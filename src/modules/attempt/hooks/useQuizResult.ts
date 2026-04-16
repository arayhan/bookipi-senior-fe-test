import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useGetQuizQuery } from "@/modules/quiz/quiz.query";
import { attemptActions } from "@/modules/attempt/attempt.slice";
import type { PlayerQuestion } from "@/modules/attempt/attempt.model";

export const useQuizResult = () => {
  const { quizId } = useParams<{ quizId: string; attemptId: string }>();
  const dispatch = useAppDispatch();
  const result = useAppSelector((s) => s.attempt.lastResult);
  const answers = useAppSelector((s) => s.attempt.answers);
  const antiCheat = useAppSelector((s) => s.attempt.antiCheat);

  const quizQuery = useGetQuizQuery(quizId);

  const playerQuestions: PlayerQuestion[] =
    quizQuery.data?.questions.map((q) => ({
      id: q.id,
      type: q.type,
      prompt: q.prompt,
      options: q.options ?? null,
      position: q.position,
    })) ?? [];

  const retake = () => {
    dispatch(attemptActions.resetAttempt());
  };

  return {
    quizId,
    quiz: quizQuery.data,
    result,
    answers,
    antiCheat,
    playerQuestions,
    isLoading: quizQuery.isLoading,
    isError: quizQuery.isError || !quizQuery.data,
    hasResult: Boolean(result),
    retake,
  };
};
