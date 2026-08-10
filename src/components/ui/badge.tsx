import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-md border px-2 py-0.5 font-meta text-[13px] font-medium transition-colors", {
  variants: {
    variant: {
      default: "border-transparent bg-[var(--primary-soft)] text-[var(--primary)]",
      outline: "border-[var(--outline)] bg-transparent text-[var(--muted)]",
      teal: "border-transparent bg-[var(--teal-soft)] text-[var(--teal)]",
    },
  },
  defaultVariants: { variant: "default" },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
