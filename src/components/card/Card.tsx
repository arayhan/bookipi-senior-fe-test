import type { HTMLAttributes } from "react";
import { cn } from "@/libs/cn";

export const Card = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "rounded-xl border border-slate-200 bg-white shadow-sm",
      className,
    )}
    {...rest}
  />
);

export const CardBody = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-5", className)} {...rest} />
);

export const CardHeader = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-3",
      className,
    )}
    {...rest}
  />
);
