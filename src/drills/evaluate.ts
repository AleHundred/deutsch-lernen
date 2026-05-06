import type { DrillItem } from "../db/schema";
import type {
  EvaluationResult,
  FeedbackContent,
  ProductionPrompt,
} from "./types";
import { generateSlotClassification } from "./generators/slotClassification";

// ─── Public surface ──────────────────────────────────────────────

export interface ProductionEvaluatorOptions {
  levenshteinTolerance?: number;            // default 1
  capitalizationMode: "strict" | "warn" | "ignore";
}

/**
 * Drill-agnostic production evaluator. Used by drills 1.2–1.5.
 *
 * Resolution order:
 *   1. exact match → grade 5
 *   2. case-insensitive match → behavior depends on `capitalizationMode`
 *      - "ignore" → grade 5
 *      - "warn"   → grade 4 + capitalization warning
 *      - "strict" → wrong (no fall-through to typo check)
 *   3. Levenshtein-≤N typo against expected answers → grade 4 + typo flag
 *      (with grammatical-contrast guard, see `findTypoMatch`)
 *   4. otherwise wrong, grade 1
 */
export function evaluateProduction(
  userAnswer: string,
  prompt: ProductionPrompt,
  options: ProductionEvaluatorOptions,
): EvaluationResult {
  const normalized = userAnswer.trim();
  const tolerance = options.levenshteinTolerance ?? 1;

  // 1. Exact match
  if (prompt.expectedAnswers.includes(normalized)) {
    return {
      correct: true,
      grade: 5,
      feedback: prompt.buildFeedback(normalized, true),
    };
  }

  // 2. Case-insensitive match — resolve per mode
  const ciMatch = prompt.expectedAnswers.find(
    (a) => a.toLowerCase() === normalized.toLowerCase(),
  );
  if (ciMatch) {
    if (options.capitalizationMode === "ignore") {
      return {
        correct: true,
        grade: 5,
        feedback: prompt.buildFeedback(normalized, true),
      };
    }
    if (options.capitalizationMode === "warn") {
      const warning = buildCapitalizationWarning(normalized, ciMatch);
      return {
        correct: true,
        grade: 4,
        feedback: {
          ...prompt.buildFeedback(normalized, true),
          capitalizationWarning: warning,
        },
      };
    }
    // strict mode → fall through to "wrong" without a typo check.
    // (A case-only difference shouldn't be silently accepted as a typo.)
    return {
      correct: false,
      grade: 1,
      feedback: prompt.buildFeedback(normalized, false),
    };
  }

  // 3. Levenshtein typo
  if (tolerance > 0) {
    const typo = findTypoMatch(
      normalized,
      prompt.expectedAnswers,
      prompt.grammaticallyContrastive,
      tolerance,
    );
    if (typo) {
      return {
        correct: true,
        grade: 4,
        typo: true,
        diff: highlightDiff(normalized, typo.match),
        feedback: prompt.buildFeedback(normalized, true),
      };
    }
  }

  // 4. Wrong
  return {
    correct: false,
    grade: 1,
    feedback: prompt.buildFeedback(normalized, false),
  };
}

/**
 * Compatibility shim. Production drills will route through `evaluateProduction`
 * with their own ProductionPrompt; this `evaluate()` handles button-tap drills
 * (case-selection, deprecated slot-classification) directly.
 */
export function evaluate(
  item: DrillItem,
  userAnswer: string,
  responseTimeMs: number,
): EvaluationResult {
  switch (item.kind) {
    case "slot-classification":
      return evaluateSlotClassification(item, userAnswer, responseTimeMs);
    case "case-selection":
      return evaluateCaseSelection(item, userAnswer, responseTimeMs);
    case "case-morphology":
    case "verb-conjugation":
    case "reflexive-production":
    case "v2-word-order":
      throw new Error(
        `evaluate: production drill kind "${item.kind}" must use evaluateProduction directly`,
      );
    default: {
      const _exhaust: never = item;
      throw new Error(`evaluate: unknown drill kind ${JSON.stringify(_exhaust)}`);
    }
  }
}

function evaluateSlotClassification(
  item: DrillItem & { kind: "slot-classification" },
  userAnswer: string,
  responseTimeMs: number,
): EvaluationResult {
  const prompt = generateSlotClassification(item);
  const correct = userAnswer === prompt.correctAnswer;
  // correctAnswer is the bare slot ("Mo") so OptionButtons can match it for highlighting.
  // The subtype goes into specificErrorType, and the explanation includes both.
  const explanation =
    prompt.disambiguationNote ??
    (correct
      ? `${prompt.correctAnswer} — ${prompt.subtype}`
      : `Expected ${prompt.correctAnswer} (${prompt.subtype}); you answered ${userAnswer}`);

  const feedback: FeedbackContent = {
    correctAnswer: prompt.correctAnswer,
    userAnswer,
    explanation,
    specificErrorType: prompt.subtype,
    ...(prompt.examples && {
      compareItems: prompt.examples.map((ex) => ({
        form: ex.phrase,
        label: ex.slot,
      })),
    }),
  };

  return {
    correct,
    grade: computeGrade(correct, responseTimeMs, "recognition"),
    declarative: correct && responseTimeMs > 4000,
    feedback,
  };
}

