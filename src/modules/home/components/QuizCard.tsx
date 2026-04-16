import { Link } from "react-router-dom";
import { LuArrowRight, LuFileText, LuPencilLine } from "react-icons/lu";
import { Card, CardBody } from "@/components/card/Card";
import { cn } from "@/libs/cn";
import type { Quiz } from "@/modules/quiz/quiz.model";

interface Props {
  quiz: Quiz;
}

export const QuizCard = ({ quiz }: Props) => {
  const isPublished = quiz.isPublished;

  const inner = (
    <CardBody className="flex h-full flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <LuFileText className="mt-1 flex-shrink-0 text-brand-600" size={20} />
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide",
            isPublished
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700",
          )}
        >
          {isPublished ? "Published" : "Draft"}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="line-clamp-2 text-base font-semibold text-slate-900">
          {quiz.title}
        </h3>
        <p className="line-clamp-2 text-sm text-slate-600">
          {quiz.description || <em className="text-slate-400">No description</em>}
        </p>
      </div>
      <div className="mt-auto flex items-center justify-between pt-2 text-sm">
        {isPublished ? (
          <span className="inline-flex items-center gap-1 font-medium text-brand-700">
            Take quiz <LuArrowRight size={14} />
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-slate-400">
            <LuPencilLine size={14} /> Not yet published
          </span>
        )}
        <span className="text-xs text-slate-400">#{quiz.id}</span>
      </div>
    </CardBody>
  );

  const cardClass = cn(
    "h-full transition-shadow",
    isPublished
      ? "cursor-pointer hover:shadow-md hover:border-brand-300"
      : "cursor-not-allowed opacity-70",
  );

  if (isPublished) {
    return (
      <Link to={`/play/${quiz.id}`} className="block h-full">
        <Card className={cardClass}>{inner}</Card>
      </Link>
    );
  }

  return (
    <div aria-disabled className="block h-full">
      <Card className={cardClass}>{inner}</Card>
    </div>
  );
};
