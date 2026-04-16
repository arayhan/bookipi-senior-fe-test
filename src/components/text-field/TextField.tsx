import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/libs/cn";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, hint, className, id, ...rest }, ref) => {
    const inputId = id ?? rest.name;
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-10 rounded-md border border-slate-300 bg-white px-3 text-sm",
            "focus:border-brand-500 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20",
            error && "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20",
            className,
          )}
          {...rest}
        />
        {error ? (
          <span className="text-xs text-rose-600">{error}</span>
        ) : hint ? (
          <span className="text-xs text-slate-500">{hint}</span>
        ) : null}
      </div>
    );
  },
);

TextField.displayName = "TextField";
