import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMdxComponents } from "@/components/mdx/mdx-blocks";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { mdxOptions } from "@/lib/mdx-options";
import { getPost, getPosts } from "@/lib/posts";

export async function generateStaticParams() {
  return (await getPosts()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = await getPost((await params).slug);
  return post ? { title: `${post.title} | Gin`, description: post.description } : {};
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([getPost(slug), getPosts()]);
  if (!post) notFound();

  const index = posts.findIndex((item) => item.slug === slug);
  const previous = posts[index + 1];
  const next = posts[index - 1];
  const headingCounts = new Map<string, number>();
  const content = await MDXRemote({
    source: post.source,
    options: {
      mdxOptions,
    },
    components: getMdxComponents(headingCounts),
  });

  return (
    <main className="container section-pad">
      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,760px)_240px] lg:justify-center">
        <article className="min-w-0">
          <Link className="focus-ring meta inline-flex items-center gap-2 text-xs text-[var(--muted)] hover:text-[var(--primary)]" href="/"><ArrowLeft size={15} />返回文章</Link>
          <header className="mt-8 border-b border-[var(--outline)] pb-10">
            <div className="flex flex-wrap gap-2"><Badge variant="outline">{post.category}</Badge>{post.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div>
            <h1 className="mt-6 text-[clamp(2.5rem,7vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.055em]">{post.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{post.description}</p>
            <div className="meta mt-8 flex flex-wrap gap-5 text-xs text-[var(--muted)]">
              <span className="inline-flex items-center gap-2 font-semibold text-[var(--text)]">{post.author}</span>
              <time className="inline-flex items-center gap-2"><CalendarDays size={15} />{post.date}</time>
              <span className="inline-flex items-center gap-2"><Clock3 size={15} />{post.readTime}</span>
            </div>
          </header>
          <div className="prose-content pt-4 text-[16px] leading-8">{content}</div>
          {(previous || next) && (
            <nav aria-label="相邻文章" className="mt-16 grid gap-4 border-t border-[var(--outline)] pt-8 sm:grid-cols-2">
              {previous ? <PostNav direction="previous" post={previous} /> : <span />}
              {next ? <PostNav direction="next" post={next} /> : <span />}
            </nav>
          )}
        </article>
        <aside className="sticky top-24 hidden lg:block">
          <Card className="p-5">
            <p className="eyebrow">文章目录</p>
            <nav className="mt-4 flex flex-col gap-1">
              {post.toc.map((item, itemIndex) => (
                <a className="focus-ring rounded-lg border-l-2 border-transparent py-2 pr-3 text-sm leading-5 text-[var(--muted)] transition hover:border-[var(--primary)] hover:bg-[var(--surface-low)] hover:text-[var(--text)]" href={`#${item.id}`} key={item.id} style={{ paddingLeft: `${Math.max(item.level - 1, 0) * 12 + 12}px` }}>
                  <span className="meta mr-2 text-[10px] text-[var(--primary)]">{String(itemIndex + 1).padStart(2, "0")}</span>{item.title}
                </a>
              ))}
            </nav>
          </Card>
        </aside>
      </div>
    </main>
  );
}

function PostNav({ direction, post }: { direction: "previous" | "next"; post: Awaited<ReturnType<typeof getPosts>>[number] }) {
  const previous = direction === "previous";
  return (
    <Link className={`focus-ring group rounded-2xl border border-[var(--outline)] p-5 transition hover:border-[var(--primary)] hover:bg-[var(--surface-low)] ${previous ? "text-left" : "text-right"}`} href={`/blog/${post.slug}`}>
      <span className={`meta flex items-center gap-2 text-[11px] text-[var(--muted)] ${previous ? "" : "justify-end"}`}>{previous ? <ArrowLeft size={14} /> : null}{previous ? "上一篇" : "下一篇"}{previous ? null : <ArrowRight size={14} />}</span>
      <span className="mt-2 block font-medium leading-6 text-[var(--text)] group-hover:text-[var(--primary)]">{post.title}</span>
    </Link>
  );
}
