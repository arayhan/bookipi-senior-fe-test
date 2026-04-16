import { configureStore } from "@reduxjs/toolkit";
import { quizBuilderReducer } from "@/modules/quiz/quiz.slice";
import { attemptReducer } from "@/modules/attempt/attempt.slice";

export const store = configureStore({
  reducer: {
    quizBuilder: quizBuilderReducer,
    attempt: attemptReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
