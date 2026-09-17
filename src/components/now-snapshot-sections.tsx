import type { NowSnapshot } from "@/lib/now";

const sections = [
  { key: "learning", label: "在学", eyebrow: "Learning" },
  { key: "doing", label: "在做", eyebrow: "Building" },
  { key: "realization", label: "最近想通的一件事", eyebrow: "Realization" },
  { key: "paused", label: "暂时放下的", eyebrow: "Paused" },
] as const;

export function NowSnapshotSections({ snapshot }: { snapshot: NowSnapshot }) {
  return (
    <div className="now-notes-grid">
      {sections.map((section, index) => (
        <article className={`now-note now-note--${section.key}`} key={section.key}>
          <div className="now-note__index"><span>{String(index + 1).padStart(2, "0")}</span><span>{section.eyebrow}</span></div>
          <div className="now-note__copy">
            <h2>{section.label}</h2>
            <p>{snapshot[section.key]}</p>
          </div>
          <span aria-hidden className="now-note__corner">↗</span>
        </article>
      ))}
    </div>
  );
}
