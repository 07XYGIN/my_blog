import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { GitHubIcon } from "@/components/github-icon";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getMdxComponents } from "@/components/mdx/mdx-blocks";
import { PostList } from "@/components/post-list";
import { ProjectStatusLabel } from "@/components/project-list";
import { ReadingLayout } from "@/components/reading-layout";
import { getProjects } from "@/lib/projects";
import { getPosts } from "@/lib/posts";
import { mdxOptions } from "@/lib/mdx-options";
import { tocFromSource } from "@/lib/mdx-content";

export const dynamicParams = false;
type ProjectPageProps = { params: Promise<{ slug: string }> };
export async function generateStaticParams() {
  return (await getProjects()).map((project) => ({ slug: project.slug }));
}
export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = (await getProjects()).find((item) => item.slug === slug);
  return project
    ? { title: `${project.title} | 项目 | Gin`, description: project.summary }
    : {};
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const related = project.relatedPosts.flatMap((postSlug) =>
    posts.filter((post) => post.slug === postSlug),
  );
  const content = await MDXRemote({
    source: project.source,
    options: { mdxOptions },
    components: getMdxComponents(new Map()),
  });
  const toc = [
    { id: "project-overview", title: "项目概览", level: 2 },
    { id: "project-decisions", title: "技术选择", level: 2 },
    ...tocFromSource(project.source),
    ...(project.insights
      ? [{ id: "project-lessons", title: "实践收获", level: 2 }]
      : []),
  ];
  return (
    <ReadingLayout
      backHref="/projects"
      backLabel="全部项目"
      toc={toc}
      header={
        <>
          <ProjectStatusLabel status={project.status} />
          <h1>{project.title}</h1>
          <p className="reading-description">{project.summary}</p>
          <div className="project-detail-links">
            <a
              className="text-link focus-ring"
              href={project.links.source}
              rel="noreferrer"
              target="_blank"
            >
              <GitHubIcon size={16} />
              GitHub 源码
              <ArrowUpRight size={14} />
            </a>
            {project.links.demo ? (
              <a
                className="text-link focus-ring"
                href={project.links.demo}
                rel="noreferrer"
                target="_blank"
              >
                <ExternalLink size={16} />
                在线预览
              </a>
            ) : null}
          </div>
        </>
      }
      footer={
        <>
          <section className="related-reading">
            <h2>相关笔记</h2>
            {related.length ? (
              <PostList posts={related} />
            ) : (
              <Link className="text-link focus-ring" href="/blog">
                浏览全部笔记
                <ArrowUpRight size={15} />
              </Link>
            )}
          </section>
        </>
      }
    >
      <h2 id="project-overview">项目概览</h2>
      <div className="project-stack">
        {project.stack.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <h2 id="project-decisions">技术选择</h2>
      {content}
      {project.insights ? (
        <section id="project-lessons">
          <h2>实践收获</h2>
          <dl className="project-lessons">
            <div>
              <dt>选择</dt>
              <dd>{project.insights.choice}</dd>
            </div>
            <div>
              <dt>踩坑</dt>
              <dd>{project.insights.pitfall}</dd>
            </div>
            <div>
              <dt>收获</dt>
              <dd>{project.insights.takeaway}</dd>
            </div>
          </dl>
        </section>
      ) : null}
    </ReadingLayout>
  );
}
