import { Bot, GitBranch, Layers3, Rocket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface ev{
  date:string
  title:string
  text:string
  type:string
}

const events:ev[] = [
  { date: "2026-08-10", title: "博客接入 Vercel CI/CD", text: "主分支推送自动执行 pnpm 安装、Lint、Next.js 构建与 Vercel 生产部署。", type: "my_blog", icon: <Rocket size={18} /> },
  { date: "2026-08-06", title: "Aura 多端与 Agent 架构持续更新", text: "项目主线包含 FastAPI、LangGraph、Next.js、Vue 与 Flutter，并围绕对话、记忆和多端体验迭代。", type: "Aura", icon: <Bot size={18} /> },
  { date: "2026-07-08", title: "Templates 仓库创建", text: "开始整理 Spring Boot 与 FastAPI 的基础工程模板，复用统一响应、异常处理和常用基础设施。", type: "templates", icon: <Layers3 size={18} /> },
  { date: "2025-12-25", title: "Aura 仓库创建", text: "AI 陪伴项目从对话与记忆能力出发，逐步扩展为多客户端、多服务的完整工程。", type: "Aura", icon: <GitBranch size={18} /> },
];

export default function TimelinePage() {
  return (
    <main className="container section-pad">
      <header className="border-b border-[var(--outline)] pb-12 pt-8 md:pb-16 md:pt-16">
        <p className="eyebrow">Changelog / Open source</p>
        <h1 className="mt-4 text-[clamp(3rem,8vw,6rem)] font-semibold leading-none tracking-[-0.06em]">构建轨迹</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">只记录可以从公开仓库与部署历史确认的项目节点。</p>
      </header>
      <section className="relative mx-auto mt-12 max-w-4xl md:mt-20">
        <div aria-hidden className="absolute bottom-0 left-[15px] top-0 w-px bg-[var(--outline)] md:left-[139px]" />
        <ol className="space-y-8">
          {events.map((event, index) => (
            <li className="relative grid gap-4 pl-12 md:grid-cols-[110px_1fr] md:pl-0" key={event.date + event.title}>
              <time className="meta pt-5 text-xs text-[var(--muted)]">{event.date}</time>
              <span className={`absolute left-0 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--outline)] bg-[var(--surface)] text-[var(--primary)] md:left-[124px] ${index === 0 ? "ring-4 ring-[var(--primary-soft)]" : ""}`}>{event.icon}</span>
              <Card className="p-6 md:ml-10 md:p-7">
                <Badge variant="outline">{event.type}</Badge>
                <h2 className="mt-4 text-xl font-semibold tracking-tight">{event.title}</h2>
                <p className="mt-2 leading-7 text-[var(--muted)]">{event.text}</p>
              </Card>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
