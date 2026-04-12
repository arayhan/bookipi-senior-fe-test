import { LuLoader } from "react-icons/lu";
import { cn } from "@/libs/cn";

interface SpinnerProps {
  size?: number;
  className?: string;
}

export const Spinner = ({ size = 18, className }: SpinnerProps) => (
  <LuLoader className={cn("animate-spin text-slate-500", className)} size={size} />
);
