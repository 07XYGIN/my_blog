import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";
import { GlobalLoading } from "@/components/webgl/global-loading";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader, SiteFooter } from "@/components/site-shell";
import { getSearchDocuments } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Gin | 技术笔记与项目",
  description: "_",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const searchDocuments = await getSearchDocuments();

  return (
    <html data-scroll-behavior="smooth" lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <GlobalLoading />
          <SiteHeader searchDocuments={searchDocuments} />
          <div className="min-h-screen pt-16">{children}</div>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
