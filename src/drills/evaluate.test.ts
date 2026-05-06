import { describe, it, expect } from "vitest";
import {
  evaluate,
  evaluateProduction,
  computeGrade,
  findTypoMatch,
  levenshtein,
  highlightDiff,
} from "./evaluate";
import type { ProductionPrompt } from "./types";
import type { DrillItem, SlotClassificationParams } from "../db/schema";

function mkPrompt(overrides: Partial<ProductionPrompt>): ProductionPrompt {
  return {
    displayPrompt: "test prompt",
    gloss: "test gloss",
    inputType: "single-word",
    expectedAnswers: ["der"],
    grammaticallyContrastive: [],
    rule: "test-rule",
    buildFeedback: (userAnswer, correct) => ({
      correctAnswer: "der",
      userAnswer,
      explanation: correct ? "right" : "wrong",
    }),
    ...overrides,
  };
}

const ARTICLES = ["der", "die", "das", "den", "dem", "ein", "eine", "einen", "einem", "einer"];

describe("evaluateProduction", () => {
  it("exact match returns correct + grade 5", () => {
    const r = evaluateProduction("der", mkPrompt({}), { capitalizationMode: "warn" });
    expect(r.correct).toBe(true);
    expect(r.grade).toBe(5);
    expect(r.typo).toBeUndefined();
  });

  it("trims surrounding whitespace before comparing", () => {
    const r = evaluateProduction("  der  ", mkPrompt({}), { capitalizationMode: "warn" });
    expect(r.correct).toBe(true);
    expect(r.grade).toBe(5);
  });

  it("ci-match in 'warn' mode → grade 4 with capitalization warning", () => {
    const r = evaluateProduction("buch", mkPrompt({ expectedAnswers: ["Buch"] }), {
      capitalizationMode: "warn",
    });
    expect(r.correct).toBe(true);
    expect(r.grade).toBe(4);
    expect(r.feedback.capitalizationWarning).toBe("German capitalizes nouns.");
  });

  it("ci-match in 'ignore' mode → grade 5, no warning", () => {
    const r = evaluateProduction("buch", mkPrompt({ expectedAnswers: ["Buch"] }), {
      capitalizationMode: "ignore",
    });
    expect(r.correct).toBe(true);
    expect(r.grade).toBe(5);
    expect(r.feedback.capitalizationWarning).toBeUndefined();
  });

  it("ci-match in 'strict' mode → wrong (no typo fallthrough)", () => {
    const r = evaluateProduction("buch", mkPrompt({ expectedAnswers: ["Buch"] }), {
      capitalizationMode: "strict",
    });
    expect(r.correct).toBe(false);
    expect(r.grade).toBe(1);
  });

  it("plain typo against a contrastive candidate is accepted (input not contrastive)", () => {
    // "demm" is not in the contrastive articles set, so it falls through to typo match.
    const r = evaluateProduction(
      "demm",
      mkPrompt({ expectedAnswers: ["dem"], grammaticallyContrastive: ARTICLES }),
      { capitalizationMode: "strict" },
    );
    expect(r.correct).toBe(true);
    expect(r.typo).toBe(true);
    expect(r.grade).toBe(4);
    expect(r.diff).toBeDefined();
  });

  it("grammatical-contrast confusion is rejected (both input and candidate contrastive)", () => {
    // "den" expected "dem" — both are articles. Should be wrong, not a typo.
    const r = evaluateProduction(
      "den",
      mkPrompt({ expectedAnswers: ["dem"], grammaticallyContrastive: ARTICLES }),
      { capitalizationMode: "strict" },
    );
    expect(r.correct).toBe(false);
    expect(r.grade).toBe(1);
    expect(r.typo).toBeUndefined();
  });

  it("wrong answer with no near-match returns grade 1", () => {
    const r = evaluateProduction("totally-wrong", mkPrompt({}), {
      capitalizationMode: "warn",
    });
    expect(r.correct).toBe(false);
    expect(r.grade).toBe(1);
  });

  it("tolerance=0 disables the typo path", () => {
    const r = evaluateProduction(
      "deg",
      mkPrompt({ expectedAnswers: ["der"] }),
      { capitalizationMode: "strict", levenshteinTolerance: 0 },
    );
    expect(r.correct).toBe(false);
    expect(r.grade).toBe(1);
  });

  it("typo flag + diff are populated when typo path matches", () => {
    const r = evaluateProduction("dre", mkPrompt({}), { capitalizationMode: "warn" });
    // "dre" → "der" is 2 edits (transposition). Levenshtein-1 won't catch it.
    expect(r.correct).toBe(false);

    const r2 = evaluateProduction("derx", mkPrompt({}), { capitalizationMode: "warn" });
    // "derx" → "der" is 1 deletion → typo at distance 1.
    expect(r2.correct).toBe(true);
    expect(r2.typo).toBe(true);
    expect(r2.diff).toContain("[-x]");
  });
});

