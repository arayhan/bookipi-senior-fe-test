import { LuCheck, LuX } from "react-icons/lu";
import { Card, CardBody } from "@/components/card/Card";
import { parsePrompt } from "@/modules/attempt/utils/parsePrompt";
import type { PlayerQuestion } from "@/modules/attempt/attempt.model";
import type { SubmitResult } from "@/modules/attempt/attempt.model";

interface Props {
  result: SubmitResult;
  questions: PlayerQuestion[];
  answers: Record<number, string>;
}

const renderUserAnswer = (question: PlayerQuestion, raw: string | undefined) => {
  if (raw == null || raw === "") return <em className="text-slate-400">No answer</em>;
  if (question.type === "mcq" && question.options) {
    const idx = Number(raw);
    if (Number.isInteger(idx) && question.options[idx] != null) return question.options[idx];
  }
  return raw;
};

export const ResultSummary = ({ result, questions, answers }: Props) => {
  const total = result.details.length;
  return (
    <div className="flex flex-col gap-4">
      <Card className="bg-gradient-to-br from-brand-50 to-white">
        <CardBody className="flex flex-col items-center gap-1 py-8">
          <span className="text-sm uppercase tracking-wide text-brand-700">Your score</span>
          <span className="text-5xl font-semibold text-slate-900">
            {result.score}
            <span className="text-2xl text-slate-400"> / {total}</span>
          </span>
        </CardBody>
      </Card>
      <div className="flex flex-col gap-2">
        {result.details.map((detail, i) => {
          const question = questions.find((q) => q.id === detail.questionId);
          if (!question) return null;
          const { text } = parsePrompt(question.prompt);
          return (
            <Card key={detail.questionId}>
              <CardBody className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-wide text-slate-500">
                      Question {i + 1}
                    </span>
                    <p className="text-sm text-slate-900">{text}</p>
                  </div>
                  <span
                    className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      detail.correct
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {detail.correct ? <LuCheck /> : <LuX />}
                    {detail.correct ? "Correct" : "Incorrect"}
                  </span>
                </div>
                <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-slate-500">
                      Your answer
                    </dt>
                    <dd className="text-slate-800">
                      {renderUserAnswer(question, answers[detail.questionId])}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-slate-500">Expected</dt>
                    <dd className="text-slate-800">{detail.expected || <em className="text-slate-400">—</em>}</dd>
                  </div>
                </dl>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
