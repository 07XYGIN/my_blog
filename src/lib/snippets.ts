import "server-only";

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

export type CodeSnippet = {
  slug: string;
  title: string;
  description: string;
  language: string;
  tags: string[];
  date: string;
  source: string;
};

const codeDirectory = path.join(process.cwd(), "docs", "code");

function parseFrontmatter(file: string) {
  const match = file.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { metadata: {}, source: file.trim() };

  const metadata = Object.fromEntries(
    match[1].split(/\r?\n/).filter((line) => line.includes(":")).map((line) => {
      const separator = line.indexOf(":");
      return [line.slice(0, separator).trim(), line.slice(separator + 1).trim().replace(/^[']|[']$/g, "").replace(/^[\"]|[\"]$/g, "")];
    }),
  );

  return { metadata, source: match[2].trim() };
}

async function getSnippetFiles(directory = codeDirectory): Promise<string[]> {
  try {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = await Promise.all(entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return getSnippetFiles(entryPath);
      return entry.isFile() && entry.name.endsWith(".mdx") ? [entryPath] : [];
    }));

    return files.flat();
  } catch {
    return [];
  }
}

function slugFromFile(file: string) {
  return path.relative(codeDirectory, file).replace(/\\/g, "/").replace(/\.mdx$/, "");
}

function titleFromSlug(slug: string) {
  return path.basename(slug).replace(/[-_]+/g, " ");
}

function inferLanguage(source: string) {
  return source.match(/```([\w-]+)/)?.[1] ?? "text";
}

function toSnippet(slug: string, metadata: Record<string, string>, source: string): CodeSnippet {
  return {
    slug,
    title: metadata.title ?? titleFromSlug(slug),
    description: metadata.description ?? "",
    language: metadata.language ?? inferLanguage(source),
    tags: (metadata.tags ?? "").split(",").map((tag) => tag.trim()).filter(Boolean),
    date: metadata.date ?? "",
    source,
  };
}

export async function getCodeSnippets(): Promise<CodeSnippet[]> {
  const files = await getSnippetFiles();
  const snippets = await Promise.all(files.map(async (file) => {
    const raw = await readFile(file, "utf8");
    const { metadata, source } = parseFrontmatter(raw);
    return toSnippet(slugFromFile(file), metadata, source);
  }));

  return snippets.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, "zh-Hans-CN"));
}
