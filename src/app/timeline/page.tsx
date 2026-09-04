import { GitBranch, Rocket,FaceGrinning } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { RouteScene } from "@/components/webgl/route-scene";


const events = [
  { date: "2026-08-30", title: "Rust", text: "新技术栈", type: "learn", icon: <Rocket size={18} /> },
  { date: "2026-08-10", title: "博客接入 Vercel CI/CD", text: "主分支推送自动执行 pnpm 安装、Lint、Next.js 构建与 Vercel 生产部署。", type: "my_blog", icon: <Rocket size={18} /> },
  { date: "2026-08-10", title: "设计个人博客", text: "基于React + Next 用于总结学习笔记和代码等", type: "my_blog", icon: <Rocket size={18} /> },
  { date: "2026-07-08", title: "create Templates", text: "整理 Spring Boot 与 FastAPI 的基础工程模板，复用统一响应、异常处理和常用基础设施。", type: "templates", icon: <GitBranch size={18} /> },
  { date: "2025-11-25", title: "create Aura ", text: "AI 陪伴项目从对话与记忆能力出发，逐步扩展为多客户端、多服务的完整工程。使用了FastAPI、langgraph、PostgreSql、pgvector", type: "Aura", icon: <GitBranch size={18} /> },
  { date: "2023-06-05", title: "入门", text: "_", type: "Introduction", icon: <FaceGrinning size={18} /> },
];

export default function TimelinePage() {
  return (
    <main className="container section-pad">
      <header className="timeline-hero">
        <div className="timeline-hero__copy">
          <p className="eyebrow">Timeline / Build log</p>
          <h1>构建轨迹</h1>
          <p>把学习、项目和技术栈变化，串成一条可以回看的路径。</p>
        </div>
        <RouteScene className="timeline-hero__scene" variant="timeline" />
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
