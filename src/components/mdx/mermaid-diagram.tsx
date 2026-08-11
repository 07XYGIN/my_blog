"use client";

import mermaid from "mermaid";
import { AlertTriangle, Check, Copy, GitBranch, Move, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type MermaidDiagramProps = {
  chart: string;
  title?: string;
  className?: string;
};

export function MermaidDiagram({ chart, title = "Mermaid", className }: MermaidDiagramProps) {
  const baseId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [svg, setSvg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; originX: number; originY: number } | null>(null);
  const sourceRef = useRef<HTMLPreElement>(null);

  const updateScale = useCallback((nextScale: number, anchor?: { x: number; y: number }) => {
    const clampedScale = clamp(nextScale, 0.5, 2.5);
    if (anchor && clampedScale !== scale) {
      const ratio = clampedScale / scale;
      setOffset((currentOffset) => ({
        x: anchor.x - (anchor.x - currentOffset.x) * ratio,
        y: anchor.y - (anchor.y - currentOffset.y) * ratio,
      }));
    }
    setScale(clampedScale);
  }, [scale]);

  useEffect(() => {
    const root = document.documentElement;
    const updateTheme = () => setIsDark(root.classList.contains("dark"));
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let active = true;
    const rootStyle = getComputedStyle(document.documentElement);
    const text = cssVar(rootStyle, "--text", isDark ? "#f2f3ed" : "#171915");
    const muted = cssVar(rootStyle, "--muted", isDark ? "#a3a89b" : "#65685e");
    const primary = cssVar(rootStyle, "--primary", isDark ? "#b5ca87" : "#4d5d30");
    const surface = cssVar(rootStyle, "--surface", isDark ? "#171a15" : "#fcfcf9");
    const outline = cssVar(rootStyle, "--outline", isDark ? "#343a30" : "#d9dbd1");

    async function renderDiagram() {
      setSvg("");
      setError(null);

      try {
        mermaid.initialize({
          fontFamily: "Aptos, Segoe UI Variable, Noto Sans SC, sans-serif",
          securityLevel: "strict",
          startOnLoad: false,
          theme: "base",
          themeVariables: {
            actorBorder: outline,
            actorBkg: surface,
            actorTextColor: text,
            background: "transparent",
            edgeLabelBackground: surface,
            lineColor: muted,
            mainBkg: surface,
            nodeBorder: primary,
            noteBkgColor: surface,
            noteTextColor: text,
            primaryBorderColor: primary,
            primaryColor: surface,
            primaryTextColor: text,
            secondaryColor: isDark ? "#203a36" : "#e1efeb",
            tertiaryColor: isDark ? "#303c24" : "#e3e9d7",
            textColor: text,
          },
        });

        const { svg: renderedSvg } = await mermaid.render(`mermaid-${baseId}-${Date.now()}`, chart);
        if (active) setSvg(renderedSvg);
      } catch (reason) {
        if (active) setError(reason instanceof Error ? reason.message : "Mermaid 图表解析失败");
      }
    }

    renderDiagram();
    return () => {
      active = false;
    };
  }, [baseId, chart, isDark]);

  async function copySource() {
    const value = sourceRef.current?.innerText ?? chart;
    if (!value) return;
    await navigator.clipboard?.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  function zoomBy(delta: number) {
    updateScale(scale + delta);
  }

  function resetView() {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }

  function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
    if (!svg) return;
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    updateScale(scale + (event.deltaY > 0 ? -0.1 : 0.1), {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!svg || event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: offset.x,
      originY: offset.y,
    };
    setIsDragging(true);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    setOffset({
      x: drag.originX + event.clientX - drag.startX,
      y: drag.originY + event.clientY - drag.startY,
    });
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
    setIsDragging(false);
  }

  const zoomLabel = `${Math.round(scale * 100)}%`;

  return (
    <figure className={cn("mdx-mermaid my-8 overflow-hidden rounded-xl border border-[var(--outline)] bg-[var(--surface)]", className)}>
      <figcaption className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--outline)] bg-[var(--surface-low)] px-4 py-2.5">
        <span className="flex items-center gap-2 text-sm font-medium text-[var(--text)]">
          <GitBranch size={16} />
          {title}
        </span>
        <div className="flex items-center gap-1">
          <button aria-label="缩小流程图" className="mdx-mermaid__button focus-ring" onClick={() => zoomBy(-0.15)} title="缩小" type="button">
            <ZoomOut size={14} />
          </button>
          <span className="meta min-w-12 text-center text-[11px] text-[var(--muted)]">{zoomLabel}</span>
          <button aria-label="放大流程图" className="mdx-mermaid__button focus-ring" onClick={() => zoomBy(0.15)} title="放大" type="button">
            <ZoomIn size={14} />
          </button>
          <button aria-label="复位流程图" className="mdx-mermaid__button focus-ring" onClick={resetView} title="复位" type="button">
            <RotateCcw size={14} />
          </button>
          <span aria-hidden className="mdx-mermaid__button text-[var(--muted)]" title="拖拽移动">
            <Move size={14} />
          </span>
          <button className="focus-ring inline-flex items-center gap-1 rounded-md px-2 py-1 font-meta text-xs text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--primary)]" onClick={copySource} type="button">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {/* {copied ? "已复制" : "复制源码"} */}
          </button>
        </div>
      </figcaption>
      <pre className="sr-only" ref={sourceRef}>{chart}</pre>
      {error ? (
        <div className="flex items-start gap-3 px-4 py-5 text-sm text-[var(--muted)]">
          <AlertTriangle className="mt-0.5 shrink-0 text-[var(--amber)]" size={17} />
          <div>
            <p className="font-medium text-[var(--text)]">Mermaid 渲染失败</p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      ) : (
        <div
          className={cn("mdx-mermaid__viewport", isDragging && "is-dragging")}
          onPointerCancel={endDrag}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onWheel={handleWheel}
        >
          {svg ? (
            <div
              className="mdx-mermaid__canvas"
              dangerouslySetInnerHTML={{ __html: svg }}
              style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}
            />
          ) : (
            <div className="mdx-mermaid__placeholder">正在渲染图表...</div>
          )}
        </div>
      )}
    </figure>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function cssVar(styles: CSSStyleDeclaration, name: string, fallback: string) {
  return styles.getPropertyValue(name).trim() || fallback;
}
