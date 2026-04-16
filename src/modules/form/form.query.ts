import { useMutation } from "@tanstack/react-query";
import { formService, type CreateQuestionRequest } from "@/modules/form/form.service";
import { quizService } from "@/modules/quiz/quiz.service";
import type { BuilderDraft } from "@/modules/form/form.model";
import type { Quiz } from "@/modules/quiz/quiz.model";

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
      const quiz = await formService.createQuiz({
        title: draft.title,
        description: draft.description,
      });
      const payloads = draftToQuestionPayloads(draft);
      for (const payload of payloads) {
        await formService.addQuestion({ quizId: quiz.id, ...payload });
      }
      return formService.publishQuiz({ id: quiz.id });
    },
  });

export const useUpdateQuizFlowMutation = () =>
  useMutation<Quiz, Error, { id: number; draft: BuilderDraft }>({
    mutationFn: async ({ id, draft }) => {
      await formService.updateQuiz({
        id,
        title: draft.title,
        description: draft.description,
      });
      const existing = await quizService.get({ id });
      for (const q of existing.questions) {
        await formService.deleteQuestion({ id: q.id });
      }
      const payloads = draftToQuestionPayloads(draft);
      for (const payload of payloads) {
        await formService.addQuestion({ quizId: id, ...payload });
      }
      const { questions: _questions, ...quiz } = await quizService.get({ id });
      return quiz;
    },
  });
