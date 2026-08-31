import { ArrowUpRight, Bot, Braces, Code2, Database, GitBranch, Layers3, Mail, NotebookTabs, Server, Sparkles, TerminalSquare } from "lucide-react";
import { AboutHeroTitle } from "@/components/about-hero-title";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPosts } from "@/lib/posts";
import { getCodeSnippets } from "@/lib/snippets";

const stack = [
  { title: "前端", icon: <Code2 size={19} />, items: ["React", "Next.js", "Vue", "TypeScript"] },
  { title: "服务端", icon: <Server size={19} />, items: ["FastAPI", "Python", "Java", "Spring Boot","PostgreSQL","Mysql", "Redis",] },
  { title: "Agent", icon: <Bot size={19} />, items: ["LangGraph", "LangChain"] },
];

const projects = [
  {
    name: "Aura",
    label: "AI Companion",
    description: "围绕实时对话、长期记忆、情绪感知和多端体验构建的 AI 陪伴项目。后端以 FastAPI 和 LangGraph 为主，客户端覆盖 Next.js 和 Vue。",
    href: "https://github.com/07XYGIN/Aura",
    icon: <Sparkles size={24} />,
    tags: ["FastAPI", "LangGraph", "Next.js", "Vue"],
  },
  {
    name: "Templates",
    label: "Project Starters",
    description: "面向 Java 和 Python 后端的个人项目脚手架集合，沉淀 Spring Boot、FastAPI、统一响应、异常处理和常用基础设施。",
    href: "https://github.com/07XYGIN/templates",
    icon: <Layers3 size={24} />,
    tags: ["Java", "Spring Boot", "Python", "FastAPI"],
  },
];

export default async function AboutPage() {
  const [posts, snippets] = await Promise.all([getPosts(), getCodeSnippets()]);
  const categories = new Set(posts.map((post) => post.category));
  const languages = new Set(snippets.map((snippet) => snippet.language));

  return (
    <main className="container section-pad">
      <header className="relative overflow-hidden border-b border-[var(--outline)] pb-14 pt-8 md:pb-20 md:pt-16">
        <div aria-hidden className="about-grid" />
        <p className="eyebrow">About / Gin</p>
        <div className="relative mt-5 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
          <div>
            <AboutHeroTitle />
            <div className="mt-4 flex flex-wrap gap-3">
              <Button asChild><a href="https://github.com/07XYGIN" rel="noreferrer" target="_blank"><Code2 size={17} />GitHub</a></Button>
            </div>
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--muted)]">
              <Mail size={16} className="text-[var(--primary)]" />
              <a className="transition-colors hover:text-[var(--primary)]" href="mailto:xygin0708@163.com">xygin0708@163.com</a>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--outline)] bg-[var(--outline)]">
            <Metric icon={<NotebookTabs size={18} />} label="笔记" value={posts.length} />
            <Metric icon={<TerminalSquare size={18} />} label="代码片段" value={snippets.length} />
            <Metric icon={<Database size={18} />} label="分类" value={categories.size} />
            <Metric icon={<Braces size={18} />} label="语言" value={languages.size} />
          </div>
        </div>
      </header>

      <section className="mt-16 md:mt-24">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <div>
            <p className="eyebrow">Technical stack</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">常用技术栈</h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-[var(--outline)] bg-[var(--outline)] sm:grid-cols-3">
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
        <div className="flex items-end justify-between border-b border-[var(--outline)] pb-6">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">项目</h2>
          </div>
          <GitBranch className="hidden text-[var(--muted)] sm:block" size={28} />
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {projects.map((project) => (
            <a className="focus-ring group block rounded-2xl" href={project.href} key={project.name} rel="noreferrer" target="_blank">
              <Card className="relative h-full min-h-[320px] overflow-hidden p-7 transition duration-300 group-hover:-translate-y-1 group-hover:border-[var(--primary)] md:p-9">
                <div className="flex h-full flex-col justify-between">
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
    </main>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="bg-[var(--surface)] p-5 text-center">
      <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">{icon}</div>
      <div className="mt-3 text-3xl font-semibold text-[var(--text)]">{value}</div>
      <div className="meta mt-1 text-[11px] text-[var(--muted)]">{label}</div>
    </div>
  );
}
