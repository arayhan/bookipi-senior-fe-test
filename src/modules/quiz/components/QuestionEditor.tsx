import { LuArrowDown, LuArrowUp, LuTrash2 } from "react-icons/lu";
import { useAppDispatch } from "@/app/hooks";
import { quizBuilderActions } from "@/modules/quiz/quiz.slice";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextArea } from "@/components/ui/TextArea";
import type { DraftQuestion } from "@/modules/quiz/quiz.model";
import { McqQuestionEditor } from "./McqQuestionEditor";
import { ShortQuestionEditor } from "./ShortQuestionEditor";

interface Props {
  question: DraftQuestion;
  index: number;
  total: number;
}

export const QuestionEditor = ({ question, index, total }: Props) => {
  const dispatch = useAppDispatch();

  const update = (patch: Partial<DraftQuestion>) =>
    dispatch(quizBuilderActions.updateQuestion({ localId: question.localId, patch }));

  const typeLabel = question.type === "mcq" ? "Multiple Choice" : "Short Answer";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-wide text-slate-500">
            Question {index + 1}
          </span>
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
            {typeLabel}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              dispatch(quizBuilderActions.moveQuestion({ localId: question.localId, direction: "up" }))
            }
            disabled={index === 0}
            aria-label="Move up"
          >
            <LuArrowUp />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              dispatch(quizBuilderActions.moveQuestion({ localId: question.localId, direction: "down" }))
            }
            disabled={index === total - 1}
            aria-label="Move down"
          >
            <LuArrowDown />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(quizBuilderActions.removeQuestion(question.localId))}
            aria-label="Delete question"
          >
            <LuTrash2 className="text-rose-600" />
          </Button>
        </div>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <TextArea
          label="Prompt"
          value={question.prompt}
          onChange={(e) => update({ prompt: e.target.value })}
          placeholder="What does the following code log?"
        />
        <TextArea
          label="Code snippet (optional, display only)"
          value={question.codeSnippet}
          onChange={(e) => update({ codeSnippet: e.target.value })}
          placeholder="console.log(typeof null);"
          className="font-mono text-xs"
        />
        {question.type === "mcq" ? (
          <McqQuestionEditor question={question} />
        ) : (
          <ShortQuestionEditor question={question} />
        )}
      </CardBody>
    </Card>
  );
};
