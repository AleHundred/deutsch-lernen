import { SlotButtons } from "./components/SlotButtons";
import type { Slot } from "../drills/generators/slotClassification";

interface Props {
  phrase: string;
  gloss?: string;
  onAnswer: (slot: Slot) => void;
}

export function DrillPrompt({ phrase, gloss, onAnswer }: Props) {
  return (
    <div className="flex flex-col items-center gap-12">
      <div className="flex flex-col items-center">
        <div className="font-mono text-4xl text-center leading-snug">
          {phrase}
        </div>
        {gloss && (
          <div className="text-lg italic text-text/60 mt-2 text-center">
            {gloss}
          </div>
        )}
      </div>
      <SlotButtons onAnswer={onAnswer} />
    </div>
  );
}
