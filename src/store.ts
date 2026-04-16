import { configureStore } from "@reduxjs/toolkit";
import { quizFormReducer } from "@/modules/quiz/form/form.slice";
import { attemptReducer } from "@/modules/attempt/attempt.slice";

export const store = configureStore({
  reducer: {
    quizForm: quizFormReducer,
    attempt: attemptReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
