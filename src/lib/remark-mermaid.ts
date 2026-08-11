type MarkdownNode = {
  type: string;
  lang?: string;
  meta?: string;
  value?: string;
  children?: MarkdownNode[];
  name?: string;
  attributes?: Array<{ type: string; name: string; value?: string }>;
};

export function remarkMermaid() {
  return (tree: MarkdownNode) => {
    transformMermaidBlocks(tree);
  };
}

function transformMermaidBlocks(node: MarkdownNode) {
  if (!node.children) return;

  node.children = node.children.map((child) => {
    if (child.type === "code" && child.lang === "mermaid" && typeof child.value === "string") {
      return {
        type: "mdxJsxFlowElement",
        name: "MermaidDiagram",
        attributes: [
          { type: "mdxJsxAttribute", name: "chart", value: child.value },
          ...titleAttributes(child.meta),
        ],
        children: [],
      };
    }

    transformMermaidBlocks(child);
    return child;
  });
}

function titleAttributes(meta?: string) {
  const title = meta?.match(/title="([^"]+)"/)?.[1];
  return title ? [{ type: "mdxJsxAttribute", name: "title", value: title }] : [];
}
