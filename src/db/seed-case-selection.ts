// src/db/seed-case-selection.ts
//
// Real seed for case-selection drill (drill 1.1).
// 65 items: 24 Akk-only preps + 27 Dat-only preps + 14 verb-driven.
// Replaces the 4-item stub seed used during Phase B wiring.
//
// Berlin-life vocabulary: friends Lex (Albanian, raised in Greece), Miša, Lisa,
// Felipe, Kitty. Places Görli, Tipsy Bear, Späti, Kanal, Hermannplatz, Kotti,
// Bürgeramt, Hausarzt. Remote-work texture (Homeoffice, Zoom). Sobriety-relevant
// vocabulary where natural.
//
// Each entry maps to a DrillItem with kind="case-selection" and
// grammarTopic="case-selection-basics".

import type { DrillItem } from "./schema";

interface CaseSelectionSeedEntry {
  frame: string;
  trigger: string; // word to highlight within frame
  highlightStart: number; // computed below; auto-derived from frame.indexOf(trigger)
  highlightEnd: number;
  triggerType:
    | "preposition"
    | "verb-transitive"
    | "verb-dative"
    | "sein-construction";
  correctCase: "nom" | "akk" | "dat";
  gloss: string;
  explanation: string;
  rule: string;
  difficulty: 1 | 2 | 3;
}

// Helper: derive highlight indices from frame + trigger string.
// All triggers in this seed appear exactly once in their frames.
function locate(
  frame: string,
  trigger: string,
): { start: number; end: number } {
  const start = frame.indexOf(trigger);
  if (start === -1) {
    throw new Error(`Trigger "${trigger}" not found in frame: ${frame}`);
  }
  return { start, end: start + trigger.length };
}

// Raw entries — indices computed at build time.
type RawEntry = Omit<CaseSelectionSeedEntry, "highlightStart" | "highlightEnd">;

