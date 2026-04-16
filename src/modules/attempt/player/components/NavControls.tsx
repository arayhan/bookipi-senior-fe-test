import { LuArrowLeft, LuArrowRight, LuCheck } from "react-icons/lu";
import { Button } from "@/components/button/Button";

interface Props {
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  submitting: boolean;
  canSubmit: boolean;
}

export const NavControls = ({ index, total, onPrev, onNext, onSubmit, submitting, canSubmit }: Props) => {
  const isLast = index === total - 1;
  return (
    <div className="flex items-center justify-between gap-2">
      <Button variant="secondary" onClick={onPrev} disabled={index === 0}>
        <LuArrowLeft /> Previous
      </Button>
      {isLast ? (
        <Button onClick={onSubmit} loading={submitting} disabled={!canSubmit}>
          <LuCheck /> Submit
        </Button>
      ) : (
        <Button onClick={onNext}>
          Next <LuArrowRight />
        </Button>
      )}
    </div>
  );
};
