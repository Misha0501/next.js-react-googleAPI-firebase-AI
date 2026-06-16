import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-[#1F5FD6] text-white shadow-sm hover:bg-[#184FB5] disabled:opacity-50",
  secondary:
    "border border-slate-300 bg-white text-[#334155] hover:border-[#1F5FD6] hover:text-[#1F5FD6] disabled:opacity-50",
  danger:
    "bg-red-600 text-white shadow-sm hover:bg-red-700 disabled:opacity-50",
  ghost:
    "text-[#1F5FD6] hover:bg-[#EAF2FF] disabled:opacity-50",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "min-h-[36px] px-3 py-1.5 text-xs",
  md: "min-h-[42px] px-4 py-2.5 text-sm",
  lg: "min-h-[50px] px-6 py-3 text-sm",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      disabled,
      children,
      className = "",
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={[
          "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition",
          VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
          fullWidth ? "w-full" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      >
        {loading && (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current/30 border-t-current" />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
