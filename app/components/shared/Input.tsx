import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

const BASE =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#1F2937] outline-none transition placeholder:text-slate-400 focus:border-[#1F5FD6] focus:ring-2 focus:ring-[#1F5FD6]/15 disabled:bg-slate-50 disabled:text-slate-400";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  label?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, label, id, className = "", ...rest }, ref) => (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-semibold text-[#1F2937]"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={[
          BASE,
          error
            ? "focus:ring-red-400/15 border-red-400 focus:border-red-400"
            : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      />
      {error && (
        <p className="mt-1.5 text-xs font-semibold text-red-600">{error}</p>
      )}
    </div>
  ),
);

Input.displayName = "Input";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
  label?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, label, id, className = "", ...rest }, ref) => (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-semibold text-[#1F2937]"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        className={[
          BASE,
          "resize-y",
          error
            ? "focus:ring-red-400/15 border-red-400 focus:border-red-400"
            : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      />
      {error && (
        <p className="mt-1.5 text-xs font-semibold text-red-600">{error}</p>
      )}
    </div>
  ),
);

Textarea.displayName = "Textarea";
