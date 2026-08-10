"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/components/theme-provider";

const links = [
  { href: "/", label: "首页" },
  { href: "/timeline", label: "时间线" },
  { href: "/about", label: "关于" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-[var(--outline)] bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="focus-ring text-[28px] font-bold tracking-tight" onClick={() => setOpen(false)}>开发日志</Link>
        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return <Link key={link.href} href={link.href} className={`focus-ring relative rounded-lg px-3 py-2 font-meta text-[13px] transition-colors hover:bg-[var(--surface-container)] hover:text-[var(--primary)] ${active ? "font-bold text-[var(--primary)] after:absolute after:-bottom-1 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-[var(--primary)]" : "text-[var(--muted)]"}`}>{link.label}</Link>;
          })}
        </nav>
        <div className="flex items-center gap-1">
          <button type="button" aria-label={theme === "light" ? "切换为深色主题" : "切换为浅色主题"} className="focus-ring rounded-lg p-2 text-[var(--muted)] transition-colors hover:bg-[var(--surface-container)] hover:text-[var(--primary)]" onClick={toggleTheme}>
            {theme === "light" ? <Moon size={20} strokeWidth={1.8} /> : <Sun size={20} strokeWidth={1.8} />}
          </button>
          <button type="button" aria-label={open ? "关闭菜单" : "打开菜单"} className="focus-ring rounded-lg p-2 text-[var(--muted)] md:hidden" onClick={() => setOpen((v) => !v)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && <nav className="container absolute left-0 right-0 top-16 flex flex-col gap-1 border-b border-[var(--outline)] bg-[var(--surface)] py-3 md:hidden">
        {links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 font-meta text-sm text-[var(--muted)] hover:bg-[var(--surface-container)] hover:text-[var(--primary)]">{link.label}</Link>)}
      </nav>}
    </header>
  );
}

export function SiteFooter() {
  return <footer className="mt-16 border-t border-[var(--outline)] bg-[var(--surface)] py-14">
    <div className="container flex flex-col items-center justify-between gap-5 md:flex-row">
      <span className="text-[28px] font-bold tracking-tight">开发日志</span>
      <span className="font-meta text-[13px] text-[var(--muted)]">© 2024 开发日志 · 为开发者而建</span>
      <div className="flex gap-5 font-meta text-[13px] text-[var(--muted)]"><a className="hover:text-[var(--primary)]" href="#">GitHub</a><a className="hover:text-[var(--primary)]" href="#">Twitter</a><a className="hover:text-[var(--primary)]" href="#">LinkedIn</a></div>
    </div>
  </footer>;
}