describe("findTypoMatch", () => {
  it("returns null when nothing is within distance", () => {
    expect(findTypoMatch("xyz", ["der"], [], 1)).toBeNull();
  });

  it("returns the closest match when several are within distance", () => {
    // "dass" is 1 from "das", 2 from "der". Should pick "das".
    const m = findTypoMatch("dass", ["das", "der"], [], 2);
    expect(m).toEqual({ match: "das", distance: 1 });
  });
});

describe("levenshtein", () => {
  it("equal strings → 0", () => {
    expect(levenshtein("abc", "abc")).toBe(0);
  });

  it("single substitution → 1", () => {
    expect(levenshtein("abc", "abd")).toBe(1);
  });

  it("kitten → sitting → 3 (classic case)", () => {
    expect(levenshtein("kitten", "sitting")).toBe(3);
  });

  it("empty vs non-empty → length", () => {
    expect(levenshtein("", "abc")).toBe(3);
    expect(levenshtein("abc", "")).toBe(3);
  });
});

describe("highlightDiff", () => {
  it("marks an extra character as input-only", () => {
    expect(highlightDiff("derx", "der")).toContain("[-x]");
  });

  it("marks a missing character as expected-only", () => {
    expect(highlightDiff("de", "der")).toContain("[+r]");
  });
});

describe("computeGrade", () => {
  it("wrong → 1 regardless of mode", () => {
    expect(computeGrade(false, 500, "production")).toBe(1);
    expect(computeGrade(false, 500, "recognition")).toBe(1);
  });

  it("recognition mode boundaries (2s/4s)", () => {
    expect(computeGrade(true, 1999, "recognition")).toBe(5);
    expect(computeGrade(true, 2000, "recognition")).toBe(4);
    expect(computeGrade(true, 4000, "recognition")).toBe(4);
    expect(computeGrade(true, 4001, "recognition")).toBe(3);
  });

  it("production mode boundaries (3s/6s)", () => {
    expect(computeGrade(true, 2999, "production")).toBe(5);
    expect(computeGrade(true, 3000, "production")).toBe(4);
    expect(computeGrade(true, 6000, "production")).toBe(4);
    expect(computeGrade(true, 6001, "production")).toBe(3);
  });
});

// Regression: the evaluate() shim still routes the deprecated slot-classification
// drill correctly and produces the new EvaluationResult shape.
describe("evaluate (slot-classification shim)", () => {
  function mkSlotItem(params: SlotClassificationParams): DrillItem {
    return {
      id: "test-id",
      kind: "slot-classification" as const,
      params,
      rule: "test-rule",
      grammarTopic: "tekamolo",
      difficulty: 1,
    };
  }

  it("correct + fast → grade 5, feedback populated", () => {
    const r = evaluate(
      mkSlotItem({ phrase: "mit dem Fahrrad", correctSlot: "Mo", subtype: "means-transport" }),
      "Mo",
      1500,
    );
    expect(r.correct).toBe(true);
    expect(r.grade).toBe(5);
    expect(r.feedback.correctAnswer).toBe("Mo (means-transport)");
    expect(r.feedback.userAnswer).toBe("Mo");
  });

  it("wrong → grade 1, feedback shows expected vs given", () => {
    const r = evaluate(
      mkSlotItem({ phrase: "vor Angst", correctSlot: "Ka", subtype: "emotion-cause" }),
      "Te",
      1200,
    );
    expect(r.correct).toBe(false);
    expect(r.grade).toBe(1);
    expect(r.feedback.correctAnswer).toBe("Ka (emotion-cause)");
    expect(r.feedback.explanation).toContain("Expected Ka");
  });
});
