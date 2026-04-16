import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { attemptActions } from "@/modules/attempt/attempt.slice";
import { TextField } from "@/components/text-field/TextField";
import type { PlayerQuestion } from "@/modules/attempt/attempt.model";

interface Props {
  question: PlayerQuestion;
  onChange?: (value: string) => void;
  onPaste?: () => void;
}

export const ShortAnswer = ({ question, onChange, onPaste }: Props) => {
  const dispatch = useAppDispatch();
  const value = useAppSelector((s) => s.attempt.answers[question.id] ?? "");

  return (
    <TextField
      label="Your answer"
      value={value}
      onChange={(e) => {
        dispatch(attemptActions.setAnswer({ questionId: question.id, value: e.target.value }));
        onChange?.(e.target.value);
      }}
      onPaste={() => onPaste?.()}
      placeholder="Type your answer"
      autoComplete="off"
    />
  );
};
