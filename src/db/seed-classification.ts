// src/db/seed-classification.ts
//
// Seed data for slot-classification drill (v0.1.1).
// 100 adverbial phrases, each tagged with TeKaMoLo slot + subtype + English gloss.
// Weighted toward Berlin-life vocabulary and ambiguous prepositions.
//
// Structure: each entry becomes one DrillItem with:
//   kind: "slot-classification"
//   grammarTopic: "tekamolo"
//   params: { phrase, gloss, correctSlot, subtype, disambiguationNote?, examples? }
//   rule: a pattern key for SRS aggregation (e.g. "mit-Mo-accompaniment")
//
// Names used: Lex (girlfriend), Miša, Lisa, Felipe, Kitty (friends)
// Places: Tipsy Bear, Späti, Görli (Görlitzer Park), Kanal (Landwehrkanal),
//         Homeoffice, Hausarzt, Bürgeramt

import type { DrillItem } from "./schema";

// Bump this whenever the seed payload changes shape or content.
// A mismatch with appState.seedVersion on load triggers a wipe + reseed;
// same value preserves existing SRS state.
export const SEED_VERSION = 1;

interface SeedEntry {
  phrase: string;
  gloss: string;
  correctSlot: "Te" | "Ka" | "Mo" | "Lo";
  subtype: string;
  rule: string;
  difficulty: 1 | 2 | 3;
  disambiguationNote?: string;
  examples?: { phrase: string; sameSlot: boolean; slot: string }[];
}

