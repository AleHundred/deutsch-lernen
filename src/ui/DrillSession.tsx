import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionStore } from "../state/session";
import { ClassificationDrill } from "./components/ClassificationDrill";
import { ProductionDrill } from "./components/ProductionDrill";
import { generateSlotClassification } from "../drills/generators/slotClassification";
import { generateCaseSelection } from "../drills/generators/caseSelection";
import type { EvaluationResult, ProductionPrompt } from "../drills/types";
import type { DrillItem } from "../db/schema";
import { slotLabels, type SlotKey } from "../db/seed-classification";
import type { OptionTooltip } from "./components/OptionButtons";

const LEGEND_ORDER: SlotKey[] = ["Te", "Ka", "Mo", "Lo"];

const SLOT_OPTIONS = ["Te", "Ka", "Mo", "Lo"] as const;
const CASE_OPTIONS = ["nom", "akk", "dat"] as const;
const CASE_LABELS: Record<string, string> = { nom: "Nom", akk: "Akk", dat: "Dat" };

const SLOT_TOOLTIPS: Record<string, OptionTooltip> = Object.fromEntries(
  LEGEND_ORDER.map((k) => [
    k,
    {
      full: slotLabels[k].full,
      question: slotLabels[k].question,
      description: slotLabels[k].description,
    },
  ]),
);

export function DrillSession() {
  const navigate = useNavigate();
  const items = useSessionStore((s) => s.items);
  const currentIndex = useSessionStore((s) => s.currentIndex);
  const answerCurrent = useSessionStore((s) => s.answerCurrent);
  const advance = useSessionStore((s) => s.advance);
  const finish = useSessionStore((s) => s.finish);

  const [result, setResult] = useState<EvaluationResult | null>(null);
  const promptStartRef = useRef<number>(Date.now());

  useEffect(() => {
    if (items.length === 0) navigate("/", { replace: true });
  }, [items.length, navigate]);

  useEffect(() => {
    promptStartRef.current = Date.now();
  }, [currentIndex]);

  const item = items[currentIndex];

  const handleAnswer = useCallback(
    async (answer: string) => {
      if (result !== null) return;
      const rtMs = Date.now() - promptStartRef.current;
      const r = await answerCurrent(answer, rtMs);
      setResult(r);
    },
    [result, answerCurrent],
  );

  const handleNext = useCallback(async () => {
    if (result === null) return;
    const isLast = currentIndex + 1 >= items.length;
    advance();
    setResult(null);
    if (isLast) {
      await finish();
      navigate("/summary");
    }
  }, [result, currentIndex, items.length, advance, finish, navigate]);

  if (!item) return null;

  const total = items.length;
  const position = currentIndex + 1;

  return (
    <div className="min-h-screen flex flex-col max-w-xl mx-auto px-6 py-10">
      <div className="text-xs uppercase tracking-widest text-text/50 mb-6">
        Item {position} of {total}
      </div>

      {item.kind === "slot-classification" && (
        <div className="flex gap-5 justify-center mb-10 text-xs text-text/40 tracking-wide">
          {LEGEND_ORDER.map((k) => (
            <span key={k}>
              {k} · {slotLabels[k].german}
            </span>
          ))}
        </div>
      )}

      {renderDrill(item, result, handleAnswer, handleNext)}
    </div>
  );
}

function renderDrill(
  item: DrillItem,
  result: EvaluationResult | null,
  onSubmit: (answer: string) => void,
  onNext: () => void,
) {
  const disabled = result !== null;

  switch (item.kind) {
    case "slot-classification": {
      const prompt = buildSlotClassificationPrompt(item);
      return (
        <ClassificationDrill
          key={item.id}
          prompt={prompt}
          options={[...SLOT_OPTIONS]}
          onSubmit={onSubmit}
          onNext={onNext}
          feedback={result}
          disabled={disabled}
          optionTooltips={SLOT_TOOLTIPS}
        />
      );
    }
    case "case-selection": {
      const prompt = generateCaseSelection(item);
      return (
        <ClassificationDrill
          key={item.id}
          prompt={prompt}
          options={[...CASE_OPTIONS]}
          onSubmit={onSubmit}
          onNext={onNext}
          feedback={result}
          disabled={disabled}
          optionLabels={CASE_LABELS}
        />
      );
    }
    case "case-morphology":
    case "verb-conjugation":
    case "reflexive-production":
    case "v2-word-order":
      // Generators land in Phases C–F.
      return (
        <div className="text-text/60 italic text-center mt-12">
          Drill kind <code>{item.kind}</code> not yet implemented.
        </div>
      );
    default: {
      const _exhaust: never = item;
      return <div>{JSON.stringify(_exhaust)}</div>;
    }
  }
}

function buildSlotClassificationPrompt(
  item: DrillItem & { kind: "slot-classification" },
): ProductionPrompt {
  const sp = generateSlotClassification(item);
  return {
    displayPrompt: (
      <div className="font-mono text-4xl leading-snug">{sp.phrase}</div>
    ),
    gloss: sp.gloss ?? "",
    inputType: "classification",
    expectedAnswers: [sp.correctAnswer],
    grammaticallyContrastive: [],
    rule: item.rule,
    buildFeedback: (userAnswer, correct) => ({
      correctAnswer: sp.correctAnswer,
      userAnswer,
      explanation:
        sp.disambiguationNote ??
        (correct
          ? `${sp.correctAnswer} — ${sp.subtype}`
          : `Expected ${sp.correctAnswer}; you answered ${userAnswer}`),
      specificErrorType: sp.subtype,
      compareItems: sp.examples?.map((ex) => ({
        form: ex.phrase,
        label: ex.slot,
      })),
    }),
  };
}
