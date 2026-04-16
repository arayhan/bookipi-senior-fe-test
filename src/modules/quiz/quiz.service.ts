import { apiClient } from "@/services/api-client";
import type { Question, Quiz } from "@/modules/quiz/quiz.model";

type ListQuizzesResponse = Promise<Quiz[]>;
const listQuizzesService = async (): ListQuizzesResponse => {
  const { data } = await apiClient.get<Quiz[]>("/quizzes");
  return data;
};

type GetQuizRequest = { id: number | string };
type GetQuizResponse = Promise<Quiz & { questions: Question[] }>;
const getQuizService = async ({ id }: GetQuizRequest): GetQuizResponse => {
  const { data } = await apiClient.get<Quiz & { questions: Question[] }>(`/quizzes/${id}`);
  return data;
};

export const quizService = {
  list: listQuizzesService,
  get: getQuizService,
};
