import { ArrowUpRight, Bot, Braces, Code2, Database, Layers3, Server, Sparkles, Workflow } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const stack = [
  { title: "Web", icon: <Code2 size={19} />, items: ["React 19", "Next.js 16", "Vue 3", "TypeScript", "Tailwind CSS"] },
  { title: "Backend", icon: <Server size={19} />, items: ["FastAPI", "Python", "Java", "Spring Boot", "SSE"] },
  { title: "AI & Data", icon: <Bot size={19} />, items: ["LangGraph", "LangChain", "PostgreSQL", "pgvector", "Redis"] },
  { title: "Workflow", icon: <Workflow size={19} />, items: ["pnpm", "GitHub Actions", "Docker", "Vercel", "uv"] },
];

const projects = [
  {
    name: "Aura",
    label: "AI Companion",
    description: "围绕实时对话、长期记忆、情绪感知和多端体验构建的 AI 陪伴聊天项目。后端以 FastAPI 与 LangGraph 为主，客户端覆盖 Next.js、Vue 和 Flutter。",
    href: "https://github.com/07XYGIN/Aura",
    icon: <Sparkles size={24} />,
    tags: ["FastAPI", "LangGraph", "Next.js", "Flutter"],
  },
  {
    name: "Templates",
    label: "Project Starters",
    description: "面向 Java 与 Python 后端的个人项目脚手架合集，当前包含 Spring Boot 和 FastAPI 基础模板，用来减少重复搭建时间。",
    href: "https://github.com/07XYGIN/templates",
    icon: <Layers3 size={24} />,
    tags: ["Java 21", "Spring Boot", "Python", "FastAPI"],
  },
];

export default function AboutPage() {
  return (
    <main className="container section-pad">
      <header className="relative overflow-hidden border-b border-[var(--outline)] pb-14 pt-8 md:pb-20 md:pt-16">
        <div aria-hidden className="about-grid" />
        <p className="eyebrow">About / Gin</p>
        <div className="relative mt-5 grid gap-10 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <h1 className="max-w-4xl text-[clamp(3rem,8vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.065em]">把想法做成<br /><span className="text-[var(--primary)]">可以运行的产品。</span></h1>
          </div>
          <div className="border-l border-[var(--outline)] pl-6">
            <p className="text-lg leading-8 text-[var(--muted)]">Gin，关注 Web、后端与 Agent 工程。这个站点用于沉淀学习笔记，并展示正在持续迭代的开源项目。</p>
            <Button asChild className="mt-6"><a href="https://github.com/07XYGIN" rel="noreferrer" target="_blank"><Code2 size={17} />查看 GitHub</a></Button>
          </div>
        </div>
      </header>

      <section className="mt-16 md:mt-24">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <div><p className="eyebrow">Technical stack</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">技术栈</h2></div>
          <div className="grid gap-px overflow-hidden rounded-[20px] border border-[var(--outline)] bg-[var(--outline)] sm:grid-cols-2">
            {stack.map((group) => (
              <div className="bg-[var(--surface)] p-6 md:p-7" key={group.title}>
                <div className="flex items-center gap-3 text-[var(--primary)]">{group.icon}<h3 className="text-lg font-semibold text-[var(--text)]">{group.title}</h3></div>
                <div className="mt-5 flex flex-wrap gap-2">{group.items.map((item) => <Badge key={item} variant="outline">{item}</Badge>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-20 md:mt-28">
        <div className="flex items-end justify-between border-b border-[var(--outline)] pb-6"><div><p className="eyebrow">Selected work</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">开源项目</h2></div><Braces className="hidden text-[var(--muted)] sm:block" size={28} /></div>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {projects.map((project, index) => (
            <a className="focus-ring group block rounded-[20px]" href={project.href} key={project.name} rel="noreferrer" target="_blank">
              <Card className="relative h-full min-h-[340px] overflow-hidden p-7 transition duration-300 group-hover:-translate-y-1 group-hover:border-[var(--primary)] md:p-9">
                <span className="meta absolute right-7 top-6 text-5xl font-semibold text-[var(--surface-container)]">0{index + 1}</span>
                <div className="relative flex h-full flex-col justify-between">
                  <div>
                    <span className="inline-flex rounded-xl bg-[var(--primary-soft)] p-3 text-[var(--primary)]">{project.icon}</span>
                    <p className="eyebrow mt-8">{project.label}</p>
                    <h3 className="mt-2 flex items-center gap-2 text-3xl font-semibold">{project.name}<ArrowUpRight className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" size={22} /></h3>
                    <p className="mt-4 max-w-xl leading-7 text-[var(--muted)]">{project.description}</p>
                  </div>
                  <div className="mt-8 flex flex-wrap gap-2">{project.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div>
                </div>
              </Card>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-20 rounded-[20px] border border-[var(--outline)] bg-[var(--surface-low)] px-6 py-10 md:px-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between"><div><p className="eyebrow">Currently exploring</p><h2 className="mt-2 text-2xl font-semibold">Agent 工作流、长期记忆与跨端产品体验</h2></div><div className="flex gap-3 text-[var(--primary)]"><Bot size={24} /><Database size={24} /><Workflow size={24} /></div></div>
      </section>
    </main>
  );
}
