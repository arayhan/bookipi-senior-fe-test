import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { quizFormActions } from "@/modules/quiz/form/form.slice";
import { TextField } from "@/components/text-field/TextField";
import { TextArea } from "@/components/text-area/TextArea";

export const QuizMetadataForm = () => {
  const dispatch = useAppDispatch();
  const title = useAppSelector((s) => s.quizForm.title);
  const description = useAppSelector((s) => s.quizForm.description);

  return (
    <div className="grid gap-4">
      <TextField
        label="Title"
        name="title"
        placeholder="e.g. JavaScript Fundamentals"
        value={title}
        onChange={(e) => dispatch(quizFormActions.setTitle(e.target.value))}
      />
      <TextArea
        label="Description"
        name="description"
        placeholder="What is this quiz about?"
        value={description}
        onChange={(e) => dispatch(quizFormActions.setDescription(e.target.value))}
      />
    </div>
  );
};
