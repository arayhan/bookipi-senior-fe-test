import { apiClient } from "@/services/api-client";
import type {
  CreateQuestionRequest,
  CreateQuizRequest,
  Question,
  Quiz,
} from "@/modules/quiz/quiz.model";

type ListQuizzesResponse = Promise<Quiz[]>;
const listQuizzesService = async (): ListQuizzesResponse => {
  const { data } = await apiClient.get<Quiz[]>("/quizzes");
  return data;
};

type CreateQuizResponse = Promise<Quiz>;
const createQuizService = async (request: CreateQuizRequest): CreateQuizResponse => {
  const { data } = await apiClient.post<Quiz>("/quizzes", request);
  return data;
};

type GetQuizRequest = { id: number | string };
type GetQuizResponse = Promise<Quiz & { questions: Question[] }>;
const getQuizService = async ({ id }: GetQuizRequest): GetQuizResponse => {
  const { data } = await apiClient.get<Quiz & { questions: Question[] }>(`/quizzes/${id}`);
  return data;
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

export const quizService = {
  list: listQuizzesService,
  create: createQuizService,
  get: getQuizService,
  addQuestion: addQuestionService,
  publish: publishQuizService,
  update: updateQuizService,
  updateQuestion: updateQuestionService,
  deleteQuestion: deleteQuestionService,
};
