"use client";

import { Command, FileText, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { SearchDocument } from "@/lib/posts";

type SearchResult = SearchDocument & { score: number; excerpt: string };

export function KnowledgeSearch({ documents, compact = false }: { documents: SearchDocument[]; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const results = useMemo(() => searchDocuments(documents, query), [documents, query]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button aria-label="搜索笔记" className={compact ? "h-9 px-3 font-meta text-xs" : "h-10 font-meta text-xs"} type="button" variant="outline">
          <Search size={15} />
          <span className={compact ? "hidden lg:inline" : ""}>搜索</span>
          <span className="hidden rounded border border-[var(--outline)] px-1.5 py-0.5 text-[10px] text-[var(--muted)] lg:inline">Ctrl K</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="flex max-h-[min(760px,calc(100dvh-2rem))] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl" showCloseButton={false}>
        <DialogTitle className="sr-only">搜索笔记</DialogTitle>
        <DialogDescription className="sr-only">搜索文章标题、正文、标签和代码说明。</DialogDescription>
        <div className="flex items-center gap-3 border-b border-[var(--outline)] px-4 py-3">
          <Search className="shrink-0 text-[var(--muted)]" size={18} />
          <Input
            aria-label="搜索关键词"
            className="min-w-0 flex-1"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索标题、正文、标签、代码说明..."
            value={query}
          />
          <DialogClose asChild>
            <Button aria-label="关闭搜索" size="icon" title="关闭搜索" type="button" variant="ghost">
              <X size={18} />
            </Button>
          </DialogClose>
        </div>

        <div className="min-h-0 overflow-y-auto p-3">
          {results.length > 0 ? (
            <div className="grid gap-2">
              {results.map((result) => (
                <Link className="focus-ring group rounded-xl border border-transparent p-4 transition hover:border-[var(--outline)] hover:bg-[var(--surface-low)]" href={`/blog/${result.slug}`} key={result.slug} onClick={() => setOpen(false)}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="tag">{result.category}</span>
                    {result.tags.slice(0, 3).map((tag) => <span className="tag" key={tag}>{tag}</span>)}
                  </div>
                  <div className="mt-3 flex items-start gap-3">
                    <FileText className="mt-1 shrink-0 text-[var(--primary)]" size={18} />
                    <div className="min-w-0">
                      <h3 className="font-semibold leading-6 text-[var(--text)] group-hover:text-[var(--primary)]">{result.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--muted)]">{result.excerpt || result.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex min-h-60 flex-col items-center justify-center text-center">
              <Command className="text-[var(--muted)]" size={28} />
              <p className="mt-3 font-medium text-[var(--text)]">没有找到相关笔记</p>
              <p className="mt-1 text-sm text-[var(--muted)]">换一个关键词，或者搜技术名、函数名、错误信息。</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function searchDocuments(documents: SearchDocument[], query: string): SearchResult[] {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return documents.slice(0, 8).map((document) => ({ ...document, score: 1, excerpt: document.preview }));

  return documents
    .map((document) => {
      const title = document.title.toLowerCase();
      const description = document.description.toLowerCase();
      const category = document.category.toLowerCase();
      const tags = document.tags.join(" ").toLowerCase();
      const headings = document.headings.join(" ").toLowerCase();
      const text = document.text.toLowerCase();
      const score = terms.reduce((total, term) => {
        if (!term) return total;
        return total
          + (title.includes(term) ? 20 : 0)
          + (tags.includes(term) ? 14 : 0)
          + (category.includes(term) ? 10 : 0)
          + (headings.includes(term) ? 8 : 0)
          + (description.includes(term) ? 6 : 0)
          + (text.includes(term) ? 3 : 0);
      }, 0);
      return { ...document, score, excerpt: excerptFor(document.text, terms) || document.preview };
    })
    .filter((document) => document.score > 0)
    .sort((a, b) => b.score - a.score || b.date.localeCompare(a.date))
    .slice(0, 12);
}

function excerptFor(text: string, terms: string[]) {
  const lower = text.toLowerCase();
  const firstIndex = terms.map((term) => lower.indexOf(term)).filter((index) => index >= 0).sort((a, b) => a - b)[0];
  if (firstIndex === undefined) return "";
  const start = Math.max(0, firstIndex - 48);
  const end = Math.min(text.length, firstIndex + 118);
  return `${start > 0 ? "..." : ""}${text.slice(start, end)}${end < text.length ? "..." : ""}`;
}
