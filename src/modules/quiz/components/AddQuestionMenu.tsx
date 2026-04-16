import { LuListChecks, LuType } from "react-icons/lu";
import { Button } from "@/components/button/Button";
import { useAppDispatch } from "@/hooks/redux";
import { createQuizActions } from "@/modules/quiz/quiz.slice";

export const AddQuestionMenu = () => {
  const dispatch = useAppDispatch();
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="secondary" onClick={() => dispatch(createQuizActions.addQuestion("mcq"))}>
        <LuListChecks /> Add multiple choice
      </Button>
      <Button variant="secondary" onClick={() => dispatch(createQuizActions.addQuestion("short"))}>
        <LuType /> Add short answer
      </Button>
    </div>
  );
};
