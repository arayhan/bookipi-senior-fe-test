import { Spinner } from "@/components/ui/Spinner";

interface LoadingViewProps {
  label?: string;
}

export const LoadingView = ({ label = "Loading..." }: LoadingViewProps) => (
  <div className="flex items-center justify-center gap-2 py-10 text-slate-500">
    <Spinner />
    <span className="text-sm">{label}</span>
  </div>
);
