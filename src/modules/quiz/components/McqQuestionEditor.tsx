import { LuPlus, LuX } from "react-icons/lu";
import { Button } from "@/components/button/Button";
import { TextField } from "@/components/text-field/TextField";
import { useAppDispatch } from "@/hooks/redux";
import { createQuizActions } from "@/modules/quiz/quiz.slice";
import type { DraftMcqQuestion } from "@/modules/quiz/quiz.model";

interface Props {
  question: DraftMcqQuestion;
}

export const McqQuestionEditor = ({ question }: Props) => {
  const dispatch = useAppDispatch();

  const update = (patch: Partial<DraftMcqQuestion>) =>
    dispatch(createQuizActions.updateQuestion({ localId: question.localId, patch }));

  const setOption = (index: number, value: string) => {
    const next = [...question.options];
    next[index] = value;
    update({ options: next });
  };

  const addOption = () => {
    if (question.options.length >= 6) return;
    update({ options: [...question.options, ""] });
  };

  const removeOption = (index: number) => {
    if (question.options.length <= 2) return;
    const next = question.options.filter((_, i) => i !== index);
    const correctIndex = question.correctIndex >= next.length ? next.length - 1 : question.correctIndex;
    update({ options: next, correctIndex });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-700">Choices</span>
        <div className="flex flex-col gap-2">
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="radio"
                name={`mcq-correct-${question.localId}`}
                checked={question.correctIndex === index}
                onChange={() => update({ correctIndex: index })}
                aria-label={`Mark choice ${index + 1} as correct`}
                className="h-4 w-4 text-brand-600"
              />
              <TextField
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => setOption(index, e.target.value)}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeOption(index)}
                disabled={question.options.length <= 2}
                aria-label="Remove option"
              >
                <LuX />
              </Button>
            </div>
          ))}
        </div>
        <div>
          <Button
            variant="secondary"
            size="sm"
            onClick={addOption}
            disabled={question.options.length >= 6}
          >
            <LuPlus /> Add option
          </Button>
        </div>
        <p className="text-xs text-slate-500">
          The selected radio marks the correct option. Min 2, max 6.
        </p>
      </div>
    </div>
  );
};
