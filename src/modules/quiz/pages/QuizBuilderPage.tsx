import { LuSave } from "react-icons/lu";
import { Button } from "@/components/button/Button";
import { Card, CardBody, CardHeader } from "@/components/card/Card";
import { QuizMetadataForm } from "@/modules/quiz/components/QuizMetadataForm";
import { QuestionList } from "@/modules/quiz/components/QuestionList";
import { AddQuestionMenu } from "@/modules/quiz/components/AddQuestionMenu";
import { SaveResultPanel } from "@/modules/quiz/components/SaveResultPanel";
import { useQuizBuilder } from "@/modules/quiz/hooks/useQuizBuilder";

export const QuizBuilderPage = () => {
  const builder = useQuizBuilder();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Quiz Builder</h1>
          <p className="text-sm text-slate-600">
            Create a quiz with multiple-choice and short-answer questions. Saving will publish it
            so it can be taken immediately.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {builder.savedQuiz && (
            <Button variant="ghost" onClick={builder.reset}>
              Start a new quiz
            </Button>
          )}
          <Button
            onClick={builder.save}
            loading={builder.isSaving}
            disabled={Boolean(builder.savedQuiz)}
          >
            <LuSave /> Save quiz
          </Button>
        </div>
      </header>

      {builder.savedQuiz && <SaveResultPanel quizId={builder.savedQuiz.id} />}

      <Card>
        <CardHeader>
          <span className="text-sm font-medium text-slate-700">Quiz details</span>
        </CardHeader>
        <CardBody>
          <QuizMetadataForm />
        </CardBody>
      </Card>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Questions</h2>
          <span className="text-xs text-slate-500">{builder.draft.questions.length} added</span>
        </div>
        <QuestionList />
        <AddQuestionMenu />
        {builder.validationError && (
          <p className="text-sm text-rose-600">{builder.validationError}</p>
        )}
      </section>
    </div>
  );
};