function evaluateCaseSelection(
  item: DrillItem & { kind: "case-selection" },
  userAnswer: string,
  responseTimeMs: number,
): EvaluationResult {
  const correct = userAnswer === item.params.correctCase;
  const feedback: FeedbackContent = {
    correctAnswer: item.params.correctCase,
    userAnswer,
    explanation: item.params.explanation,
  };
  return {
    correct,
    grade: computeGrade(correct, responseTimeMs, "recognition"),
    declarative: correct && responseTimeMs > 4000,
    feedback,
  };
}

// ─── Grade mapping ────────────────────────────────────────────────

export type GradeMode = "production" | "recognition";

/**
 * Production thresholds: <3s → 5, 3–6s → 4, >6s → 3.
 * Recognition thresholds: <2s → 5, 2–4s → 4, >4s → 3.
 * Wrong → 1 in either mode.
 */
export function computeGrade(
  correct: boolean,
  responseTimeMs: number,
  mode: GradeMode = "production",
): 0 | 1 | 2 | 3 | 4 | 5 {
  if (!correct) return 1;
  const fastMs = mode === "production" ? 3000 : 2000;
  const slowMs = mode === "production" ? 6000 : 4000;
  if (responseTimeMs < fastMs) return 5;
  if (responseTimeMs <= slowMs) return 4;
  return 3;
}

// ─── Helpers ──────────────────────────────────────────────────────

/**
 * Find the closest expected-answer candidate within `maxDistance` Levenshtein
 * edits of the input.
 *
 * Grammatical-contrast guard: skip a candidate when BOTH input and candidate
 * appear in the `contrastive` set. This prevents a confusion between two real
 * grammatical forms (e.g. "den" typed where "dem" was expected — both are
 * articles) from being silently accepted as a typo. Plain typos against a
 * contrastive candidate (e.g. "demm" → "dem") still pass through.
 */
export function findTypoMatch(
  input: string,
  candidates: string[],
  contrastive: string[],
  maxDistance: number,
): { match: string; distance: number } | null {
  const inputIsContrastive = contrastive.includes(input);
  let best: { match: string; distance: number } | null = null;
  for (const candidate of candidates) {
    const d = levenshtein(input, candidate);
    if (d === 0 || d > maxDistance) continue;
    if (inputIsContrastive && contrastive.includes(candidate)) continue;
    if (best === null || d < best.distance) {
      best = { match: candidate, distance: d };
    }
  }
  return best;
}

/** Standard iterative DP Levenshtein, two-row buffer. */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  let curr = new Array<number>(b.length + 1).fill(0);
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        curr[j - 1]! + 1,        // insertion
        prev[j]! + 1,            // deletion
        prev[j - 1]! + cost,     // substitution
      );
    }
    [prev, curr] = [curr, prev];
  }
  return prev[b.length]!;
}

/**
 * Character-level diff using LCS backtracking. Returns markup with
 *   `[-x]` for chars only in input,
 *   `[+y]` for chars only in expected.
 * Suitable for inline rendering by the UI.
 */
export function highlightDiff(input: string, expected: string): string {
  const a = input;
  const b = expected;
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array<number>(n + 1).fill(0),
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i]![j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1]![j - 1]! + 1
          : Math.max(dp[i - 1]![j]!, dp[i]![j - 1]!);
    }
  }
  const out: string[] = [];
  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      out.unshift(a[i - 1]!);
      i--;
      j--;
    } else if (dp[i - 1]![j]! >= dp[i]![j - 1]!) {
      out.unshift(`[-${a[i - 1]}]`);
      i--;
    } else {
      out.unshift(`[+${b[j - 1]}]`);
      j--;
    }
  }
  while (i > 0) {
    out.unshift(`[-${a[i - 1]}]`);
    i--;
  }
  while (j > 0) {
    out.unshift(`[+${b[j - 1]}]`);
    j--;
  }
  return out.join("");
}

/** Context-aware capitalization warning, surfaced in "warn" mode. */
export function buildCapitalizationWarning(
  input: string,
  expected: string,
): string {
  const expFirstUpper = /^[A-ZÄÖÜ]/.test(expected);
  const inFirstLower = /^[a-zäöüß]/.test(input);
  if (expFirstUpper && inFirstLower) {
    return "German capitalizes nouns.";
  }
  return `Check capitalization: expected "${expected}".`;
}
