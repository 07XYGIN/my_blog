type GroupableSnippet = {
  slug: string;
  language: string;
  tags: readonly string[];
  category?: string;
};

const directoryCategories = new Map([
  ["python", "Python"],
  ["database", "数据库"],
  ["git", "Git"],
  ["docker", "Docker"],
  ["redis", "Redis"],
  ["java", "Java"],
]);

const languageCategories = new Map([
  ["py", "Python"],
  ["python", "Python"],
  ["java", "Java"],
  ["sql", "数据库"],
  ["mysql", "数据库"],
  ["postgresql", "数据库"],
  ["js", "JavaScript"],
  ["javascript", "JavaScript"],
  ["ts", "TypeScript"],
  ["typescript", "TypeScript"],
  ["powershell", "PowerShell"],
  ["pwsh", "PowerShell"],
  ["bash", "Bash"],
  ["shell", "Shell"],
  ["json", "JSON"],
  ["yaml", "YAML"],
]);

const categoryOrder = ["Python", "数据库", "Git", "Docker", "Redis", "Java"];

export function getSnippetCategory(snippet: GroupableSnippet): string {
  const explicitCategory = snippet.category?.trim();
  if (explicitCategory) {
    const name = explicitCategory.toLowerCase();
    return directoryCategories.get(name) ?? languageCategories.get(name) ?? explicitCategory;
  }

  const segments = snippet.slug.split("/");
  const directoryCategory = segments.length > 1
    ? directoryCategories.get(segments[0].toLowerCase())
    : undefined;
  if (directoryCategory) return directoryCategory;
  if (snippet.tags.some((tag) => tag.trim().toLowerCase() === "redis")) return "Redis";

  const language = snippet.language.trim().toLowerCase();
  if (!language || ["text", "plaintext", "plain"].includes(language)) return "其他";
  return languageCategories.get(language) ?? snippet.language.trim().toUpperCase();
}

export function groupSnippets<T extends GroupableSnippet>(snippets: readonly T[]) {
  const groups = new Map<string, T[]>();
  for (const snippet of snippets) {
    const category = getSnippetCategory(snippet);
    const group = groups.get(category);
    if (group) group.push(snippet);
    else groups.set(category, [snippet]);
  }

  function order(category: string) {
    const index = categoryOrder.indexOf(category);
    if (index !== -1) return index;
    return category === "其他" ? categoryOrder.length + 1 : categoryOrder.length;
  }

  return [...groups.entries()]
    .sort(([a], [b]) => order(a) - order(b) || a.localeCompare(b, "zh-Hans-CN"))
    .map(([category, items]) => ({ category, items }));
}
