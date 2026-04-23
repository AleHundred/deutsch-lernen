// src/db/seed-classification.ts
//
// Seed data for slot-classification drill (v0.1).
// 100 adverbial phrases, each tagged with TeKaMoLo slot + subtype.
// Weighted toward Berlin-life vocabulary and ambiguous prepositions.
//
// Structure: each entry becomes one DrillItem with:
//   kind: "slot-classification"
//   grammarTopic: "tekamolo"
//   params: { phrase, correctSlot, subtype, disambiguationNote?, examples? }
//   rule: a pattern key for SRS aggregation (e.g. "mit-Mo-accompaniment")
//
// Names used: Lex (girlfriend), Miša, Lisa, Felipe, Kitty (friends)
// Places: Tipsy Bear, Späti, Görli (Görlitzer Park), Kanal (Landwehrkanal),
//         Homeoffice, Hausarzt, Bürgeramt

import type { DrillItem, UUID } from "./schema";

interface SeedEntry {
  phrase: string;
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
    correctSlot: "Te",
    subtype: "day-of-week",
    rule: "am-day-Te",
    difficulty: 1,
    disambiguationNote: "am + day of week → Te",
  },
  {
    phrase: "um 9 Uhr",
    correctSlot: "Te",
    subtype: "clock-time",
    rule: "um-clock-Te",
    difficulty: 1,
    disambiguationNote: "um + clock time → Te",
  },
  {
    phrase: "im Januar",
    correctSlot: "Te",
    subtype: "month",
    rule: "im-month-Te",
    difficulty: 1,
    disambiguationNote: "im + month → Te",
  },
  {
    phrase: "im Sommer",
    correctSlot: "Te",
    subtype: "season",
    rule: "im-season-Te",
    difficulty: 1,
  },
  {
    phrase: "heute",
    correctSlot: "Te",
    subtype: "bare-adverb",
    rule: "bare-Te",
    difficulty: 1,
  },
  {
    phrase: "morgen",
    correctSlot: "Te",
    subtype: "bare-adverb",
    rule: "bare-Te",
    difficulty: 1,
  },
  {
    phrase: "gestern",
    correctSlot: "Te",
    subtype: "bare-adverb",
    rule: "bare-Te",
    difficulty: 1,
  },
  {
    phrase: "jeden Tag",
    correctSlot: "Te",
    subtype: "frequency",
    rule: "frequency-Te",
    difficulty: 1,
  },
  {
    phrase: "am Wochenende",
    correctSlot: "Te",
    subtype: "period",
    rule: "am-period-Te",
    difficulty: 1,
  },
  {
    phrase: "seit drei Jahren",
    correctSlot: "Te",
    subtype: "duration-since",
    rule: "seit-Te",
    difficulty: 1,
    disambiguationNote: "seit + time → Te (duration up to now)",
  },
  {
    phrase: "vor zwei Wochen",
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
    correctSlot: "Te",
    subtype: "during",
    rule: "waehrend-Te",
    difficulty: 1,
    disambiguationNote: "während → always Te",
  },
  {
    phrase: "bis Freitag",
    correctSlot: "Te",
    subtype: "until-time",
    rule: "bis-time-Te",
    difficulty: 1,
  },
  {
    phrase: "bis morgen",
    correctSlot: "Te",
    subtype: "until-time",
    rule: "bis-time-Te",
    difficulty: 1,
  },
  {
    phrase: "in zwei Tagen",
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
    correctSlot: "Te",
    subtype: "bare-adverb",
    rule: "bare-Te",
    difficulty: 1,
  },
  {
    phrase: "letzte Woche",
    correctSlot: "Te",
    subtype: "last-period",
    rule: "period-Te",
    difficulty: 1,
  },
  {
    phrase: "den ganzen Tag",
    correctSlot: "Te",
    subtype: "duration-through",
    rule: "duration-Te",
    difficulty: 2,
  },
  {
    phrase: "gegen 18 Uhr",
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
    correctSlot: "Te",
    subtype: "between-events",
    rule: "zwischen-time-Te",
    difficulty: 2,
    disambiguationNote: "zwischen + events/times → Te. zwischen + places → Lo.",
  },
  {
    phrase: "zwischen zwei und drei",
    correctSlot: "Te",
    subtype: "between-times",
    rule: "zwischen-time-Te",
    difficulty: 2,
  },
  {
    phrase: "innerhalb einer Woche",
    correctSlot: "Te",
    subtype: "within-time",
    rule: "innerhalb-time-Te",
    difficulty: 2,
  },
  {
    phrase: "über das Wochenende",
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
    correctSlot: "Ka",
    subtype: "reason",
    rule: "wegen-Ka",
    difficulty: 1,
    disambiguationNote: "wegen → always Ka",
  },
  {
    phrase: "wegen eines Termins",
    correctSlot: "Ka",
    subtype: "reason",
    rule: "wegen-Ka",
    difficulty: 1,
  },
  {
    phrase: "wegen Lex",
    correctSlot: "Ka",
    subtype: "reason-personal",
    rule: "wegen-Ka",
    difficulty: 1,
  },
  {
    phrase: "aufgrund der Verspätung",
    correctSlot: "Ka",
    subtype: "reason-formal",
    rule: "aufgrund-Ka",
    difficulty: 2,
  },
  {
    phrase: "aus Angst",
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
    correctSlot: "Ka",
    subtype: "emotion-cause",
    rule: "aus-emotion-Ka",
    difficulty: 2,
  },
  {
    phrase: "aus Langeweile",
    correctSlot: "Ka",
    subtype: "emotion-cause",
    rule: "aus-emotion-Ka",
    difficulty: 2,
  },
  {
    phrase: "vor Angst",
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
    correctSlot: "Ka",
    subtype: "emotion-cause",
    rule: "vor-emotion-Ka",
    difficulty: 3,
  },
  {
    phrase: "deshalb",
    correctSlot: "Ka",
    subtype: "bare-adverb",
    rule: "bare-Ka",
    difficulty: 1,
  },
  {
    phrase: "deswegen",
    correctSlot: "Ka",
    subtype: "bare-adverb",
    rule: "bare-Ka",
    difficulty: 1,
  },
  {
    phrase: "darum",
    correctSlot: "Ka",
    subtype: "bare-adverb",
    rule: "bare-Ka",
    difficulty: 1,
  },
  {
    phrase: "trotz des Regens",
    correctSlot: "Ka",
    subtype: "concessive",
    rule: "trotz-Ka",
    difficulty: 2,
    disambiguationNote:
      "trotz → Ka (concessive, 'despite'). Categorized with kausal for TeKaMoLo purposes.",
  },
  {
    phrase: "dank seiner Hilfe",
    correctSlot: "Ka",
    subtype: "reason-positive",
    rule: "dank-Ka",
    difficulty: 2,
  },
  {
    phrase: "aus diesem Grund",
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
    correctSlot: "Mo",
    subtype: "means-transport",
    rule: "mit-thing-Mo",
    difficulty: 1,
    disambiguationNote: "mit + transport → Mo (means/how).",
  },
  {
    phrase: "mit dem Fahrrad",
    correctSlot: "Mo",
    subtype: "means-transport",
    rule: "mit-thing-Mo",
    difficulty: 1,
  },
  {
    phrase: "mit dem Bus",
    correctSlot: "Mo",
    subtype: "means-transport",
    rule: "mit-thing-Mo",
    difficulty: 1,
  },
  {
    phrase: "zu Fuß",
    correctSlot: "Mo",
    subtype: "means-manner",
    rule: "zu-fuss-Mo",
    difficulty: 1,
    disambiguationNote:
      "zu Fuß → Mo (idiom, 'on foot'). One of the few 'zu + X' phrases that isn't Lo.",
  },
  {
    phrase: "mit Lex",
    correctSlot: "Mo",
    subtype: "accompaniment",
    rule: "mit-person-Mo",
    difficulty: 1,
    disambiguationNote: "mit + person → Mo (accompaniment/with whom).",
  },
  {
    phrase: "mit Miša",
    correctSlot: "Mo",
    subtype: "accompaniment",
    rule: "mit-person-Mo",
    difficulty: 1,
  },
  {
    phrase: "mit Lisa und Felipe",
    correctSlot: "Mo",
    subtype: "accompaniment",
    rule: "mit-person-Mo",
    difficulty: 1,
  },
  {
    phrase: "mit Kitty",
    correctSlot: "Mo",
    subtype: "accompaniment",
    rule: "mit-person-Mo",
    difficulty: 1,
  },
  {
    phrase: "ohne Jacke",
    correctSlot: "Mo",
    subtype: "negative-means",
    rule: "ohne-Mo",
    difficulty: 1,
    disambiguationNote: "ohne → always Mo (negation of accompaniment/means).",
  },
  {
    phrase: "ohne Alkohol",
    correctSlot: "Mo",
    subtype: "negative-means",
    rule: "ohne-Mo",
    difficulty: 1,
  },
  {
    phrase: "ohne Hilfe",
    correctSlot: "Mo",
    subtype: "negative-means",
    rule: "ohne-Mo",
    difficulty: 1,
  },
  {
    phrase: "per E-Mail",
    correctSlot: "Mo",
    subtype: "channel",
    rule: "per-Mo",
    difficulty: 1,
    disambiguationNote: "per → always Mo (channel/medium).",
  },
  {
    phrase: "per Telefon",
    correctSlot: "Mo",
    subtype: "channel",
    rule: "per-Mo",
    difficulty: 1,
  },
  {
    phrase: "per Zoom",
    correctSlot: "Mo",
    subtype: "channel",
    rule: "per-Mo",
    difficulty: 1,
  },
  {
    phrase: "auf Deutsch",
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
    correctSlot: "Mo",
    subtype: "language",
    rule: "auf-language-Mo",
    difficulty: 2,
  },
  {
    phrase: "auf Spanisch",
    correctSlot: "Mo",
    subtype: "language",
    rule: "auf-language-Mo",
    difficulty: 2,
  },
  {
    phrase: "schnell",
    correctSlot: "Mo",
    subtype: "bare-manner",
    rule: "bare-manner-Mo",
    difficulty: 1,
  },
  {
    phrase: "leise",
    correctSlot: "Mo",
    subtype: "bare-manner",
    rule: "bare-manner-Mo",
    difficulty: 1,
  },
  {
    phrase: "gern",
    correctSlot: "Mo",
    subtype: "bare-manner",
    rule: "bare-manner-Mo",
    difficulty: 1,
  },
  {
    phrase: "alleine",
    correctSlot: "Mo",
    subtype: "bare-manner",
    rule: "bare-manner-Mo",
    difficulty: 1,
  },
  {
    phrase: "zusammen",
    correctSlot: "Mo",
    subtype: "bare-manner",
    rule: "bare-manner-Mo",
    difficulty: 1,
  },
  {
    phrase: "mit Geduld",
    correctSlot: "Mo",
    subtype: "manner-abstract",
    rule: "mit-abstract-Mo",
    difficulty: 2,
    disambiguationNote:
      "mit + abstract noun → Mo (manner, how). Not accompaniment.",
  },
  {
    phrase: "in aller Ruhe",
    correctSlot: "Mo",
    subtype: "manner-idiom",
    rule: "in-manner-Mo",
    difficulty: 3,
    disambiguationNote:
      "'in aller Ruhe' → Mo (idiom: calmly). Rare case of 'in' being Mo.",
  },
  {
    phrase: "unter Freunden",
    correctSlot: "Mo",
    subtype: "among-social",
    rule: "unter-social-Mo",
    difficulty: 3,
    disambiguationNote:
      "unter + plural people → Mo ('among'). unter + thing → Lo.",
    examples: [{ phrase: "unter dem Tisch", sameSlot: false, slot: "Lo" }],
  },

  // ═══════════════════════════════════════════════════════════════
  // LOKAL (35 items — heavy because bei/zu pairs and Berlin geography)
  // ═══════════════════════════════════════════════════════════════

  // bei/zu pairs — location vs direction for people/places you actually go
  {
    phrase: "bei Lex",
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
    correctSlot: "Lo",
    subtype: "direction-to-person",
    rule: "zu-person-Lo",
    difficulty: 1,
    disambiguationNote:
      "zu + person → Lo (direction, 'to their place'). Both slots Lo.",
  },
  {
    phrase: "bei Miša",
    correctSlot: "Lo",
    subtype: "location-at-person",
    rule: "bei-person-Lo",
    difficulty: 1,
  },
  {
    phrase: "zu Miša",
    correctSlot: "Lo",
    subtype: "direction-to-person",
    rule: "zu-person-Lo",
    difficulty: 1,
  },
  {
    phrase: "bei Kitty",
    correctSlot: "Lo",
    subtype: "location-at-person",
    rule: "bei-person-Lo",
    difficulty: 1,
  },
  {
    phrase: "zu Felipe",
    correctSlot: "Lo",
    subtype: "direction-to-person",
    rule: "zu-person-Lo",
    difficulty: 1,
  },

  // Berlin venues — Tipsy Bear, Späti, Görli, Kanal, etc.
  {
    phrase: "im Tipsy Bear",
    correctSlot: "Lo",
    subtype: "location-venue",
    rule: "im-place-Lo",
    difficulty: 1,
    disambiguationNote: "im + Dat place → Lo (location, wo?).",
  },
  {
    phrase: "ins Tipsy Bear",
    correctSlot: "Lo",
    subtype: "direction-to-venue",
    rule: "ins-place-Lo",
    difficulty: 1,
    disambiguationNote:
      "ins + Akk place → Lo (direction, wohin?). Compare im + Dat (location).",
  },
  {
    phrase: "im Späti",
    correctSlot: "Lo",
    subtype: "location-venue",
    rule: "im-place-Lo",
    difficulty: 1,
  },
  {
    phrase: "zum Späti",
    correctSlot: "Lo",
    subtype: "direction-to-venue",
    rule: "zum-place-Lo",
    difficulty: 1,
  },
  {
    phrase: "im Görli",
    correctSlot: "Lo",
    subtype: "location-park",
    rule: "im-place-Lo",
    difficulty: 1,
  },
  {
    phrase: "am Kanal",
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
    correctSlot: "Lo",
    subtype: "location-square",
    rule: "am-place-Lo",
    difficulty: 1,
  },
  {
    phrase: "am Kotti",
    correctSlot: "Lo",
    subtype: "location-square",
    rule: "am-place-Lo",
    difficulty: 1,
  },

  // Home and work (remote-life adapted)
  {
    phrase: "im Homeoffice",
    correctSlot: "Lo",
    subtype: "location-work",
    rule: "im-place-Lo",
    difficulty: 1,
  },
  {
    phrase: "in der Küche",
    correctSlot: "Lo",
    subtype: "location-room",
    rule: "in-place-Lo",
    difficulty: 1,
  },
  {
    phrase: "auf dem Sofa",
    correctSlot: "Lo",
    subtype: "location-on",
    rule: "auf-place-Lo",
    difficulty: 1,
  },
  {
    phrase: "zu Hause",
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
    correctSlot: "Lo",
    subtype: "direction-home-idiom",
    rule: "nach-hause-Lo",
    difficulty: 2,
    disambiguationNote:
      "nach Hause → Lo (direction, idiom). Both 'zu Hause' and 'nach Hause' are Lo.",
  },

  // Medical/bureaucracy
  {
    phrase: "beim Hausarzt",
    correctSlot: "Lo",
    subtype: "location-professional",
    rule: "bei-person-Lo",
    difficulty: 1,
  },
  {
    phrase: "zum Hausarzt",
    correctSlot: "Lo",
    subtype: "direction-to-professional",
    rule: "zum-person-Lo",
    difficulty: 1,
  },
  {
    phrase: "zum Bürgeramt",
    correctSlot: "Lo",
    subtype: "direction-to-institution",
    rule: "zum-place-Lo",
    difficulty: 1,
  },
  {
    phrase: "im Finanzamt",
    correctSlot: "Lo",
    subtype: "location-institution",
    rule: "im-place-Lo",
    difficulty: 1,
  },

  // Cities/countries — origin vs destination
  {
    phrase: "nach Berlin",
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
    correctSlot: "Lo",
    subtype: "direction-to-country",
    rule: "nach-place-Lo",
    difficulty: 1,
  },
  {
    phrase: "aus Berlin",
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
    correctSlot: "Lo",
    subtype: "origin-country",
    rule: "aus-place-Lo",
    difficulty: 2,
  },

  // Spatial prepositions — vor, hinter, über, unter, zwischen (spatial)
  {
    phrase: "vor dem Tipsy Bear",
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
    correctSlot: "Lo",
    subtype: "location-behind",
    rule: "hinter-place-Lo",
    difficulty: 1,
  },
  {
    phrase: "über die Brücke",
    correctSlot: "Lo",
    subtype: "direction-across",
    rule: "ueber-place-Lo",
    difficulty: 2,
    disambiguationNote:
      "über + Akk place → Lo (direction, across). über + time → Te.",
  },
  {
    phrase: "über dem Sofa",
    correctSlot: "Lo",
    subtype: "location-above",
    rule: "ueber-place-Lo",
    difficulty: 2,
  },
  {
    phrase: "unter dem Tisch",
    correctSlot: "Lo",
    subtype: "location-under",
    rule: "unter-place-Lo",
    difficulty: 2,
  },
  {
    phrase: "zwischen den Häusern",
    correctSlot: "Lo",
    subtype: "location-between",
    rule: "zwischen-place-Lo",
    difficulty: 2,
    disambiguationNote: "zwischen + places → Lo. zwischen + times → Te.",
  },
  {
    phrase: "gegenüber dem Späti",
    correctSlot: "Lo",
    subtype: "location-opposite",
    rule: "gegenueber-Lo",
    difficulty: 2,
  },

  // Post-positional entlang
  {
    phrase: "den Kanal entlang",
    correctSlot: "Lo",
    subtype: "direction-along",
    rule: "entlang-Lo",
    difficulty: 3,
    disambiguationNote: "entlang is post-positional (noun first). Always Lo.",
  },

  // Bare spatial adverbs
  {
    phrase: "hier",
    correctSlot: "Lo",
    subtype: "bare-location",
    rule: "bare-Lo",
    difficulty: 1,
  },
  {
    phrase: "dort",
    correctSlot: "Lo",
    subtype: "bare-location",
    rule: "bare-Lo",
    difficulty: 1,
  },
  {
    phrase: "draußen",
    correctSlot: "Lo",
    subtype: "bare-location",
    rule: "bare-Lo",
    difficulty: 1,
  },
];

