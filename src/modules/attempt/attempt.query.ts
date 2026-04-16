import { useMutation } from "@tanstack/react-query";
import { attemptService } from "@/modules/attempt/attempt.service";
import type { AntiCheatEventName, Attempt, SubmitResult } from "@/modules/attempt/attempt.model";

export const useStartAttemptMutation = () =>
  useMutation<Attempt, Error, number>({
    mutationFn: (quizId) => attemptService.start({ quizId }),
  });

export const useSaveAnswerMutation = () =>
  useMutation<void, Error, { attemptId: number; questionId: number; value: string }>({
    mutationFn: (request) => attemptService.saveAnswer(request),
  });

export const useSubmitAttemptMutation = () =>
  useMutation<SubmitResult, Error, number>({
    mutationFn: (attemptId) => attemptService.submit({ attemptId }),
  });

export const usePostEventMutation = () =>
  useMutation<void, Error, { attemptId: number; event: AntiCheatEventName }>({
    mutationFn: (request) => attemptService.postEvent(request),
  });
