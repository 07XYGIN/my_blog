import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getMdxComponents } from "@/components/mdx/mdx-blocks";
import { SnippetExplorer } from "@/components/snippet-explorer";
import { stripMdxForSearch } from "@/lib/mdx-content";
import { mdxOptions } from "@/lib/mdx-options";
import { remarkSnippetPreview } from "@/lib/remark-snippet-preview";
import { getCodeSnippets } from "@/lib/snippets";

export const metadata: Metadata = {
  title: "速查 | Gin",
  description: "按任务整理的代码、命令和配置，以及完整示例与使用说明。",
};

export default async function SnippetsPage() {
  const snippets = await getCodeSnippets();
  const items = await Promise.all(snippets.map(async (snippet) => ({
    slug: snippet.slug,
    title: snippet.title,
    description: snippet.description,
    category: snippet.category,
    language: snippet.language,
    tags: snippet.tags,
    date: snippet.date,
    originTitle: snippet.originTitle,
    originHref: snippet.originHref,
    searchText: stripMdxForSearch(snippet.source),
    preview: await MDXRemote({
      source: snippet.source,
      options: { mdxOptions: { ...mdxOptions, remarkPlugins: [remarkSnippetPreview, ...(mdxOptions.remarkPlugins ?? [])] } },
      components: getMdxComponents(new Map()),
    }),
  })));

  return (
    <main className="container section-pad">
      <header className="border-b border-[var(--outline)] pb-7">
        <p className="eyebrow">Snippets</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight">速查</h1>
      </header>
      <SnippetExplorer snippets={items} />
    </main>
  );
}
