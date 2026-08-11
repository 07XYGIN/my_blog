import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-xl border px-4 py-4 text-sm leading-6",
  {
    variants: {
      variant: {
        default: "border-[var(--outline)] bg-[var(--surface)] text-[var(--text)]",
        muted: "border-[var(--outline)] bg-[var(--surface-low)] text-[var(--muted)]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {}

function Alert({ className, variant, ...props }: AlertProps) {
  return <div className={cn(alertVariants({ variant }), className)} role="note" {...props} />;
}

function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h5 className={cn("mb-1 font-semibold leading-none tracking-normal text-[var(--text)]", className)} {...props} />;
}

function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-[var(--muted)]", className)} {...props} />;
}

export { Alert, AlertDescription, AlertTitle };
