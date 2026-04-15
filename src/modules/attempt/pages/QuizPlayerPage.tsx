import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { LoadingView } from "@/components/feedback/LoadingView";
import { ErrorView } from "@/components/feedback/ErrorView";
import {
  useSaveAnswerMutation,
  useStartAttemptMutation,
  useSubmitAttemptMutation,
} from "@/modules/attempt/attempt.query";
import { attemptActions } from "@/modules/attempt/attempt.slice";
import { useAntiCheat } from "@/modules/attempt/hooks/useAntiCheat";
import { ProgressBar } from "@/modules/attempt/components/ProgressBar";
import { QuestionCard } from "@/modules/attempt/components/QuestionCard";
import { NavControls } from "@/modules/attempt/components/NavControls";

export const QuizPlayerPage = () => {
  const { quizId: quizIdParam } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    mutate: startAttempt,
    data: attempt,
    isError: startFailed,
  } = useStartAttemptMutation();
  const saveAnswerMutation = useSaveAnswerMutation();
  const submitMutation = useSubmitAttemptMutation();

  const currentIndex = useAppSelector((s) => s.attempt.currentIndex);
  const answers = useAppSelector((s) => s.attempt.answers);

  const { reportPaste } = useAntiCheat(attempt?.id ?? null);

  useEffect(() => {
    const quizId = Number(quizIdParam);
    if (!Number.isInteger(quizId) || quizId <= 0) return;
    startAttempt(quizId, {
      onSuccess: (data) => dispatch(attemptActions.startAttempt(data)),
    });
  }, [quizIdParam, startAttempt, dispatch]);

  if (!attempt && startFailed) {
    return (
      <ErrorView
        title="Couldn't start the quiz"
        message="Verify the quiz ID is correct and that the quiz is published."
        onRetry={() => {
          const quizId = Number(quizIdParam);
          if (!Number.isInteger(quizId) || quizId <= 0) return;
          startAttempt(quizId, {
            onSuccess: (data) => dispatch(attemptActions.startAttempt(data)),
          });
        }}
      />
    );
  }

  if (!attempt) {
    return <LoadingView label="Loading quiz..." />;
  }

  const questions = attempt.quiz.questions ?? [];
  const total = questions.length;

  if (total === 0) {
    return <ErrorView title="No questions" message="This quiz has no questions to take." />;
  }

  const safeIndex = Math.min(currentIndex, total - 1);
  const currentQuestion = questions[safeIndex];

  const handleAnswerChange = (value: string) => {
    saveAnswerMutation.mutate({
      attemptId: attempt.id,
      questionId: currentQuestion.id,
      value,
    });
  };

  const handlePrev = () => dispatch(attemptActions.prev());
  const handleNext = () => dispatch(attemptActions.next(total));

  const handleSubmit = () => {
    submitMutation.mutate(attempt.id, {
      onSuccess: (result) => {
        dispatch(attemptActions.setResult(result));
        navigate(`/play/${attempt.quizId}/result/${attempt.id}`);
      },
    });
  };

  const allAnswered = questions.every((q) => {
    const v = answers[q.id];
    return typeof v === "string" && v.length > 0;
  });

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{attempt.quiz.title}</h1>
        {attempt.quiz.description && (
          <p className="text-sm text-slate-600">{attempt.quiz.description}</p>
        )}
        <ProgressBar current={safeIndex} total={total} />
      </header>

      <QuestionCard
        question={currentQuestion}
        index={safeIndex}
        total={total}
        onAnswerChange={handleAnswerChange}
        onPaste={reportPaste}
      />

      <NavControls
        index={safeIndex}
        total={total}
        onPrev={handlePrev}
        onNext={handleNext}
        onSubmit={handleSubmit}
        submitting={submitMutation.isPending}
        canSubmit={allAnswered}
      />

      {!allAnswered && (
        <p className="text-center text-xs text-slate-500">
          Answer every question to enable Submit.
        </p>
      )}
    </div>
  );
};
