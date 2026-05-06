import type { GrammarTopic } from "../db/schema";

export interface WeekConfig {
  primary: GrammarTopic[];
  review: GrammarTopic[] | "all";
}

// v0.1 post-pivot weekly map.
// Foundations consume weeks 1-3; A2.2 content compresses into weeks 4-12.
export const weeklyFocus: Record<number, WeekConfig> = {
  // Foundations
  1: { primary: ["v2-word-order"], review: [] },
  2: {
    primary: ["case-selection-basics", "case-morphology-basics"],
    review: ["v2-word-order"],
  },
  3: {
    primary: ["verb-conjugation-irreg", "reflexive-verbs-a2"],
    review: ["v2-word-order", "case-morphology-basics"],
  },
  // A2.2, compressed
  4: {
    primary: ["tekamolo"],
    review: ["v2-word-order", "reflexive-verbs-a2"],
  },
  5: { primary: ["partizip2-regular"], review: ["verb-conjugation-irreg"] },
  6: { primary: ["partizip2-irregular"], review: ["partizip2-regular"] },
  7: { primary: ["wechselpraep"], review: ["case-morphology-basics"] },
  8: { primary: ["nebensatz-weil-dass"], review: ["v2-word-order"] },
  9: { primary: ["nebensatz-wenn-ob-als"], review: ["nebensatz-weil-dass"] },
  10: {
    primary: ["adjektivdeklination"],
    review: ["case-morphology-basics", "wechselpraep"],
  },
  11: { primary: ["konjunktiv2"], review: ["adjektivdeklination"] },
  12: { primary: [], review: "all" },
};

export const MAX_WEEK = 12;
