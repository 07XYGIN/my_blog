"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { categories, type Post } from "@/lib/post-types";

export function PostExplorer({ posts }: { posts: Post[] }) {
  const [active, setActive] = useState<(typeof categories)[number]>("全部");
  const visiblePosts = active === "全部" ? posts : posts.filter((post) => post.category === active);

  return (
    <section aria-labelledby="posts-heading" className="mt-20">
      <div className="flex flex-col gap-6 border-b border-[var(--outline)] pb-7 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Notes / {String(visiblePosts.length).padStart(2, "0")}</p>
          <h2 id="posts-heading" className="mt-2 text-3xl font-semibold tracking-[-0.03em] md:text-4xl">技术笔记</h2>
        </div>
        <div aria-label="文章分类" className="flex flex-wrap gap-2" role="group">
          {categories.map((category) => (
            <Button
              aria-pressed={active === category}
              className="h-9 rounded-full px-4 font-meta text-xs"
              key={category}
              onClick={() => setActive(category)}
              type="button"
              variant={active === category ? "default" : "outline"}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <motion.div layout className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {visiblePosts.map((post) => (
            <motion.article
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              initial={{ opacity: 0, y: 12 }}
              key={post.slug}
              layout
              transition={{ duration: 0.22 }}
            >
              <Link className="focus-ring group block h-full rounded-[18px]" href={`/blog/${post.slug}`}>
                <Card className="flex h-full min-h-72 flex-col justify-between overflow-hidden p-6 transition duration-300 group-hover:-translate-y-1 group-hover:border-[var(--primary)] group-hover:shadow-[0_18px_50px_rgba(36,42,66,.11)] md:p-7">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-4">
                      <Badge variant="outline">{post.category}</Badge>
                      <ArrowUpRight className="text-[var(--muted)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--primary)]" size={19} />
                    </div>
                    <CardTitle className="mt-5 text-2xl leading-tight">{post.title}</CardTitle>
                    <CardDescription className="mt-2 line-clamp-3 text-[15px] leading-7">{post.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-7">
                    <div className="mb-5 flex flex-wrap gap-2">{post.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div>
                    <div className="meta flex items-center justify-between border-t border-[var(--outline)] pt-4 text-xs text-[var(--muted)]">
                      <time>{post.date}</time><span>{post.readTime}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
