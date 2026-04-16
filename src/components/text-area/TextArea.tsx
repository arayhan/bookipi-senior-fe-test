import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/libs/cn";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, hint, className, id, ...rest }, ref) => {
    const fieldId = id ?? rest.name;
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={fieldId} className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={fieldId}
          className={cn(
            "min-h-[88px] rounded-md border border-slate-300 bg-white px-3 py-2 text-sm",
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

TextArea.displayName = "TextArea";
