import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { quizBuilderActions } from "@/modules/quiz/quiz.slice";
import { TextField } from "@/components/ui/TextField";
import { TextArea } from "@/components/ui/TextArea";

export const QuizMetadataForm = () => {
  const dispatch = useAppDispatch();
  const title = useAppSelector((s) => s.quizBuilder.title);
  const description = useAppSelector((s) => s.quizBuilder.description);

  return (
    <div className="grid gap-4">
      <TextField
        label="Title"
        name="title"
        placeholder="e.g. JavaScript Fundamentals"
        value={title}
        onChange={(e) => dispatch(quizBuilderActions.setTitle(e.target.value))}
      />
      <TextArea
        label="Description"
        name="description"
        placeholder="What is this quiz about?"
        value={description}
        onChange={(e) => dispatch(quizBuilderActions.setDescription(e.target.value))}
      />
    </div>
  );
};
