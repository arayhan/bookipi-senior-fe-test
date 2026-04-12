import { Link } from "react-router-dom";
import { LuPencilLine, LuPlay } from "react-icons/lu";
import { Card, CardBody } from "@/components/ui/Card";

export const HomePage = () => (
  <div className="flex flex-col gap-8">
    <header className="flex flex-col gap-2">
      <h1 className="text-3xl font-semibold tracking-tight">Quiz Maker</h1>
      <p className="text-slate-600 max-w-2xl">
        Build a small coding quiz, share its ID, and let someone take it. The reviewer can run
        either flow independently.
      </p>
    </header>
    <div className="grid gap-4 sm:grid-cols-2">
      <Link to="/builder" className="block group">
        <Card className="transition-shadow group-hover:shadow-md">
          <CardBody className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-brand-600">
              <LuPencilLine size={22} />
              <span className="text-sm font-medium uppercase tracking-wide">Builder</span>
            </div>
            <h2 className="text-lg font-semibold">Create a quiz</h2>
            <p className="text-sm text-slate-600">
              Add a title and description, then mix multiple-choice and short-answer questions.
            </p>
          </CardBody>
        </Card>
      </Link>
      <Link to="/play" className="block group">
        <Card className="transition-shadow group-hover:shadow-md">
          <CardBody className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-brand-600">
              <LuPlay size={22} />
              <span className="text-sm font-medium uppercase tracking-wide">Player</span>
            </div>
            <h2 className="text-lg font-semibold">Take a quiz</h2>
            <p className="text-sm text-slate-600">
              Enter a quiz ID, answer the questions, and see your score with a per-question
              breakdown.
            </p>
          </CardBody>
        </Card>
      </Link>
    </div>
  </div>
);
