import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("inline-flex items-center justify-center rounded-lg font-meta text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", {
  variants: {
    variant: {
      primary: "bg-[var(--primary)] text-white hover:brightness-110",
      outline: "border border-[var(--outline)] bg-transparent text-[var(--muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]",
      ghost: "text-[var(--muted)] hover:bg-[var(--surface-container)] hover:text-[var(--primary)]",
    },
    size: { default: "px-4 py-2", icon: "h-9 w-9 p-2" },
  },
  defaultVariants: { variant: "primary", size: "default" },
});

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />);
Button.displayName = "Button";
