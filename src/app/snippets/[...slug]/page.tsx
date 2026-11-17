import type { Metadata } from "next";
import { ArrowRight, BookOpen } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMdxComponents } from "@/components/mdx/mdx-blocks";
import { ReadingLayout } from "@/components/reading-layout";
import { mdxOptions } from "@/lib/mdx-options";
import { getCodeSnippet, getCodeSnippets } from "@/lib/snippets";

export const dynamicParams = false;
type SnippetPageProps = { params: Promise<{ slug: string[] }> };
export async function generateStaticParams() {
  return (await getCodeSnippets()).map((snippet) => ({
    slug: snippet.slug.split("/"),
  }));
}
export async function generateMetadata({
  params,
}: SnippetPageProps): Promise<Metadata> {
  const snippet = await getCodeSnippet((await params).slug.join("/"));
  if (!snippet) notFound();
  return {
    title: `${snippet.title} | 速查 | Gin`,
    description: snippet.description,
  };
}

export default async function SnippetPage({ params }: SnippetPageProps) {
  const slug = (await params).slug.join("/");
  const [snippet, snippets] = await Promise.all([
    getCodeSnippet(slug),
    getCodeSnippets(),
  ]);
  if (!snippet) notFound();
  const content = await MDXRemote({
    source: snippet.source,
    options: { mdxOptions },
    components: getMdxComponents(new Map()),
  });
  const related = snippets
    .filter(
      (item) =>
        item.slug !== slug &&
        item.tags.some((tag) => snippet.tags.includes(tag)),
    )
    .sort(
      (a, b) =>
        b.tags.filter((tag) => snippet.tags.includes(tag)).length -
        a.tags.filter((tag) => snippet.tags.includes(tag)).length,
    )
    .slice(0, 3);
  return (
    <ReadingLayout
      backHref={`/snippets#snippet-${slug}`}
      backLabel="返回速查"
      toc={snippet.toc}
      header={
        <>
          <div className="reading-tags">
            <span className="tag">{snippet.language.toUpperCase()}</span>
            {snippet.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <h1>{snippet.title}</h1>
          <p className="reading-description">{snippet.description}</p>
          <div className="reading-meta">
            {snippet.date ? (
              <time dateTime={snippet.date}>{snippet.date}</time>
            ) : null}
            {snippet.originHref ? (
              <Link className="focus-ring" href={snippet.originHref}>
                <BookOpen size={14} />
                {snippet.originTitle ?? "来源笔记"}
              </Link>
            ) : null}
          </div>
        </>
      }
      footer={
        related.length ? (
          <nav aria-label="相关速查" className="related-reading">
            <h2>相关速查</h2>
            {related.map((item) => (
              <Link
                className="related-link focus-ring"
                href={`/snippets/${item.slug}`}
                key={item.slug}
              >
                <span>{item.title}</span>
                <ArrowRight size={16} />
              </Link>
            ))}
          </nav>
        ) : null
      }
    >
      {content}
    </ReadingLayout>
  );
}
