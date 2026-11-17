"use client";

import { useState } from "react";
import { PostList } from "@/components/post-list";
import { categories, type Post } from "@/lib/post-types";

export function PostExplorer({
  posts,
  title = "最新笔记",
}: {
  posts: Post[];
  title?: string;
}) {
  const [active, setActive] = useState<(typeof categories)[number]>("全部");
  const visible =
    active === "全部"
      ? posts
      : posts.filter((post) => post.category === active);
  const available = categories.filter(
    (category) =>
      category === "全部" || posts.some((post) => post.category === category),
  );

  return (
    <section aria-labelledby="posts-heading" className="post-explorer">
      <div className="section-heading">
        <h2 id="posts-heading">{title}</h2>
        <span className="quiet-count" aria-live="polite">
          {visible.length} 篇
        </span>
      </div>
      <div aria-label="文章分类" className="category-filter" role="group">
        {available.map((category) => (
          <button
            aria-pressed={active === category}
            className="focus-ring"
            key={category}
            onClick={() => setActive(category)}
            type="button"
          >
            {category}
          </button>
        ))}
      </div>
      {visible.length ? (
        <PostList key={active} posts={visible} />
      ) : (
        <div className="empty-state">
          <p>这个分类还没有笔记</p>
          <button
            className="text-link focus-ring"
            onClick={() => setActive("全部")}
            type="button"
          >
            查看全部笔记
          </button>
        </div>
      )}
    </section>
  );
}
