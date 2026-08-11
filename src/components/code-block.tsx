"use client";

import * as React from "react";
import { Check, Copy, FileCode2 } from "lucide-react";
import { cn } from "@/lib/utils";

type PrettyCodeFigureProps = React.ComponentProps<"figure"> & {
  "data-rehype-pretty-code-figure"?: string;
};

type ElementProps = Record<string, unknown> & {
  children?: React.ReactNode;
};

export function CodeFigure({ children, className, ...props }: PrettyCodeFigureProps) {
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);
  const isPrettyCode = Object.prototype.hasOwnProperty.call(props, "data-rehype-pretty-code-figure");

  if (!isPrettyCode) {
    return <figure className={className} {...props}>{children}</figure>;
  }

  const nodes = React.Children.toArray(children);
  const titleNode = nodes.find(isPrettyCodeTitle);
  const codeNodes = nodes.filter((node) => node !== titleNode);
  const language = findLanguage(codeNodes);
  const title = titleNode && React.isValidElement<ElementProps>(titleNode) ? titleNode.props.children : null;
  const label = title ?? (language ? language.toUpperCase() : "Code");

  async function copy() {
    const value = bodyRef.current?.innerText ?? "";
    if (!value) return;
    await navigator.clipboard?.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <figure className={cn("code-frame my-8 overflow-hidden rounded-xl border border-[var(--code-border)] bg-[var(--code)]", className)} {...props}>
      <div className="flex items-center justify-between gap-4 border-b border-[var(--code-border)] bg-[#0d1117] px-4 py-2.5">
        <span className="meta inline-flex min-w-0 items-center gap-2 truncate text-[12px] text-[#8b949e]">
          <FileCode2 className="shrink-0" size={14} />
          <span className="truncate">{label}</span>
        </span>
        <button
          className="focus-ring inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 font-meta text-[12px] text-[#8b949e] transition hover:bg-white/5 hover:text-[#c0c1ff]"
          onClick={copy}
          type="button"
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? "已复制" : "复制"}
        </button>
      </div>
      <div className="code-frame__body" ref={bodyRef}>{codeNodes}</div>
    </figure>
  );
}

function isPrettyCodeTitle(node: React.ReactNode) {
  return React.isValidElement<ElementProps>(node) && Object.prototype.hasOwnProperty.call(node.props, "data-rehype-pretty-code-title");
}

function findLanguage(children: React.ReactNode): string | undefined {
  for (const child of React.Children.toArray(children)) {
    if (!React.isValidElement<ElementProps>(child)) continue;

    const language = child.props["data-language"];
    if (typeof language === "string" && language.length > 0) return language;

    const nestedLanguage = findLanguage(child.props.children);
    if (nestedLanguage) return nestedLanguage;
  }

  return undefined;
}
