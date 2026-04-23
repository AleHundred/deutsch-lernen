import { useEffect } from "react";
import type { Slot } from "../../drills/generators/slotClassification";
import { slotLabels } from "../../db/seed-classification";

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

        const label = slotLabels[slot];
        const titleText = `${label.full} — ${label.question} (${label.description})`;
        const tooltipVisibility = disabled ? "" : "group-hover:opacity-100";

        return (
          <div key={slot} className="group relative">
            <button
              onClick={() => !disabled && onAnswer(slot)}
              disabled={disabled}
              title={titleText}
              className={`min-w-[4.5rem] px-4 py-3 rounded font-medium text-lg border transition-colors ${stateClass}`}
            >
              <span className="text-[10px] text-text/40 block mb-0.5">
                {i + 1}
              </span>
              {slot}
            </button>
            <div
              className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 ${tooltipVisibility} transition-opacity pointer-events-none bg-bg border border-text/20 rounded px-3 py-2 text-sm whitespace-nowrap z-10`}
            >
              <div>
                {label.full} · {label.question}
              </div>
              <div className="text-xs text-text/60 mt-0.5">
                {label.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
