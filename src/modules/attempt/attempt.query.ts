import { useMutation } from "@tanstack/react-query";
import {
  postAttemptEvent,
  saveAnswer,
  startAttempt,
  submitAttempt,
} from "@/modules/attempt/attempt.service";
import type { AntiCheatEventName, Attempt, SubmitResult } from "@/modules/attempt/attempt.model";

export const useStartAttemptMutation = () =>
  useMutation<Attempt, Error, number>({
    mutationFn: (quizId) => startAttempt(quizId),
  });

export const useSaveAnswerMutation = () =>
  useMutation<void, Error, { attemptId: number; questionId: number; value: string }>({
    mutationFn: ({ attemptId, questionId, value }) => saveAnswer(attemptId, questionId, value),
  });

export const useSubmitAttemptMutation = () =>
  useMutation<SubmitResult, Error, number>({
    mutationFn: (attemptId) => submitAttempt(attemptId),
  });

export const usePostEventMutation = () =>
  useMutation<void, Error, { attemptId: number; event: AntiCheatEventName }>({
    mutationFn: ({ attemptId, event }) => postAttemptEvent(attemptId, event),
  });
