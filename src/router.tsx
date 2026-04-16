import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { HomePage } from "@/modules/home/pages/HomePage";
import { CreateQuizPage } from "@/modules/quiz/pages/CreateQuizPage";
import { QuizPlayerPage } from "@/modules/attempt/pages/QuizPlayerPage";
import { QuizResultPage } from "@/modules/attempt/pages/QuizResultPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/create-quiz", element: <CreateQuizPage /> },
      { path: "/play/:quizId", element: <QuizPlayerPage /> },
      { path: "/play/:quizId/result/:attemptId", element: <QuizResultPage /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
