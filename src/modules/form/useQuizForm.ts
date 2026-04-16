import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { toast } from "@/components/toast/toast";
import { quizFormActions } from "@/modules/form/form.slice";
import { validateDraft } from "@/modules/form/form.schema";
import { useGetQuizQuery } from "@/modules/quiz/quiz.query";
import {
  useSaveQuizFlowMutation,
  useUpdateQuizFlowMutation,
} from "@/modules/form/form.query";

export const useQuizForm = () => {
  const { id } = useParams<{ id: string }>();
  const mode: "create" | "edit" = id ? "edit" : "create";

  const dispatch = useAppDispatch();
  const draft = useAppSelector((s) => s.quizForm);

  const quizQuery = useGetQuizQuery(mode === "edit" ? id : undefined);
  const createMutation = useSaveQuizFlowMutation();
  const updateMutation = useUpdateQuizFlowMutation();

  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "create") {
      dispatch(quizFormActions.resetDraft());
      createMutation.reset();
      updateMutation.reset();
      setValidationError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    if (mode === "edit" && quizQuery.data) {
      dispatch(quizFormActions.loadFromQuiz(quizQuery.data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, quizQuery.data?.id]);

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
    if (mode === "create") {
      createMutation.mutate(draft, {
        onSuccess: (quiz) => toast.success(`Quiz "${quiz.title}" published`),
      });
    } else if (id) {
      updateMutation.mutate(
        { id: Number(id), draft },
        {
          onSuccess: (quiz) => toast.success(`Quiz "${quiz.title}" updated`),
        },
      );
    }
  };

  const reset = () => {
    if (createMutation.isPending || updateMutation.isPending) return;
    dispatch(quizFormActions.resetDraft());
    createMutation.reset();
    updateMutation.reset();
    setValidationError(null);
  };

  const savedQuiz = mode === "create" ? createMutation.data : updateMutation.data;

  return {
    mode,
    draft,
    isLoadingQuiz: mode === "edit" && quizQuery.isLoading,
    isQuizError: mode === "edit" && quizQuery.isError,
    savedQuiz,
    isSaving: createMutation.isPending || updateMutation.isPending,
    validationError,
    save,
    reset,
  };
};
