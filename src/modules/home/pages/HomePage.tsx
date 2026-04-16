import { Link } from "react-router-dom";
import { LuPlus } from "react-icons/lu";
import { Button } from "@/components/button/Button";
import { QuizList } from "@/modules/home/components/QuizList";

export const HomePage = () => (
  <div className="flex flex-col gap-6">
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight">Quiz Maker</h1>
        <p className="text-slate-600">
          Browse available quizzes and take one, or build your own.
        </p>
      </div>
      <Link to="/builder">
        <Button>
          <LuPlus /> Create quiz
        </Button>
      </Link>
    </header>

    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Available quizzes</h2>
      </div>
      <QuizList />
    </section>
  </div>
);
