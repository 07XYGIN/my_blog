"use client";

import { motion } from "motion/react";

export function AboutHeroTitle() {
  return (
    <div className="relative min-h-[270px] overflow-hidden rounded-2xl border border-[var(--outline)] bg-[color-mix(in_srgb,var(--surface)_72%,transparent)] p-8 md:p-10">
      <div aria-hidden className="absolute inset-0 opacity-70 [background-image:linear-gradient(var(--outline)_1px,transparent_1px),linear-gradient(90deg,var(--outline)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div aria-hidden className="absolute bottom-0 left-0 right-0 grid h-24 grid-cols-4 border-t border-[var(--outline)] bg-[color-mix(in_srgb,var(--surface)_62%,transparent)]">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="border-r border-[var(--outline)] last:border-r-0" key={index} />
        ))}
      </div>
      <div className="relative flex min-h-[150px] flex-col justify-center">
        <p className="eyebrow">Memo profile</p>
        <h1 className="mt-5 text-[clamp(4rem,11vw,8.5rem)] font-semibold leading-none tracking-[-0.08em] text-[var(--text)]">
          关于<span className="mx-3 text-[var(--primary)]">我</span>
        </h1>
        <div className="relative mt-6 h-[5px] w-full max-w-[520px] overflow-hidden rounded-full bg-[var(--surface-container)]">
          <motion.span
            animate={{ x: ["-35%", "85%", "-35%"], scaleX: [0.35, 1, 0.35] }}
            className="absolute inset-y-0 left-0 w-2/3 origin-left rounded-full bg-[var(--primary)]"
            transition={{ duration: 2.8, ease: "easeInOut", repeat: Infinity }}
          />
        </div>
      </div>
    </div>
  );
}
