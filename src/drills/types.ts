export type { DrillKind } from "../db/schema";

export interface EvaluationResult {
  correct: boolean;
  correctAnswer: string;        // always shown, even on correct (e.g. "Mo (accompaniment)")
  yourAnswer: string;
  explanation: string;          // from disambiguationNote or generated fallback
  examples?: { phrase: string; slot: string; sameSlot: boolean }[];
  grade: 0 | 1 | 2 | 3 | 4 | 5; // mapped for SM-2
  declarative: boolean;         // correct but >4000ms — surfaced in session summary
}