// Transform seed entries into DrillItem records for DB insertion.
// Called from seed.ts during first-run bootstrap.
export function buildClassificationItems(): Omit<DrillItem, "id">[] {
  return classificationSeed.map((entry) => ({
    kind: "slot-classification" as const,
    params: {
      phrase: entry.phrase,
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

// Count: 25 Te + 15 Ka + 25 Mo + 35 Lo = 100 items
// Rules covered (for SRS aggregation analysis later):
//   Te: am-day, um-clock, im-month, im-season, bare-Te, frequency, am-period,
//       seit, vor-time, nach-event, waehrend, bis-time, in-time, period,
//       duration, gegen-time, zwischen-time, innerhalb-time, ueber-time, unter-time
//   Ka: wegen, aufgrund, aus-emotion, vor-emotion, bare-Ka, trotz, dank, aus-grund
//   Mo: mit-thing, zu-fuss, mit-person, ohne, per, auf-language, bare-manner,
//       mit-abstract, in-manner, unter-social
//   Lo: bei-person, zu-person, im-place, ins-place, zum-place, am-place,
//       in-place, auf-place, zu-hause, nach-hause, nach-place, aus-place,
//       vor-place, hinter-place, ueber-place, unter-place, zwischen-place,
//       gegenueber, entlang, bare-Lo
