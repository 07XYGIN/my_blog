import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, ChevronDown } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMdxComponents } from "@/components/mdx/mdx-blocks";
import type { TocItem } from "@/lib/mdx-content";
import { mdxOptions } from "@/lib/mdx-options";
import { getCodeSnippet, getCodeSnippets } from "@/lib/snippets";

export const dynamicParams = false;

type SnippetPageProps = { params: Promise<{ slug: string[] }> };

export async function generateStaticParams() {
  return (await getCodeSnippets()).map((snippet) => ({ slug: snippet.slug.split("/") }));
}

export async function generateMetadata({ params }: SnippetPageProps): Promise<Metadata> {
  const snippet = await getCodeSnippet((await params).slug.join("/"));
  if (!snippet) notFound();
  return { title: `${snippet.title} | 速查 | Gin`, description: snippet.description };
}

export default async function SnippetPage({ params }: SnippetPageProps) {
  const slug = (await params).slug.join("/");
  const [snippet, snippets] = await Promise.all([getCodeSnippet(slug), getCodeSnippets()]);
  if (!snippet) notFound();

  const content = await MDXRemote({ source: snippet.source, options: { mdxOptions }, components: getMdxComponents(new Map()) });
  const related = snippets
    .filter((item) => item.slug !== slug && item.tags.some((tag) => snippet.tags.includes(tag)))
    .sort((a, b) => b.tags.filter((tag) => snippet.tags.includes(tag)).length - a.tags.filter((tag) => snippet.tags.includes(tag)).length)
    .slice(0, 3);

  return (
    <main className="container section-pad">
      <Link className="focus-ring meta inline-flex items-center gap-2 text-xs text-[var(--muted)] hover:text-[var(--primary)]" href={`/snippets#snippet-${slug}`}><ArrowLeft size={15} />返回速查</Link>
      <div className={`mt-7 grid items-start gap-12 ${snippet.toc.length ? "lg:grid-cols-[minmax(0,1fr)_220px]" : "lg:grid-cols-[minmax(0,80ch)] lg:justify-center"}`}>
        <article className="min-w-0">
          <header className="border-b border-[var(--outline)] pb-7">
            <div className="flex flex-wrap gap-2"><span className="tag teal">{snippet.language.toUpperCase()}</span>{snippet.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
            <h1 className="mt-5 break-words text-3xl font-semibold leading-tight sm:text-4xl">{snippet.title}</h1>
            {snippet.description ? <p className="mt-4 text-base leading-7 text-[var(--muted)]">{snippet.description}</p> : null}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-[var(--muted)]">
              {snippet.date ? <time className="meta inline-flex items-center gap-2" dateTime={snippet.date}><CalendarDays size={14} />{snippet.date}</time> : null}
              {snippet.originHref ? <Link className="focus-ring inline-flex min-w-0 items-center gap-2 break-words hover:text-[var(--primary)]" href={snippet.originHref}><BookOpen className="shrink-0" size={14} />{snippet.originTitle ?? "来源笔记"}</Link> : null}
            </div>
          </header>
          {snippet.toc.length ? (
            <details className="snippet-toc group mt-6 border-y border-[var(--outline)] lg:hidden">
              <summary className="focus-ring flex cursor-pointer list-none items-center justify-between py-3 text-sm font-medium">本页目录<ChevronDown className="transition-transform group-open:rotate-180" size={16} /></summary>
              <SnippetToc items={snippet.toc} />
            </details>
          ) : null}
          <div className="prose-content pt-2 text-base leading-7">{content}</div>
          {related.length ? (
            <nav aria-label="相关速查" className="mt-12 border-t border-[var(--outline)] pt-6">
              <h2 className="text-lg font-semibold">相关速查</h2>
              <div className="mt-3 divide-y divide-[var(--outline)]">
                {related.map((item) => <Link className="focus-ring flex items-center justify-between gap-3 py-4 text-sm hover:text-[var(--primary)]" href={`/snippets/${item.slug}`} key={item.slug}><span className="min-w-0 break-words">{item.title}</span><ArrowRight className="shrink-0" size={16} /></Link>)}
              </div>
            </nav>
          ) : null}
        </article>
        {snippet.toc.length ? (
          <aside className="sticky top-24 hidden max-h-[calc(100dvh-8rem)] overflow-y-auto border-l border-[var(--outline)] pl-5 lg:block">
            <h2 className="mb-3 text-sm font-semibold">本页目录</h2>
            <SnippetToc items={snippet.toc} />
          </aside>
        ) : null}
      </div>
    </main>
  );
}

function SnippetToc({ items }: { items: TocItem[] }) {
  return (
    <nav aria-label="本页目录" className="flex flex-col gap-1 pb-3">
      {items.map((item) => <a className="focus-ring rounded py-2 text-sm leading-5 text-[var(--muted)] hover:text-[var(--primary)]" href={`#${item.id}`} key={item.id} style={{ paddingLeft: `${Math.max(item.level - 2, 0) * 12}px` }}>{item.title}</a>)}
    </nav>
  );
}
