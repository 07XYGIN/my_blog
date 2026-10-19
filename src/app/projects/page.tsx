import type { Metadata } from "next";
import { ArrowDownRight, ArrowUpRight, BookOpen, CircleAlert, GitBranch, Lightbulb, Wrench } from "lucide-react";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getMdxComponents } from "@/components/mdx/mdx-blocks";
import { Badge } from "@/components/ui/badge";
import { mdxOptions } from "@/lib/mdx-options";
import { getPosts } from "@/lib/posts";
import { getProjects, type Project } from "@/lib/projects";

export const metadata: Metadata = {
  title: "项目 | Gin",
  description: "记录项目中的技术选择、踩坑过程和最终收获。",
};

export default async function ProjectsPage() {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);
  const postsBySlug = new Map(posts.map((post) => [post.slug, post]));
  const activeCount = projects.filter((project) => project.status === "ACTIVE").length;

  return (
    <main className="container section-pad">
      <header className="border-b border-[var(--outline)] pb-12 pt-8 md:grid md:grid-cols-[1fr_320px] md:items-end md:gap-12 md:pb-16 md:pt-14">
        <div>
          <p className="eyebrow">Projects / Build, break, learn</p>
          <h1 className="mt-5 text-[clamp(3.5rem,10vw,7.5rem)] font-semibold leading-[0.88] tracking-[-0.07em]">项目</h1>
        </div>
        <div className="mt-8 md:mt-0">
          <p className="text-lg leading-8 text-[var(--muted)]">不只陈列结果，也记录实现过程中做过的选择、遇到的问题，以及下一次可以复用的经验。</p>
          <div className="meta mt-6 flex gap-8 text-xs text-[var(--muted)]">
            <span><strong className="mr-2 text-2xl text-[var(--text)]">{projects.length}</strong>项目</span>
            <span><strong className="mr-2 text-2xl text-[var(--text)]">{activeCount}</strong>进行中</span>
          </div>
        </div>
      </header>

      <nav aria-label="项目索引" className="grid grid-cols-2 border-b border-[var(--outline)] lg:grid-cols-5">
        {projects.map((project) => (
          <a className="focus-ring group flex min-h-24 items-end justify-between gap-3 border-[var(--outline)] px-4 py-5 transition-colors hover:bg-[var(--surface-low)] sm:border-r" href={`#${project.slug}`} key={project.slug}>
            <span><span className="meta block text-[10px] text-[var(--muted)]">{String(project.order).padStart(2, "0")}</span><span className="mt-2 block font-semibold">{project.title}</span></span>
            <ArrowDownRight className="shrink-0 text-[var(--muted)] transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" size={17} />
          </a>
        ))}
      </nav>

      <section aria-label="项目复盘">
        {projects.map((project) => <ProjectSection key={project.slug} postsBySlug={postsBySlug} project={project} />)}
      </section>
    </main>
  );
}

async function ProjectSection({ project, postsBySlug }: { project: Project; postsBySlug: Map<string, Awaited<ReturnType<typeof getPosts>>[number]> }) {
  const decision = await MDXRemote({ source: project.source, options: { mdxOptions }, components: getMdxComponents(new Map()) });
  const statusVariant = project.status === "ACTIVE" ? "teal" : project.status === "SHIPPED" ? "default" : "outline";
  const relatedPosts = project.relatedPosts.flatMap((slug) => {
    const post = postsBySlug.get(slug);
    return post ? [post] : [];
  });

  return (
    <article className="scroll-mt-24 border-b border-[var(--outline)] py-12 md:py-20" id={project.slug}>
      <div className="grid gap-8 md:grid-cols-[180px_minmax(0,1fr)] md:gap-12">
        <div>
          <span className="meta text-4xl font-semibold text-[var(--outline)]">{String(project.order).padStart(2, "0")}</span>
          <div className="mt-4"><Badge variant={statusVariant}>{project.status}</Badge></div>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <h2 className="text-3xl font-semibold md:text-5xl">{project.title}</h2>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted)]">{project.summary}</p>
            </div>
            <a aria-label={`查看 ${project.title} 源码`} className="focus-ring inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[var(--outline)] text-[var(--muted)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]" href={project.links.source} rel="noreferrer" target="_blank"><ArrowUpRight size={20} /></a>
          </div>

          <div className="mt-7 flex flex-wrap gap-2">{project.stack.map((item) => <Badge key={item} variant="outline">{item}</Badge>)}</div>

          {project.insights ? (
            <div className="mt-10 grid border-y border-[var(--outline)] md:grid-cols-3 md:divide-x md:divide-[var(--outline)]">
              <Insight icon={<Wrench size={18} />} label="技术选择" text={project.insights.choice} />
              <Insight icon={<CircleAlert size={18} />} label="踩坑" text={project.insights.pitfall} />
              <Insight icon={<Lightbulb size={18} />} label="收获" text={project.insights.takeaway} />
            </div>
          ) : (
            <div className="mt-10 max-w-3xl border-l-2 border-[var(--primary)] pl-5 md:pl-6">
              <p className="eyebrow flex items-center gap-2"><Wrench size={14} />技术选择</p>
              <div className="prose-content mt-3 text-[15px] leading-7">{decision}</div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <a className="focus-ring inline-flex items-center gap-2 font-medium hover:text-[var(--primary)]" href={project.links.source} rel="noreferrer" target="_blank"><GitBranch size={16} />源码<ArrowUpRight size={14} /></a>
            {project.links.demo ? <a className="focus-ring inline-flex items-center gap-2 font-medium hover:text-[var(--primary)]" href={project.links.demo} rel="noreferrer" target="_blank">在线预览<ArrowUpRight size={14} /></a> : null}
            {relatedPosts.map((post) => <Link className="focus-ring inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--primary)]" href={`/blog/${post.slug}`} key={post.slug}><BookOpen size={15} />{post.title}</Link>)}
          </div>
        </div>
      </div>
    </article>
  );
}

function Insight({ icon, label, text }: { icon: React.ReactNode; label: string; text: string }) {
  return (
    <section className="border-b border-[var(--outline)] py-6 last:border-b-0 md:border-b-0 md:px-6 md:first:pl-0 md:last:pr-0">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">{icon}{label}</h3>
      <p className="mt-4 text-[15px] leading-7 text-[var(--muted)]">{text}</p>
    </section>
  );
}
