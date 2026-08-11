import "server-only";

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { categories, type Post, type PostCategory } from "@/lib/post-types";

export type TocItem = { id: string; title: string; level: number };
export type PostDocument = Post & { source: string; toc: TocItem[] };
export type SearchDocument = Post & { headings: string[]; text: string; preview: string };

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
    if (entry.isDirectory()) {
      if (directory === docsDirectory && entry.name === "code") return [];
      return getMdxFiles(entryPath);
    }
    return entry.isFile() && entry.name.endsWith(".mdx") ? [entryPath] : [];
  }));
  return files.flat();
}

function slugFromFile(file: string) {
  return path.basename(file, ".mdx");
}

function cleanText(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/[`*_~>#\[\]()+|:-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function headingEntriesFromSource(source: string) {
  const entries: Array<{ level: number; title: string }> = [];
  let fence: { marker: "`" | "~"; length: number } | null = null;

  for (const line of source.split(/\r?\n/)) {
    const fenceMatch = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (fenceMatch) {
      const marker = fenceMatch[1][0] as "`" | "~";
      const length = fenceMatch[1].length;
      if (!fence) {
        fence = { marker, length };
      } else if (fence.marker === marker && length >= fence.length) {
        fence = null;
      }
      continue;
    }

    if (fence) continue;

    const headingMatch = line.match(/^ {0,3}(#{1,6})[\t ]+(.+)$/);
    if (!headingMatch) continue;

    const title = cleanText(headingMatch[2].trim().replace(/[\t ]+#+[\t ]*$/, ""));
    if (title) entries.push({ level: headingMatch[1].length, title });
  }

  return entries;
}

function headingsFromSource(source: string) {
  return headingEntriesFromSource(source).map((heading) => heading.title);
}

function tocFromSource(source: string): TocItem[] {
  const counts = new Map<string, number>();
  return headingEntriesFromSource(source).map((heading) => ({
    ...heading,
    id: uniqueHeadingId(heading.title, counts),
  }));
}

function stripMdxForSearch(source: string) {
  return cleanText(
    source
      .replace(/```[\s\S]*?```/g, (block) => block.replace(/^```.*\n?|```$/g, " "))
      .replace(/~~~[\s\S]*?~~~/g, (block) => block.replace(/^~~~.*\n?|~~~$/g, " "))
      .replace(/<[^>]+>/g, " ")
      .replace(/\{[\s\S]*?\}/g, " "),
  );
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
    const toc = tocFromSource(source);
    return { ...toPost(slug, metadata), source, toc };
  } catch {
    return null;
  }
}

export async function getSearchDocuments(): Promise<SearchDocument[]> {
  const files = await getMdxFiles();
  const documents = await Promise.all(files.map(async (file) => {
    const raw = await readFile(file, "utf8");
    const { metadata, source } = parseFrontmatter(raw);
    const post = toPost(slugFromFile(file), metadata);
    const text = stripMdxForSearch(source);
    return {
      ...post,
      headings: headingsFromSource(source),
      text,
      preview: text.slice(0, 180),
    };
  }));

  return documents.sort((a, b) => b.date.localeCompare(a.date));
}
