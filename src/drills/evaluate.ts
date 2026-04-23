import type { DrillItem } from "../db/schema";
import type { EvaluationResult } from "./types";
import { generateSlotClassification } from "./generators/slotClassification";

export function evaluate(
  item: DrillItem,
  userAnswer: string,
  responseTimeMs: number,
): EvaluationResult {
  switch (item.kind) {
    case "slot-classification":
      return evaluateSlotClassification(item, userAnswer, responseTimeMs);
    default:
      throw new Error(`evaluate: unsupported drill kind "${item.kind}"`);
  }
}

function evaluateSlotClassification(
  item: DrillItem,
  userAnswer: string,
  responseTimeMs: number,
): EvaluationResult {
  const prompt = generateSlotClassification(item);
  const correct = userAnswer === prompt.correctAnswer;
  const correctAnswer = `${prompt.correctAnswer} (${prompt.subtype})`;

  const explanation =
    prompt.disambiguationNote ??
    (correct
      ? `${prompt.correctAnswer} — ${prompt.subtype}`
      : `Expected ${prompt.correctAnswer} (${prompt.subtype}); you answered ${userAnswer}`);

  return {
    correct,
    correctAnswer,
    yourAnswer: userAnswer,
    explanation,
    ...(prompt.examples && { examples: prompt.examples }),
    grade: computeGrade(correct, responseTimeMs),
    declarative: correct && responseTimeMs > 4000,
  };
}

export function computeGrade(
  correct: boolean,
  responseTimeMs: number,
): 0 | 1 | 2 | 3 | 4 | 5 {
  if (!correct) return 1;
  if (responseTimeMs < 2000) return 5;
  if (responseTimeMs <= 4000) return 4;
  return 3;
}
