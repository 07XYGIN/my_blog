"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { AtSign, CalendarDays, Clock3, Code2, Link2, MessageSquare } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

const avatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuCBeSs-nEEsDdU-EzKuKFbkpO8hAXmX_4Pt5AbV-HSCQ6FLfVL8ur0bPwHYt_bFBz1x_KLlnUF5dvxe9v8IBswR48PJ8nJ1VdA1fdccQT7S4AnjOecKN-Al-9BasLN8eigrCAwMMzK1xmMuYo2t1ZZB4DehPPwnNEUIVCjWTvNmHDCDZ_87G6QWSpFRKJGhrEPlY7inzB9Athk5YJ21U2hRvew8Hp1a1pn8UPxKfogizY54bQaxByf-";

type Post = { title: string; description: string; tags: string[]; date: string; read?: string; tone?: "teal" | "amber" | "muted" };
const lightPosts: Post[] = [
  { title: "构建 2024 年的韧性前端架构", description: "探索构建可扩展应用的模式，让系统面对组织变化和需求迁移时无需彻底重写。", tags: ["架构", "React"], date: "2023 年 10 月 24 日", read: "8 分钟阅读" },
  { title: "高级类型推导的魔法", description: "深入理解条件类型、映射类型，以及如何让编译器承担更多工作。", tags: ["TypeScript"], date: "2023 年 10 月 18 日", read: "5 分钟阅读" },
  { title: "掌握容器查询", description: "媒体查询正在逐渐让位于组件驱动的设计，看看今天如何落地容器查询。", tags: ["CSS"], date: "2023 年 10 月 12 日", read: "4 分钟阅读" },
  { title: "优化 INP：新的核心网页指标", description: "理解并解决复杂单页应用中的 Interaction to Next Paint 问题。", tags: ["性能", "Web Vitals"], date: "2023 年 9 月 28 日", read: "12 分钟阅读" },
];
const darkPosts: Post[] = [
  { title: "用 Rust 与 React 构建可扩展系统", description: "将遗留微服务迁移到统一的 Rust 后端，同时保留现代 React 前端，最终将延迟降低了 40%。", tags: ["架构", "2024"], date: "2024 年 10 月 24 日", read: "12 分钟阅读", tone: "teal" },
  { title: "理解 React 编译器", description: "新的 React 编译器正在改变我们对现代函数式组件中记忆化和依赖数组的理解。", tags: ["React"], date: "2024 年 10 月 18 日" },
  { title: "优化 2024 年核心网页指标", description: "使用边缘缓存和细粒度资源加载，改善 LCP 与 INP 分数的实战策略。", tags: ["Web 性能"], date: "2024 年 10 月 10 日", tone: "amber" },
  { title: "创建类型安全的设计令牌", description: "从单一事实源自动生成 Tailwind 配置与 CSS 变量，消除微前端间的样式不一致。", tags: ["设计系统", "Tailwind"], date: "2024 年 9 月 28 日", read: "8 分钟阅读", tone: "muted" },
];

function Avatar({ size = "lg" }: { size?: "sm" | "lg" }) {
  const classes = size === "sm" ? "h-10 w-10" : "h-16 w-16";
  return <div className={`${classes} shrink-0 overflow-hidden rounded-full border border-[var(--outline)] bg-[var(--surface-container)]`}><img src={avatar} alt="作者头像" className="h-full w-full object-cover" /></div>;
}

function LightHome() {
  return <main className="container section-pad">
    <motion.header initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }} className="mx-auto mb-20 flex max-w-[700px] flex-col items-center text-center">
      <Avatar />
      <h1 className="mt-4 text-[40px] font-bold leading-tight tracking-tight">Alex 陈</h1>
      <p className="mt-2 max-w-[420px] text-[16px] text-[var(--muted)]">前端开发者，探索后端并持续构建有趣的东西</p>
      <div className="mt-6 flex gap-4">
        <SocialButton label="代码主页" icon={<Code2 size={22} />} href="https://github.com" />
        <SocialButton label="联系作者" icon={<AtSign size={22} />} href="mailto:hello@example.com" />
        <SocialButton label="个人链接" icon={<Link2 size={22} />} href="#" />
      </div>
    </motion.header>
    <section>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end"><h2 className="text-[28px] font-semibold leading-tight">最新文章</h2><FilterBar /></div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lightPosts.map((post, index) => <PostCard key={post.title} post={post} index={index} href={index === 0 ? "/blog/resilient-microservices" : "#"} />)}
      </div>
    </section>
  </main>;
}

