import "server-only";

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { categories, type Post, type PostCategory } from "@/lib/post-types";

export type PostDocument = Post & { source: string; toc: Array<{ id: string; title: string }> };

const docsDirectory = path.join(process.cwd(), "docs");

function parseFrontmatter(file: string) {
  const match = file.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error("MDX 文件缺少 frontmatter");

  const metadata = Object.fromEntries(
    match[1].split(/\r?\n/).filter(Boolean).map((line) => {
      const separator = line.indexOf(":");
      return [line.slice(0, separator).trim(), line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "")];
    }),
  );

  return { metadata, source: match[2].trim() };
}

export function headingId(title: string) {
  return title.toLowerCase().replace(/[`*_]/g, "").replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "");
}

export function uniqueHeadingId(title: string, counts: Map<string, number>) {
  const base = headingId(title) || "section";
  const count = counts.get(base) ?? 0;
  counts.set(base, count + 1);
  return count === 0 ? base : `${base}-${count + 1}`;
}

async function getMdxFiles(directory = docsDirectory): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return getMdxFiles(entryPath);
    return entry.isFile() && entry.name.endsWith(".mdx") ? [entryPath] : [];
  }));
  return files.flat();
}

function slugFromFile(file: string) {
  return path.basename(file, ".mdx");
}

function toPost(slug: string, metadata: Record<string, string>): Post {
  const category = metadata.category as PostCategory;
  if (!categories.includes(category)) throw new Error(`${slug} 使用了未知分类：${category}`);
  return {
    slug,
    title: metadata.title,
    description: metadata.description,
    category,
    tags: metadata.tags.split(",").map((tag) => tag.trim()),
    date: metadata.date,
    readTime: metadata.readTime,
    author: metadata.author,
  };
}

export async function getPosts(): Promise<Post[]> {
  const files = await getMdxFiles();
  const posts = await Promise.all(files.map(async (file) => {
    const raw = await readFile(file, "utf8");
    const { metadata } = parseFrontmatter(raw);
    return toPost(slugFromFile(file), metadata);
  }));
  const slugs = new Set<string>();
  for (const post of posts) {
    if (slugs.has(post.slug)) throw new Error(`MDX 文件名重复，无法生成唯一文章地址：${post.slug}`);
    slugs.add(post.slug);
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string): Promise<PostDocument | null> {
  try {
    const file = (await getMdxFiles()).find((candidate) => slugFromFile(candidate) === slug);
    if (!file) return null;
    const raw = await readFile(file, "utf8");
    const { metadata, source } = parseFrontmatter(raw);
    const counts = new Map<string, number>();
    const toc = [...source.matchAll(/^##\s+(.+)$/gm)].map((match) => {
      const title = match[1].trim();
      return { title, id: uniqueHeadingId(title, counts) };
    });
    return { ...toPost(slug, metadata), source, toc };
  } catch {
    return null;
  }
}
