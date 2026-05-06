import type { ReactNode } from "react";

export type { DrillKind } from "../db/schema";

export interface FeedbackContent {
  correctAnswer: string;
  userAnswer: string;
  explanation: string;
  paradigm?: ReactNode;
  compareItems?: Array<{ form: string; label: string }>;
  specificErrorType?: string;
  capitalizationWarning?: string;
}

export interface ProductionPrompt {
  displayPrompt: ReactNode;            // rendered prompt (frame with blank, etc.)
  gloss: string;                       // English meaning
  inputType: "single-word" | "sentence" | "classification";
  expectedAnswers: string[];           // all valid answers
  grammaticallyContrastive: string[];  // forms that are NEVER typos (Levenshtein guard)
  rule: string;                        // SRS aggregation key
  buildFeedback: (
    userAnswer: string,
    correct: boolean,
  ) => FeedbackContent;
}

export interface EvaluationResult {
  correct: boolean;
  grade: 0 | 1 | 2 | 3 | 4 | 5;
  declarative?: boolean;
  typo?: boolean;
  diff?: string;
  feedback: FeedbackContent;
}
