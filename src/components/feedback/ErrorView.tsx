import { LuTriangleAlert } from "react-icons/lu";
import { Button } from "@/components/button/Button";

interface ErrorViewProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorView = ({
  title = "Something went wrong",
  message = "Please try again.",
  onRetry,
}: ErrorViewProps) => (
  <div className="flex flex-col items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 p-6 text-center">
    <LuTriangleAlert className="text-rose-500" size={28} />
    <div>
      <p className="font-semibold text-rose-700">{title}</p>
      <p className="text-sm text-rose-600">{message}</p>
    </div>
    {onRetry && (
      <Button variant="secondary" size="sm" onClick={onRetry}>
        Retry
      </Button>
    )}
  </div>
);