export const classificationSeed: SeedEntry[] = [
  // ═══════════════════════════════════════════════════════════════
  // TEMPORAL (25 items)
  // ═══════════════════════════════════════════════════════════════

  {
    phrase: "am Montag",
    gloss: "on Monday",
    correctSlot: "Te",
    subtype: "day-of-week",
    rule: "am-day-Te",
    difficulty: 1,
    disambiguationNote: "am + day of week → Te",
  },
  {
    phrase: "um 9 Uhr",
    gloss: "at 9 o'clock",
    correctSlot: "Te",
    subtype: "clock-time",
    rule: "um-clock-Te",
    difficulty: 1,
    disambiguationNote: "um + clock time → Te",
  },
  {
    phrase: "im Januar",
    gloss: "in January",
    correctSlot: "Te",
    subtype: "month",
    rule: "im-month-Te",
    difficulty: 1,
    disambiguationNote: "im + month → Te",
  },
  {
    phrase: "im Sommer",
    gloss: "in summer",
    correctSlot: "Te",
    subtype: "season",
    rule: "im-season-Te",
    difficulty: 1,
  },
  {
    phrase: "heute",
    gloss: "today",
    correctSlot: "Te",
    subtype: "bare-adverb",
    rule: "bare-Te",
    difficulty: 1,
  },
  {
    phrase: "morgen",
    gloss: "tomorrow",
    correctSlot: "Te",
    subtype: "bare-adverb",
    rule: "bare-Te",
    difficulty: 1,
  },
  {
    phrase: "gestern",
    gloss: "yesterday",
    correctSlot: "Te",
    subtype: "bare-adverb",
    rule: "bare-Te",
    difficulty: 1,
  },
  {
    phrase: "jeden Tag",
    gloss: "every day",
    correctSlot: "Te",
    subtype: "frequency",
    rule: "frequency-Te",
    difficulty: 1,
  },
  {
    phrase: "am Wochenende",
    gloss: "on the weekend",
    correctSlot: "Te",
    subtype: "period",
    rule: "am-period-Te",
    difficulty: 1,
  },
  {
    phrase: "seit drei Jahren",
    gloss: "for three years (up to now)",
    correctSlot: "Te",
    subtype: "duration-since",
    rule: "seit-Te",
    difficulty: 1,
    disambiguationNote: "seit + time → Te (duration up to now)",
  },
  {
    phrase: "vor zwei Wochen",
    gloss: "two weeks ago",
    correctSlot: "Te",
    subtype: "time-ago",
    rule: "vor-time-Te",
    difficulty: 2,
    disambiguationNote:
      "vor + time span → Te. Compare with vor + place (Lo) and vor + emotion (Ka).",
    examples: [
      { phrase: "vor dem Haus", sameSlot: false, slot: "Lo" },
      { phrase: "vor Angst", sameSlot: false, slot: "Ka" },
    ],
  },
  {
    phrase: "nach der Arbeit",
    gloss: "after work",
    correctSlot: "Te",
    subtype: "after-event",
    rule: "nach-event-Te",
    difficulty: 2,
    disambiguationNote:
      "nach + event/time → Te. Compare nach + place (nach Berlin) → Lo.",
    examples: [{ phrase: "nach Berlin", sameSlot: false, slot: "Lo" }],
  },
  {
    phrase: "während des Meetings",
    gloss: "during the meeting",
    correctSlot: "Te",
    subtype: "during",
    rule: "waehrend-Te",
    difficulty: 1,
    disambiguationNote: "während → always Te",
  },
  {
    phrase: "bis Freitag",
    gloss: "until Friday",
    correctSlot: "Te",
    subtype: "until-time",
    rule: "bis-time-Te",
    difficulty: 1,
  },
  {
    phrase: "bis morgen",
    gloss: "until tomorrow / see you tomorrow",
    correctSlot: "Te",
    subtype: "until-time",
    rule: "bis-time-Te",
    difficulty: 1,
  },
  {
    phrase: "in zwei Tagen",
    gloss: "in two days (from now)",
    correctSlot: "Te",
    subtype: "in-the-future",
    rule: "in-time-Te",
    difficulty: 2,
    disambiguationNote:
      "in + time span → Te. Compare in + place (im Görli) → Lo.",
    examples: [{ phrase: "im Görli", sameSlot: false, slot: "Lo" }],
  },
  {
    phrase: "bald",
    gloss: "soon",
    correctSlot: "Te",
    subtype: "bare-adverb",
    rule: "bare-Te",
    difficulty: 1,
  },
  {
    phrase: "letzte Woche",
    gloss: "last week",
    correctSlot: "Te",
    subtype: "last-period",
    rule: "period-Te",
    difficulty: 1,
  },
  {
    phrase: "den ganzen Tag",
    gloss: "the whole day / all day long",
    correctSlot: "Te",
    subtype: "duration-through",
    rule: "duration-Te",
    difficulty: 2,
  },
  {
    phrase: "gegen 18 Uhr",
    gloss: "around 6 PM",
    correctSlot: "Te",
    subtype: "approximate-time",
    rule: "gegen-time-Te",
    difficulty: 2,
    disambiguationNote:
      "gegen + time → Te (approximate). gegen + place → Lo (against, direction).",
    examples: [{ phrase: "gegen die Wand", sameSlot: false, slot: "Lo" }],
  },
  {
    phrase: "zwischen den Meetings",
    gloss: "between the meetings",
    correctSlot: "Te",
    subtype: "between-events",
    rule: "zwischen-time-Te",
    difficulty: 2,
    disambiguationNote: "zwischen + events/times → Te. zwischen + places → Lo.",
  },
  {
    phrase: "zwischen zwei und drei",
    gloss: "between two and three",
    correctSlot: "Te",
    subtype: "between-times",
    rule: "zwischen-time-Te",
    difficulty: 2,
  },
  {
    phrase: "innerhalb einer Woche",
    gloss: "within a week",
    correctSlot: "Te",
    subtype: "within-time",
    rule: "innerhalb-time-Te",
    difficulty: 2,
  },
  {
    phrase: "über das Wochenende",
    gloss: "over the weekend",
    correctSlot: "Te",
    subtype: "spanning-period",
    rule: "ueber-time-Te",
    difficulty: 3,
    disambiguationNote:
      "über + time period → Te. 'Spatial' preposition used temporally. Compare über + place (Lo).",
    examples: [
      { phrase: "über die Brücke", sameSlot: false, slot: "Lo" },
      { phrase: "über dem Sofa", sameSlot: false, slot: "Lo" },
    ],
  },
  {
    phrase: "unter der Woche",
    gloss: "during the week / on weekdays",
    correctSlot: "Te",
    subtype: "idiomatic",
    rule: "unter-time-Te",
    difficulty: 3,
    disambiguationNote:
      "unter der Woche → Te (idiom: on weekdays). unter + place → Lo.",
    examples: [{ phrase: "unter dem Tisch", sameSlot: false, slot: "Lo" }],
  },

  // ═══════════════════════════════════════════════════════════════
  // KAUSAL (15 items)
  // ═══════════════════════════════════════════════════════════════

  {
    phrase: "wegen der Hitze",
    gloss: "because of the heat",
    correctSlot: "Ka",
    subtype: "reason",
    rule: "wegen-Ka",
    difficulty: 1,
    disambiguationNote: "wegen → always Ka",
  },
  {
    phrase: "wegen eines Termins",
    gloss: "because of an appointment",
    correctSlot: "Ka",
    subtype: "reason",
    rule: "wegen-Ka",
    difficulty: 1,
  },
  {
    phrase: "wegen Lex",
    gloss: "because of Lex",
    correctSlot: "Ka",
    subtype: "reason-personal",
    rule: "wegen-Ka",
    difficulty: 1,
  },
  {
    phrase: "aufgrund der Verspätung",
    gloss: "due to the delay",
    correctSlot: "Ka",
    subtype: "reason-formal",
    rule: "aufgrund-Ka",
    difficulty: 2,
  },
  {
    phrase: "aus Angst",
    gloss: "out of fear",
    correctSlot: "Ka",
    subtype: "emotion-cause",
    rule: "aus-emotion-Ka",
    difficulty: 2,
    disambiguationNote: "aus + emotion/inner state → Ka. aus + place → Lo.",
    examples: [
      { phrase: "aus Berlin", sameSlot: false, slot: "Lo" },
      { phrase: "aus Mexiko", sameSlot: false, slot: "Lo" },
    ],
  },
  {
    phrase: "aus Neugier",
    gloss: "out of curiosity",
    correctSlot: "Ka",
    subtype: "emotion-cause",
    rule: "aus-emotion-Ka",
    difficulty: 2,
  },
  {
    phrase: "aus Langeweile",
    gloss: "out of boredom",
    correctSlot: "Ka",
    subtype: "emotion-cause",
    rule: "aus-emotion-Ka",
    difficulty: 2,
  },
  {
    phrase: "vor Angst",
    gloss: "from fear (physical cause — e.g. trembling with fear)",
    correctSlot: "Ka",
    subtype: "emotion-cause",
    rule: "vor-emotion-Ka",
    difficulty: 3,
    disambiguationNote:
      "vor + emotion → Ka (physical cause of reaction). Compare vor + time → Te, vor + place → Lo.",
    examples: [
      { phrase: "vor zwei Wochen", sameSlot: false, slot: "Te" },
      { phrase: "vor dem Tipsy Bear", sameSlot: false, slot: "Lo" },
    ],
  },
  {
    phrase: "vor Müdigkeit",
    gloss: "from tiredness (physical cause)",
    correctSlot: "Ka",
    subtype: "emotion-cause",
    rule: "vor-emotion-Ka",
    difficulty: 3,
  },
  {
    phrase: "deshalb",
    gloss: "therefore / for that reason",
    correctSlot: "Ka",
    subtype: "bare-adverb",
    rule: "bare-Ka",
    difficulty: 1,
  },
  {
    phrase: "deswegen",
    gloss: "therefore / for that reason",
    correctSlot: "Ka",
    subtype: "bare-adverb",
    rule: "bare-Ka",
    difficulty: 1,
  },
  {
    phrase: "darum",
    gloss: "therefore / for that reason",
    correctSlot: "Ka",
    subtype: "bare-adverb",
    rule: "bare-Ka",
    difficulty: 1,
  },
  {
    phrase: "trotz des Regens",
    gloss: "despite the rain",
    correctSlot: "Ka",
    subtype: "concessive",
    rule: "trotz-Ka",
    difficulty: 2,
    disambiguationNote:
      "trotz → Ka (concessive, 'despite'). Categorized with kausal for TeKaMoLo purposes.",
  },
  {
    phrase: "dank seiner Hilfe",
    gloss: "thanks to his help",
    correctSlot: "Ka",
    subtype: "reason-positive",
    rule: "dank-Ka",
    difficulty: 2,
  },
  {
    phrase: "aus diesem Grund",
    gloss: "for this reason",
    correctSlot: "Ka",
    subtype: "reason-generic",
    rule: "aus-grund-Ka",
    difficulty: 2,
    disambiguationNote:
      "aus + Grund (reason) → Ka. Not a place, not an emotion, but a logical cause.",
  },

  // ═══════════════════════════════════════════════════════════════
  // MODAL (25 items)
  // ═══════════════════════════════════════════════════════════════

  {
    phrase: "mit der U-Bahn",
    gloss: "by U-Bahn / subway",
    correctSlot: "Mo",
    subtype: "means-transport",
    rule: "mit-thing-Mo",
    difficulty: 1,
    disambiguationNote: "mit + transport → Mo (means/how).",
  },
  {
    phrase: "mit dem Fahrrad",
    gloss: "by bike",
    correctSlot: "Mo",
    subtype: "means-transport",
    rule: "mit-thing-Mo",
    difficulty: 1,
  },
  {
    phrase: "mit dem Bus",
    gloss: "by bus",
    correctSlot: "Mo",
    subtype: "means-transport",
    rule: "mit-thing-Mo",
    difficulty: 1,
  },
  {
    phrase: "zu Fuß",
    gloss: "on foot",
    correctSlot: "Mo",
    subtype: "means-manner",
    rule: "zu-fuss-Mo",
    difficulty: 1,
    disambiguationNote:
      "zu Fuß → Mo (idiom, 'on foot'). One of the few 'zu + X' phrases that isn't Lo.",
  },
  {
    phrase: "mit Lex",
    gloss: "with Lex",
    correctSlot: "Mo",
    subtype: "accompaniment",
    rule: "mit-person-Mo",
    difficulty: 1,
    disambiguationNote: "mit + person → Mo (accompaniment/with whom).",
  },
  {
    phrase: "mit Miša",
    gloss: "with Miša",
    correctSlot: "Mo",
    subtype: "accompaniment",
    rule: "mit-person-Mo",
    difficulty: 1,
  },
  {
    phrase: "mit Lisa und Felipe",
    gloss: "with Lisa and Felipe",
    correctSlot: "Mo",
    subtype: "accompaniment",
    rule: "mit-person-Mo",
    difficulty: 1,
  },
  {
    phrase: "mit Kitty",
    gloss: "with Kitty",
    correctSlot: "Mo",
    subtype: "accompaniment",
    rule: "mit-person-Mo",
    difficulty: 1,
  },
  {
    phrase: "ohne Jacke",
    gloss: "without a jacket",
    correctSlot: "Mo",
    subtype: "negative-means",
    rule: "ohne-Mo",
    difficulty: 1,
    disambiguationNote: "ohne → always Mo (negation of accompaniment/means).",
  },
  {
    phrase: "ohne Alkohol",
    gloss: "without alcohol",
    correctSlot: "Mo",
    subtype: "negative-means",
    rule: "ohne-Mo",
    difficulty: 1,
  },
  {
    phrase: "ohne Hilfe",
    gloss: "without help",
    correctSlot: "Mo",
    subtype: "negative-means",
    rule: "ohne-Mo",
    difficulty: 1,
  },
  {
    phrase: "per E-Mail",
    gloss: "by email",
    correctSlot: "Mo",
    subtype: "channel",
    rule: "per-Mo",
    difficulty: 1,
    disambiguationNote: "per → always Mo (channel/medium).",
  },
  {
    phrase: "per Telefon",
    gloss: "by phone",
    correctSlot: "Mo",
    subtype: "channel",
    rule: "per-Mo",
    difficulty: 1,
  },
  {
    phrase: "per Zoom",
    gloss: "via Zoom",
    correctSlot: "Mo",
    subtype: "channel",
    rule: "per-Mo",
    difficulty: 1,
  },
  {
    phrase: "auf Deutsch",
    gloss: "in German",
    correctSlot: "Mo",
    subtype: "language",
    rule: "auf-language-Mo",
    difficulty: 2,
    disambiguationNote:
      "auf + language → Mo. auf + place → Lo. auf + Weise/Art → Mo.",
    examples: [{ phrase: "auf dem Markt", sameSlot: false, slot: "Lo" }],
  },
  {
    phrase: "auf Englisch",
    gloss: "in English",
    correctSlot: "Mo",
    subtype: "language",
    rule: "auf-language-Mo",
    difficulty: 2,
  },
  {
    phrase: "auf Spanisch",
    gloss: "in Spanish",
    correctSlot: "Mo",
    subtype: "language",
    rule: "auf-language-Mo",
    difficulty: 2,
  },
  {
    phrase: "schnell",
    gloss: "quickly / fast",
    correctSlot: "Mo",
    subtype: "bare-manner",
    rule: "bare-manner-Mo",
    difficulty: 1,
  },
  {
    phrase: "leise",
    gloss: "quietly",
    correctSlot: "Mo",
    subtype: "bare-manner",
    rule: "bare-manner-Mo",
    difficulty: 1,
  },
  {
    phrase: "gern",
    gloss: "gladly / willingly",
    correctSlot: "Mo",
    subtype: "bare-manner",
    rule: "bare-manner-Mo",
    difficulty: 1,
  },
  {
    phrase: "alleine",
    gloss: "alone",
    correctSlot: "Mo",
    subtype: "bare-manner",
    rule: "bare-manner-Mo",
    difficulty: 1,
  },
  {
    phrase: "zusammen",
    gloss: "together",
    correctSlot: "Mo",
    subtype: "bare-manner",
    rule: "bare-manner-Mo",
    difficulty: 1,
  },
  {
    phrase: "mit Geduld",
    gloss: "with patience / patiently",
    correctSlot: "Mo",
    subtype: "manner-abstract",
    rule: "mit-abstract-Mo",
    difficulty: 2,
    disambiguationNote:
      "mit + abstract noun → Mo (manner, how). Not accompaniment.",
  },
  {
    phrase: "in aller Ruhe",
    gloss: "calmly / at one's leisure",
    correctSlot: "Mo",
    subtype: "manner-idiom",
    rule: "in-manner-Mo",
    difficulty: 3,
    disambiguationNote:
      "'in aller Ruhe' → Mo (idiom: calmly). Rare case of 'in' being Mo.",
  },
  {
    phrase: "unter Freunden",
    gloss: "among friends",
    correctSlot: "Mo",
    subtype: "among-social",
    rule: "unter-social-Mo",
    difficulty: 3,
    disambiguationNote:
      "unter + plural people → Mo ('among'). unter + thing → Lo.",
    examples: [{ phrase: "unter dem Tisch", sameSlot: false, slot: "Lo" }],
  },

  // ═══════════════════════════════════════════════════════════════
  // LOKAL (35 items)
  // ═══════════════════════════════════════════════════════════════

  {
    phrase: "bei Lex",
    gloss: "at Lex's place",
    correctSlot: "Lo",
    subtype: "location-at-person",
    rule: "bei-person-Lo",
    difficulty: 1,
    disambiguationNote:
      "bei + person → Lo (location, 'at their place'). Compare zu + person (direction).",
    examples: [{ phrase: "zu Lex", sameSlot: true, slot: "Lo" }],
  },
  {
    phrase: "zu Lex",
    gloss: "to Lex's place",
    correctSlot: "Lo",
    subtype: "direction-to-person",
    rule: "zu-person-Lo",
    difficulty: 1,
    disambiguationNote:
      "zu + person → Lo (direction, 'to their place'). Both slots Lo.",
  },
  {
    phrase: "bei Miša",
    gloss: "at Miša's place",
    correctSlot: "Lo",
    subtype: "location-at-person",
    rule: "bei-person-Lo",
    difficulty: 1,
  },
  {
    phrase: "zu Miša",
    gloss: "to Miša's place",
    correctSlot: "Lo",
    subtype: "direction-to-person",
    rule: "zu-person-Lo",
    difficulty: 1,
  },
  {
    phrase: "bei Kitty",
    gloss: "at Kitty's place",
    correctSlot: "Lo",
    subtype: "location-at-person",
    rule: "bei-person-Lo",
    difficulty: 1,
  },
  {
    phrase: "zu Felipe",
    gloss: "to Felipe's place",
    correctSlot: "Lo",
    subtype: "direction-to-person",
    rule: "zu-person-Lo",
    difficulty: 1,
  },
  {
    phrase: "im Tipsy Bear",
    gloss: "at Tipsy Bear",
    correctSlot: "Lo",
    subtype: "location-venue",
    rule: "im-place-Lo",
    difficulty: 1,
    disambiguationNote: "im + Dat place → Lo (location, wo?).",
  },
  {
    phrase: "ins Tipsy Bear",
    gloss: "to Tipsy Bear",
    correctSlot: "Lo",
    subtype: "direction-to-venue",
    rule: "ins-place-Lo",
    difficulty: 1,
    disambiguationNote:
      "ins + Akk place → Lo (direction, wohin?). Compare im + Dat (location).",
  },
  {
    phrase: "im Späti",
    gloss: "at the Späti",
    correctSlot: "Lo",
    subtype: "location-venue",
    rule: "im-place-Lo",
    difficulty: 1,
  },
  {
    phrase: "zum Späti",
    gloss: "to the Späti",
    correctSlot: "Lo",
    subtype: "direction-to-venue",
    rule: "zum-place-Lo",
    difficulty: 1,
  },
  {
    phrase: "im Görli",
    gloss: "in Görli (Görlitzer Park)",
    correctSlot: "Lo",
    subtype: "location-park",
    rule: "im-place-Lo",
    difficulty: 1,
  },
  {
    phrase: "am Kanal",
    gloss: "at/by the canal",
    correctSlot: "Lo",
    subtype: "location-beside",
    rule: "am-place-Lo",
    difficulty: 1,
    disambiguationNote:
      "am + place → Lo. am + day → Te. Distinguish by the noun type.",
    examples: [{ phrase: "am Montag", sameSlot: false, slot: "Te" }],
  },
  {
    phrase: "am Hermannplatz",
    gloss: "at Hermannplatz",
    correctSlot: "Lo",
    subtype: "location-square",
    rule: "am-place-Lo",
    difficulty: 1,
  },
  {
    phrase: "am Kotti",
    gloss: "at Kotti (Kottbusser Tor)",
    correctSlot: "Lo",
    subtype: "location-square",
    rule: "am-place-Lo",
    difficulty: 1,
  },
  {
    phrase: "im Homeoffice",
    gloss: "in the home office",
    correctSlot: "Lo",
    subtype: "location-work",
    rule: "im-place-Lo",
    difficulty: 1,
  },
  {
    phrase: "in der Küche",
    gloss: "in the kitchen",
    correctSlot: "Lo",
    subtype: "location-room",
    rule: "in-place-Lo",
    difficulty: 1,
  },
  {
    phrase: "auf dem Sofa",
    gloss: "on the sofa",
    correctSlot: "Lo",
    subtype: "location-on",
    rule: "auf-place-Lo",
    difficulty: 1,
  },
  {
    phrase: "zu Hause",
    gloss: "at home",
    correctSlot: "Lo",
    subtype: "location-home-idiom",
    rule: "zu-hause-Lo",
    difficulty: 2,
    disambiguationNote:
      "zu Hause → Lo (location, idiom). Compare nach Hause (direction home).",
    examples: [{ phrase: "nach Hause", sameSlot: true, slot: "Lo" }],
  },
  {
    phrase: "nach Hause",
    gloss: "home (going home)",
    correctSlot: "Lo",
    subtype: "direction-home-idiom",
    rule: "nach-hause-Lo",
    difficulty: 2,
    disambiguationNote:
      "nach Hause → Lo (direction, idiom). Both 'zu Hause' and 'nach Hause' are Lo.",
  },
  {
    phrase: "beim Hausarzt",
    gloss: "at the GP's office",
    correctSlot: "Lo",
    subtype: "location-professional",
    rule: "bei-person-Lo",
    difficulty: 1,
  },
  {
    phrase: "zum Hausarzt",
    gloss: "to the GP",
    correctSlot: "Lo",
    subtype: "direction-to-professional",
    rule: "zum-person-Lo",
    difficulty: 1,
  },
  {
    phrase: "zum Bürgeramt",
    gloss: "to the Bürgeramt",
    correctSlot: "Lo",
    subtype: "direction-to-institution",
    rule: "zum-place-Lo",
    difficulty: 1,
  },
  {
    phrase: "im Finanzamt",
    gloss: "at the tax office",
    correctSlot: "Lo",
    subtype: "location-institution",
    rule: "im-place-Lo",
    difficulty: 1,
  },
  {
    phrase: "nach Berlin",
    gloss: "to Berlin",
    correctSlot: "Lo",
    subtype: "direction-to-city",
    rule: "nach-place-Lo",
    difficulty: 1,
    disambiguationNote:
      "nach + city/country (no article) → Lo (direction). Compare nach + event → Te.",
    examples: [{ phrase: "nach der Arbeit", sameSlot: false, slot: "Te" }],
  },
  {
    phrase: "nach Mexiko",
    gloss: "to Mexico",
    correctSlot: "Lo",
    subtype: "direction-to-country",
    rule: "nach-place-Lo",
    difficulty: 1,
  },
  {
    phrase: "aus Berlin",
    gloss: "from Berlin (origin)",
    correctSlot: "Lo",
    subtype: "origin-place",
    rule: "aus-place-Lo",
    difficulty: 2,
    disambiguationNote:
      "aus + place → Lo (origin). Compare aus + emotion → Ka.",
    examples: [{ phrase: "aus Angst", sameSlot: false, slot: "Ka" }],
  },
  {
    phrase: "aus Mexiko",
    gloss: "from Mexico (origin)",
    correctSlot: "Lo",
    subtype: "origin-country",
    rule: "aus-place-Lo",
    difficulty: 2,
  },
  {
    phrase: "vor dem Tipsy Bear",
    gloss: "in front of Tipsy Bear",
    correctSlot: "Lo",
    subtype: "location-in-front",
    rule: "vor-place-Lo",
    difficulty: 3,
    disambiguationNote:
      "vor + place (Dat) → Lo. Three-way distinction: vor + time (Te), vor + emotion (Ka), vor + place (Lo).",
    examples: [
      { phrase: "vor zwei Wochen", sameSlot: false, slot: "Te" },
      { phrase: "vor Angst", sameSlot: false, slot: "Ka" },
    ],
  },
  {
    phrase: "hinter dem Späti",
    gloss: "behind the Späti",
    correctSlot: "Lo",
    subtype: "location-behind",
    rule: "hinter-place-Lo",
    difficulty: 1,
  },
  {
    phrase: "über die Brücke",
    gloss: "across the bridge",
    correctSlot: "Lo",
    subtype: "direction-across",
    rule: "ueber-place-Lo",
    difficulty: 2,
    disambiguationNote:
      "über + Akk place → Lo (direction, across). über + time → Te.",
  },
  {
    phrase: "über dem Sofa",
    gloss: "above the sofa",
    correctSlot: "Lo",
    subtype: "location-above",
    rule: "ueber-place-Lo",
    difficulty: 2,
  },
  {
    phrase: "unter dem Tisch",
    gloss: "under the table",
    correctSlot: "Lo",
    subtype: "location-under",
    rule: "unter-place-Lo",
    difficulty: 2,
  },
  {
    phrase: "zwischen den Häusern",
    gloss: "between the buildings",
    correctSlot: "Lo",
    subtype: "location-between",
    rule: "zwischen-place-Lo",
    difficulty: 2,
    disambiguationNote: "zwischen + places → Lo. zwischen + times → Te.",
  },
  {
    phrase: "gegenüber dem Späti",
    gloss: "across from the Späti",
    correctSlot: "Lo",
    subtype: "location-opposite",
    rule: "gegenueber-Lo",
    difficulty: 2,
  },
  {
    phrase: "den Kanal entlang",
    gloss: "along the canal",
    correctSlot: "Lo",
    subtype: "direction-along",
    rule: "entlang-Lo",
    difficulty: 3,
    disambiguationNote: "entlang is post-positional (noun first). Always Lo.",
  },
  {
    phrase: "hier",
    gloss: "here",
    correctSlot: "Lo",
    subtype: "bare-location",
    rule: "bare-Lo",
    difficulty: 1,
  },
  {
    phrase: "dort",
    gloss: "there",
    correctSlot: "Lo",
    subtype: "bare-location",
    rule: "bare-Lo",
    difficulty: 1,
  },
  {
    phrase: "draußen",
    gloss: "outside",
    correctSlot: "Lo",
    subtype: "bare-location",
    rule: "bare-Lo",
    difficulty: 1,
  },
];

