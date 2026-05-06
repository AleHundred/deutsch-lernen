import { useState } from "react";
import type { ProductionPrompt, EvaluationResult } from "../../drills/types";
import {
  OptionButtons,
  type ButtonOption,
  type OptionTooltip,
} from "./OptionButtons";
import { FeedbackPanel } from "./FeedbackPanel";

interface Props {
  prompt: ProductionPrompt;
  options: string[];                   // explicit button values; separate from prompt.expectedAnswers
  onSubmit: (answer: string) => void;
  onNext: () => void;
  feedback: EvaluationResult | null;
  disabled: boolean;
  optionTooltips?: Record<string, OptionTooltip>;
  optionLabels?: Record<string, string>;
}

export function ClassificationDrill({
  prompt,
  options,
  onSubmit,
  onNext,
  feedback,
  disabled,
  optionTooltips,
  optionLabels,
}: Props) {
  const [userAnswer, setUserAnswer] = useState<string | undefined>(undefined);

  const buttons: ButtonOption[] = options.map((value) => ({
    value,
    label: optionLabels?.[value] ?? value,
    tooltip: optionTooltips?.[value],
  }));

  const handleAnswer = (value: string) => {
    if (disabled) return;
    setUserAnswer(value);
    onSubmit(value);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">{prompt.displayPrompt}</div>
      {prompt.gloss && (
        <div className="text-lg italic text-text/60 text-center -mt-4">
          {prompt.gloss}
        </div>
      )}

      <OptionButtons
        options={buttons}
        onAnswer={handleAnswer}
        disabled={disabled}
        correctValue={feedback?.feedback.correctAnswer}
        userAnswer={userAnswer}
        tooltipsEnabled={!!optionTooltips}
      />

      {feedback && disabled && (
        <FeedbackPanel feedback={feedback} onNext={onNext} />
      )}
    </div>
  );
}
