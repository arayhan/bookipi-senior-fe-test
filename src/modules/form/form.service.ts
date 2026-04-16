import { apiClient } from "@/services/api-client";
import type { Question, QuestionType, Quiz } from "@/modules/quiz/quiz.model";

type CreateQuizRequest = { title: string; description: string };
type CreateQuizResponse = Promise<Quiz>;
const createQuizService = async (request: CreateQuizRequest): CreateQuizResponse => {
  const { data } = await apiClient.post<Quiz>("/quizzes", request);
  return data;
};

export type CreateQuestionRequest = {
  type: QuestionType;
  prompt: string;
  options?: string[];
  correctAnswer: string | number;
  position?: number;
};
type AddQuestionRequest = CreateQuestionRequest & { quizId: number };
type AddQuestionResponse = Promise<Question>;
const addQuestionService = async ({ quizId, ...rest }: AddQuestionRequest): AddQuestionResponse => {
  const { data } = await apiClient.post<Question>(`/quizzes/${quizId}/questions`, rest);
  return data;
};

type PublishQuizRequest = { id: number };
type PublishQuizResponse = Promise<Quiz>;
const publishQuizService = async ({ id }: PublishQuizRequest): PublishQuizResponse => {
  const { data } = await apiClient.patch<Quiz>(`/quizzes/${id}`, { isPublished: true });
  return data;
};

type UpdateQuizRequest = { id: number } & Partial<CreateQuizRequest> & {
  timeLimitSeconds?: number | null;
  isPublished?: boolean;
};
type UpdateQuizResponse = Promise<Quiz>;
const updateQuizService = async ({ id, ...patch }: UpdateQuizRequest): UpdateQuizResponse => {
  const { data } = await apiClient.patch<Quiz>(`/quizzes/${id}`, patch);
  return data;
};

type UpdateQuestionRequest = { id: number } & Partial<CreateQuestionRequest>;
type UpdateQuestionResponse = Promise<Question>;
const updateQuestionService = async ({
  id,
  ...patch
}: UpdateQuestionRequest): UpdateQuestionResponse => {
  const { data } = await apiClient.patch<Question>(`/questions/${id}`, patch);
  return data;
};

type DeleteQuestionRequest = { id: number };
type DeleteQuestionResponse = Promise<void>;
const deleteQuestionService = async ({ id }: DeleteQuestionRequest): DeleteQuestionResponse => {
  await apiClient.delete(`/questions/${id}`);
};

export const formService = {
  createQuiz: createQuizService,
  addQuestion: addQuestionService,
  publishQuiz: publishQuizService,
  updateQuiz: updateQuizService,
  updateQuestion: updateQuestionService,
  deleteQuestion: deleteQuestionService,
};
