import "server-only";

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { headingsFromSource, stripMdxForSearch, tocFromSource, type TocItem } from "@/lib/mdx-content";
import { categories, type Post, type PostCategory } from "@/lib/post-types";

export type PostDocument = Post & { source: string; toc: TocItem[] };
export type SearchDocument = Post & { headings: string[]; text: string; preview: string };

const docsDirectory = path.join(process.cwd(), "docs");

function parseFrontmatter(file: string) {
  const match = file.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error("MDX 文件缺少 frontmatter");

  const visibilityPattern = /^IS_SHOW\s*(?::|=)\s*(TRUE|FALSE)\s*;?\s*$/i;
  const bodyVisibilityPattern = /^IS_SHOW\s*(?::|=)\s*(TRUE|FALSE)\s*;?\s*(?:\r?\n|$)/i;
  const frontmatterVisibility = match[1].split(/\r?\n/).find((line) => visibilityPattern.test(line))?.match(visibilityPattern)?.[1];
  const trimmedSource = match[2].trim();
  const bodyVisibility = trimmedSource.match(bodyVisibilityPattern)?.[1];
  const isShown = (frontmatterVisibility ?? bodyVisibility)?.toUpperCase() !== "FALSE";

  const metadata = Object.fromEntries(
    match[1].split(/\r?\n/).filter((line) => line && !visibilityPattern.test(line)).map((line) => {
      const separator = line.indexOf(":");
      return [line.slice(0, separator).trim(), line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "")];
    }),
  );

  const source = trimmedSource.replace(bodyVisibilityPattern, "").trim();
  return { isShown, metadata, source };
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
    const { isShown, metadata } = parseFrontmatter(raw);
    return isShown ? toPost(slugFromFile(file), metadata) : null;
  })).then((items) => items.filter((post): post is Post => post !== null));
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
    const { isShown, metadata, source } = parseFrontmatter(raw);
    if (!isShown) return null;
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
    const { isShown, metadata, source } = parseFrontmatter(raw);
    if (!isShown) return null;
    const post = toPost(slugFromFile(file), metadata);
    const text = stripMdxForSearch(source);
    return {
      ...post,
      headings: headingsFromSource(source),
      text,
      preview: text.slice(0, 180),
    };
  })).then((items) => items.filter((document): document is SearchDocument => document !== null));

  return documents.sort((a, b) => b.date.localeCompare(a.date));
}
