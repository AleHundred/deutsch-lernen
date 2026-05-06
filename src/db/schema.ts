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

// Drill kinds — new kinds first; slot-classification last and DEPRECATED.
export type DrillKind =
  | "case-selection"
  | "case-morphology"
  | "verb-conjugation"
  | "reflexive-production"
  | "v2-word-order"
  | "slot-classification"; // DEPRECATED — retained for git history; not scheduled in v0.1 post-pivot.

export type GrammarTopic =
  // A2.1 foundations (v0.1 post-pivot)
  | "v2-word-order"
  | "case-selection-basics"
  | "case-morphology-basics"
  | "verb-conjugation-irreg"
  | "reflexive-verbs-a2"
  // A2.2 content, compressed into weeks 4-12
  | "tekamolo"
  | "partizip2-regular"
  | "partizip2-irregular"
  | "akkusativ-preps"
  | "dativ-preps"
  | "wechselpraep"
  | "nebensatz-weil-dass"
  | "nebensatz-wenn-ob-als"
  | "adjektivdeklination"
  | "konjunktiv2";
// `reflexive-verben` removed — migrated to foundations as `reflexive-verbs-a2`.

// ─── Per-kind params ──────────────────────────────────────────────

export interface CaseSelectionParams {
  frame: string;                    // "Ich spreche mit der Frau."
  gloss: string;                    // "I'm talking with the woman."
  highlightStart: number;           // index in frame of the trigger
  highlightEnd: number;
  trigger: string;                  // the word being tested: "mit"
  triggerType:
    | "preposition"
    | "verb-transitive"             // sehen, kaufen, lesen, ... → Akk
    | "verb-dative"                 // helfen, danken, ... → Dat
    | "sein-construction";          // "ist ___" → Nom
  correctCase: "nom" | "akk" | "dat";
  explanation: string;              // "mit always triggers Dativ"
}

export interface CaseMorphologyParams {
  frame: string;                    // "Ich fahre mit ___ U-Bahn."
  caseMarker: "Nom" | "Akk" | "Dat"; // shown next to trigger position
  caseMarkerPosition: number;       // index in frame where marker renders
  gloss: string;                    // "I go by U-Bahn."
  expected: string;                 // "der"
  alternatives?: string[];          // rare, e.g. indefinite also valid
  gender: "m" | "f" | "n" | "pl";
  case: "nom" | "akk" | "dat";
  definiteness: "def" | "indef";
  trigger: string;                  // for cross-drill analytics
}

export interface VerbConjugationParams {
  infinitive: string;               // "sprechen"
  infinitiveGloss: string;          // "to speak"
  person: "ich" | "du" | "er" | "wir" | "ihr" | "sie";
  expected: string;                 // "sprichst"
  alternatives?: string[];
  irregularityType:
    | "e-to-i"
    | "e-to-ie"
    | "a-to-ae"
    | "full-irregular"
    | "modal"
    | "regular-contrast";           // trap items: NO stem change (wir/ihr/sie forms)
  regularExpected: string;          // what naive regular conjugation would produce
}

export interface ReflexiveProductionParams {
  subject: "ich" | "du" | "er" | "wir" | "ihr" | "sie";
  reflexiveInfinitive: string;      // "sich treffen"
  objectPhrase?: string;            // "mit Lex" — optional
  gloss: string;                    // "I meet with Lex."
  expected: string[];               // all valid orderings
  reflexiveCase: "akk" | "dat";
  verbIrregularity?: string;        // if verb is irregular
  commonErrors: Array<{
    pattern: string;
    diagnosis: string;
  }>;
}

export interface V2WordOrderParams {
  components: string[];             // unordered chunks
  gloss: string;                    // English meaning
  conjugatedVerb: string;           // must be in position 2
  subject: string;                  // "ich"
  reflexivePronoun?: string;        // "mich" if reflexive
  validOrderings: string[];         // pre-computed accepted answers
  minComponentsCount: number;       // must use at least this many (usually all)
}

/** DEPRECATED — slot-classification is retained for v0.1 post-pivot history only. */
export interface SlotClassificationParams {
  phrase: string;
  gloss?: string;
  correctSlot: "Te" | "Ka" | "Mo" | "Lo";
  subtype: string;
  disambiguationNote?: string;
  examples?: string;                // JSON-stringified array of { phrase, slot, sameSlot }
}

// ─── DrillItem: discriminated union ──────────────────────────────

export interface BaseDrillItem {
  id: UUID;
  rule: string;                     // free-form SRS aggregation key
  grammarTopic: GrammarTopic;
  difficulty: 1 | 2 | 3;
  tags?: string[];
}

export type DrillItem = BaseDrillItem &
  (
    | { kind: "case-selection"; params: CaseSelectionParams }
    | { kind: "case-morphology"; params: CaseMorphologyParams }
    | { kind: "verb-conjugation"; params: VerbConjugationParams }
    | { kind: "reflexive-production"; params: ReflexiveProductionParams }
    | { kind: "v2-word-order"; params: V2WordOrderParams }
    | { kind: "slot-classification"; params: SlotClassificationParams } // DEPRECATED
  );

// ─── SRS / sessions / app state ──────────────────────────────────

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
  seedVersion?: number;      // legacy (v0.1.1); unused after pivot's wipe-and-reseed
}
