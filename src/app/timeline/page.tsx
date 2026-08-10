import { Braces, Database, GraduationCap, Rocket } from "lucide-react";

const events: Array<{ date: string; title: string; text: string; icon: React.ReactNode; side: "left" | "right"; featured?: boolean }> = [
  { date: "2024 年 10 月", title: "平台 V2 发布", text: "使用边缘优先架构重写核心渲染引擎，支持并发流式传输，将全球 CDN 的可交互时间降低了 40%。", icon: <Rocket size={18} />, side: "right", featured: true },
  { date: "2024 年 6 月", title: "设计系统开源", text: "将内部 UI 组件提取为独立、与框架无关的 Web Component 库，目前已被 3 个外部产品使用。", icon: <Braces size={18} />, side: "left" },
  { date: "2024 年 2 月", title: "数据库迁移", text: "成功将 5TB 的历史分析数据迁移至新的分布式列式存储，在切换窗口期间保持零停机。", icon: <Database size={18} />, side: "right" },
  { date: "2023 年 9 月", title: "担任高级工程师", text: "晋升为高级工程师，负责核心 API 网关的架构工作，并指导 4 名初级开发者。", icon: <GraduationCap size={18} />, side: "left" },
];

export default function TimelinePage() {
  return <main className="container section-pad">
    <header className="mx-auto max-w-[700px] text-center"><h1 className="text-[40px] font-bold leading-tight tracking-tight">成长旅程</h1><p className="mt-4 text-[16px] text-[var(--muted)]">记录架构、代码库与持续学习的演进。</p></header>
    <section className="relative mx-auto mt-16 max-w-[960px] pb-4">
      <div className="absolute bottom-0 left-4 top-0 w-px bg-[var(--primary-soft)] md:left-1/2 md:-translate-x-1/2" />
      <div className="space-y-10 md:space-y-12">
        {events.map((event) => <TimelineEvent key={event.title} {...event} />)}
      </div>
    </section>
  </main>;
}

function TimelineEvent({ date, title, text, icon, side, featured }: { date: string; title: string; text: string; icon: React.ReactNode; side: "left" | "right"; featured?: boolean }) {
  return <div className={`relative md:grid md:grid-cols-2 md:gap-24 ${side === "left" ? "md:text-right" : ""}`}>
    <div className={`absolute left-4 top-7 z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-[var(--bg)] ${featured ? "bg-[var(--primary)] ring-4 ring-[var(--primary-soft)]" : "bg-[var(--primary)]/70"} md:left-1/2`} />
    <div className={`${side === "left" ? "md:col-start-1" : "md:col-start-2"} ml-10 md:ml-0`}>
      <article className={`card p-6 ${featured ? "border-l-4 border-l-[var(--primary)]" : ""}`}>
        <div className={`mb-4 flex items-center gap-2 ${side === "left" ? "md:flex-row-reverse md:justify-start" : ""}`}><span className="text-[var(--primary)]">{icon}</span><span className="meta text-[13px] text-[var(--muted)]">{date}</span></div>
        <h2 className="text-[18px] font-semibold">{title}</h2>
        <p className="mt-2 text-[16px] leading-relaxed text-[var(--muted)]">{text}</p>
      </article>
    </div>
  </div>;
}
