// STUB SEED — replace with real ~50-item seed before v0.2.0 ships.
// See design doc §1.1 (drill scope and breakdown) and §5.3 (seed curation strategy).
//
// These four items exist solely to verify the
// generator → ClassificationDrill → evaluator → SRS update → summary loop.
// Vocabulary fit and pedagogical coverage are deliberately not optimized here.

import type { DrillItem } from "./schema";

interface SeedEntry {
  frame: string;
  gloss: string;
  highlightStart: number;
  highlightEnd: number;
  trigger: string;
  triggerType:
    | "preposition"
    | "verb-transitive"
    | "verb-dative"
    | "sein-construction";
  correctCase: "nom" | "akk" | "dat";
  explanation: string;
  rule: string;
  difficulty: 1 | 2 | 3;
}

export const caseSelectionStubSeed: SeedEntry[] = [
  {
    frame: "Ich gehe mit der Frau.",
    gloss: "I'm going with the woman.",
    highlightStart: 9,
    highlightEnd: 12,
    trigger: "mit",
    triggerType: "preposition",
    correctCase: "dat",
    explanation: "mit always triggers Dativ.",
    rule: "mit-Dat",
    difficulty: 1,
  },
  {
    frame: "Das ist für den Mann.",
    gloss: "That's for the man.",
    highlightStart: 8,
    highlightEnd: 11,
    trigger: "für",
    triggerType: "preposition",
    correctCase: "akk",
    explanation: "für always triggers Akkusativ.",
    rule: "für-Akk",
    difficulty: 1,
  },
  {
    frame: "Ich helfe dem Kind.",
    gloss: "I help the child.",
    highlightStart: 4,
    highlightEnd: 9,
    trigger: "helfe",
    triggerType: "verb-dative",
    correctCase: "dat",
    explanation: "helfen is a dative verb.",
    rule: "helfen-Dat",
    difficulty: 1,
  },
  {
    frame: "Ich sehe die Katze.",
    gloss: "I see the cat.",
    highlightStart: 4,
    highlightEnd: 8,
    trigger: "sehe",
    triggerType: "verb-transitive",
    correctCase: "akk",
    explanation: "sehen takes a direct object (Akkusativ).",
    rule: "sehen-Akk",
    difficulty: 1,
  },
];

export function buildCaseSelectionStubItems(): Omit<DrillItem, "id">[] {
  return caseSelectionStubSeed.map((entry) => ({
    kind: "case-selection" as const,
    params: {
      frame: entry.frame,
      gloss: entry.gloss,
      highlightStart: entry.highlightStart,
      highlightEnd: entry.highlightEnd,
      trigger: entry.trigger,
      triggerType: entry.triggerType,
      correctCase: entry.correctCase,
      explanation: entry.explanation,
    },
    rule: entry.rule,
    grammarTopic: "case-selection-basics" as const,
    difficulty: entry.difficulty,
  }));
}
