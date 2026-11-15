import assert from "node:assert/strict";
import test from "node:test";
import { getSnippetCategory, groupSnippets } from "../src/lib/snippet-groups.ts";

test("task directories keep their topic despite mixed code languages", () => {
  assert.equal(getSnippetCategory({ slug: "python/uv-project", language: "powershell", tags: ["uv"] }), "Python");
  assert.equal(getSnippetCategory({ slug: "docker/redis-container", language: "bash", tags: ["Redis"] }), "Docker");
  assert.equal(getSnippetCategory({ slug: "database/pgvector", language: "sql", tags: [] }), "数据库");
  assert.equal(getSnippetCategory({ slug: "git/stash", language: "bash", tags: [] }), "Git");
  assert.equal(getSnippetCategory({ slug: "java/collections", language: "java", tags: [] }), "Java");
});

test("legacy files, explicit topics and unknown directories remain classified", () => {
  assert.equal(getSnippetCategory({ slug: "redis-py", language: "python", tags: ["Redis", "Python"] }), "Redis");
  assert.equal(getSnippetCategory({ slug: "redis-py", language: "python", tags: [" redis "] }), "Redis");
  assert.equal(getSnippetCategory({ slug: "python/client", language: "python", tags: [], category: " 网络 " }), "网络");
  assert.equal(getSnippetCategory({ slug: "git/client", language: "bash", tags: [], category: " python " }), "Python");
  assert.equal(getSnippetCategory({ slug: "misc/query", language: "sql", tags: [] }), "数据库");
  assert.equal(getSnippetCategory({ slug: "misc/example", language: "typescript", tags: [] }), "TypeScript");
  assert.equal(getSnippetCategory({ slug: "misc/example", language: "rust", tags: [] }), "RUST");
  assert.equal(getSnippetCategory({ slug: "constructor/example", language: "constructor", tags: [] }), "CONSTRUCTOR");
  assert.equal(getSnippetCategory({ slug: "misc/example", language: "text", tags: [], category: " " }), "其他");
});

test("grouping keeps every filtered item and its order without changing the input", () => {
  const snippets = [
    { slug: "python/logging", language: "python", tags: [] },
    { slug: "git/stash", language: "bash", tags: [] },
    { slug: "redis-py", language: "python", tags: ["Redis"] },
    { slug: "python/uv-project", language: "powershell", tags: [] },
    { slug: "other/example", language: "text", tags: [] },
    { slug: "misc/example", language: "typescript", tags: [] },
  ];
  const original = [...snippets];
  const groups = groupSnippets(snippets);
  assert.deepEqual(groups.map((group) => group.category), ["Python", "Git", "Redis", "TypeScript", "其他"]);
  assert.deepEqual(groups[0].items, [snippets[0], snippets[3]]);
  assert.equal(groups.flatMap((group) => group.items).length, snippets.length);
  assert.strictEqual(groups[0].items[0], snippets[0]);
  assert.deepEqual(snippets, original);

  const filtered = groupSnippets(snippets.filter((snippet) => snippet.language === "powershell"));
  assert.deepEqual(filtered, [{ category: "Python", items: [snippets[3]] }]);
  assert.deepEqual(groupSnippets([]), []);
});
