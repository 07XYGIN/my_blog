import assert from "node:assert/strict";
import test from "node:test";
import { stripMdxForSearch, tocFromSource } from "../src/lib/mdx-content.ts";
import { remarkSnippetPreview } from "../src/lib/remark-snippet-preview.ts";

test("code search preserves identifiers, comparisons and markup examples", () => {
  const source = [
    '<Callout title="说明">',
    "代码示例",
    "</Callout>",
    '```python title="example.py"',
    "if n < 3:",
    "    do_work()",
    "def next_call() -> None:",
    "    return None",
    "```",
    "~~~html",
    '<button class="save_button">保存</button>',
    "~~~",
  ].join("\n");
  const text = stripMdxForSearch(source);
  assert.ok(text.includes("if n < 3: do_work() def next_call() -> None:"));
  assert.ok(text.includes('<button class="save_button">保存</button>'));
  assert.ok(!text.includes("<Callout"));
  assert.ok(!text.includes("```python"));
});

test("article and snippet directories exclude fenced headings and deduplicate anchors", () => {
  const source = [
    "## 使用方式",
    "~~~python",
    "## 代码注释",
    "~~~",
    "## 使用方式",
    "### 参数",
  ].join("\n");
  assert.deepEqual(tocFromSource(source), [
    { id: "使用方式", title: "使用方式", level: 2 },
    { id: "使用方式-2", title: "使用方式", level: 2 },
    { id: "参数", title: "参数", level: 3 },
  ]);
});

test("snippet preview selects one complete code block without its surrounding prose", () => {
  const code = { type: "code", lang: "python", value: "print('complete')" };
  const tree = {
    type: "root",
    children: [
      { type: "paragraph", children: [] },
      { type: "code", lang: "mermaid", value: "graph TD; A-->B" },
      { type: "mdxJsxFlowElement", children: [code] },
      { type: "code", lang: "python", value: "print('later')" },
    ],
  };
  remarkSnippetPreview()(tree);
  assert.deepEqual(tree.children, [code]);
});

test("directory anchors preserve the same identifier boundaries as rendered headings", () => {
  assert.deepEqual(tocFromSource("### 完整脚本：create_agent 与会话历史\n### 使用 `bind_tools`"), [
    { id: "完整脚本-createagent-与会话历史", title: "完整脚本：create_agent 与会话历史", level: 3 },
    { id: "使用-bindtools", title: "使用 bind_tools", level: 3 },
  ]);
});
