import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { createQuizActions } from "@/modules/quiz/quiz.slice";
import { TextField } from "@/components/text-field/TextField";
import { TextArea } from "@/components/text-area/TextArea";

export const QuizMetadataForm = () => {
  const dispatch = useAppDispatch();
  const title = useAppSelector((s) => s.createQuiz.title);
  const description = useAppSelector((s) => s.createQuiz.description);

  return (
    <div className="grid gap-4">
      <TextField
        label="Title"
        name="title"
        placeholder="e.g. JavaScript Fundamentals"
        value={title}
        onChange={(e) => dispatch(createQuizActions.setTitle(e.target.value))}
      />
      <TextArea
        label="Description"
        name="description"
        placeholder="What is this quiz about?"
        value={description}
        onChange={(e) => dispatch(createQuizActions.setDescription(e.target.value))}
      />
    </div>
  );
};
