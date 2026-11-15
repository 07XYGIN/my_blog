"use client";

import * as React from "react";
import { Check, Copy, FileCode2, Maximize2, WrapText, X } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type PrettyCodeFigureProps = React.ComponentProps<"figure"> & {
  "data-rehype-pretty-code-figure"?: string;
};

type ElementProps = Record<string, unknown> & {
  children?: React.ReactNode;
};

const actionClassName = "focus-ring inline-flex size-8 shrink-0 items-center justify-center rounded-md text-[var(--code-muted)] transition hover:bg-white/5 hover:text-[var(--code-accent)]";

export function CodeFigure({ children, className, ...props }: PrettyCodeFigureProps) {
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const copyTimeoutRef = React.useRef<number | null>(null);
  const [copyStatus, setCopyStatus] = React.useState<"idle" | "copied" | "error">("idle");
  const [wrapLines, setWrapLines] = React.useState(true);
  const isPrettyCode = Object.prototype.hasOwnProperty.call(props, "data-rehype-pretty-code-figure");

  React.useEffect(() => () => {
    if (copyTimeoutRef.current !== null) window.clearTimeout(copyTimeoutRef.current);
  }, []);

  if (!isPrettyCode) {
    return <figure className={className} {...props}>{children}</figure>;
  }

  const nodes = React.Children.toArray(children);
  const titleNode = nodes.find(isPrettyCodeTitle);
  const codeNodes = nodes.filter((node) => node !== titleNode);
  const language = findLanguage(codeNodes);
  const title = titleNode && React.isValidElement<ElementProps>(titleNode) ? titleNode.props.children : null;
  const label = title ?? (language ? language.toUpperCase() : "Code");
  const copyLabel = copyStatus === "copied" ? "已复制" : copyStatus === "error" ? "复制失败，请重试" : "复制代码";

  async function copy() {
    const value = bodyRef.current?.querySelector("code")?.textContent ?? "";
    if (!value) return;
    if (copyTimeoutRef.current !== null) window.clearTimeout(copyTimeoutRef.current);

    try {
      await navigator.clipboard.writeText(value);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }

    copyTimeoutRef.current = window.setTimeout(() => setCopyStatus("idle"), 1500);
  }

  const copyButton = (
    <button aria-label={copyLabel} className={actionClassName} onClick={copy} title={copyLabel} type="button">
      {copyStatus === "copied" ? <Check size={15} /> : <Copy size={15} />}
    </button>
  );

  return (
    <Dialog>
      <figure className={cn("code-frame my-8 overflow-hidden rounded-xl border border-[var(--code-border)] bg-[var(--code)]", className)} {...props}>
        <div className="flex items-center justify-between gap-4 border-b border-[var(--code-border)] bg-[var(--code-header)] px-4 py-2.5">
          <span className="meta inline-flex min-w-0 items-center gap-2 truncate text-[12px] text-[var(--code-muted)]">
            <FileCode2 className="shrink-0" size={14} />
            <span className="truncate">{label}</span>
          </span>
          <div className="flex shrink-0 items-center gap-1">
            <DialogTrigger asChild>
              <button aria-label="展开完整代码" className={actionClassName} title="展开完整代码" type="button">
                <Maximize2 size={15} />
              </button>
            </DialogTrigger>
            {copyButton}
          </div>
        </div>
        <div className="code-frame__body" ref={bodyRef}>{codeNodes}</div>
        <span aria-live="polite" className="sr-only">{copyStatus === "idle" ? "" : copyLabel}</span>
      </figure>

      <DialogContent className="code-viewer flex flex-col gap-0 overflow-hidden border-[var(--code-border)] bg-[var(--code)] p-0 text-[var(--code-fg)]" showCloseButton={false}>
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--code-border)] bg-[var(--code-header)] px-4 py-3">
          <DialogTitle className="flex min-w-0 items-center gap-2 font-meta text-sm font-normal">
            <FileCode2 className="shrink-0 text-[var(--code-muted)]" size={16} />
            <span className="truncate">{label}</span>
          </DialogTitle>
          <DialogDescription className="sr-only">完整代码</DialogDescription>
          <div className="flex shrink-0 items-center gap-1">
            <button
              aria-label="自动换行"
              aria-pressed={wrapLines}
              className={cn(actionClassName, wrapLines && "bg-white/10 text-[var(--code-fg)]")}
              onClick={() => setWrapLines((value) => !value)}
              title={wrapLines ? "关闭自动换行" : "开启自动换行"}
              type="button"
            >
              <WrapText size={16} />
            </button>
            {copyButton}
            <DialogClose asChild>
              <button aria-label="关闭代码预览" className={actionClassName} title="关闭代码预览" type="button">
                <X size={18} />
              </button>
            </DialogClose>
          </div>
        </div>
        {/* Dialog renders outside the article, so restore its code styles without the snippet height limit. */}
        <div className="code-viewer__body prose-content min-h-0 flex-1 overflow-auto" role="region" aria-label="完整代码内容" tabIndex={0}>
          <div className="code-frame" data-wrap={wrapLines}>{codeNodes}</div>
        </div>
        <span aria-live="polite" className="sr-only">{copyStatus === "idle" ? "" : copyLabel}</span>
      </DialogContent>
    </Dialog>
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
