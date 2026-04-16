import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import type {
  BuilderDraft,
  DraftMcqQuestion,
  DraftQuestion,
  DraftShortQuestion,
} from "@/modules/form/form.model";
import type { Question, QuestionType, Quiz } from "@/modules/quiz/quiz.model";
import { parsePrompt } from "@/modules/attempt/utils/parsePrompt";

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

const toDraftQuestion = (q: Question): DraftQuestion => {
  const { text, code } = parsePrompt(q.prompt);
  const base = {
    localId: nanoid(),
    serverId: q.id,
    prompt: text,
    codeSnippet: code ?? "",
  };
  if (q.type === "mcq") {
    const mcq: DraftMcqQuestion = {
      ...base,
      type: "mcq",
      options: q.options ?? ["", ""],
      correctIndex: typeof q.correctAnswer === "number" ? q.correctAnswer : 0,
    };
    return mcq;
  }
  const short: DraftShortQuestion = {
    ...base,
    type: "short",
    correctAnswer: typeof q.correctAnswer === "string" ? q.correctAnswer : "",
  };
  return short;
};

const initialState: BuilderDraft = {
  title: "",
  description: "",
  questions: [],
};

const quizFormSlice = createSlice({
  name: "quizForm",
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
    loadFromQuiz(_state, action: PayloadAction<Quiz & { questions: Question[] }>) {
      const quiz = action.payload;
      const sorted = [...quiz.questions].sort((a, b) => a.position - b.position);
      return {
        title: quiz.title,
        description: quiz.description,
        questions: sorted.map(toDraftQuestion),
      };
    },
    resetDraft() {
      return initialState;
    },
  },
});

export const quizFormActions = quizFormSlice.actions;
export const quizFormReducer = quizFormSlice.reducer;
