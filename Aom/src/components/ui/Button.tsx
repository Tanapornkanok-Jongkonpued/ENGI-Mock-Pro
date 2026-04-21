import type { ReactNode, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "gold" | "outline" | "ghost" | "danger";
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "gold",
  loading,
  children,
  className = "",
  disabled,
  ...rest
}: ButtonProps) {
  const classes = {
    gold: "btn-gold",
    outline: "btn-outline",
    ghost: "btn-ghost",
    danger:
      "border border-accent-red/50 text-accent-red hover:bg-accent-red hover:text-white font-heading font-bold px-6 py-3 rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50",
  };
  return (
    <button
      className={`${classes[variant]} inline-flex items-center justify-center gap-2 ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}
