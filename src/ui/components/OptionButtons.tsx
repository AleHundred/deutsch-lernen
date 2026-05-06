import { useEffect } from "react";

export interface OptionTooltip {
  full: string;
  question: string;
  description: string;
}

export interface ButtonOption {
  value: string;          // submitted as the answer
  label?: string;         // displayed on button (defaults to value)
  tooltip?: OptionTooltip;
}

interface Props {
  options: readonly ButtonOption[];
  onAnswer: (value: string) => void;
  disabled?: boolean;
  correctValue?: string;  // for post-answer highlighting
  userAnswer?: string;    // for post-answer highlighting
  tooltipsEnabled?: boolean;
}

export function OptionButtons({
  options,
  onAnswer,
  disabled,
  correctValue,
  userAnswer,
  tooltipsEnabled,
}: Props) {
  useEffect(() => {
    if (disabled) return;
    const handler = (e: KeyboardEvent) => {
      const idx = ["1", "2", "3", "4", "5", "6", "7", "8", "9"].indexOf(e.key);
      if (idx >= 0 && idx < options.length) {
        e.preventDefault();
        onAnswer(options[idx]!.value);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [disabled, onAnswer, options]);

  return (
    <div className="flex gap-3 justify-center flex-wrap">
      {options.map((option, i) => {
        const isCorrect = correctValue === option.value;
        const isWrongPick = userAnswer === option.value && !isCorrect;
        let stateClass = "border-text/30 hover:border-accent hover:text-accent";
        if (isCorrect) {
          stateClass = "bg-accent/20 border-accent text-accent";
        } else if (isWrongPick) {
          stateClass = "border-red-500/70 text-red-400";
        } else if (disabled) {
          stateClass = "border-text/15 text-text/40";
        }

        const titleText = option.tooltip
          ? `${option.tooltip.full} — ${option.tooltip.question} (${option.tooltip.description})`
          : undefined;
        const showTooltip = tooltipsEnabled && option.tooltip && !disabled;

        return (
          <div key={option.value} className="group relative">
            <button
              onClick={() => !disabled && onAnswer(option.value)}
              disabled={disabled}
              title={titleText}
              className={`min-w-[4.5rem] px-4 py-3 rounded font-medium text-lg border transition-colors ${stateClass}`}
            >
              <span className="text-[10px] text-text/40 block mb-0.5">
                {i + 1}
              </span>
              {option.label ?? option.value}
            </button>
            {showTooltip && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-bg border border-text/20 rounded px-3 py-2 text-sm whitespace-nowrap z-10">
                <div>
                  {option.tooltip!.full} · {option.tooltip!.question}
                </div>
                <div className="text-xs text-text/60 mt-0.5">
                  {option.tooltip!.description}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
