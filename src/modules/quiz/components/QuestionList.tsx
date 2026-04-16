import { useAppSelector } from "@/hooks/redux";
import { QuestionEditor } from "./QuestionEditor";

export const QuestionList = () => {
  const questions = useAppSelector((s) => s.createQuiz.questions);

  if (questions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        No questions yet. Use the buttons below to add one.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {questions.map((q, i) => (
        <QuestionEditor key={q.localId} question={q} index={i} total={questions.length} />
      ))}
    </div>
  );
};