// Category-level labels used by drill UI for button tooltips + legend.
// Single source of truth so hover text and drill legend stay consistent.
export const slotLabels = {
  Te: {
    full: "Temporal",
    german: "Zeit",
    question: "wann?",
    description: "when — time, duration, frequency",
  },
  Ka: {
    full: "Kausal",
    german: "Grund",
    question: "warum?",
    description: "why — reason, cause",
  },
  Mo: {
    full: "Modal",
    german: "Art",
    question: "wie? womit? mit wem?",
    description: "how — means, manner, accompaniment",
  },
  Lo: {
    full: "Lokal",
    german: "Ort",
    question: "wo? wohin?",
    description: "where / where to — location, direction",
  },
} as const;

export type SlotKey = keyof typeof slotLabels;

// Transform seed entries into DrillItem records for DB insertion.
// Called from seed.ts during first-run bootstrap.
export function buildClassificationItems(): Omit<DrillItem, "id">[] {
  return classificationSeed.map((entry) => ({
    kind: "slot-classification" as const,
    params: {
      phrase: entry.phrase,
      gloss: entry.gloss,
      correctSlot: entry.correctSlot,
      subtype: entry.subtype,
      ...(entry.disambiguationNote && {
        disambiguationNote: entry.disambiguationNote,
      }),
      ...(entry.examples && { examples: JSON.stringify(entry.examples) }),
    },
    rule: entry.rule,
    grammarTopic: "tekamolo" as const,
    difficulty: entry.difficulty,
  }));
}
