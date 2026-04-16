import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  useSaveAnswerMutation,
  useStartAttemptMutation,
  useSubmitAttemptMutation,
} from "@/modules/attempt/attempt.query";
import { attemptActions } from "@/modules/attempt/attempt.slice";
import { useAntiCheat } from "@/modules/attempt/hooks/useAntiCheat";

export const useQuizPlayer = () => {
  const { quizId: quizIdParam } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    mutate: startAttempt,
    data: attempt,
    isError: startFailed,
  } = useStartAttemptMutation();
  const saveAnswerMutation = useSaveAnswerMutation();
  const submitMutation = useSubmitAttemptMutation();

  const currentIndex = useAppSelector((s) => s.attempt.currentIndex);
  const answers = useAppSelector((s) => s.attempt.answers);

  const { reportPaste } = useAntiCheat(attempt?.id ?? null);

  const triggerStart = useCallback(() => {
    const quizId = Number(quizIdParam);
    if (!Number.isInteger(quizId) || quizId <= 0) return;
    startAttempt(quizId, {
      onSuccess: (data) => dispatch(attemptActions.startAttempt(data)),
    });
  }, [quizIdParam, startAttempt, dispatch]);

  useEffect(() => {
    triggerStart();
  }, [triggerStart]);

  const questions = attempt?.quiz.questions ?? [];
  const total = questions.length;
  const safeIndex = Math.min(currentIndex, Math.max(total - 1, 0));
  const currentQuestion = questions[safeIndex];

  const allAnswered =
    total > 0 &&
    questions.every((q) => {
      const v = answers[q.id];
      return typeof v === "string" && v.length > 0;
    });

  const handleAnswerChange = (value: string) => {
    if (!attempt || !currentQuestion) return;
    saveAnswerMutation.mutate({
      attemptId: attempt.id,
      questionId: currentQuestion.id,
      value,
    });
  };

  const handlePrev = () => dispatch(attemptActions.prev());
  const handleNext = () => dispatch(attemptActions.next(total));

  const handleSubmit = () => {
    if (!attempt) return;
    submitMutation.mutate(attempt.id, {
      onSuccess: (result) => {
        dispatch(attemptActions.setResult(result));
        navigate(`/play/${attempt.quizId}/result/${attempt.id}`);
      },
    });
  };

  return {
    attempt,
    currentQuestion,
    safeIndex,
    total,
    allAnswered,
    isLoading: !attempt && !startFailed,
    startFailed: Boolean(startFailed && !attempt),
    isEmpty: Boolean(attempt) && total === 0,
    submitting: submitMutation.isPending,
    handleAnswerChange,
    handlePrev,
    handleNext,
    handleSubmit,
    retry: triggerStart,
    reportPaste,
  };
};