const rawSeed: RawEntry[] = [
  // ═══════════════════════════════════════════════════════════════
  // AKK-ONLY PREPOSITIONS (24)
  // ═══════════════════════════════════════════════════════════════

  // für (6)
  {
    frame: "Das ist für Lex.",
    trigger: "für",
    triggerType: "preposition",
    correctCase: "akk",
    gloss: "This is for Lex.",
    explanation: "für always triggers Akkusativ.",
    rule: "für-Akk",
    difficulty: 1,
  },
  {
    frame: "Ich kaufe Blumen für Miša.",
    trigger: "für",
    triggerType: "preposition",
    correctCase: "akk",
    gloss: "I'm buying flowers for Miša.",
    explanation: "für always triggers Akkusativ.",
    rule: "für-Akk",
    difficulty: 1,
  },
  {
    frame: "Ich arbeite für eine kleine Firma.",
    trigger: "für",
    triggerType: "preposition",
    correctCase: "akk",
    gloss: "I work for a small company.",
    explanation: "für always triggers Akkusativ.",
    rule: "für-Akk",
    difficulty: 1,
  },
  {
    frame: "Das Geschenk ist für meine Mutter.",
    trigger: "für",
    triggerType: "preposition",
    correctCase: "akk",
    gloss: "The gift is for my mother.",
    explanation: "für always triggers Akkusativ.",
    rule: "für-Akk",
    difficulty: 1,
  },
  {
    frame: "Ich brauche das für morgen.",
    trigger: "für",
    triggerType: "preposition",
    correctCase: "akk",
    gloss: "I need that for tomorrow.",
    explanation: "für always triggers Akkusativ.",
    rule: "für-Akk",
    difficulty: 1,
  },
  {
    frame: "Vielen Dank für die Einladung.",
    trigger: "für",
    triggerType: "preposition",
    correctCase: "akk",
    gloss: "Thanks for the invitation.",
    explanation: "für always triggers Akkusativ.",
    rule: "für-Akk",
    difficulty: 1,
  },

  // ohne (5)
  {
    frame: "Ich gehe heute ohne Jacke.",
    trigger: "ohne",
    triggerType: "preposition",
    correctCase: "akk",
    gloss: "I'm going without a jacket today.",
    explanation: "ohne always triggers Akkusativ.",
    rule: "ohne-Akk",
    difficulty: 1,
  },
  {
    frame: "Das Meeting war ohne Felipe.",
    trigger: "ohne",
    triggerType: "preposition",
    correctCase: "akk",
    gloss: "The meeting was without Felipe.",
    explanation: "ohne always triggers Akkusativ.",
    rule: "ohne-Akk",
    difficulty: 1,
  },
  {
    frame: "Ich trinke meinen Kaffee ohne Zucker.",
    trigger: "ohne",
    triggerType: "preposition",
    correctCase: "akk",
    gloss: "I drink my coffee without sugar.",
    explanation: "ohne always triggers Akkusativ.",
    rule: "ohne-Akk",
    difficulty: 1,
  },
  {
    frame: "Ich kann nicht ohne meine Brille lesen.",
    trigger: "ohne",
    triggerType: "preposition",
    correctCase: "akk",
    gloss: "I can't read without my glasses.",
    explanation: "ohne always triggers Akkusativ.",
    rule: "ohne-Akk",
    difficulty: 1,
  },
  {
    frame: "Sie ist ohne Lex hierhergekommen.",
    trigger: "ohne",
    triggerType: "preposition",
    correctCase: "akk",
    gloss: "She came here without Lex.",
    explanation: "ohne always triggers Akkusativ.",
    rule: "ohne-Akk",
    difficulty: 1,
  },

  // durch (5)
  {
    frame: "Wir laufen durch den Görli.",
    trigger: "durch",
    triggerType: "preposition",
    correctCase: "akk",
    gloss: "We walk through Görli.",
    explanation: "durch always triggers Akkusativ.",
    rule: "durch-Akk",
    difficulty: 1,
  },
  {
    frame: "Ich gehe durch die Tür.",
    trigger: "durch",
    triggerType: "preposition",
    correctCase: "akk",
    gloss: "I walk through the door.",
    explanation: "durch always triggers Akkusativ.",
    rule: "durch-Akk",
    difficulty: 1,
  },
  {
    frame: "Ich habe es durch einen Freund erfahren.",
    trigger: "durch",
    triggerType: "preposition",
    correctCase: "akk",
    gloss: "I found out through a friend.",
    explanation: "durch always triggers Akkusativ.",
    rule: "durch-Akk",
    difficulty: 1,
  },
  {
    frame: "Sie reisen durch Deutschland.",
    trigger: "durch",
    triggerType: "preposition",
    correctCase: "akk",
    gloss: "They're traveling through Germany.",
    explanation: "durch always triggers Akkusativ.",
    rule: "durch-Akk",
    difficulty: 1,
  },
  {
    frame: "Durch das Fenster sehe ich den Kanal.",
    trigger: "Durch",
    triggerType: "preposition",
    correctCase: "akk",
    gloss: "Through the window I see the canal.",
    explanation:
      "durch always triggers Akkusativ. Capitalized here because it starts the sentence.",
    rule: "durch-Akk",
    difficulty: 2,
  },

  // gegen (4)
  {
    frame: "Ich nehme etwas gegen Kopfschmerzen.",
    trigger: "gegen",
    triggerType: "preposition",
    correctCase: "akk",
    gloss: "I'm taking something for a headache.",
    explanation: "gegen always triggers Akkusativ.",
    rule: "gegen-Akk",
    difficulty: 1,
  },
  {
    frame: "Wir spielen morgen gegen ein anderes Team.",
    trigger: "gegen",
    triggerType: "preposition",
    correctCase: "akk",
    gloss: "We're playing against another team tomorrow.",
    explanation: "gegen always triggers Akkusativ.",
    rule: "gegen-Akk",
    difficulty: 1,
  },
  {
    frame: "Ich bin gegen diese Entscheidung.",
    trigger: "gegen",
    triggerType: "preposition",
    correctCase: "akk",
    gloss: "I'm against this decision.",
    explanation: "gegen always triggers Akkusativ.",
    rule: "gegen-Akk",
    difficulty: 1,
  },
  {
    frame: "Das Auto fuhr gegen die Wand.",
    trigger: "gegen",
    triggerType: "preposition",
    correctCase: "akk",
    gloss: "The car drove into the wall.",
    explanation: "gegen always triggers Akkusativ.",
    rule: "gegen-Akk",
    difficulty: 1,
  },

  // um (4)
  {
    frame: "Wir treffen uns um 18 Uhr.",
    trigger: "um",
    triggerType: "preposition",
    correctCase: "akk",
    gloss: "We meet at 6 PM.",
    explanation: "um always triggers Akkusativ (also for clock times).",
    rule: "um-Akk",
    difficulty: 1,
  },
  {
    frame: "Wir laufen um den Kanal.",
    trigger: "um",
    triggerType: "preposition",
    correctCase: "akk",
    gloss: "We walk around the canal.",
    explanation: "um always triggers Akkusativ.",
    rule: "um-Akk",
    difficulty: 1,
  },
  {
    frame: "Ich kümmere mich um Lex.",
    trigger: "um",
    triggerType: "preposition",
    correctCase: "akk",
    gloss: "I take care of Lex.",
    explanation: "um always triggers Akkusativ.",
    rule: "um-Akk",
    difficulty: 1,
  },
  {
    frame: "Es geht um eine wichtige Sache.",
    trigger: "um",
    triggerType: "preposition",
    correctCase: "akk",
    gloss: "It's about an important thing.",
    explanation: "um always triggers Akkusativ.",
    rule: "um-Akk",
    difficulty: 2,
  },

  // ═══════════════════════════════════════════════════════════════
  // DAT-ONLY PREPOSITIONS (27)
  // ═══════════════════════════════════════════════════════════════

  // mit (5)
  {
    frame: "Ich fahre mit der U-Bahn.",
    trigger: "mit",
    triggerType: "preposition",
    correctCase: "dat",
    gloss: "I go by U-Bahn.",
    explanation: "mit always triggers Dativ.",
    rule: "mit-Dat",
    difficulty: 1,
  },
  {
    frame: "Ich gehe mit Miša ins Tipsy Bear.",
    trigger: "mit",
    triggerType: "preposition",
    correctCase: "dat",
    gloss: "I'm going to Tipsy Bear with Miša.",
    explanation: "mit always triggers Dativ.",
    rule: "mit-Dat",
    difficulty: 1,
  },
  {
    frame: "Schreib mir mit dem Handy.",
    trigger: "mit",
    triggerType: "preposition",
    correctCase: "dat",
    gloss: "Text me with your phone.",
    explanation: "mit always triggers Dativ.",
    rule: "mit-Dat",
    difficulty: 1,
  },
  {
    frame: "Ich arbeite mit einem Team in Spanien.",
    trigger: "mit",
    triggerType: "preposition",
    correctCase: "dat",
    gloss: "I work with a team in Spain.",
    explanation: "mit always triggers Dativ.",
    rule: "mit-Dat",
    difficulty: 1,
  },
  {
    frame: "Ich war gestern mit Kitty unterwegs.",
    trigger: "mit",
    triggerType: "preposition",
    correctCase: "dat",
    gloss: "I was out with Kitty yesterday.",
    explanation: "mit always triggers Dativ.",
    rule: "mit-Dat",
    difficulty: 1,
  },

  // bei (5)
  {
    frame: "Ich war bei Lex zum Abendessen.",
    trigger: "bei",
    triggerType: "preposition",
    correctCase: "dat",
    gloss: "I was at Lex's for dinner.",
    explanation: "bei always triggers Dativ.",
    rule: "bei-Dat",
    difficulty: 1,
  },
  {
    frame: "Bei dem Wetter bleibe ich zu Hause.",
    trigger: "Bei",
    triggerType: "preposition",
    correctCase: "dat",
    gloss: "In this weather I'm staying home.",
    explanation:
      "bei always triggers Dativ. Capitalized here because it starts the sentence.",
    rule: "bei-Dat",
    difficulty: 2,
  },
  {
    frame: "Ich wohne bei einer Freundin.",
    trigger: "bei",
    triggerType: "preposition",
    correctCase: "dat",
    gloss: "I'm staying with a friend.",
    explanation: "bei always triggers Dativ.",
    rule: "bei-Dat",
    difficulty: 1,
  },
  {
    frame: "Beim Hausarzt habe ich lange gewartet.",
    trigger: "Beim",
    triggerType: "preposition",
    correctCase: "dat",
    gloss: "I waited a long time at the GP's.",
    explanation: "Beim = bei + dem. Always triggers Dativ.",
    rule: "bei-Dat",
    difficulty: 2,
  },
  {
    frame: "Ich bin gerade beim Kochen.",
    trigger: "beim",
    triggerType: "preposition",
    correctCase: "dat",
    gloss: "I'm in the middle of cooking.",
    explanation: "beim = bei + dem. Always triggers Dativ.",
    rule: "bei-Dat",
    difficulty: 2,
  },

  // von (4)
  {
    frame: "Ich komme gerade von der Arbeit.",
    trigger: "von",
    triggerType: "preposition",
    correctCase: "dat",
    gloss: "I'm just coming from work.",
    explanation: "von always triggers Dativ.",
    rule: "von-Dat",
    difficulty: 1,
  },
  {
    frame: "Das ist ein Geschenk von Lex.",
    trigger: "von",
    triggerType: "preposition",
    correctCase: "dat",
    gloss: "It's a gift from Lex.",
    explanation: "von always triggers Dativ.",
    rule: "von-Dat",
    difficulty: 1,
  },
  {
    frame: "Ich habe das von einem Kollegen gehört.",
    trigger: "von",
    triggerType: "preposition",
    correctCase: "dat",
    gloss: "I heard it from a colleague.",
    explanation: "von always triggers Dativ.",
    rule: "von-Dat",
    difficulty: 1,
  },
  {
    frame: "Wir sprechen oft von dir.",
    trigger: "von",
    triggerType: "preposition",
    correctCase: "dat",
    gloss: "We often talk about you.",
    explanation: "von always triggers Dativ.",
    rule: "von-Dat",
    difficulty: 1,
  },

  // zu (4)
  {
    frame: "Ich gehe zum Bürgeramt.",
    trigger: "zum",
    triggerType: "preposition",
    correctCase: "dat",
    gloss: "I'm going to the Bürgeramt.",
    explanation: "zum = zu + dem. Always triggers Dativ.",
    rule: "zu-Dat",
    difficulty: 1,
  },
  {
    frame: "Ich fahre zu Felipe nach Mitte.",
    trigger: "zu",
    triggerType: "preposition",
    correctCase: "dat",
    gloss: "I'm going to Felipe's in Mitte.",
    explanation: "zu always triggers Dativ.",
    rule: "zu-Dat",
    difficulty: 1,
  },
  {
    frame: "Was möchtest du zum Frühstück?",
    trigger: "zum",
    triggerType: "preposition",
    correctCase: "dat",
    gloss: "What would you like for breakfast?",
    explanation: "zum = zu + dem. Always triggers Dativ.",
    rule: "zu-Dat",
    difficulty: 1,
  },
  {
    frame: "Ich habe keine Zeit zum Lernen.",
    trigger: "zum",
    triggerType: "preposition",
    correctCase: "dat",
    gloss: "I have no time to study.",
    explanation: "zum = zu + dem. Always triggers Dativ.",
    rule: "zu-Dat",
    difficulty: 2,
  },

  // nach (4)
  {
    frame: "Nach der Arbeit treffe ich Miša.",
    trigger: "Nach",
    triggerType: "preposition",
    correctCase: "dat",
    gloss: "After work I'm meeting Miša.",
    explanation:
      "nach always triggers Dativ. Capitalized here because it starts the sentence.",
    rule: "nach-Dat",
    difficulty: 1,
  },
  {
    frame: "Wir fliegen nächste Woche nach Mexiko.",
    trigger: "nach",
    triggerType: "preposition",
    correctCase: "dat",
    gloss: "We're flying to Mexico next week.",
    explanation: "nach always triggers Dativ.",
    rule: "nach-Dat",
    difficulty: 1,
  },
  {
    frame: "Nach dem Meeting ruf ich dich an.",
    trigger: "Nach",
    triggerType: "preposition",
    correctCase: "dat",
    gloss: "After the meeting I'll call you.",
    explanation:
      "nach always triggers Dativ. Capitalized here because it starts the sentence.",
    rule: "nach-Dat",
    difficulty: 1,
  },
  {
    frame: "Sie sucht nach einer neuen Wohnung.",
    trigger: "nach",
    triggerType: "preposition",
    correctCase: "dat",
    gloss: "She's looking for a new apartment.",
    explanation: "nach always triggers Dativ.",
    rule: "nach-Dat",
    difficulty: 1,
  },

  // aus (4 — increased from 3 for Lex pair)
  {
    frame: "Lex kommt aus Albanien.",
    trigger: "aus",
    triggerType: "preposition",
    correctCase: "dat",
    gloss: "Lex is from Albania.",
    explanation:
      "aus + place → Dativ (origin). Note: aus + emotion (e.g. aus Angst) is also Dativ but functions as Kausal in slot-classification.",
    rule: "aus-Dat",
    difficulty: 1,
  },
  {
    frame: "Lex ist in Griechenland aufgewachsen.",
    trigger: "in",
    triggerType: "preposition",
    correctCase: "dat",
    gloss: "Lex grew up in Greece.",
    explanation:
      "in + Dat = location/state ('in Greece'). Compare with in + Akk = direction ('into Greece'). This is a Wechselpräposition; here it's location, so Dativ.",
    rule: "in-wechsel-location-Dat",
    difficulty: 3,
  },
  {
    frame: "Ich trinke aus einer Tasse.",
    trigger: "aus",
    triggerType: "preposition",
    correctCase: "dat",
    gloss: "I drink from a cup.",
    explanation: "aus always triggers Dativ.",
    rule: "aus-Dat",
    difficulty: 1,
  },
  {
    frame: "Aus diesem Grund bleibe ich heute zu Hause.",
    trigger: "Aus",
    triggerType: "preposition",
    correctCase: "dat",
    gloss: "For this reason I'm staying home today.",
    explanation:
      "aus always triggers Dativ. Capitalized here because it starts the sentence.",
    rule: "aus-Dat",
    difficulty: 2,
  },

  // seit (1)
  {
    frame: "Ich wohne seit sechs Jahren in Berlin.",
    trigger: "seit",
    triggerType: "preposition",
    correctCase: "dat",
    gloss: "I've lived in Berlin for six years.",
    explanation: "seit always triggers Dativ.",
    rule: "seit-Dat",
    difficulty: 1,
  },

  // ═══════════════════════════════════════════════════════════════
  // VERB-DRIVEN ITEMS (14)
  // ═══════════════════════════════════════════════════════════════

  // Transitive verbs → Akk (7)
  {
    frame: "Ich sehe meinen Kollegen heute Abend.",
    trigger: "sehe",
    triggerType: "verb-transitive",
    correctCase: "akk",
    gloss: "I'm seeing my colleague tonight.",
    explanation: "sehen is transitive — its direct object takes Akkusativ.",
    rule: "sehen-Akk",
    difficulty: 1,
  },
  {
    frame: "Ich treffe Lex am Hermannplatz.",
    trigger: "treffe",
    triggerType: "verb-transitive",
    correctCase: "akk",
    gloss: "I'm meeting Lex at Hermannplatz.",
    explanation: "treffen is transitive — its direct object takes Akkusativ.",
    rule: "treffen-Akk",
    difficulty: 1,
  },
  {
    frame: "Ich kaufe einen neuen Laptop.",
    trigger: "kaufe",
    triggerType: "verb-transitive",
    correctCase: "akk",
    gloss: "I'm buying a new laptop.",
    explanation: "kaufen is transitive — its direct object takes Akkusativ.",
    rule: "kaufen-Akk",
    difficulty: 1,
  },
  {
    frame: "Ich frage meinen Hausarzt.",
    trigger: "frage",
    triggerType: "verb-transitive",
    correctCase: "akk",
    gloss: "I'm asking my GP.",
    explanation:
      "fragen is transitive — its direct object takes Akkusativ. (Spanish/English speakers often miscode this as Dativ.)",
    rule: "fragen-Akk",
    difficulty: 2,
  },
  {
    frame: "Ich liebe diese Stadt.",
    trigger: "liebe",
    triggerType: "verb-transitive",
    correctCase: "akk",
    gloss: "I love this city.",
    explanation: "lieben is transitive — its direct object takes Akkusativ.",
    rule: "lieben-Akk",
    difficulty: 1,
  },
  {
    frame: "Ich brauche einen Termin.",
    trigger: "brauche",
    triggerType: "verb-transitive",
    correctCase: "akk",
    gloss: "I need an appointment.",
    explanation: "brauchen is transitive — its direct object takes Akkusativ.",
    rule: "brauchen-Akk",
    difficulty: 1,
  },
  {
    frame: "Ich besuche meine Eltern in Mexiko.",
    trigger: "besuche",
    triggerType: "verb-transitive",
    correctCase: "akk",
    gloss: "I visit my parents in Mexico.",
    explanation: "besuchen is transitive — its direct object takes Akkusativ.",
    rule: "besuchen-Akk",
    difficulty: 1,
  },

  // Dative verbs → Dat (7)
  {
    frame: "Ich helfe meinem Nachbarn beim Umzug.",
    trigger: "helfe",
    triggerType: "verb-dative",
    correctCase: "dat",
    gloss: "I'm helping my neighbor move.",
    explanation:
      "helfen is a dative verb. The person being helped takes Dativ, not Akkusativ. This is one of the most common Spanish/English-speaker errors.",
    rule: "helfen-Dat",
    difficulty: 2,
  },
  {
    frame: "Ich danke dir für die Hilfe.",
    trigger: "danke",
    triggerType: "verb-dative",
    correctCase: "dat",
    gloss: "Thank you for the help.",
    explanation:
      "danken is a dative verb. The person being thanked takes Dativ.",
    rule: "danken-Dat",
    difficulty: 2,
  },
  {
    frame: "Wir gratulieren ihm zum Geburtstag.",
    trigger: "gratulieren",
    triggerType: "verb-dative",
    correctCase: "dat",
    gloss: "We congratulate him on his birthday.",
    explanation:
      "gratulieren is a dative verb. The person being congratulated takes Dativ.",
    rule: "gratulieren-Dat",
    difficulty: 2,
  },
  {
    frame: "Antworte mir bitte schnell.",
    trigger: "Antworte",
    triggerType: "verb-dative",
    correctCase: "dat",
    gloss: "Please answer me quickly.",
    explanation:
      "antworten is a dative verb. The person being answered takes Dativ.",
    rule: "antworten-Dat",
    difficulty: 2,
  },
  {
    frame: "Das gehört meiner Schwester.",
    trigger: "gehört",
    triggerType: "verb-dative",
    correctCase: "dat",
    gloss: "That belongs to my sister.",
    explanation: "gehören is a dative verb. The owner takes Dativ.",
    rule: "gehören-Dat",
    difficulty: 2,
  },
  {
    frame: "Sie folgt einem Rezept.",
    trigger: "folgt",
    triggerType: "verb-dative",
    correctCase: "dat",
    gloss: "She follows a recipe.",
    explanation: "folgen is a dative verb. What is being followed takes Dativ.",
    rule: "folgen-Dat",
    difficulty: 2,
  },
  {
    frame: "Das passt mir nicht.",
    trigger: "passt",
    triggerType: "verb-dative",
    correctCase: "dat",
    gloss: "That doesn't suit me.",
    explanation:
      "passen is a dative verb. The person it suits/fits takes Dativ.",
    rule: "passen-Dat",
    difficulty: 2,
  },
];

// Build the full seed array with computed indices.
export const caseSelectionSeed: CaseSelectionSeedEntry[] = rawSeed.map(
  (entry) => {
    const { start, end } = locate(entry.frame, entry.trigger);
    return { ...entry, highlightStart: start, highlightEnd: end };
  },
);

// Transform seed entries into DrillItem records for DB insertion.
// Called from seed.ts on first-run / wipe-and-reseed.
export function buildCaseSelectionItems(): Omit<DrillItem, "id">[] {
  return caseSelectionSeed.map((entry) => ({
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
