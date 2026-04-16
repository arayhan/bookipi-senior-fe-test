import { describe, expect, it } from "vitest";
import { validateDraft } from "@/modules/form/form.schema";
import type { BuilderDraft } from "@/modules/form/form.model";

const baseDraft = (): BuilderDraft => ({
  title: "Sample quiz",
  description: "About sample",
  questions: [
    {
      localId: "q1",
      type: "mcq",
      prompt: "Pick one",
      codeSnippet: "",
      options: ["a", "b"],
      correctIndex: 0,
    },
  ],
});

describe("validateDraft", () => {
  it("accepts a valid draft", () => {
    expect(validateDraft(baseDraft()).success).toBe(true);
  });

  it("rejects a draft with an empty title", () => {
    const result = validateDraft({ ...baseDraft(), title: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a draft with no questions", () => {
    const result = validateDraft({ ...baseDraft(), questions: [] });
    expect(result.success).toBe(false);
  });

  it("rejects an mcq question whose correctIndex is out of range", () => {
    const draft = baseDraft();
    const q = draft.questions[0];
    if (q.type !== "mcq") throw new Error("precondition");
    const result = validateDraft({
      ...draft,
      questions: [{ ...q, correctIndex: q.options.length }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects a short-answer question with an empty correctAnswer", () => {
    const result = validateDraft({
      ...baseDraft(),
      questions: [
        {
          localId: "q1",
          type: "short",
          prompt: "Name one thing",
          codeSnippet: "",
          correctAnswer: "",
        },
      ],
    });
    expect(result.success).toBe(false);
  });
});
