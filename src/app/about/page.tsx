import { ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import { GitHubIcon } from "@/components/github-icon";
import Link from "next/link";
import { ProjectList } from "@/components/project-list";
import { getPosts } from "@/lib/posts";
import { getProjects } from "@/lib/projects";

const directions = [
  {
    title: "Web 工程",
    description: "从组件到页面，构建博客、管理端和客户端应用。",
    stack: "React / Next.js / Vue / TypeScript / Tailwind CSS",
  },
  {
    title: "后端与数据",
    description: "接口设计、数据建模、持久化与缓存。",
    stack: "Python / FastAPI / Java / Spring Boot / PostgreSQL / Redis",
  },
  {
    title: "AI 应用与 Agent",
    description: "围绕长期记忆、工具调用与流式响应。",
    stack: "LangGraph / LangChain / pgvector",
  },
];

export default async function AboutPage() {
  const [posts, projects] = await Promise.all([getPosts(), getProjects()]);
  const featured = projects.filter(
    (project) => project.title === "Aura" || project.title === "Templates",
  );
  return (
    <main className="container editorial-page about-page" id="main-content">
      <header className="page-heading about-intro">
        <div>
          <p className="section-kicker">About / 开发者与记录者</p>
          <h1>
            你好，我是 Gin<span className="accent-dot">.</span>
          </h1>
          <p>
            前端开发。主要写前端工程实践和踩坑，也会记录 Python、Java、AI Agent
            的学习笔记。
          </p>
          <div className="about-contact">
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
            <a className="text-link focus-ring" href="mailto:xygin0708@163.com">
              <Mail size={16} />
              xygin0708@163.com
            </a>
          </div>
        </div>
        <div className="about-identity">
          <div aria-hidden className="author-mark">
            G<span>.</span>
          </div>
          <span>Frontend / Backend / Agent</span>
        </div>
      </header>
      <section className="about-section">
        <div>
          <p className="section-kicker">Focus</p>
          <h2>关注的方向</h2>
        </div>
        <div className="focus-list">
          {directions.map((direction) => (
            <section key={direction.title}>
              <h3>{direction.title}</h3>
              <p>{direction.description}</p>
              <span>{direction.stack}</span>
            </section>
          ))}
        </div>
      </section>
      <section className="about-section">
        <div>
          <p className="section-kicker">Writing</p>
          <h2>把过程留下来</h2>
        </div>
        <div className="about-writing">
          <p>
            这里收录了 {posts.length} 篇技术笔记和 {projects.length}{" "}
            个项目。笔记围绕具体问题展开，项目记录实现过程中的选择、问题和收获。
          </p>
          <Link className="text-link focus-ring" href="/blog">
            阅读笔记
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <section className="about-projects">
        <div className="section-heading">
          <h2>精选项目</h2>
          <Link className="text-link focus-ring" href="/projects">
            全部项目
            <ArrowRight size={15} />
          </Link>
        </div>
        <ProjectList projects={featured} />
      </section>
    </main>
  );
}
