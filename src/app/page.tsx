import { ArrowRight, ArrowUpRight } from "lucide-react";
import { GitHubIcon } from "@/components/github-icon";
import Link from "next/link";
import { PostExplorer } from "@/components/post-explorer";
import { MotionReveal } from "@/components/motion-surface";
import { getPosts } from "@/lib/posts";
import { getProjects } from "@/lib/projects";
import { getCodeSnippets } from "@/lib/snippets";
import { groupSnippets } from "@/lib/snippet-groups";

export default async function Home() {
  const [posts, projects, snippets] = await Promise.all([
    getPosts(),
    getProjects(),
    getCodeSnippets(),
  ]);
  return (
    <main className="container editorial-page" id="main-content">
      <MotionReveal>
        <header className="home-intro">
          <p className="section-kicker">工程实践 / 持续记录</p>
          <h1>
            Gin 的技术笔记<span className="accent-dot">.</span>
          </h1>
          <p>从一个问题出发，把构建过程、技术选择和踩过的坑写下来。</p>
        </header>
      </MotionReveal>
      <div className="home-columns">
        <div className="min-w-0">
          <PostExplorer posts={posts.slice(0, 10)} />
          <Link className="text-link archive-link focus-ring" href="/blog">
            全部 {posts.length} 篇笔记
            <ArrowRight size={16} />
          </Link>
        </div>
        <aside aria-label="关于与精选内容" className="home-aside">
          <section className="aside-section">
            <div className="author-mark" aria-hidden>
              G<span>.</span>
            </div>
            <h2>你好，我是 Gin</h2>
            <p>
              前端开发，也在探索后端工程和 AI
              Agent。这里是我的学习笔记与构建记录。
            </p>
            <div className="aside-links">
              <Link className="text-link focus-ring" href="/about">
                关于我
                <ArrowRight size={14} />
              </Link>
              <a
                aria-label="Gin 的 GitHub"
                className="icon-button focus-ring"
                href="https://github.com/07XYGIN"
                rel="noreferrer"
                target="_blank"
                title="GitHub"
              >
                <GitHubIcon />
              </a>
            </div>
          </section>
          <section className="aside-section">
            <div className="section-heading">
              <h2>正在构建</h2>
              <Link
                aria-label="查看全部项目"
                className="icon-button focus-ring"
                href="/projects"
                title="全部项目"
              >
                <ArrowUpRight size={16} />
              </Link>
            </div>
            {projects.slice(0, 2).map((project) => (
              <Link
                className="aside-project focus-ring"
                href={`/projects/${project.slug}`}
                key={project.slug}
              >
                <strong>
                  {project.title}
                  <ArrowUpRight size={14} />
                </strong>
                <span>{project.summary}</span>
              </Link>
            ))}
          </section>
          <section className="aside-section">
            <div className="section-heading">
              <h2>常用速查</h2>
              <span className="quiet-count">{snippets.length}</span>
            </div>
            <div className="topic-links">
              {groupSnippets(snippets)
                .slice(0, 5)
                .map((group) => (
                  <Link
                    className="focus-ring"
                    href={`/snippets#category-${encodeURIComponent(group.category)}`}
                    key={group.category}
                  >
                    <span>{group.category}</span>
                    <span className="quiet-count">
                      {group.items.length}
                      <ArrowRight size={13} />
                    </span>
                  </Link>
                ))}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
