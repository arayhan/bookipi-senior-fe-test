import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export const useHome = () => {
  const navigate = useNavigate();
  const [quizId, setQuizId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();

    const trimmedQuizId = quizId.trim();

    if (!/^\d+$/.test(trimmedQuizId)) {
      setError("Quiz ID must be a number.");
      return;
    }

    setError(null);
    navigate(`/play/${trimmedQuizId}`);
  };

  return {
    playQuizById: { quizId, setQuizId, error, submit },
  };
};
