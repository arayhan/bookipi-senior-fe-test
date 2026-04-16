import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { LuArrowRight } from "react-icons/lu";
import { TextField } from "@/components/text-field/TextField";
import { Button } from "@/components/button/Button";
import { Card, CardBody } from "@/components/card/Card";

export const QuizIdEntry = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!/^\d+$/.test(trimmed)) {
      setError("Quiz ID must be a number.");
      return;
    }
    setError(null);
    navigate(`/play/${trimmed}`);
  };

  return (
    <Card className="mx-auto max-w-lg">
      <CardBody>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <h1 className="text-xl font-semibold">Take a quiz</h1>
          <p className="text-sm text-slate-600">
            Enter the quiz ID you were given by the quiz creator.
          </p>
          <TextField
            label="Quiz ID"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. 12"
            inputMode="numeric"
            error={error ?? undefined}
            autoFocus
          />
          <div className="flex justify-end">
            <Button type="submit">
              Load quiz <LuArrowRight />
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};
