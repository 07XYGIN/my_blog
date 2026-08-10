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
  const files = (await readdir(docsDirectory)).filter((file) => file.endsWith(".mdx"));
  const posts = await Promise.all(files.map(async (file) => {
    const raw = await readFile(path.join(docsDirectory, file), "utf8");
    const { metadata } = parseFrontmatter(raw);
    return toPost(file.replace(/\.mdx$/, ""), metadata);
  }));
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string): Promise<PostDocument | null> {
  try {
    const raw = await readFile(path.join(docsDirectory, `${slug}.mdx`), "utf8");
    const { metadata, source } = parseFrontmatter(raw);
    const toc = [...source.matchAll(/^##\s+(.+)$/gm)].map((match) => ({ title: match[1].trim(), id: headingId(match[1]) }));
    return { ...toPost(slug, metadata), source, toc };
  } catch {
    return null;
  }
}
