import { Link, useParams } from "react-router-dom";
import { LuHouse, LuRotateCcw } from "react-icons/lu";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Button } from "@/components/button/Button";
import { ErrorView } from "@/components/feedback/ErrorView";
import { LoadingView } from "@/components/feedback/LoadingView";
import { useGetQuizQuery } from "@/modules/quiz/quiz.query";
import { attemptActions } from "@/modules/attempt/attempt.slice";
import { ResultSummary } from "@/modules/attempt/components/ResultSummary";
import { AntiCheatSummary } from "@/modules/attempt/components/AntiCheatSummary";
import type { PlayerQuestion } from "@/modules/attempt/attempt.model";

export const QuizResultPage = () => {
  const { quizId } = useParams<{ quizId: string; attemptId: string }>();
  const dispatch = useAppDispatch();
  const result = useAppSelector((s) => s.attempt.lastResult);
  const answers = useAppSelector((s) => s.attempt.answers);
  const antiCheat = useAppSelector((s) => s.attempt.antiCheat);

  const quizQuery = useGetQuizQuery(quizId);

  if (!result) {
    return (
      <ErrorView
        title="No result available"
        message="Take the quiz before viewing results."
      />
    );
  }

  if (quizQuery.isLoading) return <LoadingView label="Loading questions..." />;
  if (quizQuery.isError || !quizQuery.data) {
    return <ErrorView title="Couldn't load quiz" message="Try refreshing." />;
  }

  const playerQuestions: PlayerQuestion[] = quizQuery.data.questions.map((q) => ({
    id: q.id,
    type: q.type,
    prompt: q.prompt,
    options: q.options ?? null,
    position: q.position,
  }));

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Results</h1>
        <p className="text-sm text-slate-600">{quizQuery.data.title}</p>
      </header>
      <AntiCheatSummary tabSwitches={antiCheat.tabSwitches} pastes={antiCheat.pastes} />
      <ResultSummary result={result} questions={playerQuestions} answers={answers} />
      <div className="flex flex-wrap gap-2">
        <Link to="/">
          <Button variant="secondary">
            <LuHouse /> Home
          </Button>
        </Link>
        <Link to={`/play/${quizId}`}>
          <Button
            variant="secondary"
            onClick={() => dispatch(attemptActions.resetAttempt())}
          >
            <LuRotateCcw /> Retake
          </Button>
        </Link>
      </div>
    </div>
  );
};
