import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { toast } from "@/components/toast/toast";
import { quizFormActions } from "@/modules/quiz/form/form.slice";
import { useSaveQuizFlowMutation } from "@/modules/quiz/quiz.query";
import { validateDraft } from "@/modules/quiz/form/form.schema";

export const useQuizForm = () => {
  const dispatch = useAppDispatch();
  const draft = useAppSelector((s) => s.quizForm);
  const saveMutation = useSaveQuizFlowMutation();
  const [validationError, setValidationError] = useState<string | null>(null);

  const save = () => {
    setValidationError(null);
    const result = validateDraft(draft);
    if (!result.success) {
      const first = result.error.issues[0];
      const msg = first?.message ?? "Please fix the form before saving.";
      setValidationError(msg);
      toast.error(msg);
      return;
    }
    saveMutation.mutate(draft, {
      onSuccess: (quiz) => {
        toast.success(`Quiz "${quiz.title}" published`);
      },
    });
  };

  const reset = () => {
    if (saveMutation.isPending) return;
    dispatch(quizFormActions.resetDraft());
    saveMutation.reset();
    setValidationError(null);
  };

  return {
    draft,
    savedQuiz: saveMutation.data,
    isSaving: saveMutation.isPending,
    validationError,
    save,
    reset,
  };
};
