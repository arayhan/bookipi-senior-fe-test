import { apiClient } from "@/services/api-client";
import type {
  AntiCheatEventName,
  Attempt,
  SubmitResult,
} from "@/modules/attempt/attempt.model";

export const startAttempt = async (quizId: number): Promise<Attempt> => {
  const { data } = await apiClient.post<Attempt>("/attempts", { quizId });
  return data;
};

export const saveAnswer = async (
  attemptId: number,
  questionId: number,
  value: string,
): Promise<void> => {
  await apiClient.post(`/attempts/${attemptId}/answer`, { questionId, value });
};

export const submitAttempt = async (attemptId: number): Promise<SubmitResult> => {
  const { data } = await apiClient.post<SubmitResult>(`/attempts/${attemptId}/submit`);
  return data;
};

export const postAttemptEvent = async (
  attemptId: number,
  event: AntiCheatEventName,
): Promise<void> => {
  await apiClient.post(`/attempts/${attemptId}/events`, { event });
};
