import { z } from "zod";
import type { BuilderDraft } from "@/modules/quiz/quiz.model";

const mcqSchema = z.object({
  type: z.literal("mcq"),
  prompt: z.string().trim().min(1, "Prompt is required"),
  options: z
    .array(z.string().trim().min(1, "Option cannot be empty"))
    .min(2, "Add at least 2 options")
    .max(6, "At most 6 options"),
  correctIndex: z.number().int().nonnegative(),
});

const shortSchema = z.object({
  type: z.literal("short"),
  prompt: z.string().trim().min(1, "Prompt is required"),
  correctAnswer: z.string().trim().min(1, "Correct answer is required"),
});

const draftQuestionSchema = z
  .union([mcqSchema, shortSchema])
  .superRefine((q, ctx) => {
    if (q.type === "mcq" && q.correctIndex >= q.options.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Pick a valid correct option",
        path: ["correctIndex"],
      });
    }
  });

export const builderDraftSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  questions: z.array(draftQuestionSchema).min(1, "Add at least one question"),
});

export const validateDraft = (draft: BuilderDraft) => {
  const stripped = {
    title: draft.title,
    description: draft.description,
    questions: draft.questions.map((q) =>
      q.type === "mcq"
        ? { type: "mcq" as const, prompt: q.prompt, options: q.options, correctIndex: q.correctIndex }
        : { type: "short" as const, prompt: q.prompt, correctAnswer: q.correctAnswer },
    ),
  };
  return builderDraftSchema.safeParse(stripped);
};
