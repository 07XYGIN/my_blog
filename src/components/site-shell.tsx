"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { KnowledgeSearch } from "@/components/knowledge-search";
import { useTheme } from "@/components/theme-provider";
import type { SearchDocument } from "@/lib/posts";

const links = [
  { href: "/", label: "首页" },
  // { href: "/snippets", label: "代码片段" },
  { href: "/timeline", label: "时间线" },
  { href: "/about", label: "关于" },
];

export function SiteHeader({ searchDocuments }: { searchDocuments: SearchDocument[] }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-[var(--outline)] bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link className="focus-ring text-2xl font-semibold tracking-[-0.06em]" href="/" onClick={() => setOpen(false)}>GIN<span className="text-[var(--primary)]">.</span></Link>
        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return <Link key={link.href} href={link.href} className={`focus-ring relative rounded-lg px-3 py-2 font-meta text-[13px] transition-colors hover:bg-[var(--surface-container)] hover:text-[var(--primary)] ${active ? "font-bold text-[var(--primary)] after:absolute after:-bottom-1 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-[var(--primary)]" : "text-[var(--muted)]"}`}>{link.label}</Link>;
          })}
        </nav>
        <div className="flex items-center gap-1">
          <KnowledgeSearch compact documents={searchDocuments} />
          <button aria-label={theme === "light" ? "切换为深色主题" : "切换为浅色主题"} className="focus-ring rounded-lg p-2 text-[var(--muted)] transition-colors hover:bg-[var(--surface-container)] hover:text-[var(--primary)]" onClick={toggleTheme} type="button">
            {theme === "light" ? <Moon size={20} strokeWidth={1.8} /> : <Sun size={20} strokeWidth={1.8} />}
          </button>
          <button aria-label={open ? "关闭菜单" : "打开菜单"} className="focus-ring rounded-lg p-2 text-[var(--muted)] md:hidden" onClick={() => setOpen((value) => !value)} type="button">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open ? (
        <nav className="container absolute left-0 right-0 top-16 flex flex-col gap-1 border-b border-[var(--outline)] bg-[var(--surface)] py-3 md:hidden">
          {links.map((link) => <Link className="rounded-lg px-3 py-2 font-meta text-sm text-[var(--muted)] hover:bg-[var(--surface-container)] hover:text-[var(--primary)]" href={link.href} key={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}
        </nav>
      ) : null}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[var(--outline)] bg-[var(--surface)] py-14">
      <div className="container flex flex-col items-center justify-between gap-5 md:flex-row">
        <span className="text-2xl font-semibold tracking-[-0.06em]">GIN<span className="text-[var(--primary)]">.</span></span>
        <span className="font-meta text-[12px] text-[var(--muted)]">2026 Gin / Notes from building</span>
        <a className="font-meta text-[12px] text-[var(--muted)] hover:text-[var(--primary)]" href="https://github.com/07XYGIN" rel="noreferrer" target="_blank">GitHub</a>
      </div>
    </footer>
  );
}
