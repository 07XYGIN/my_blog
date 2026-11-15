export type TocItem = { id: string; title: string; level: number };

export function headingId(title: string) {
  return title.toLowerCase().replace(/[`*_]/g, "").replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "");
}

export function uniqueHeadingId(title: string, counts: Map<string, number>) {
  const base = headingId(title) || "section";
  const count = counts.get(base) ?? 0;
  counts.set(base, count + 1);
  return count === 0 ? base : `${base}-${count + 1}`;
}

function cleanText(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/[`*~>#\[\]()+|:-]/g, " ")
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

export function headingsFromSource(source: string) {
  return headingEntriesFromSource(source).map((heading) => heading.title);
}

export function tocFromSource(source: string): TocItem[] {
  const counts = new Map<string, number>();
  return headingEntriesFromSource(source).map((heading) => ({
    ...heading,
    id: uniqueHeadingId(heading.title, counts),
  }));
}

export function stripMdxForSearch(source: string) {
  let fence: { marker: string; length: number } | null = null;
  return source.split(/\r?\n/).map((line) => {
    const match = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (match) {
      const marker = match[1][0];
      const length = match[1].length;
      if (!fence) {
        fence = { marker, length };
        return "";
      }
      if (fence.marker === marker && length >= fence.length && !line.slice(match[0].length).trim()) {
        fence = null;
        return "";
      }
    }

    // Preserve code identifiers, comparisons and markup examples in the search index.
    return fence ? line : line.replace(/<[^>]+>/g, " ").replace(/^ {0,3}#{1,6}\s+/g, "");
  }).join(" ")
    .replace(/\s+/g, " ")
    .trim();
}
