import type { Metadata } from "next";
import { PostExplorer } from "@/components/post-explorer";
import { getPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "笔记 | Gin",
  description: "前端、Python、Java、数据库与 AI Agent 的技术笔记和工程实践。",
};

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <main className="container editorial-page archive-page" id="main-content">
      <header className="page-heading">
        <p className="section-kicker">Notes / 学习与实践</p>
        <h1>笔记</h1>
        <p>记录解决问题的过程，也记录还没想明白的部分。</p>
      </header>
      <PostExplorer posts={posts} title="全部笔记" />
    </main>
  );
}
