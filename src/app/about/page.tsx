import { ArrowUpRight, Bot, Code2, GitBranch, Mail, NotebookTabs, Server } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPosts } from "@/lib/posts";
import { getProjects, type Project, type ProjectStatus } from "@/lib/projects";

const statusLabel: Record<ProjectStatus, string> = {
  ACTIVE: "进行中",
  SHIPPED: "已交付",
  ARCHIVED: "已归档",
};

const directions = [
  {
    title: "Web 工程",
    icon: <Code2 size={19} />,
    description: "从组件到页面，构建博客、管理端和客户端应用。",
    items: ["React", "Next.js", "Vue", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "后端与数据",
    icon: <Server size={19} />,
    description: "接口设计、数据建模、持久化与缓存。",
    items: ["Python", "FastAPI", "Java", "Spring Boot", "PostgreSQL", "MySQL", "Redis", "SQLAlchemy"],
  },
  {
    title: "AI 应用与 Agent",
    icon: <Bot size={19} />,
    description: "围绕长期记忆、工具调用与流式响应。",
    items: ["LangGraph", "LangChain", "pgvector"],
  },
];

export default async function AboutPage() {
  const [posts, projects] = await Promise.all([getPosts(), getProjects()]);
  const featured = projects.filter((project) => project.title === "Aura" || project.title === "Templates");

  return (
    <main className="container section-pad">
      <header className="relative overflow-hidden border-b border-[var(--outline)] pb-14 pt-8 md:pb-20 md:pt-16">
        <div aria-hidden className="about-grid" />
        <p className="eyebrow">About / Gin</p>
        <h1 className="relative mt-4 max-w-3xl text-[clamp(2.75rem,8vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.06em]">
          关于<span className="text-[var(--primary)]">我</span>
        </h1>
        <p className="relative mt-6 max-w-2xl text-base leading-8 text-[var(--muted)]">
          我是 Gin，前端开发。主要写前端工程实践和踩坑，也会记录 Python、Java、AI Agent 的学习笔记。
        </p>
        <div className="relative mt-8 flex flex-wrap items-center gap-3">
          <Button asChild><a href="https://github.com/07XYGIN" rel="noreferrer" target="_blank"><Code2 size={17} />GitHub</a></Button>
          <a className="focus-ring inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--surface-container)] hover:text-[var(--primary)]" href="mailto:xygin0708@163.com"><Mail size={16} />xygin0708@163.com</a>
        </div>
        <div className="relative mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-[var(--outline)] pt-6 text-sm text-[var(--muted)]">
          <span className="inline-flex items-center gap-2"><NotebookTabs size={16} className="text-[var(--primary)]" /><span className="font-semibold text-[var(--text)]">{posts.length}</span> 篇笔记</span>
          <span className="inline-flex items-center gap-2"><GitBranch size={16} className="text-[var(--primary)]" /><span className="font-semibold text-[var(--text)]">{projects.length}</span> 个项目</span>
        </div>
      </header>

      <section className="mt-16 md:mt-24">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <div>
            <p className="eyebrow">Focus</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">技术方向</h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-[var(--outline)] bg-[var(--outline)] sm:grid-cols-3">
            {directions.map((group) => (
              <div className="bg-[var(--surface)] p-6 md:p-7" key={group.title}>
                <div className="flex items-center gap-3 text-[var(--primary)]">{group.icon}<h3 className="text-lg font-semibold text-[var(--text)]">{group.title}</h3></div>
                <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{group.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">{group.items.map((item) => <Badge key={item} variant="outline">{item}</Badge>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-20 md:mt-28">
        <div className="flex items-end justify-between border-b border-[var(--outline)] pb-6">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">项目</h2>
          </div>
          <Link className="focus-ring inline-flex items-center gap-1.5 text-sm text-[var(--muted)] transition-colors hover:text-[var(--primary)]" href="/projects">查看全部<ArrowUpRight size={15} /></Link>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {featured.map((project) => <ProjectCard key={project.title} project={project} />)}
        </div>
      </section>
    </main>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const statusVariant = project.status === "ACTIVE" ? "teal" : project.status === "SHIPPED" ? "default" : "outline";
  return (
    <a className="focus-ring group block h-full rounded-2xl" href={project.links.source} rel="noreferrer" target="_blank">
      <Card className="relative h-full overflow-hidden p-7 transition duration-300 group-hover:-translate-y-1 group-hover:border-[var(--primary)] md:p-8">
        <div className="flex h-full flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4">
              <Badge variant={statusVariant}>{statusLabel[project.status]}</Badge>
              <ArrowUpRight className="text-[var(--muted)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--primary)]" size={19} />
            </div>
            <h3 className="mt-5 text-3xl font-semibold tracking-tight">{project.title}</h3>
            <p className="mt-4 leading-7 text-[var(--muted)]">{project.summary}</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">{project.stack.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}</div>
        </div>
      </Card>
    </a>
  );
}
