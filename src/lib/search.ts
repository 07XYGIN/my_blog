import "server-only";

import { stripMdxForSearch } from "@/lib/mdx-content";
import { getSearchDocuments } from "@/lib/posts";
import { getCodeSnippets } from "@/lib/snippets";

export type KnowledgeDocument = {
  href: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: string;
  text: string;
  preview: string;
  headings: string[];
};

export async function getKnowledgeDocuments(): Promise<KnowledgeDocument[]> {
  const [posts, snippets] = await Promise.all([getSearchDocuments(), getCodeSnippets()]);
  const documents: KnowledgeDocument[] = posts.map((post) => ({
    href: `/blog/${post.slug}`,
    title: post.title,
    description: post.description,
    category: post.category,
    tags: post.tags,
    date: post.date,
    text: post.text,
    preview: post.preview,
    headings: post.headings,
  }));

  for (const snippet of snippets) {
    const text = stripMdxForSearch(snippet.source);
    documents.push({
      href: `/snippets/${snippet.slug}`,
      title: snippet.title,
      description: snippet.description,
      category: "速查",
      tags: snippet.tags,
      date: snippet.date,
      text,
      preview: text.slice(0, 180),
      headings: snippet.toc.map((heading) => heading.title),
    });
  }

  return documents.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, "zh-Hans-CN"));
}
