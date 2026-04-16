import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { attemptActions } from "@/modules/attempt/attempt.slice";
import type { PlayerQuestion } from "@/modules/attempt/attempt.model";

interface Props {
  question: PlayerQuestion;
  onChange?: (value: string) => void;
}

export const McqAnswer = ({ question, onChange }: Props) => {
  const dispatch = useAppDispatch();
  const value = useAppSelector((s) => s.attempt.answers[question.id] ?? "");
  const options = question.options ?? [];

  const handlePick = (index: number) => {
    const next = String(index);
    dispatch(attemptActions.setAnswer({ questionId: question.id, value: next }));
    onChange?.(next);
  };

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="sr-only">Choices</legend>
      {options.map((option, index) => {
        const checked = value === String(index);
        return (
          <label
            key={index}
            className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors ${
              checked
                ? "border-brand-500 bg-brand-50"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <input
              type="radio"
              name={`q-${question.id}`}
              checked={checked}
              onChange={() => handlePick(index)}
              className="mt-1 h-4 w-4 text-brand-600"
            />
            <span className="text-sm text-slate-800">{option}</span>
          </label>
        );
      })}
    </fieldset>
  );
};
