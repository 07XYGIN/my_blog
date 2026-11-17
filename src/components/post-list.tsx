import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Post } from "@/lib/post-types";
import { MotionArticle } from "@/components/motion-surface";

export function PostList({ posts }: { posts: Post[] }) {
  return (
    <div className="post-list">
      {posts.map((post, index) => (
        <MotionArticle className="post-row" index={index} key={post.slug}>
          <div className="post-row-meta">
            <span>{post.category}</span>
            <time dateTime={post.date}>{post.date.replaceAll("-", ".")}</time>
          </div>
          <h3>
            <Link className="focus-ring" href={`/blog/${post.slug}`}>
              {post.title}
              <ArrowUpRight aria-hidden size={18} />
            </Link>
          </h3>
          <p>{post.description}</p>
          <div className="post-row-tags">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </MotionArticle>
      ))}
    </div>
  );
}
