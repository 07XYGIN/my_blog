type MarkdownNode = {
  type: string;
  lang?: string | null;
  children?: MarkdownNode[];
};

export function remarkSnippetPreview() {
  return (tree: MarkdownNode) => {
    const code = findCode(tree);
    tree.children = code ? [code] : [];
  };
}

function findCode(node: MarkdownNode): MarkdownNode | undefined {
  if (node.type === "code" && node.lang !== "mermaid") return node;
  for (const child of node.children ?? []) {
    const code = findCode(child);
    if (code) return code;
  }
}
