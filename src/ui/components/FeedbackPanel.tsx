import { useEffect } from "react";
import type { EvaluationResult } from "../../drills/types";

interface Props {
  feedback: EvaluationResult;
  onNext: () => void;
}

export function FeedbackPanel({ feedback, onNext }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onNext();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onNext]);

  const status = buildStatus(feedback);
  const correctClass = feedback.correct ? "text-accent" : "text-red-400";

  return (
    <div className="w-full flex flex-col items-center gap-4 mt-8">
      <div className={`text-xl ${correctClass}`}>
        {status} — {feedback.feedback.correctAnswer}
      </div>

      {feedback.feedback.explanation && (
        <div className="text-sm text-text/70 text-center max-w-md">
          {feedback.feedback.explanation}
        </div>
      )}

      {feedback.feedback.specificErrorType && (
        <div className="text-xs uppercase tracking-widest text-text/50">
          {feedback.feedback.specificErrorType}
        </div>
      )}

      {feedback.feedback.capitalizationWarning && (
        <div className="text-sm text-text/70 italic">
          {feedback.feedback.capitalizationWarning}
        </div>
      )}

      {feedback.diff && (
        <div className="font-mono text-sm text-text/60">{feedback.diff}</div>
      )}

      {feedback.feedback.paradigm && (
        <div className="border-t border-text/10 pt-4 w-full">
          {feedback.feedback.paradigm}
        </div>
      )}

      {feedback.feedback.compareItems &&
        feedback.feedback.compareItems.length > 0 && (
          <div className="border-t border-text/10 pt-4 w-full">
            <div className="text-xs uppercase tracking-widest text-text/50 mb-2 text-center">
              Compare
            </div>
            <ul className="space-y-1">
              {feedback.feedback.compareItems.map((c, i) => (
                <li
                  key={i}
                  className="flex justify-center gap-3 font-mono text-sm"
                >
                  <span>{c.form}</span>
                  <span className="text-text/50">→ {c.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      <button
        onClick={onNext}
        className="bg-accent text-bg font-medium px-6 py-3 rounded hover:opacity-90 mt-4"
      >
        Next →
      </button>
      <div className="text-xs text-text/40">Enter or Space</div>
    </div>
  );
}

function buildStatus(feedback: EvaluationResult): string {
  if (!feedback.correct) return "✗ Incorrect";
  if (feedback.typo) return "✓ Correct (typo)";
  if (feedback.feedback.capitalizationWarning) return "✓ Correct (capitalization)";
  return "✓ Correct";
}
