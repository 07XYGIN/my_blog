"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

export function MotionArticle({
  children,
  className,
  id,
  index = 0,
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  index?: number;
  interactive?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.article
      animate={{ opacity: 1, y: 0 }}
      className={className}
      id={id}
      initial={reducedMotion ? false : { y: 8 }}
      transition={{
        duration: reducedMotion ? 0 : 0.18,
        delay: reducedMotion ? 0 : Math.min(index, 4) * 0.035,
        ease: "easeOut",
      }}
      whileHover={
        interactive && !reducedMotion
          ? { y: -3, transition: { duration: 0.16, delay: 0 } }
          : undefined
      }
    >
      {children}
    </motion.article>
  );
}

export function MotionReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={className}
      initial={reducedMotion ? false : { y: 8 }}
      transition={{ duration: reducedMotion ? 0 : 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
