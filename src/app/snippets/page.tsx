import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getMdxComponents } from "@/components/mdx/mdx-blocks";
import { mdxOptions } from "@/lib/mdx-options";
import { getCodeSnippets } from "@/lib/snippets";

export const metadata: Metadata = {
  title: "代码片段 | Gin",
};

export default async function SnippetsPage() {
  const snippets = await getCodeSnippets();
  const renderedSnippets = await Promise.all(snippets.map(async (snippet) => {
    const headingCounts = new Map<string, number>();
    const content = await MDXRemote({
      source: snippet.source,
      options: { mdxOptions },
      components: getMdxComponents(headingCounts),
    });

    return { snippet, content };
  }));

  return (
    <main className="container section-pad">
      <header className="border-b border-[var(--outline)] pb-12 pt-8">
        <h1 className="mt-5 max-w-4xl text-[clamp(2.8rem,8vw,6rem)] font-semibold leading-[0.95] tracking-[-0.065em]">代码片段</h1>
      </header>
      {renderedSnippets.length > 0 ? (
        <section className="mt-10 columns-1 gap-5 lg:columns-2">
          {renderedSnippets.map(({ snippet, content }) => (
            <details className="snippet-card group mb-5 break-inside-avoid overflow-hidden rounded-2xl border border-[var(--outline)] bg-[var(--surface)]" key={snippet.slug} open>
              <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-4 border-b border-[var(--outline)] px-5 py-4 marker:hidden">
                <span className="min-w-0 text-base font-semibold leading-6 text-[var(--text)]">{snippet.title}</span>
                
              </summary>
              <div className="px-5 pb-5 pt-1">
                <div className="prose-content snippet-prose pt-1 text-[15px] leading-7">{content}</div>
              </div>
            </details>
          ))}
        </section>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-[var(--outline)] bg-[var(--surface)] px-6 py-14 text-center">
          <p className="font-medium text-[var(--text)]">暂无内容</p>
        </div>
      )}
    </main>
  );
}
