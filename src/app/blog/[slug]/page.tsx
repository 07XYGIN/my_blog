import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMdxComponents } from "@/components/mdx/mdx-blocks";
import { PostList } from "@/components/post-list";
import { ReadingLayout } from "@/components/reading-layout";
import { mdxOptions } from "@/lib/mdx-options";
import { getPost, getPosts } from "@/lib/posts";

export const dynamicParams = false;
export async function generateStaticParams() {
  return (await getPosts()).map((post) => ({ slug: post.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const post = await getPost((await params).slug);
  return post
    ? { title: `${post.title} | Gin`, description: post.description }
    : {};
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([getPost(slug), getPosts()]);
  if (!post) notFound();
  const index = posts.findIndex((item) => item.slug === slug);
  const previous = posts[index + 1];
  const next = posts[index - 1];
  const related = posts
    .filter((item) => item.slug !== slug && item.category === post.category)
    .slice(0, 2);
  const content = await MDXRemote({
    source: post.source,
    options: { mdxOptions, blockJS: false },
    components: getMdxComponents(new Map()),
  });
  return (
    <ReadingLayout
      backHref="/blog"
      backLabel="全部笔记"
      toc={post.toc}
      header={
        <>
          <div className="reading-tags">
            <span className="tag">{post.category}</span>
            {post.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <h1>{post.title}</h1>
          <p className="reading-description">{post.description}</p>
          <div className="reading-meta">
            <span>{post.author}</span>
            <time dateTime={post.date}>{post.date}</time>
            {post.readTime ? <span>{post.readTime}</span> : null}
          </div>
        </>
      }
      footer={
        <>
          {related.length ? (
            <section className="related-reading">
              <h2>继续阅读</h2>
              <PostList posts={related} />
            </section>
          ) : null}
          {previous || next ? (
            <nav aria-label="相邻文章" className="adjacent-posts">
              {previous ? (
                <Link className="focus-ring" href={`/blog/${previous.slug}`}>
                  <span>
                    <ArrowLeft size={14} />
                    上一篇
                  </span>
                  <strong>{previous.title}</strong>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link className="focus-ring" href={`/blog/${next.slug}`}>
                  <span>
                    下一篇
                    <ArrowRight size={14} />
                  </span>
                  <strong>{next.title}</strong>
                </Link>
              ) : null}
            </nav>
          ) : null}
        </>
      }
    >
      {content}
    </ReadingLayout>
  );
}
