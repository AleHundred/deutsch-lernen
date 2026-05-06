import { useState, useRef, useEffect } from "react";
import type { ProductionPrompt, EvaluationResult } from "../../drills/types";
import { FeedbackPanel } from "./FeedbackPanel";

interface Props {
  prompt: ProductionPrompt;
  onSubmit: (answer: string) => void;
  onNext: () => void;
  feedback: EvaluationResult | null;
  disabled: boolean;
}

export function ProductionDrill({
  prompt,
  onSubmit,
  onNext,
  feedback,
  disabled,
}: Props) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  const submit = () => {
    if (disabled) return;
    const trimmed = input.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">{prompt.displayPrompt}</div>
      {prompt.gloss && (
        <div className="text-lg italic text-text/60 text-center -mt-2">
          {prompt.gloss}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex gap-3 items-center mt-4"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled}
          autoFocus
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          size={24}
          className="font-mono bg-transparent border border-text/30 rounded px-3 py-2 text-lg focus:outline-none focus:border-accent disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="bg-accent text-bg font-medium px-5 py-2 rounded hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </form>

      {feedback && disabled && (
        <FeedbackPanel feedback={feedback} onNext={onNext} />
      )}
    </div>
  );
}
