import { TextField } from "@/components/text-field/TextField";
import { useAppDispatch } from "@/hooks/redux";
import { quizFormActions } from "@/modules/form/form.slice";
import type { DraftShortQuestion } from "@/modules/form/form.model";

interface Props {
  question: DraftShortQuestion;
}

export const ShortQuestionEditor = ({ question }: Props) => {
  const dispatch = useAppDispatch();

  const update = (patch: Partial<DraftShortQuestion>) =>
    dispatch(quizFormActions.updateQuestion({ localId: question.localId, patch }));

  return (
    <div className="flex flex-col gap-3">
      <TextField
        label="Correct answer"
        value={question.correctAnswer}
        onChange={(e) => update({ correctAnswer: e.target.value })}
        placeholder="Exact expected answer"
        hint="Matched case-insensitively, with whitespace normalized."
      />
    </div>
  );
};
