import { ArrowDown, Code2, Layers3 } from "lucide-react";
import Link from "next/link";
import { PostExplorer } from "@/components/post-explorer";
import { Button } from "@/components/ui/button";
import { getPosts } from "@/lib/posts";

export default async function Home() {
  const posts = await getPosts();

  return (
    <main className="container section-pad">
      <section className="relative overflow-hidden border-b border-[var(--outline)] pb-16 pt-10 md:pb-24 md:pt-20">
        <div aria-hidden className="hero-orbit" />
        <p className="eyebrow">Developer · Builder · Learner</p>
        <h1 className="relative mt-5 max-w-4xl text-[clamp(3.5rem,10vw,7.75rem)] font-semibold leading-[0.88] tracking-[-0.075em]">
          Gin<span className="text-[var(--primary)]">.</span>
        </h1>
        <div className="relative mt-9 flex flex-wrap gap-3">
          <Button asChild><a href="https://github.com/07XYGIN" rel="noreferrer" target="_blank"><Code2 size={17} />GitHub</a></Button>
          <Button asChild variant="outline"><Link href="/about"><Layers3 size={17} />查看项目</Link></Button>
          <Button asChild variant="ghost"><a href="#posts-heading"><ArrowDown size={17} />阅读笔记</a></Button>
        </div>
      </section>
      <PostExplorer posts={posts} />
    </main>
  );
}
