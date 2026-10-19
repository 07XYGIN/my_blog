import type { Metadata } from "next";
import { Braces, CalendarDays, ChevronDown, Code2, Hash } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getMdxComponents } from "@/components/mdx/mdx-blocks";
import { Badge } from "@/components/ui/badge";
import { mdxOptions } from "@/lib/mdx-options";
import { getCodeSnippets } from "@/lib/snippets";

export const metadata: Metadata = {
  title: "速查 | Gin",
  description: "可以直接检索和复用的代码、命令与配置片段。",
};

export default async function SnippetsPage() {
  const snippets = await getCodeSnippets();
  const renderedSnippets = await Promise.all(snippets.map(async (snippet) => ({
    snippet,
    content: await MDXRemote({ source: snippet.source, options: { mdxOptions }, components: getMdxComponents(new Map()) }),
  })));

  return (
    <main className="container section-pad">
      <header className="border-b border-[var(--outline)] pb-12 pt-8 md:grid md:grid-cols-[1fr_320px] md:items-end md:gap-12 md:pb-16 md:pt-14">
        <div>
          <p className="eyebrow">Snippets / Copy, adapt, ship</p>
          <h1 className="mt-5 text-[clamp(3.5rem,10vw,7.5rem)] font-semibold leading-[0.88] tracking-[-0.07em]">速查</h1>
        </div>
        <div className="mt-8 md:mt-0">
          <p className="text-lg leading-8 text-[var(--muted)]">收录反复使用的代码、命令和配置。需要时直接找到、复制，再按当前项目调整。</p>
          <p className="meta mt-5 text-xs text-[var(--muted)]"><strong className="mr-2 text-2xl text-[var(--text)]">{snippets.length}</strong>条可复用片段</p>
        </div>
      </header>

      {renderedSnippets.length > 0 ? (
        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
          <aside className="lg:sticky lg:top-24">
            <p className="eyebrow">片段索引</p>
            <nav className="mt-4 border-y border-[var(--outline)]" aria-label="代码片段索引">
              {snippets.map((snippet, index) => (
                <a className="focus-ring flex items-center justify-between gap-3 border-b border-[var(--outline)] px-1 py-4 text-sm last:border-b-0 hover:text-[var(--primary)]" href={`#snippet-${snippet.slug}`} key={snippet.slug}>
                  <span className="min-w-0 truncate">{snippet.title}</span>
                  <span className="meta text-[10px] text-[var(--muted)]">{String(index + 1).padStart(2, "0")}</span>
                </a>
              ))}
            </nav>
          </aside>

          <section aria-label="代码片段列表" className="min-w-0 space-y-5">
            {renderedSnippets.map(({ snippet, content }, index) => (
              <details className="snippet-card group scroll-mt-24 overflow-hidden rounded-lg border border-[var(--outline)] bg-[var(--surface)]" id={`snippet-${snippet.slug}`} key={snippet.slug} open={index === 0}>
                <summary className="focus-ring flex cursor-pointer list-none items-start justify-between gap-5 px-5 py-5 marker:hidden md:px-6">
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <Code2 className="text-[var(--primary)]" size={18} />
                      <span className="text-lg font-semibold text-[var(--text)]">{snippet.title}</span>
                      <Badge variant="outline">{snippet.language.toUpperCase()}</Badge>
                    </span>
                    {snippet.description ? <span className="mt-2 block text-sm leading-6 text-[var(--muted)]">{snippet.description}</span> : null}
                    <span className="meta mt-3 flex flex-wrap gap-4 text-[10px] text-[var(--muted)]">
                      {snippet.tags.map((tag) => <span className="inline-flex items-center gap-1" key={tag}><Hash size={11} />{tag}</span>)}
                      {snippet.date ? <span className="inline-flex items-center gap-1"><CalendarDays size={11} />{snippet.date}</span> : null}
                    </span>
                  </span>
                  <ChevronDown className="mt-1 shrink-0 text-[var(--muted)] transition-transform group-open:rotate-180" size={20} />
                </summary>
                <div className="border-t border-[var(--outline)] px-4 pb-5 md:px-6">
                  <div className="prose-content snippet-prose text-[15px] leading-7">{content}</div>
                </div>
              </details>
            ))}
          </section>
        </div>
      ) : (
        <div className="mt-10 border-y border-dashed border-[var(--outline)] px-6 py-16 text-center">
          <Braces className="mx-auto text-[var(--muted)]" size={28} />
          <p className="mt-4 font-medium">暂无速查内容</p>
          <p className="mt-2 text-sm text-[var(--muted)]">新的代码片段会显示在这里。</p>
        </div>
      )}
    </main>
  );
}
