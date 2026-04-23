import type { GrammarTopic } from "../db/schema";

export interface WeekConfig {
  primary: GrammarTopic[];
  review: GrammarTopic[] | "all";
}

export const weeklyFocus: Record<number, WeekConfig> = {
  1: { primary: ["tekamolo", "partizip2-regular"], review: [] },
  2: { primary: ["akkusativ-preps"], review: ["tekamolo"] },
  3: { primary: ["dativ-preps"], review: ["akkusativ-preps", "tekamolo"] },
  4: { primary: ["partizip2-irregular"], review: ["dativ-preps", "akkusativ-preps"] },
  5: { primary: ["nebensatz-weil-dass"], review: ["partizip2-irregular"] },
  6: { primary: ["nebensatz-wenn-ob-als"], review: ["nebensatz-weil-dass"] },
  7: { primary: ["wechselpraep"], review: ["dativ-preps", "akkusativ-preps"] },
  8: { primary: ["wechselpraep"], review: ["nebensatz-weil-dass", "nebensatz-wenn-ob-als"] },
  9: { primary: ["adjektivdeklination"], review: ["wechselpraep"] },
  10: { primary: ["adjektivdeklination"], review: ["adjektivdeklination"] },
  11: { primary: ["konjunktiv2", "reflexive-verben"], review: ["adjektivdeklination"] },
  12: { primary: [], review: "all" },
};

export const MAX_WEEK = 12;
