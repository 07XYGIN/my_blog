import type { Metadata } from "next";
import { ProjectList } from "@/components/project-list";
import { getProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "项目 | Gin",
  description: "从个人工具到 AI 应用，记录真实项目中的技术选择与构建过程。",
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <main className="container editorial-page" id="main-content">
      <header className="page-heading">
        <p className="section-kicker">Projects / 从想法到实现</p>
        <h1>项目</h1>
        <p>一些持续构建的应用与工具，以及背后的技术选择和实践记录。</p>
        <div className="page-stats">
          <span>{projects.length} 个项目</span>
          <span>
            {projects.filter((project) => project.status === "ACTIVE").length}{" "}
            个进行中
          </span>
        </div>
      </header>
      <ProjectList projects={projects} />
    </main>
  );
}
