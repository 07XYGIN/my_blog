import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import rehypeHighlight from "rehype-highlight";
import { MDXRemote } from "next-mdx-remote/rsc";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { CodeFrame } from "@/components/code-block";

export default async function BlogPostPage() {
  const source = await readFile(path.join(process.cwd(), "src/content/resilient-microservices.mdx"), "utf8");
  const content = await MDXRemote({ source, options: { mdxOptions: { rehypePlugins: [rehypeHighlight] } }, components: { pre: CodeFrame } });
  return <main className="container flex items-start gap-8 section-pad">
    <article className="mx-auto w-full max-w-[700px] shrink-0 md:mx-0">
      <header className="mb-12">
        <div className="mb-6 flex flex-wrap gap-2"><span className="tag teal">Go</span><span className="tag teal">微服务</span><span className="tag teal">架构</span></div>
        <h1 className="text-[32px] font-bold leading-tight tracking-tight md:text-[40px]">使用 Go 与 gRPC 构建韧性微服务</h1>
        <div className="mt-6 flex items-center gap-4 border-l-2 border-[var(--primary)] py-1 pl-4"><div className="h-10 w-10 overflow-hidden rounded-full border border-[var(--outline)] bg-[var(--surface-container)]"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiEl_qPrFJLNCtMEBcsUlsJKeCQ1YPwRsIxiN8wdRvTsL8iuWBaX0Bm0frWy7B8pil1xwolgNpkgEO1nGqlByiHc95MImxmmcYbrW5pfm5AcfpWBDo7xwRfHcei_1kjD92HnpBH5c0z24w30-zDQCEFjIU0LhIwgNGwxlsaAY1FNuM0wvvvf4XWN-V3jjg0sGOR7jOfSQz0Oi2UiHj93xicIHdELkpCmqdJlbAJhtg5-KtPiWVwNf5" alt="作者头像" className="h-full w-full object-cover" /></div><div><div className="text-[18px] font-medium">Alex Chen</div><div className="meta text-[13px] text-[var(--muted)]">发布于 2023 年 10 月 24 日 · 8 分钟阅读</div></div></div>
      </header>
      <div className="prose-content text-[16px] leading-relaxed">
        {content}
      </div>
      <div className="mt-16 flex flex-col justify-between gap-4 border-t border-[var(--outline)] pt-8 sm:flex-row">
        <PostNav href="#" direction="previous" title="理解 Go 通道" />
        <PostNav href="#" direction="next" title="部署到 Kubernetes" />
      </div>
    </article>
    <aside className="sticky top-24 hidden w-64 shrink-0 lg:block"><div className="card p-6"><h2 className="border-b border-[var(--outline)] pb-3 text-[18px] font-semibold">本文目录</h2><nav className="mt-4 flex flex-col gap-3"><a href="#circuit-breaker" className="meta flex items-start gap-2 text-[13px] text-[var(--muted)] hover:text-[var(--primary)]"><span>·</span>断路器模式</a><a href="#grpc-retries" className="meta flex items-start gap-2 text-[13px] text-[var(--muted)] hover:text-[var(--primary)]"><span>·</span>配置 gRPC 重试</a></nav></div></aside>
  </main>;
}

function PostNav({ href, direction, title }: { href: string; direction: "previous" | "next"; title: string }) { const previous = direction === "previous"; return <Link href={href} className={`focus-ring card flex flex-1 items-center gap-3 p-3 transition hover:border-[var(--primary)] ${previous ? "justify-start" : "justify-end text-right"}`}><span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--outline)] bg-[var(--surface-container)] text-[var(--primary)]">{previous ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}</span><span><span className="meta block text-[11px] uppercase tracking-wider text-[var(--muted)]">{previous ? "上一篇" : "下一篇"}</span><span className="text-[15px] text-[var(--primary)]">{title}</span></span></Link>; }
