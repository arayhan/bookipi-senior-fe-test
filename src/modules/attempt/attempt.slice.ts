import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  AntiCheatEventName,
  Attempt,
  AttemptState,
  SubmitResult,
} from "@/modules/attempt/attempt.model";

const initialState: AttemptState = {
  attemptId: null,
  quizId: null,
  currentIndex: 0,
  answers: {},
  antiCheat: {
    tabSwitches: 0,
    pastes: 0,
    events: [],
  },
  lastResult: null,
};

const attemptSlice = createSlice({
  name: "attempt",
  initialState,
  reducers: {
    startAttempt(state, action: PayloadAction<Attempt>) {
      state.attemptId = action.payload.id;
      state.quizId = action.payload.quizId;
      state.currentIndex = 0;
      state.answers = {};
      state.antiCheat = { tabSwitches: 0, pastes: 0, events: [] };
      state.lastResult = null;
    },
    setAnswer(state, action: PayloadAction<{ questionId: number; value: string }>) {
      state.answers[action.payload.questionId] = action.payload.value;
    },
    next(state, action: PayloadAction<number>) {
      const max = action.payload - 1;
      state.currentIndex = Math.min(state.currentIndex + 1, max);
    },
    prev(state) {
      state.currentIndex = Math.max(state.currentIndex - 1, 0);
    },
    goto(state, action: PayloadAction<number>) {
      state.currentIndex = Math.max(0, action.payload);
    },
    recordEvent(state, action: PayloadAction<AntiCheatEventName>) {
      state.antiCheat.events.push({ event: action.payload, timestamp: Date.now() });
      if (action.payload === "tab_blur") state.antiCheat.tabSwitches += 1;
      if (action.payload === "paste") state.antiCheat.pastes += 1;
    },
    setResult(state, action: PayloadAction<SubmitResult>) {
      state.lastResult = action.payload;
    },
    resetAttempt() {
      return initialState;
    },
  },
});

export const attemptActions = attemptSlice.actions;
export const attemptReducer = attemptSlice.reducer;
