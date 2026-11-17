import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Download, Globe2, Mail, Phone, UserRound } from "lucide-react";
import { GitHubIcon } from "@/components/github-icon";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { headingId, tocFromSource } from "@/lib/mdx-content";
import "./resume.css";

export const metadata: Metadata = {
  title: "乔宇帅 · 职业履历 | Gin",
  description: "乔宇帅的专业技能、工作与项目经历、教育背景。",
};

export default async function ResumePage() {
  const source = await readFile(path.join(process.cwd(), "content/resume.md"), "utf8");
  const sections = tocFromSource(source).filter((heading) => heading.level === 2);

  return (
    <main className="container section-pad resume-page">
      <div className="resume-toolbar">
        <Link className="focus-ring inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--primary)]" href="/about">
          <ArrowLeft size={16} aria-hidden />返回关于
        </Link>
        <Button asChild>
          <a href="/resume/qiao-yushuai.pdf" download="乔宇帅-简历.pdf"><Download size={16} aria-hidden />下载 PDF</a>
        </Button>
      </div>
      <div className="resume-layout">
        <article className="resume-document" aria-label="乔宇帅的简历">
          <MDXRemote
            source={source}
            options={{ mdxOptions: { format: "md", remarkPlugins: [remarkGfm] } }}
            components={{
              p: ({ children }) => String(children).startsWith("男 / 3年开发经验") ? (
                <p className="resume-identity"><UserRound size={15} aria-hidden />{children}</p>
              ) : <p>{children}</p>,
              a: ({ href, children }) => {
                const Icon = href?.startsWith("tel:") ? Phone
                  : href?.startsWith("mailto:") ? Mail
                    : href?.includes("github.com") ? GitHubIcon : Globe2;
                return <a className="resume-contact-link" href={href}><Icon size={14} aria-hidden />{children}</a>;
              },
              h2: ({ children }) => <h2 id={headingId(String(children))}>{children}</h2>,
              h3: ({ children }) => (
                <h3>{children}</h3>
              ),
            }}
          />
        </article>
        <aside className="resume-sections">
          <p className="mb-4 text-xs text-[var(--muted)]">职业履历</p>
          <nav aria-label="履历目录" className="flex flex-col gap-2">
            {sections.map((section) => (
              <a className="focus-ring border-l border-[var(--outline)] px-4 py-2 text-sm text-[var(--muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]" key={section.id} href={`#${section.id}`}>
                {section.title}
              </a>
            ))}
          </nav>
        </aside>
      </div>
    </main>
  );
}
