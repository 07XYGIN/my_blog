"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { AtSign, Code2, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const avatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuCBeSs-nEEsDdU-EzKuKFbkpO8hAXmX_4Pt5AbV-HSCQ6FLfVL8ur0bPwHYt_bFBz1x_KLlnUF5dvxe9v8IBswR48PJ8nJ1VdA1fdccQT7S4AnjOecKN-Al-9BasLN8eigrCAwMMzK1xmMuYo2t1ZZB4DehPPwnNEUIVCjWTvNmHDCDZ_87G6QWSpFRKJGhrEPlY7inzB9Athk5YJ21U2hRvew8Hp1a1pn8UPxKfogizY54bQaxByf-";

const posts = [
  { title: "构建 2024 年的韧性前端架构", description: "探索构建可扩展应用的模式，让系统面对组织变化和需求迁移时无需彻底重写。", tags: ["架构", "React"], date: "2023 年 10 月 24 日", read: "8 分钟阅读" },
  { title: "高级类型推导的魔法", description: "深入理解条件类型、映射类型，以及如何让编译器承担更多工作。", tags: ["TypeScript"], date: "2023 年 10 月 18 日", read: "5 分钟阅读" },
  { title: "掌握容器查询", description: "媒体查询正在逐渐让位于组件驱动的设计，看看今天如何落地容器查询。", tags: ["CSS"], date: "2023 年 10 月 12 日", read: "4 分钟阅读" },
  { title: "优化 INP：新的核心网页指标", description: "理解并解决复杂单页应用中的 Interaction to Next Paint 问题。", tags: ["性能", "Web Vitals"], date: "2023 年 9 月 28 日", read: "12 分钟阅读" },
];

function Avatar() {
  return <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-[var(--outline)] bg-[var(--surface-container)]"><img src={avatar} alt="作者头像" className="h-full w-full object-cover" /></div>;
}

export default function Home() {
  return <main className="container section-pad">
    <motion.header initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mx-auto mb-20 flex max-w-[700px] flex-col items-center text-center">
      <Avatar />
      <h1 className="mt-4 text-[40px] font-bold leading-tight tracking-tight">Alex 陈</h1>
      <p className="mt-2 max-w-[420px] text-[16px] text-[var(--muted)]">前端开发者，探索后端并持续构建有趣的东西</p>
      <div className="mt-6 flex gap-4">
        <SocialButton label="代码主页" icon={<Code2 size={21} />} href="https://github.com" />
        <SocialButton label="联系作者" icon={<AtSign size={21} />} href="mailto:hello@example.com" />
        <SocialButton label="个人链接" icon={<Link2 size={21} />} href="#" />
      </div>
    </motion.header>
    <section>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end"><h2 className="text-[28px] font-semibold leading-tight">最新文章</h2><FilterBar /></div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => <PostCard key={post.title} post={post} index={index} href={index === 0 ? "/blog/resilient-microservices" : "#"} />)}
      </div>
    </section>
  </main>;
}

function SocialButton({ label, icon, href }: { label: string; icon: React.ReactNode; href: string }) {
  return <Button asChild aria-label={label} variant="outline" size="icon" className="shadow-[0_1px_3px_rgba(0,0,0,.06)]"><a href={href}>{icon}</a></Button>;
}

function FilterBar() {
  const filters = ["全部", "React", "TypeScript", "架构"];
  return <div className="flex flex-wrap gap-2">{filters.map((filter, index) => <Button type="button" key={filter} variant={index === 0 ? "default" : "outline"} className="h-auto rounded-full px-4 py-1.5 font-meta text-[13px]">{filter}</Button>)}</div>;
}

function PostCard({ post, index, href }: { post: typeof posts[number]; index: number; href: string }) {
  const span = index === 0 ? "md:col-span-2" : index === 3 ? "md:col-span-2" : "";
  return <motion.article initial={false} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} className={`${span} card flex min-h-[250px] cursor-pointer flex-col justify-between p-6 transition-transform hover:-translate-y-1`}><Link href={href} className="focus-ring block h-full"><div><div className="mb-3 flex flex-wrap gap-2">{post.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div><h3 className="text-[18px] font-semibold leading-snug">{post.title}</h3><p className="mt-2 line-clamp-2 text-[16px] text-[var(--muted)]">{post.description}</p></div><div className="meta mt-4 flex items-center gap-2 text-[13px] text-[var(--muted)]"><span>{post.date}</span><span className="h-1 w-1 rounded-full bg-[var(--muted)]" /><span>{post.read}</span></div></Link></motion.article>;
}
