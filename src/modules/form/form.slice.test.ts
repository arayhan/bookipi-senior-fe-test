import { describe, expect, it } from "vitest";
import { quizFormActions, quizFormReducer } from "@/modules/form/form.slice";
import type { Question, Quiz } from "@/modules/quiz/quiz.model";

const initial = quizFormReducer(undefined, { type: "@@INIT" });

describe("quizFormSlice", () => {
  it("setTitle updates the title", () => {
    const next = quizFormReducer(initial, quizFormActions.setTitle("Hello"));
    expect(next.title).toBe("Hello");
  });

  it("addQuestion('mcq') appends an mcq draft", () => {
    const next = quizFormReducer(initial, quizFormActions.addQuestion("mcq"));
    expect(next.questions).toHaveLength(1);
    expect(next.questions[0].type).toBe("mcq");
  });

  it("removeQuestion removes by localId", () => {
    const added = quizFormReducer(initial, quizFormActions.addQuestion("short"));
    const [q] = added.questions;
    const next = quizFormReducer(added, quizFormActions.removeQuestion(q.localId));
    expect(next.questions).toHaveLength(0);
  });

  it("moveQuestion swaps adjacent questions", () => {
    let state = quizFormReducer(initial, quizFormActions.addQuestion("mcq"));
    state = quizFormReducer(state, quizFormActions.addQuestion("short"));
    const [first, second] = state.questions;
    const moved = quizFormReducer(
      state,
      quizFormActions.moveQuestion({ localId: second.localId, direction: "up" }),
    );
    expect(moved.questions[0].localId).toBe(second.localId);
    expect(moved.questions[1].localId).toBe(first.localId);
  });

  it("resetDraft returns to initial state", () => {
    const state = quizFormReducer(initial, quizFormActions.setTitle("Hello"));
    const next = quizFormReducer(state, quizFormActions.resetDraft());
    expect(next).toEqual(initial);
  });

  it("loadFromQuiz hydrates draft and stamps serverId on each question", () => {
    const quiz: Quiz & { questions: Question[] } = {
      id: 7,
      title: "Loaded",
      description: "From server",
      timeLimitSeconds: null,
      isPublished: true,
      createdAt: "2026-04-17T00:00:00.000Z",
      questions: [
        {
          id: 101,
          quizId: 7,
          type: "mcq",
          prompt: "Q1",
          options: ["a", "b"],
          correctAnswer: 1,
          position: 0,
        },
        {
          id: 102,
          quizId: 7,
          type: "short",
          prompt: "Q2",
          options: null,
          correctAnswer: "answer",
          position: 1,
        },
      ],
    };
    const next = quizFormReducer(initial, quizFormActions.loadFromQuiz(quiz));
    expect(next.title).toBe("Loaded");
    expect(next.questions).toHaveLength(2);
    expect(next.questions[0].serverId).toBe(101);
    expect(next.questions[1].serverId).toBe(102);
  });
});
