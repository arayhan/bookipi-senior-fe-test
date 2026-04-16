import { apiClient } from "@/services/api-client";
import type {
  CreateQuestionPayload,
  CreateQuizPayload,
  Question,
  Quiz,
} from "@/modules/quiz/quiz.model";

export const listQuizzes = async (): Promise<Quiz[]> => {
  const { data } = await apiClient.get<Quiz[]>("/quizzes");
  return data;
};

export const createQuiz = async (payload: CreateQuizPayload): Promise<Quiz> => {
  const { data } = await apiClient.post<Quiz>("/quizzes", payload);
  return data;
};

export const addQuestion = async (
  quizId: number,
  payload: CreateQuestionPayload,
): Promise<Question> => {
  const { data } = await apiClient.post<Question>(`/quizzes/${quizId}/questions`, payload);
  return data;
};

export const publishQuiz = async (quizId: number): Promise<Quiz> => {
  const { data } = await apiClient.patch<Quiz>(`/quizzes/${quizId}`, { isPublished: true });
  return data;
};

export const getQuiz = async (quizId: number | string): Promise<Quiz & { questions: Question[] }> => {
  const { data } = await apiClient.get<Quiz & { questions: Question[] }>(`/quizzes/${quizId}`);
  return data;
};
