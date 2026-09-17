import type { Metadata } from "next";
import { ArrowUpRight, BookOpen, GitBranch } from "lucide-react";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getMdxComponents } from "@/components/mdx/mdx-blocks";
import { Badge } from "@/components/ui/badge";
import { mdxOptions } from "@/lib/mdx-options";
import { getPosts } from "@/lib/posts";
import { getProjects, type Project } from "@/lib/projects";

export const metadata: Metadata = {
  title: "项目 | Gin",
  description: "记录正在构建、已经交付和暂时归档的个人项目，以及其中的技术决策。",
};

export default async function ProjectsPage() {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);
  const postsBySlug = new Map(posts.map((post) => [post.slug, post]));

  return (
    <main className="container section-pad">
      <header className="border-b border-[var(--outline)] pb-14 pt-8 md:pb-20 md:pt-16">
        <p className="eyebrow">Projects / Work log</p>
        <h1 className="mt-5 text-[clamp(3.5rem,10vw,7.75rem)] font-semibold leading-[0.88] tracking-[-0.075em]">项目</h1>
        <p className="mt-8 max-w-xl text-lg leading-8 text-[var(--muted)]">把项目当作持续演化的记录，留下结果，也留下做选择时付出的代价。</p>
      </header>

      <section aria-label="项目列表" className="mt-12 md:mt-20">
        <div className="divide-y divide-[var(--outline)] border-y border-[var(--outline)]">
          {projects.map((project) => (
            <ProjectSection key={project.title} postsBySlug={postsBySlug} project={project} />
          ))}
        </div>
      </section>
    </main>
  );
}

async function ProjectSection({ project, postsBySlug }: { project: Project; postsBySlug: Map<string, Awaited<ReturnType<typeof getPosts>>[number]> }) {
  const decision = await MDXRemote({
    source: project.source,
    options: { mdxOptions },
    components: getMdxComponents(new Map()),
  });
  const statusVariant = project.status === "ACTIVE" ? "teal" : project.status === "SHIPPED" ? "default" : "outline";

  return (
    <article className="py-10 md:py-14">
      <div className="flex flex-wrap items-center gap-3">
        <span className="meta text-xs text-[var(--muted)]">{String(project.order).padStart(2, "0")}</span>
        <Badge variant={statusVariant}>{project.status}</Badge>
      </div>
      <div className="mt-5 flex flex-wrap items-start justify-between gap-5">
        <div>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] md:text-5xl">{project.title}</h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--muted)]">{project.summary}</p>
        </div>
        <GitBranch className="hidden text-[var(--muted)] sm:block" size={28} />
      </div>

      <div className="mt-7 flex flex-wrap gap-2">
        {project.stack.map((item) => <Badge key={item}>{item}</Badge>)}
      </div>

      <div className="mt-9 max-w-3xl border-l-2 border-[var(--primary)] pl-5 md:pl-6">
        <p className="eyebrow">Technical decision</p>
        <div className="prose-content mt-3 text-[15px] leading-7">{decision}</div>
      </div>

      <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[var(--outline)] pt-5 text-sm">
        <a className="focus-ring inline-flex items-center gap-2 font-medium text-[var(--text)] transition-colors hover:text-[var(--primary)]" href={project.links.source} rel="noreferrer" target="_blank">
          <GitBranch size={16} />Source<ArrowUpRight size={14} />
        </a>
        {project.links.demo ? (
          <a className="focus-ring inline-flex items-center gap-2 font-medium text-[var(--text)] transition-colors hover:text-[var(--primary)]" href={project.links.demo} rel="noreferrer" target="_blank">
            <ArrowUpRight size={16} />Demo<ArrowUpRight size={14} />
          </a>
        ) : null}
        {project.relatedPosts.length > 0 ? <span className="hidden h-4 w-px bg-[var(--outline)] sm:block" /> : null}
        {project.relatedPosts.map((slug) => {
          const post = postsBySlug.get(slug);
          return (
            <Link className="focus-ring inline-flex items-center gap-2 text-[var(--muted)] transition-colors hover:text-[var(--primary)]" href={`/blog/${slug}`} key={slug}>
              <BookOpen size={15} />{post?.title ?? slug}
            </Link>
          );
        })}
      </div>
    </article>
  );
}
