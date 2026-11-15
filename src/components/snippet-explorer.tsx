"use client";

import { ArrowRight, Braces, ChevronDown, Search, X } from "lucide-react";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { getSnippetCategory, groupSnippets } from "@/lib/snippet-groups";
import type { CodeSnippet } from "@/lib/snippets";

type SnippetItem = Omit<CodeSnippet, "source" | "toc"> & {
  searchText: string;
  preview: ReactNode;
};

export function SnippetExplorer({ snippets }: { snippets: SnippetItem[] }) {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("");
  const [tag, setTag] = useState("");
  const languages = [...new Set(snippets.map((snippet) => snippet.language))].sort();
  const tags = [...new Set(snippets.flatMap((snippet) => snippet.tags))].sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const visible = snippets.filter((snippet) => {
    const text = [snippet.title, snippet.description, getSnippetCategory(snippet), snippet.language, ...snippet.tags, snippet.searchText].join(" ").toLowerCase();
    return (!language || snippet.language === language)
      && (!tag || snippet.tags.includes(tag))
      && terms.every((term) => text.includes(term));
  });
  const groups = groupSnippets(visible);
  const filtered = Boolean(query || language || tag);

  function reset() {
    setQuery("");
    setLanguage("");
    setTag("");
  }

  return (
    <section aria-label="速查列表" className="mt-8">
      <div className="grid gap-3 border-b border-[var(--outline)] pb-5 sm:grid-cols-[minmax(0,1fr)_140px_180px]">
        <div className="relative">
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-3 text-[var(--muted)]" size={16} />
          <Input aria-label="搜索速查" className="h-10 pl-9 pr-10" onChange={(event) => setQuery(event.target.value)} placeholder="搜索任务、代码或关键字" type="search" value={query} />
          {query ? (
            <button aria-label="清空搜索" className="focus-ring absolute right-1 top-1 flex size-8 items-center justify-center rounded-md text-[var(--muted)] hover:bg-[var(--surface-low)]" onClick={() => setQuery("")} title="清空搜索" type="button">
              <X size={15} />
            </button>
          ) : null}
        </div>
        <select aria-label="按语言筛选" className="focus-ring h-10 min-w-0 rounded-md border border-[var(--outline)] bg-[var(--surface)] px-3 text-sm" onChange={(event) => setLanguage(event.target.value)} value={language}>
          <option value="">全部语言</option>
          {languages.map((item) => <option key={item} value={item}>{item.toUpperCase()}</option>)}
        </select>
        <select aria-label="按主题筛选" className="focus-ring h-10 min-w-0 rounded-md border border-[var(--outline)] bg-[var(--surface)] px-3 text-sm" onChange={(event) => setTag(event.target.value)} value={tag}>
          <option value="">全部主题</option>
          {tags.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>

      <div className="flex min-h-14 items-center justify-between gap-4 text-xs text-[var(--muted)]">
        <p aria-live="polite">{filtered ? `${visible.length} / ${snippets.length} 条` : `${snippets.length} 条速查`}</p>
        {filtered ? <button className="focus-ring inline-flex items-center gap-1 rounded px-2 py-1 hover:text-[var(--primary)]" onClick={reset} type="button"><X size={13} />重置筛选</button> : null}
      </div>

      {visible.length > 0 ? (
        <div className="border-t border-[var(--outline)]">
          {groups.map(({ category, items }) => (
            <section aria-label={`${category}速查`} className="border-b border-[var(--outline)]" key={category}>
              <div className="flex items-baseline justify-between gap-3 border-b border-[var(--outline)] py-4">
                <h2 className="text-base font-semibold text-[var(--primary)]">{category}</h2>
                <span className="text-xs tabular-nums text-[var(--muted)]">{items.length} 条</span>
              </div>
              <div className="divide-y divide-[var(--outline)]">
                {items.map((snippet) => (
                  <article className="scroll-mt-24 py-6" id={`snippet-${snippet.slug}`} key={snippet.slug}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="break-words text-xl font-semibold leading-7">
                          <Link className="focus-ring hover:text-[var(--primary)]" href={`/snippets/${snippet.slug}`}>{snippet.title}</Link>
                        </h3>
                        {snippet.description ? <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{snippet.description}</p> : null}
                      </div>
                      <Link aria-label={`查看详情：${snippet.title}`} className="focus-ring flex size-9 shrink-0 items-center justify-center rounded-md text-[var(--primary)] hover:bg-[var(--surface-low)]" href={`/snippets/${snippet.slug}`} title="查看详情">
                        <ArrowRight size={18} />
                      </Link>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="tag teal">{snippet.language.toUpperCase()}</span>
                      {snippet.tags.filter((item) => item !== category).map((item) => <span className="tag" key={item}>{item}</span>)}
                    </div>
                    <details className="snippet-preview group mt-4">
                      <summary className="focus-ring inline-flex cursor-pointer list-none items-center gap-2 rounded py-1 text-xs text-[var(--muted)] hover:text-[var(--primary)]">
                        <ChevronDown className="shrink-0 transition-transform group-open:rotate-180" size={15} />代码预览
                      </summary>
                      <div className="prose-content snippet-prose min-w-0">{snippet.preview}</div>
                    </details>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="border-y border-dashed border-[var(--outline)] py-16 text-center">
          <Braces aria-hidden="true" className="mx-auto text-[var(--muted)]" size={28} />
          <p className="mt-4 font-medium">{snippets.length ? "没有匹配的速查" : "暂无速查内容"}</p>
          {filtered ? <button className="focus-ring mt-4 inline-flex items-center gap-2 rounded px-3 py-2 text-sm text-[var(--primary)]" onClick={reset} type="button"><X size={15} />重置筛选</button> : null}
        </div>
      )}
    </section>
  );
}
