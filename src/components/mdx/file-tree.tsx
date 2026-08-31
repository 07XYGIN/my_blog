import { FileText, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

type FileTreeProps = {
  items?: string[];
  tree?: string[];
  rootLabel?: string;
  className?: string;
};

type TreeNode = {
  name: string;
  path: string;
  isFile: boolean;
  children: TreeNode[];
};

export function FileTree({ items, tree, rootLabel = "project", className }: FileTreeProps) {
  const paths = tree ?? items ?? [];
  const nodes = buildTree(paths);
  return (
    <div className={cn("mdx-file-tree my-8 overflow-hidden rounded-xl border border-[var(--outline)] bg-[var(--surface)]", className)}>
      <div className="flex items-center gap-2 border-b border-[var(--outline)] px-4 py-3 text-sm font-medium text-[var(--text)]">
        <FolderOpen size={16} />
        {rootLabel}
      </div>
      <div className="px-4 py-3">
        <TreeList nodes={nodes} />
      </div>
    </div>
  );
}

function TreeList({ nodes }: { nodes: TreeNode[] }) {
  return (
    <ul className="space-y-1">
      {nodes.map((node) => (
        <li key={node.path}>
          <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-[var(--muted)] hover:bg-[var(--surface-low)] hover:text-[var(--text)]">
            {node.isFile ? <FileText size={15} /> : <FolderOpen size={15} />}
            <span>{node.name}</span>
          </div>
          {!node.isFile && node.children.length > 0 ? (
            <div className="ml-5 border-l border-dashed border-[var(--outline)] pl-3">
              <TreeList nodes={node.children} />
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function buildTree(paths: string[]) {
  const root: TreeNode = { name: "", path: "", isFile: false, children: [] };

  for (const input of paths) {
    const marksDirectory = /[\\/]$/.test(input);
    const normalized = input.replaceAll("\\", "/").replace(/^\/+|\/+$/g, "");
    if (!normalized) continue;
    const parts = normalized.split("/").filter(Boolean);
    let current = root;

    parts.forEach((part, index) => {
      const path = parts.slice(0, index + 1).join("/");
      let child = current.children.find((node) => node.name === part);
      if (!child) {
        child = {
          name: part,
          path,
          isFile: index === parts.length - 1 && !marksDirectory,
          children: [],
        };
        current.children.push(child);
        current.children.sort((a, b) => Number(a.isFile) - Number(b.isFile) || a.name.localeCompare(b.name, "zh-Hans-CN"));
      }
      current = child;
    });
  }

  return root.children;
}
