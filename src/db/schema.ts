export type ISODate = string;
export type UUID = string;

export type Gender = "m" | "f" | "n" | "pl";
export type Case = "nom" | "akk" | "dat" | "gen";

export interface Noun {
  id: UUID;
  lemma: string;
  gender: Gender;
  pluralForm?: string;
  weakMasc?: boolean;
  tags?: string[];
}

export interface Verb {
  id: UUID;
  infinitive: string;
  partizip2: string;
  auxiliary: "haben" | "sein";
  separable?: string;
  irregularity: "regular" | "irregular" | "mixed";
  tags?: string[];
}

export interface Preposition {
  id: UUID;
  form: string;
  governs: Case | "wechsel";
  meaning: string;
}

export type DrillKind =
  | "slot-classification"  // v0.1
  | "word-order-perfekt"   // v0.2
  | "case-after-prep"      // v0.2+
  | "gender-recall"        // v0.2+
  | "partizip2"            // v0.2+
  | "word-order-weil";     // v0.2+

export type GrammarTopic =
  | "tekamolo"
  | "partizip2-regular"
  | "partizip2-irregular"
  | "akkusativ-preps"
  | "dativ-preps"
  | "wechselpraep"
  | "nebensatz-weil-dass"
  | "nebensatz-wenn-ob-als"
  | "adjektivdeklination"
  | "konjunktiv2"
  | "reflexive-verben";

/**
 * When `kind === "slot-classification"`, `params` has this shape:
 *   {
 *     phrase: string;                              // "mit dem Fahrrad"
 *     correctSlot: "Te" | "Ka" | "Mo" | "Lo";
 *     subtype: string;                             // "means-transport", "accompaniment", etc.
 *     disambiguationNote?: string;                 // shown in feedback
 *     examples?: string;                           // JSON-stringified array of contrast examples
 *   }
 */
export interface DrillItem {
  id: UUID;
  kind: DrillKind;
  params: Record<string, UUID | string | number>;
  rule: string;              // free-form tag, e.g. "vor-emotion-Ka", "mit-person-Mo"
  grammarTopic: GrammarTopic;
  difficulty: 1 | 2 | 3;
  tags?: string[];
}

export interface SRSState {
  itemId: UUID;
  easeFactor: number;        // SM-2; starts at 2.5
  interval: number;          // days
  repetitions: number;
  nextReview: ISODate;
  lastReview?: ISODate;
  lastGrade?: 0 | 1 | 2 | 3 | 4 | 5;
  totalAttempts: number;
  totalCorrect: number;
  recentAttempts: Array<{
    at: ISODate;
    correct: boolean;
    responseTimeMs: number;
    userAnswer: string;
  }>; // keep last 20, drop oldest on push
}

export interface DrillSession {
  id: UUID;
  startedAt: ISODate;
  endedAt?: ISODate;
  kind: DrillKind | "mixed";
  attempts: Array<{
    itemId: UUID;
    correct: boolean;
    userAnswer: string;
    correctAnswer: string;
    responseTimeMs: number;
  }>;
}

export interface AppState {
  id: "singleton";           // always this literal value
  currentWeek: number;       // 1-12, manually advanced
  lastOpenedAt?: ISODate;
  seedVersion?: number;      // bump SEED_VERSION in seed-classification.ts to trigger reseed
}
