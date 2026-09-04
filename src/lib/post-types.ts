export const categories = ["全部", "前端", "Python", "Java", "Agent", "Rust","其他"] as const;
export type PostCategory = Exclude<(typeof categories)[number], "全部">;

export type Post = {
  slug: string;
  title: string;
  description: string;
  category: PostCategory;
  tags: string[];
  date: string;
  readTime: string;
  author: string;
};
