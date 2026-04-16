import { Link } from "react-router-dom";
import { LuHouse, LuRotateCcw } from "react-icons/lu";
import { Button } from "@/components/button/Button";
import { ErrorView } from "@/components/feedback/ErrorView";
import { LoadingView } from "@/components/feedback/LoadingView";
import { ResultSummary } from "@/modules/attempt/components/ResultSummary";
import { AntiCheatSummary } from "@/modules/attempt/components/AntiCheatSummary";
import { useQuizResult } from "@/modules/attempt/hooks/useQuizResult";

export const QuizResultPage = () => {
  const result = useQuizResult();

  if (!result.hasResult || !result.result) {
    return (
      <ErrorView
        title="No result available"
        message="Take the quiz before viewing results."
      />
    );
  }

  if (result.isLoading) return <LoadingView label="Loading questions..." />;
  if (result.isError || !result.quiz) {
    return <ErrorView title="Couldn't load quiz" message="Try refreshing." />;
  }

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Results</h1>
        <p className="text-sm text-slate-600">{result.quiz.title}</p>
      </header>
      <AntiCheatSummary
        tabSwitches={result.antiCheat.tabSwitches}
        pastes={result.antiCheat.pastes}
      />
      <ResultSummary
        result={result.result}
        questions={result.playerQuestions}
        answers={result.answers}
      />
      <div className="flex flex-wrap gap-2">
        <Link to="/">
          <Button variant="secondary">
            <LuHouse /> Home
          </Button>
        </Link>
        <Link to={`/play/${result.quizId}`}>
          <Button variant="secondary" onClick={result.retake}>
            <LuRotateCcw /> Retake
          </Button>
        </Link>
      </div>
    </div>
  );
};
