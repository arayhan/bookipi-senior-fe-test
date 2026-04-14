import { Card, CardBody } from "@/components/ui/Card";
import { CodeBlock } from "@/components/code/CodeBlock";
import { parsePrompt } from "@/modules/attempt/utils/parsePrompt";
import type { PlayerQuestion } from "@/modules/attempt/attempt.model";
import { McqAnswer } from "./McqAnswer";
import { ShortAnswer } from "./ShortAnswer";

interface Props {
  question: PlayerQuestion;
  index: number;
  total: number;
  onAnswerChange: (value: string) => void;
  onPaste: () => void;
}

export const QuestionCard = ({ question, index, total, onAnswerChange, onPaste }: Props) => {
  const { text, code } = parsePrompt(question.prompt);

  return (
    <Card>
      <CardBody className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-slate-500">
            Question {index + 1} of {total}
          </span>
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
            {question.type === "mcq" ? "Multiple Choice" : "Short Answer"}
          </span>
        </div>
        <p className="whitespace-pre-wrap text-base text-slate-900">{text}</p>
        {code && <CodeBlock code={code} />}
        <div className="pt-2">
          {question.type === "mcq" ? (
            <McqAnswer question={question} onChange={onAnswerChange} />
          ) : (
            <ShortAnswer question={question} onChange={onAnswerChange} onPaste={onPaste} />
          )}
        </div>
      </CardBody>
    </Card>
  );
};
