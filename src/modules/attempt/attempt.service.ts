import { apiClient } from "@/services/api-client";
import type {
  AntiCheatEventName,
  Attempt,
  SubmitResult,
} from "@/modules/attempt/attempt.model";

type StartAttemptRequest = { quizId: number };
type StartAttemptResponse = Promise<Attempt>;
const startAttemptService = async ({ quizId }: StartAttemptRequest): StartAttemptResponse => {
  const { data } = await apiClient.post<Attempt>("/attempts", { quizId });
  return data;
};

type SaveAnswerRequest = { attemptId: number; questionId: number; value: string };
type SaveAnswerResponse = Promise<void>;
const saveAnswerService = async ({
  attemptId,
  questionId,
  value,
}: SaveAnswerRequest): SaveAnswerResponse => {
  await apiClient.post(`/attempts/${attemptId}/answer`, { questionId, value });
};

type SubmitAttemptRequest = { attemptId: number };
type SubmitAttemptResponse = Promise<SubmitResult>;
const submitAttemptService = async ({
  attemptId,
}: SubmitAttemptRequest): SubmitAttemptResponse => {
  const { data } = await apiClient.post<SubmitResult>(`/attempts/${attemptId}/submit`);
  return data;
};

type PostEventRequest = { attemptId: number; event: AntiCheatEventName };
type PostEventResponse = Promise<void>;
const postEventService = async ({ attemptId, event }: PostEventRequest): PostEventResponse => {
  await apiClient.post(`/attempts/${attemptId}/events`, { event });
};

export const attemptService = {
  start: startAttemptService,
  saveAnswer: saveAnswerService,
  submit: submitAttemptService,
  postEvent: postEventService,
};
