import { useEffect } from "react";
import type { Slot } from "../../drills/generators/slotClassification";

const SLOTS: readonly Slot[] = ["Te", "Ka", "Mo", "Lo"];

interface Props {
  onAnswer: (slot: Slot) => void;
  disabled?: boolean;
  correctSlot?: Slot;
  userAnswer?: Slot;
}

export function SlotButtons({
  onAnswer,
  disabled,
  correctSlot,
  userAnswer,
}: Props) {
  useEffect(() => {
    if (disabled) return;
    const handler = (e: KeyboardEvent) => {
      const idx = ["1", "2", "3", "4"].indexOf(e.key);
      if (idx >= 0) {
        e.preventDefault();
        onAnswer(SLOTS[idx]!);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [disabled, onAnswer]);

  return (
    <div className="flex gap-3 justify-center">
      {SLOTS.map((slot, i) => {
        const isCorrect = correctSlot === slot;
        const isWrongPick = userAnswer === slot && !isCorrect;
        let stateClass = "border-text/30 hover:border-accent hover:text-accent";
        if (isCorrect) {
          stateClass = "bg-accent/20 border-accent text-accent";
        } else if (isWrongPick) {
          stateClass = "border-red-500/70 text-red-400";
        } else if (disabled) {
          stateClass = "border-text/15 text-text/40";
        }
        return (
          <button
            key={slot}
            onClick={() => !disabled && onAnswer(slot)}
            disabled={disabled}
            className={`min-w-[4.5rem] px-4 py-3 rounded font-medium text-lg border transition-colors ${stateClass}`}
          >
            <span className="text-[10px] text-text/40 block mb-0.5">
              {i + 1}
            </span>
            {slot}
          </button>
        );
      })}
    </div>
  );
}
