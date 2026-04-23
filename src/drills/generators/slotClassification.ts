import type { DrillItem } from "../../db/schema";

export type Slot = "Te" | "Ka" | "Mo" | "Lo";

export interface SlotClassificationPrompt {
  phrase: string;
  options: readonly ["Te", "Ka", "Mo", "Lo"];
  correctAnswer: Slot;
  subtype: string;
  disambiguationNote?: string;
  examples?: { phrase: string; slot: string; sameSlot: boolean }[];
}

export const SLOT_OPTIONS = ["Te", "Ka", "Mo", "Lo"] as const;

export function generateSlotClassification(
  item: DrillItem,
): SlotClassificationPrompt {
  if (item.kind !== "slot-classification") {
    throw new Error(
      `generateSlotClassification: expected kind "slot-classification", got "${item.kind}"`,
    );
  }

  const params = item.params as {
    phrase: string;
    correctSlot: Slot;
    subtype: string;
    disambiguationNote?: string;
    examples?: string;
  };

  return {
    phrase: params.phrase,
    options: SLOT_OPTIONS,
    correctAnswer: params.correctSlot,
    subtype: params.subtype,
    ...(params.disambiguationNote && {
      disambiguationNote: params.disambiguationNote,
    }),
    ...(params.examples && {
      examples: JSON.parse(params.examples) as {
        phrase: string;
        slot: string;
        sameSlot: boolean;
      }[],
    }),
  };
}
