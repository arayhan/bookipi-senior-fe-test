import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formService, type CreateQuestionRequest } from "@/modules/form/form.service";
import { quizService } from "@/modules/quiz/quiz.service";
import { quizKeys } from "@/modules/quiz/quiz.keys";
import type { BuilderDraft, DraftQuestion } from "@/modules/form/form.model";
import type { Quiz } from "@/modules/quiz/quiz.model";

const toQuestionPayload = (q: DraftQuestion, index: number): CreateQuestionRequest => {
  const promptWithCode = q.codeSnippet.trim()
    ? `${q.prompt}\n\n\`\`\`\n${q.codeSnippet}\n\`\`\``
    : q.prompt;
  if (q.type === "mcq") {
    return {
      type: "mcq",
      prompt: promptWithCode,
      options: q.options,
      correctAnswer: q.correctIndex,
      position: index,
    };
  }
  return {
    type: "short",
    prompt: promptWithCode,
    correctAnswer: q.correctAnswer,
    position: index,
  };
};

export const useSaveQuizFlowMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Quiz, Error, BuilderDraft>({
    mutationFn: async (draft) => {
      const quiz = await formService.createQuiz({
        title: draft.title,
        description: draft.description,
      });
      for (const [index, q] of draft.questions.entries()) {
        await formService.addQuestion({ quizId: quiz.id, ...toQuestionPayload(q, index) });
      }
      return formService.publishQuiz({ id: quiz.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizKeys.list() });
    },
  });
};

export const useUpdateQuizFlowMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Quiz, Error, { id: number; draft: BuilderDraft }>({
    mutationFn: async ({ id, draft }) => {
      await formService.updateQuiz({
        id,
        title: draft.title,
        description: draft.description,
      });

      const existing = await quizService.get({ id });
      const draftServerIds = new Set(
        draft.questions
          .map((q) => q.serverId)
          .filter((sid): sid is number => sid != null),
      );
      for (const q of existing.questions) {
        if (!draftServerIds.has(q.id)) {
          await formService.deleteQuestion({ id: q.id });
        }
      }

      for (const [index, q] of draft.questions.entries()) {
        const payload = toQuestionPayload(q, index);
        if (q.serverId != null) {
          await formService.updateQuestion({ id: q.serverId, ...payload });
        } else {
          await formService.addQuestion({ quizId: id, ...payload });
        }
      }

      const { questions: _questions, ...quiz } = await quizService.get({ id });
      return quiz;
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: quizKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: quizKeys.list() });
    },
  });
};
