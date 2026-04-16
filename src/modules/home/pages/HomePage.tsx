import { Link } from "react-router-dom";
import { LuArrowRight, LuPlus } from "react-icons/lu";
import { Button } from "@/components/button/Button";
import { TextField } from "@/components/text-field/TextField";
import { QuizList } from "@/modules/home/components/QuizList";
import { useHome } from "@/modules/home/hooks/useHome";

export const HomePage = () => {
  const home = useHome();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight">Quiz Maker</h1>
          <p className="text-slate-600">
            Browse available quizzes and take one, or build your own.
          </p>
        </div>
        <div className="flex flex-wrap items-start gap-3">
          <form onSubmit={home.submit} className="flex items-start gap-2">
            <TextField
              aria-label="Quiz ID"
              placeholder="Enter quiz ID"
              value={home.quizId}
              onChange={(e) => home.setQuizId(e.target.value)}
              inputMode="numeric"
              error={home.error ?? undefined}
              className="w-40"
            />
            <Button type="submit" variant="secondary">
              Go <LuArrowRight />
            </Button>
          </form>
          <Link to="/builder">
            <Button>
              <LuPlus /> Create quiz
            </Button>
          </Link>
        </div>
      </header>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Available quizzes</h2>
        </div>
        <QuizList />
      </section>
    </div>
  );
};
