import { LuSave } from "react-icons/lu";
import { Button } from "@/components/button/Button";
import { Card, CardBody, CardHeader } from "@/components/card/Card";
import { LoadingView } from "@/components/feedback/LoadingView";
import { ErrorView } from "@/components/feedback/ErrorView";
import { QuizMetadataForm } from "@/modules/form/components/QuizMetadataForm";
import { QuestionList } from "@/modules/form/components/QuestionList";
import { AddQuestionMenu } from "@/modules/form/components/AddQuestionMenu";
import { SaveResultPanel } from "@/modules/form/components/SaveResultPanel";
import { useQuizForm } from "@/modules/form/useQuizForm";

export const QuizFormPage = () => {
  const quizForm = useQuizForm();

  if (quizForm.isLoadingQuiz) return <LoadingView label="Loading quiz..." />;
  if (quizForm.isQuizError) {
    return <ErrorView title="Couldn't load quiz" message="Try refreshing." />;
  }

  const isEdit = quizForm.mode === "edit";
  const title = isEdit ? "Edit Quiz" : "Create Quiz";
  const description = isEdit
    ? "Update the metadata and questions. Saving replaces the question set."
    : "Create a quiz with multiple-choice and short-answer questions. Saving will publish it so it can be taken immediately.";
  const saveLabel = isEdit ? "Update quiz" : "Save quiz";

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          {quizForm.savedQuiz && !isEdit && (
            <Button variant="ghost" onClick={quizForm.reset}>
              Start a new quiz
            </Button>
          )}
          <Button
            onClick={quizForm.save}
            loading={quizForm.isSaving}
            disabled={Boolean(quizForm.savedQuiz) && !isEdit}
          >
            <LuSave /> {saveLabel}
          </Button>
        </div>
      </header>

      {quizForm.savedQuiz && !isEdit && <SaveResultPanel quizId={quizForm.savedQuiz.id} />}

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
          <span className="text-xs text-slate-500">{quizForm.draft.questions.length} added</span>
        </div>
        <QuestionList />
        <AddQuestionMenu />
        {quizForm.validationError && (
          <p className="text-sm text-rose-600">{quizForm.validationError}</p>
        )}
      </section>
    </div>
  );
};