function DarkHome() {
  return <main className="container section-pad">
    <motion.header initial={false} animate={{ opacity: 1, y: 0 }} className="mb-16 flex flex-col gap-7 border-b border-[var(--outline)] pb-20 pt-7 md:flex-row md:items-center md:gap-10">
      <Avatar size="sm" />
      <div><h1 className="text-[40px] font-bold leading-tight tracking-tight">Alex 陈</h1><p className="mt-3 max-w-lg text-[20px] text-[var(--muted)]">前端开发者，探索后端并持续构建有趣的东西。</p><div className="mt-6 flex flex-wrap gap-4"><DarkSocialButton icon={<Code2 size={18} />} label="GitHub" /><DarkSocialButton icon={<MessageSquare size={18} />} label="Twitter" /></div></div>
    </motion.header>
    <section><div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center"><h2 className="text-[36px] font-semibold leading-tight">最新文章</h2><FilterBar dark /></div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {darkPosts.map((post, index) => <DarkPostCard key={post.title} post={post} index={index} />)}
      </div>
    </section>
  </main>;
}

function SocialButton({ label, icon, href }: { label: string; icon: React.ReactNode; href: string }) {
  return <a aria-label={label} href={href} className="focus-ring rounded-lg border border-[var(--outline)] bg-[var(--surface)] p-2 text-[var(--muted)] shadow-[0_1px_3px_rgba(0,0,0,.06)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]">{icon}</a>;
}
function DarkSocialButton({ label, icon }: { label: string; icon: React.ReactNode }) { return <a href="#" className="focus-ring inline-flex items-center gap-2 rounded border border-[var(--outline)] px-4 py-2 text-[18px] text-[var(--muted)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]">{icon}{label}</a>; }

function FilterBar({ dark = false }: { dark?: boolean }) {
  const filters = dark ? ["全部", "React", "Rust", "架构"] : ["全部", "React", "TypeScript", "架构"];
  return <div className="flex flex-wrap gap-2">{filters.map((filter, index) => <Button type="button" key={filter} variant={index === 0 ? "primary" : "outline"} className="rounded-full px-4 py-1.5">{filter}</Button>)}</div>;
}

function PostCard({ post, index, href }: { post: Post; index: number; href: string }) {
  const span = index === 0 ? "md:col-span-2" : index === 3 ? "md:col-span-2" : "";
  return <motion.article initial={false} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .06 }} className={`${span} card flex min-h-[250px] cursor-pointer flex-col justify-between p-6 transition-transform hover:-translate-y-1`}><Link href={href} className="focus-ring block h-full"><div><div className="mb-3 flex flex-wrap gap-2">{post.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div><h3 className="text-[18px] font-semibold leading-snug">{post.title}</h3><p className="mt-2 line-clamp-2 text-[16px] text-[var(--muted)]">{post.description}</p></div><div className="meta mt-4 flex items-center gap-2 text-[13px] text-[var(--muted)]"><span>{post.date}</span><span className="h-1 w-1 rounded-full bg-[var(--muted)]" /><span>{post.read}</span></div></Link></motion.article>;
}

function DarkPostCard({ post, index }: { post: Post; index: number }) {
  const wide = index === 0 || index === 3;
  return <motion.article initial={false} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .06 }} className={`${wide ? "md:col-span-2" : ""} card group flex min-h-[250px] flex-col justify-between p-7`}><div className={index === 3 ? "flex flex-col md:flex-row md:gap-8" : ""}><div className="flex-1"><div className="mb-4 flex flex-wrap gap-2">{post.tags.map((tag, tagIndex) => <span className={`tag ${post.tone === "teal" && tagIndex === 0 ? "teal" : post.tone === "amber" ? "amber" : post.tone === "muted" ? "muted bg-[var(--surface-container)]" : ""}`} key={tag}>{tag}</span>)}</div><h3 className="mb-3 text-[22px] font-semibold leading-snug group-hover:text-[var(--primary)]">{post.title}</h3><p className="mb-6 text-[20px] leading-relaxed text-[var(--muted)]">{post.description}</p></div>{index === 3 && <pre className="mt-5 hidden w-60 shrink-0 overflow-hidden rounded-lg border border-[var(--outline)] bg-[var(--bg)] p-5 font-meta text-[13px] leading-relaxed text-[var(--teal)] md:block"><code>{`const tokens = {\n  colors: {\n    primary: '#4648d4'\n  }\n} as const;`}</code></pre>}</div><div className="meta flex items-center gap-2 text-[15px] text-[var(--muted)]"><CalendarDays size={17} /><span>{post.date}</span>{post.read && <><span>·</span><Clock3 size={17} /><span>{post.read}</span></>}</div></motion.article>;
}

export default function Home() {
  const { theme } = useTheme();
  return theme === "dark" ? <DarkHome /> : <LightHome />;
}
