import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader, SiteFooter } from "@/components/site-shell";
import { getSearchDocuments } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Gin | 技术笔记与项目",
  description: "Gin 的个人技术博客，持续记录 Python、Java、数据库与 Agent 等工程实践，理解系统如何工作，沉淀技术判断。",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const searchDocuments = await getSearchDocuments();

  return (
    <html data-scroll-behavior="smooth" lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <SiteHeader searchDocuments={searchDocuments} />
          <div className="min-h-screen pt-16">{children}</div>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
