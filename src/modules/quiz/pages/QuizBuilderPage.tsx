import { useState } from "react";
import { LuSave } from "react-icons/lu";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Button } from "@/components/button/Button";
import { Card, CardBody, CardHeader } from "@/components/card/Card";
import { toast } from "@/components/toast/toast";
import { quizBuilderActions } from "@/modules/quiz/quiz.slice";
import { useSaveQuizFlowMutation } from "@/modules/quiz/quiz.query";
import { validateDraft } from "@/modules/quiz/quiz.schema";
import { QuizMetadataForm } from "@/modules/quiz/components/QuizMetadataForm";
import { QuestionList } from "@/modules/quiz/components/QuestionList";
import { AddQuestionMenu } from "@/modules/quiz/components/AddQuestionMenu";
import { SaveResultPanel } from "@/modules/quiz/components/SaveResultPanel";

export const QuizBuilderPage = () => {
  const dispatch = useAppDispatch();
  const draft = useAppSelector((s) => s.quizBuilder);
  const saveMutation = useSaveQuizFlowMutation();
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSave = () => {
    setValidationError(null);
    const result = validateDraft(draft);
    if (!result.success) {
      const first = result.error.issues[0];
      const msg = first?.message ?? "Please fix the form before saving.";
      setValidationError(msg);
      toast.error(msg);
      return;
    }
    saveMutation.mutate(draft, {
      onSuccess: (quiz) => {
        toast.success(`Quiz "${quiz.title}" published`);
      },
    });
  };

  const handleReset = () => {
    if (saveMutation.isPending) return;
    dispatch(quizBuilderActions.resetDraft());
    saveMutation.reset();
    setValidationError(null);
  };

  const savedQuiz = saveMutation.data;

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
          {savedQuiz && (
            <Button variant="ghost" onClick={handleReset}>
              Start a new quiz
            </Button>
          )}
          <Button onClick={handleSave} loading={saveMutation.isPending} disabled={Boolean(savedQuiz)}>
            <LuSave /> Save quiz
          </Button>
        </div>
      </header>

      {savedQuiz && <SaveResultPanel quizId={savedQuiz.id} />}

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
          <span className="text-xs text-slate-500">{draft.questions.length} added</span>
        </div>
        <QuestionList />
        <AddQuestionMenu />
        {validationError && (
          <p className="text-sm text-rose-600">{validationError}</p>
        )}
      </section>
    </div>
  );
};
