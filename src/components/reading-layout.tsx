import type { ReactNode } from "react";
import { ArrowLeft, ChevronDown, List } from "lucide-react";
import Link from "next/link";
import type { TocItem } from "@/lib/mdx-content";
import { cn } from "@/lib/utils";
import { MotionReveal } from "@/components/motion-surface";

function Contents({ items }: { items: TocItem[] }) {
  return (
    <nav aria-label="本页目录" className="reading-toc-links">
      {items.map((item) => (
        <a
          className="focus-ring"
          href={`#${item.id}`}
          key={item.id}
          style={{
            paddingInlineStart: `${Math.max(item.level - 2, 0) * 12}px`,
          }}
        >
          {item.title}
        </a>
      ))}
    </nav>
  );
}

export function ReadingLayout({
  backHref,
  backLabel,
  toc,
  header,
  children,
  footer,
}: {
  backHref: string;
  backLabel: string;
  toc: TocItem[];
  header: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="container editorial-page reading-page" id="main-content">
      <Link className="back-link focus-ring" href={backHref}>
        <ArrowLeft size={15} />
        {backLabel}
      </Link>
      <div
        className={cn("reading-layout", !toc.length && "reading-layout-solo")}
      >
        <article className="reading-article">
          <MotionReveal>
            <header className="reading-header">{header}</header>
          </MotionReveal>
          {toc.length ? (
            <details className="reading-mobile-toc">
              <summary className="focus-ring">
                <span>
                  <List size={16} />
                  本页目录
                </span>
                <ChevronDown size={16} />
              </summary>
              <Contents items={toc} />
            </details>
          ) : null}
          <div className="prose-content reading-body">{children}</div>
          {footer}
        </article>
        {toc.length ? (
          <aside className="reading-toc">
            <h2>本页目录</h2>
            <Contents items={toc} />
            <a className="text-link focus-ring" href="#main-content">
              返回顶部
            </a>
          </aside>
        ) : null}
      </div>
    </main>
  );
}
