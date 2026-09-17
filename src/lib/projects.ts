import "server-only";

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

export type ProjectStatus = "ACTIVE" | "SHIPPED" | "ARCHIVED";
export type Project = {
  order: number;
  status: ProjectStatus;
  title: string;
  summary: string;
  stack: string[];
  links: { source: string; demo?: string };
  relatedPosts: string[];
  source: string;
};

const projectsDirectory = path.join(process.cwd(), "content", "projects");

export async function getProjects(): Promise<Project[]> {
  const files = (await readdir(projectsDirectory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
    .map((entry) => path.join(projectsDirectory, entry.name));

  const projects = await Promise.all(files.map(async (file) => parseProject(await readFile(file, "utf8"), file)));
  return projects.sort((a, b) => a.order - b.order);
}

function parseProject(file: string, filePath: string): Project {
  const match = file.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`项目文件缺少 frontmatter：${filePath}`);

  const metadata = parseFrontmatter(match[1]);
  const status = metadata.status;
  if (status !== "ACTIVE" && status !== "SHIPPED" && status !== "ARCHIVED") {
    throw new Error(`项目状态无效：${filePath}`);
  }

  const links = metadata.links;
  if (!isRecord(links) || typeof links.source !== "string") {
    throw new Error(`项目 links.source 缺失：${filePath}`);
  }

  return {
    order: asNumber(metadata.order, "order", filePath),
    status,
    title: asString(metadata.title, "title", filePath),
    summary: asString(metadata.summary, "summary", filePath),
    stack: asStringArray(metadata.stack, "stack", filePath),
    links: { source: links.source, demo: typeof links.demo === "string" ? links.demo : undefined },
    relatedPosts: asStringArray(metadata.relatedPosts, "relatedPosts", filePath),
    source: match[2].trim(),
  };
}

function parseFrontmatter(block: string) {
  const lines = block.split(/\r?\n/);
  const result: Record<string, unknown> = {};

  for (let index = 0; index < lines.length;) {
    if (!lines[index].trim()) {
      index += 1;
      continue;
    }

    const field = lines[index].match(/^([A-Za-z][\w-]*)\s*:\s*(.*)$/);
    if (!field) throw new Error(`无法解析 frontmatter：${lines[index]}`);

    const [, key, rawValue] = field;
    if (rawValue.trim()) {
      result[key] = parseValue(rawValue.trim());
      index += 1;
      continue;
    }

    const childLines: string[] = [];
    let childIndex = index + 1;
    while (childIndex < lines.length && (!lines[childIndex].trim() || countIndent(lines[childIndex]) > 0)) {
      if (lines[childIndex].trim()) childLines.push(lines[childIndex].trim());
      childIndex += 1;
    }

    if (childLines.every((line) => line.startsWith("- "))) {
      result[key] = childLines.map((line) => parseValue(line.slice(2).trim()));
    } else {
      const object: Record<string, unknown> = {};
      for (const line of childLines) {
        const childField = line.match(/^([A-Za-z][\w-]*)\s*:\s*(.*)$/);
        if (!childField) throw new Error(`无法解析 frontmatter 子字段：${line}`);
        object[childField[1]] = parseValue(childField[2].trim());
      }
      result[key] = object;
    }

    index = childIndex;
  }

  return result;
}

function parseValue(value: string): string | number {
  const unquoted = value.replace(/^['"]|['"]$/g, "");
  if (/^-?\d+(\.\d+)?$/.test(unquoted)) return Number(unquoted);
  return unquoted;
}

function countIndent(line: string) {
  return line.length - line.trimStart().length;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown, key: string, filePath: string) {
  if (typeof value !== "string" || !value) throw new Error(`项目 ${key} 缺失：${filePath}`);
  return value;
}

function asNumber(value: unknown, key: string, filePath: string) {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`项目 ${key} 无效：${filePath}`);
  return value;
}

function asStringArray(value: unknown, key: string, filePath: string) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`项目 ${key} 必须是字符串数组：${filePath}`);
  }
  return value;
}
