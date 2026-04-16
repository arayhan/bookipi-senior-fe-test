import { Link } from "react-router-dom";
import { LuInbox, LuPlus } from "react-icons/lu";
import { LoadingView } from "@/components/feedback/LoadingView";
import { ErrorView } from "@/components/feedback/ErrorView";
import { Button } from "@/components/button/Button";
import { useListQuizzesQuery } from "@/modules/quiz/quiz.query";
import { QuizCard } from "./QuizCard";

export const QuizList = () => {
  const { data, isLoading, isError, refetch } = useListQuizzesQuery();

  if (isLoading) return <LoadingView label="Loading quizzes..." />;
  if (isError) {
    return (
      <ErrorView
        title="Couldn't load quizzes"
        message="Check your backend connection and try again."
        onRetry={() => refetch()}
      />
    );
  }

  const quizzes = data ?? [];
  const sorted = [...quizzes].sort((a, b) => {
    if (a.isPublished !== b.isPublished) return a.isPublished ? -1 : 1;
    return (b.createdAt ?? "").localeCompare(a.createdAt ?? "");
  });

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
        <LuInbox className="text-slate-400" size={32} />
        <div>
          <p className="text-base font-semibold text-slate-800">No quizzes yet</p>
          <p className="text-sm text-slate-500">
            Create your first quiz and it will show up here.
          </p>
        </div>
        <Link to="/builder">
          <Button>
            <LuPlus /> Create quiz
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sorted.map((quiz) => (
        <QuizCard key={quiz.id} quiz={quiz} />
      ))}
    </div>
  );
};
