import { useMutation, useQuery } from "@tanstack/react-query";
import { addQuestion, createQuiz, getQuiz, publishQuiz } from "@/modules/quiz/quiz.service";
import { quizKeys } from "@/modules/quiz/quiz.keys";
import type { BuilderDraft, CreateQuestionPayload, Quiz } from "@/modules/quiz/quiz.model";

const draftToQuestionPayloads = (draft: BuilderDraft): CreateQuestionPayload[] =>
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
      const quiz = await createQuiz({ title: draft.title, description: draft.description });
      const payloads = draftToQuestionPayloads(draft);
      for (const payload of payloads) {
        await addQuestion(quiz.id, payload);
      }
      const published = await publishQuiz(quiz.id);
      return published;
    },
  });

export const useGetQuizQuery = (quizId: number | string | undefined) =>
  useQuery({
    queryKey: quizId ? quizKeys.detail(quizId) : quizKeys.detail("none"),
    queryFn: () => getQuiz(quizId as number | string),
    enabled: Boolean(quizId),
  });
