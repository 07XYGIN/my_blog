import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { tocFromSource, uniqueHeadingId } from "../src/lib/mdx-content.ts";

const root = path.resolve(import.meta.dirname, "..");

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(target) : entry.name.endsWith(".mdx") ? [target] : [];
  }));
  return files.flat();
}

function nodeText(node) {
  return node.value ?? node.children?.map(nodeText).join("") ?? "";
}

async function readDocument(file) {
  const source = await readFile(file, "utf8");
  const headings = [];
  const links = [];
  const code = [];
  const capture = () => (tree) => {
    function visit(node) {
      if (node.type === "heading") headings.push({ title: nodeText(node), level: node.depth });
      if (node.type === "link" || node.type === "image") links.push(node.url);
      if (node.type === "code") code.push({ language: node.lang, value: node.value });
      if (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") {
        for (const attr of node.attributes ?? []) {
          if (["href", "src"].includes(attr.name) && typeof attr.value === "string") links.push(attr.value);
        }
      }
      node.children?.forEach(visit);
    }
    visit(tree);
  };
  const { frontmatter } = await serialize(source, {
    parseFrontmatter: true,
    blockJS: false,
    mdxOptions: { remarkPlugins: [remarkGfm, remarkMath, capture] },
  }).catch((error) => {
    throw new Error(`${file}: ${error.message}`, { cause: error });
  });
  const relative = path.relative(path.join(root, "docs"), file).replaceAll("\\", "/");
  const snippet = relative.startsWith("code/");
  const project = file.startsWith(path.join(root, "content", "projects"));
  const slug = snippet ? relative.slice(5, -4) : path.basename(file, ".mdx");
  const route = project ? "/projects" : `/${snippet ? "snippets" : "blog"}/${slug}`;
  const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
  return { file, source, body, frontmatter, headings, links, code, snippet, project, route, slug };
}

const documents = await Promise.all((await filesUnder(path.join(root, "docs"))).map(readDocument));
const projects = await Promise.all((await filesUnder(path.join(root, "content", "projects"))).map(readDocument));
const publicDocuments = documents.filter((doc) => doc.frontmatter.IS_SHOW !== false && !/^IS_SHOW\s*=\s*FALSE/im.test(doc.body));
const routes = new Map(publicDocuments.map((doc) => [doc.route, doc]));

test("published content has unique routes, complete metadata and useful snippet details", () => {
  assert.equal(routes.size, publicDocuments.length, "duplicate content route");
  for (const doc of publicDocuments) {
    const metadata = doc.frontmatter;
    for (const key of ["title", "description", "date", "tags", doc.snippet ? "language" : "category"]) {
      assert.ok(typeof metadata[key] === "string" && metadata[key].trim(), `${doc.file}: missing ${key}`);
    }
    assert.match(metadata.date, /^\d{4}-\d{2}-\d{2}$/, doc.file);
    const counts = new Map();
    assert.deepEqual(tocFromSource(doc.body).map(({ id, level }) => ({ id, level })), doc.headings.map((heading) => ({
      level: heading.level, id: uniqueHeadingId(heading.title, counts),
    })), `${doc.file}: directory differs from parsed headings`);
    if (doc.snippet) {
      assert.ok(doc.code.some((block) => block.language !== "mermaid"), `${doc.file}: no code preview`);
      assert.ok(doc.headings.filter((heading) => heading.level === 2).length >= 2, `${doc.file}: missing detail sections`);
    }
  }
});

test("article links, snippet sources and project associations resolve to public content", () => {
  for (const doc of [...publicDocuments, ...projects]) {
    const links = [...doc.links];
    if (doc.frontmatter.originHref) links.push(doc.frontmatter.originHref);
    if (doc.project) {
      for (const slug of doc.frontmatter.relatedPosts ?? []) links.push(`/blog/${slug}`);
    }
    for (const link of links) {
      if (!link.startsWith("#") && !/^\/(blog|snippets)\//.test(link) && !/^\/projects(?:\/|#|$)/.test(link)) continue;
      const url = new URL(link, `https://content.local${doc.route}`);
      if (url.pathname === "/projects") {
        if (url.hash) assert.ok(projects.some((project) => project.slug === decodeURIComponent(url.hash.slice(1))), `${doc.file}: missing project anchor ${link}`);
        continue;
      }
      const target = routes.get(decodeURI(url.pathname).replace(/\/$/, ""));
      assert.ok(target, `${doc.file}: unpublished or missing target ${link}`);
      if (url.hash) {
        const id = decodeURIComponent(url.hash.slice(1));
        assert.ok(tocFromSource(target.body).some((heading) => heading.id === id), `${doc.file}: missing anchor ${link}`);
      }
    }
  }
});

test("Python examples are syntactically valid", (context) => {
  const blocks = publicDocuments.flatMap((doc) => doc.code
    .filter((block) => ["python", "py"].includes(block.language))
    .map((block, index) => ({ file: `${path.relative(root, doc.file)} block ${index + 1}`, code: block.value })));
  const script = [
    "import ast, json, sys",
    "blocks = json.loads(sys.stdin.buffer.read().decode('utf-8'))",
    "errors = []",
    "for block in blocks:",
    "    try:",
    "        ast.parse(block['code'], filename=block['file'])",
    "    except SyntaxError as exc:",
    "        errors.append(str(exc))",
    "print(json.dumps({'blocks': len(blocks), 'errors': errors}))",
    "sys.exit(bool(errors))",
  ].join("\n");
  const result = spawnSync("python", ["-c", script], { input: JSON.stringify(blocks), encoding: "utf8" });
  if (result.error?.code === "ENOENT") return context.skip("Python is not installed");
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  context.diagnostic(`${blocks.length} Python code blocks parsed; external services were not invoked`);
});
