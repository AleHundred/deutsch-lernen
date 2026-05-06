import type { DrillItem } from "../../db/schema";
import type { ProductionPrompt } from "../types";

export function generateCaseSelection(
  item: DrillItem & { kind: "case-selection" },
): ProductionPrompt {
  // Defensive guard for callers that may have used `as` to coerce.
  if ((item as DrillItem).kind !== "case-selection") {
    throw new Error(
      `generateCaseSelection: expected kind "case-selection", got "${(item as DrillItem).kind}"`,
    );
  }

  const {
    frame,
    highlightStart,
    highlightEnd,
    gloss,
    correctCase,
    explanation,
    triggerType,
  } = item.params;

  const before = frame.slice(0, highlightStart);
  const trigger = frame.slice(highlightStart, highlightEnd);
  const after = frame.slice(highlightEnd);

  const displayPrompt = (
    <div className="font-mono text-3xl leading-snug">
      {before}
      <span className="border-b-2 border-accent">{trigger}</span>
      {after}
    </div>
  );

  return {
    displayPrompt,
    gloss,
    inputType: "classification",
    expectedAnswers: [correctCase],
    // All three cases are mutually exclusive — typo tolerance has no meaning
    // for a button-tap drill, but the field is kept consistent with production drills.
    grammaticallyContrastive: ["nom", "akk", "dat"],
    rule: item.rule,
    buildFeedback: (userAnswer, _correct) => ({
      correctAnswer: correctCase,
      userAnswer,
      explanation,
      // Surfaced in the per-trigger-type aggregate in SessionSummary (Phase B2).
      specificErrorType: triggerType,
    }),
  };
}
