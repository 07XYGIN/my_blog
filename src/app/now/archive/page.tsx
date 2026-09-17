import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import { NowSnapshotSections } from "@/components/now-snapshot-sections";
import { getNowSnapshots } from "@/lib/now";

export const metadata: Metadata = {
  title: "近况归档 | Gin",
  description: "按时间回看 Gin 的近况快照，以及每个阶段的学习、项目和思考。",
};

export default function NowArchivePage() {
  const snapshots = getNowSnapshots();

  return (
    <main className="container section-pad">
      <header className="border-b border-[var(--outline)] pb-14 pt-8 md:pb-20 md:pt-16">
        <p className="eyebrow">Now / Archive</p>
        <h1 className="mt-5 text-[clamp(3rem,8vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.07em]">历史快照</h1>
        <p className="mt-7 max-w-xl text-lg leading-8 text-[var(--muted)]">近况不是一条永远正确的自我介绍，而是一些在当时足够诚实的记录。</p>
      </header>

      <section aria-label="近况历史" className="relative mx-auto mt-12 max-w-4xl md:mt-20">
        <div aria-hidden className="absolute bottom-6 left-[15px] top-6 w-px bg-[var(--outline)]" />
        <ol className="space-y-8">
          {snapshots.map((snapshot, index) => (
            <li className="relative pl-12" key={snapshot.date}>
              <span aria-hidden className={`absolute left-0 top-5 z-10 flex size-8 items-center justify-center rounded-full border border-[var(--outline)] bg-[var(--surface)] text-[var(--primary)] ${index === 0 ? "ring-4 ring-[var(--primary-soft)]" : ""}`}>
                <span className="size-2 rounded-full bg-current" />
              </span>
              <details className="card group overflow-hidden">
                <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-4 p-5 md:p-6 [&::-webkit-details-marker]:hidden">
                  <span>
                    <span className="eyebrow block">Snapshot {String(snapshots.length - index).padStart(2, "0")}</span>
                    <time className="meta mt-2 block text-sm text-[var(--text)]" dateTime={snapshot.date}>{snapshot.date}</time>
                  </span>
                  <ChevronDown className="shrink-0 text-[var(--muted)] transition-transform group-open:rotate-180" size={20} />
                </summary>
                <div className="border-t border-[var(--outline)] p-4 md:p-5">
                  <NowSnapshotSections snapshot={snapshot} />
                </div>
              </details>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
