import { SlotButtons } from "./components/SlotButtons";
import type { Slot } from "../drills/generators/slotClassification";

interface Props {
  phrase: string;
  onAnswer: (slot: Slot) => void;
}

export function DrillPrompt({ phrase, onAnswer }: Props) {
  return (
    <div className="flex flex-col items-center gap-12">
      <div className="font-mono text-4xl text-center leading-snug">
        {phrase}
      </div>
      <SlotButtons onAnswer={onAnswer} />
    </div>
  );
}
