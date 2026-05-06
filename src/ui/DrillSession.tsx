import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionStore } from "../state/session";
import { DrillPrompt } from "./DrillPrompt";
import { SlotButtons } from "./components/SlotButtons";
import {
  generateSlotClassification,
  type Slot,
} from "../drills/generators/slotClassification";
import type { EvaluationResult } from "../drills/types";
import { slotLabels, type SlotKey } from "../db/seed-classification";

const LEGEND_ORDER: SlotKey[] = ["Te", "Ka", "Mo", "Lo"];

export function DrillSession() {
  const navigate = useNavigate();
  const items = useSessionStore((s) => s.items);
  const currentIndex = useSessionStore((s) => s.currentIndex);
  const answerCurrent = useSessionStore((s) => s.answerCurrent);
  const advance = useSessionStore((s) => s.advance);
  const finish = useSessionStore((s) => s.finish);

  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [userAnswer, setUserAnswer] = useState<Slot | null>(null);
  const promptStartRef = useRef<number>(Date.now());

  useEffect(() => {
    if (items.length === 0) navigate("/", { replace: true });
  }, [items.length, navigate]);

  useEffect(() => {
    promptStartRef.current = Date.now();
  }, [currentIndex]);

  const item = items[currentIndex];

  const handleAnswer = useCallback(
    async (slot: Slot) => {
      if (result !== null) return;
      const rtMs = Date.now() - promptStartRef.current;
      setUserAnswer(slot);
      const r = await answerCurrent(slot, rtMs);
      setResult(r);
    },
    [result, answerCurrent],
  );

  const handleNext = useCallback(async () => {
    if (result === null) return;
    const isLast = currentIndex + 1 >= items.length;
    advance();
    setResult(null);
    setUserAnswer(null);
    if (isLast) {
      await finish();
      navigate("/summary");
    }
  }, [result, currentIndex, items.length, advance, finish, navigate]);

  useEffect(() => {
    if (result === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        void handleNext();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [result, handleNext]);

  if (!item) return null;

  const prompt = generateSlotClassification(item);
  const total = items.length;
  const position = currentIndex + 1;
  const isLast = position === total;

  return (
    <div className="min-h-screen flex flex-col max-w-xl mx-auto px-6 py-10">
      <div className="text-xs uppercase tracking-widest text-text/50 mb-6">
        Item {position} of {total}
      </div>

      <div className="flex gap-5 justify-center mb-10 text-xs text-text/40 tracking-wide">
        {LEGEND_ORDER.map((k) => (
          <span key={k}>
            {k} · {slotLabels[k].german}
          </span>
        ))}
      </div>

      {result === null ? (
        <DrillPrompt
          phrase={prompt.phrase}
          gloss={prompt.gloss}
          onAnswer={handleAnswer}
        />
      ) : (
        <div className="flex flex-col items-center gap-10">
          <div className="flex flex-col items-center">
            <div className="font-mono text-4xl text-center leading-snug">
              {prompt.phrase}
            </div>
            {prompt.gloss && (
              <div className="text-lg italic text-text/60 mt-2 text-center">
                {prompt.gloss}
              </div>
            )}
          </div>
          <SlotButtons
            onAnswer={() => {}}
            disabled
            correctSlot={prompt.correctAnswer}
            userAnswer={userAnswer ?? undefined}
          />
          <div className="w-full flex flex-col gap-5 items-center">
            <div
              className={`text-xl ${
                result.correct ? "text-accent" : "text-red-400"
              }`}
            >
              {result.correct ? "✓" : "✗"} {result.feedback.correctAnswer}
            </div>
            {prompt.disambiguationNote && (
              <div className="text-sm text-text/70 text-center max-w-md">
                {prompt.disambiguationNote}
              </div>
            )}
            {prompt.examples && prompt.examples.length > 0 && (
              <div className="border-t border-text/10 pt-5 w-full">
                <div className="text-xs uppercase tracking-widest text-text/50 mb-3 text-center">
                  Compare
                </div>
                <ul className="space-y-2">
                  {prompt.examples.map((ex, i) => (
                    <li
                      key={i}
                      className="flex justify-center gap-4 font-mono text-sm"
                    >
                      <span>{ex.phrase}</span>
                      <span className="text-text/50">→ {ex.slot}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <button
            onClick={handleNext}
            className="bg-accent text-bg font-medium px-6 py-3 rounded hover:opacity-90"
          >
            {isLast ? "Finish →" : "Next →"}
          </button>
          <div className="text-xs text-text/40">Enter or Space</div>
        </div>
      )}
    </div>
  );
}
