"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, Moon, Sun } from "lucide-react";
import { KnowledgeSearch } from "@/components/knowledge-search";
import { useTheme } from "@/components/theme-provider";
import type { KnowledgeDocument } from "@/lib/search";
import { cn } from "@/lib/utils";
import { GitHubIcon } from "@/components/github-icon";

const links = [
  { href: "/blog", label: "笔记" },
  { href: "/projects", label: "项目" },
  { href: "/snippets", label: "速查" },
  { href: "/about", label: "关于" },
];

export function SiteHeader({
  searchDocuments,
}: {
  searchDocuments: KnowledgeDocument[];
}) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const navigation = links.map((link) => {
    const active =
      pathname === link.href || pathname.startsWith(`${link.href}/`);
    return (
      <Link
        aria-current={active ? "page" : undefined}
        className={cn("nav-link focus-ring", active && "is-active")}
        href={link.href}
        key={link.href}
        onClick={(event) =>
          event.currentTarget.closest("details")?.removeAttribute("open")
        }
      >
        {link.label}
      </Link>
    );
  });
  return (
    <header className="site-header">
      <a className="skip-link" href="#page-content">
        跳转到正文
      </a>
      <div className="container header-inner">
        <Link aria-label="Gin 首页" className="brand focus-ring" href="/">
          Gin<span>.</span>
        </Link>
        <nav aria-label="主导航" className="desktop-nav">
          {navigation}
        </nav>
        <div className="header-actions">
          <KnowledgeSearch compact documents={searchDocuments} />
          <button
            aria-label={theme === "light" ? "切换为深色主题" : "切换为浅色主题"}
            className="icon-button theme-toggle focus-ring"
            data-theme={theme}
            onClick={toggleTheme}
            title={theme === "light" ? "深色主题" : "浅色主题"}
            type="button"
          >
            <Moon aria-hidden="true" className="theme-moon" size={18} />
            <Sun aria-hidden="true" className="theme-sun" size={18} />
          </button>
          <details className="mobile-menu">
            <summary
              aria-label="导航菜单"
              className="icon-button focus-ring"
              title="导航菜单"
            >
              <Menu size={20} />
            </summary>
            <nav aria-label="移动端主导航">{navigation}</nav>
          </details>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <Link className="brand focus-ring" href="/">
          Gin<span>.</span>
        </Link>
        <p>
          持续学习，认真构建。<span>© {new Date().getFullYear()} Gin</span>
        </p>
        <a
          className="text-link focus-ring"
          href="https://github.com/07XYGIN"
          rel="noreferrer"
          target="_blank"
        >
          <GitHubIcon size={16} />
          GitHub
          <ArrowUpRight size={14} />
        </a>
      </div>
    </footer>
  );
}
