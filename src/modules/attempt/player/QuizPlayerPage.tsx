import { LoadingView } from "@/components/feedback/LoadingView";
import { ErrorView } from "@/components/feedback/ErrorView";
import { ProgressBar } from "@/modules/attempt/player/components/ProgressBar";
import { QuestionCard } from "@/modules/attempt/player/components/QuestionCard";
import { NavControls } from "@/modules/attempt/player/components/NavControls";
import { useQuizPlayer } from "@/modules/attempt/player/useQuizPlayer";

export const QuizPlayerPage = () => {
  const player = useQuizPlayer();

  if (player.startFailed) {
    return (
      <ErrorView
        title="Couldn't start the quiz"
        message="Verify the quiz ID is correct and that the quiz is published."
        onRetry={player.retry}
      />
    );
  }

  if (player.isLoading || !player.attempt) {
    return <LoadingView label="Loading quiz..." />;
  }

  if (player.isEmpty || !player.currentQuestion) {
    return <ErrorView title="No questions" message="This quiz has no questions to take." />;
  }

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{player.attempt.quiz.title}</h1>
        {player.attempt.quiz.description && (
          <p className="text-sm text-slate-600">{player.attempt.quiz.description}</p>
        )}
        <ProgressBar current={player.safeIndex} total={player.total} />
      </header>

      <QuestionCard
        question={player.currentQuestion}
        index={player.safeIndex}
        total={player.total}
        onAnswerChange={player.handleAnswerChange}
        onPaste={player.reportPaste}
      />

      <NavControls
        index={player.safeIndex}
        total={player.total}
        onPrev={player.handlePrev}
        onNext={player.handleNext}
        onSubmit={player.handleSubmit}
        submitting={player.submitting}
        canSubmit={player.allAnswered}
      />

      {!player.allAnswered && (
        <p className="text-center text-xs text-slate-500">
          Answer every question to enable Submit.
        </p>
      )}
    </div>
  );
};
