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
  const items = await Promise.all(
    snippets.map(async (snippet) => ({
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
        options: {
          mdxOptions: {
            ...mdxOptions,
            remarkPlugins: [
              remarkSnippetPreview,
              ...(mdxOptions.remarkPlugins ?? []),
            ],
          },
        },
        components: getMdxComponents(new Map()),
      }),
    })),
  );

  return (
    <main className="container editorial-page" id="main-content">
      <header className="page-heading">
        <p className="section-kicker">Reference / 随用随查</p>
        <h1>速查</h1>
        <p>常用命令、代码和配置，按要解决的任务整理。</p>
      </header>
      <SnippetExplorer snippets={items} />
    </main>
  );
}
