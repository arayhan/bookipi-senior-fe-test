import { useMutation, useQuery } from "@tanstack/react-query";
import { quizService } from "@/modules/quiz/quiz.service";
import { quizKeys } from "@/modules/quiz/quiz.keys";
import type { BuilderDraft, CreateQuestionRequest, Quiz } from "@/modules/quiz/quiz.model";

const draftToQuestionPayloads = (draft: BuilderDraft): CreateQuestionRequest[] =>
  draft.questions.map((q, index) => {
    if (q.type === "mcq") {
      const promptWithCode = q.codeSnippet.trim()
        ? `${q.prompt}\n\n\`\`\`\n${q.codeSnippet}\n\`\`\``
        : q.prompt;
      return {
        type: "mcq",
        prompt: promptWithCode,
        options: q.options,
        correctAnswer: q.correctIndex,
        position: index,
      };
    }
    const promptWithCode = q.codeSnippet.trim()
      ? `${q.prompt}\n\n\`\`\`\n${q.codeSnippet}\n\`\`\``
      : q.prompt;
    return {
      type: "short",
      prompt: promptWithCode,
      correctAnswer: q.correctAnswer,
      position: index,
    };
  });

export const useSaveQuizFlowMutation = () =>
  useMutation<Quiz, Error, BuilderDraft>({
    mutationFn: async (draft) => {
      const quiz = await quizService.create({
        title: draft.title,
        description: draft.description,
      });
      const payloads = draftToQuestionPayloads(draft);
      for (const payload of payloads) {
        await quizService.addQuestion({ quizId: quiz.id, ...payload });
      }
      return quizService.publish({ id: quiz.id });
    },
  });

export const useUpdateQuizFlowMutation = () =>
  useMutation<Quiz, Error, { id: number; draft: BuilderDraft }>({
    mutationFn: async ({ id, draft }) => {
      await quizService.update({
        id,
        title: draft.title,
        description: draft.description,
      });
      const existing = await quizService.get({ id });
      for (const q of existing.questions) {
        await quizService.deleteQuestion({ id: q.id });
      }
      const payloads = draftToQuestionPayloads(draft);
      for (const payload of payloads) {
        await quizService.addQuestion({ quizId: id, ...payload });
      }
      const { questions: _questions, ...quiz } = await quizService.get({ id });
      return quiz;
    },
  });

export const useGetQuizQuery = (quizId: number | string | undefined) =>
  useQuery({
    queryKey: quizId ? quizKeys.detail(quizId) : quizKeys.detail("none"),
    queryFn: () => quizService.get({ id: quizId as number | string }),
    enabled: Boolean(quizId),
  });

export const useListQuizzesQuery = () =>
  useQuery({
    queryKey: quizKeys.list(),
    queryFn: () => quizService.list(),
  });
