import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import type { BuilderDraft, DraftQuestion, QuestionType } from "@/modules/quiz/quiz.model";

const makeMcq = (): DraftQuestion => ({
  localId: nanoid(),
  type: "mcq",
  prompt: "",
  codeSnippet: "",
  options: ["", ""],
  correctIndex: 0,
});

const makeShort = (): DraftQuestion => ({
  localId: nanoid(),
  type: "short",
  prompt: "",
  codeSnippet: "",
  correctAnswer: "",
});

const initialState: BuilderDraft = {
  title: "",
  description: "",
  questions: [],
};

const quizBuilderSlice = createSlice({
  name: "quizBuilder",
  initialState,
  reducers: {
    setTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
    },
    setDescription(state, action: PayloadAction<string>) {
      state.description = action.payload;
    },
    addQuestion(state, action: PayloadAction<QuestionType>) {
      state.questions.push(action.payload === "mcq" ? makeMcq() : makeShort());
    },
    updateQuestion(state, action: PayloadAction<{ localId: string; patch: Partial<DraftQuestion> }>) {
      const { localId, patch } = action.payload;
      const idx = state.questions.findIndex((q) => q.localId === localId);
      if (idx === -1) return;
      const current = state.questions[idx];
      state.questions[idx] = { ...current, ...patch } as DraftQuestion;
    },
    removeQuestion(state, action: PayloadAction<string>) {
      state.questions = state.questions.filter((q) => q.localId !== action.payload);
    },
    moveQuestion(state, action: PayloadAction<{ localId: string; direction: "up" | "down" }>) {
      const { localId, direction } = action.payload;
      const idx = state.questions.findIndex((q) => q.localId === localId);
      if (idx === -1) return;
      const swapWith = direction === "up" ? idx - 1 : idx + 1;
      if (swapWith < 0 || swapWith >= state.questions.length) return;
      const next = [...state.questions];
      [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
      state.questions = next;
    },
    resetDraft() {
      return initialState;
    },
  },
});

export const quizBuilderActions = quizBuilderSlice.actions;
export const quizBuilderReducer = quizBuilderSlice.reducer;
