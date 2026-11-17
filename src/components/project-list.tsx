import { ArrowRight } from "lucide-react";
import { GitHubIcon } from "@/components/github-icon";
import Link from "next/link";
import { MotionArticle } from "@/components/motion-surface";
import type { Project, ProjectStatus } from "@/lib/projects";

const statusLabels: Record<ProjectStatus, string> = {
  ACTIVE: "进行中",
  SHIPPED: "已交付",
  ARCHIVED: "已归档",
};

export function ProjectStatusLabel({ status }: { status: ProjectStatus }) {
  return (
    <span className="project-status" data-status={status}>
      <i aria-hidden />
      {statusLabels[status]}
    </span>
  );
}

export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div className="project-grid">
      {projects.map((project, index) => (
        <MotionArticle
          className="project-item"
          id={project.slug}
          index={index}
          interactive
          key={project.slug}
        >
          <div className="project-item-body">
            <div className="section-heading">
              <h2>
                <Link className="focus-ring" href={`/projects/${project.slug}`}>
                  {project.title}
                </Link>
              </h2>
              <ProjectStatusLabel status={project.status} />
            </div>
            <p>{project.summary}</p>
            <div className="project-stack">
              {project.stack.slice(0, 5).map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <div className="project-actions">
              <Link
                className="text-link focus-ring"
                href={`/projects/${project.slug}`}
              >
                项目记录
                <ArrowRight size={15} />
              </Link>
              <a
                aria-label={`查看 ${project.title} 源码`}
                className="icon-button focus-ring"
                href={project.links.source}
                rel="noreferrer"
                target="_blank"
                title="GitHub 源码"
              >
                <GitHubIcon />
              </a>
            </div>
          </div>
        </MotionArticle>
      ))}
    </div>
  );
}
