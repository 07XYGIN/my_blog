import * as React from "react";
import { AlertCircle, CheckCircle2, Info, Lightbulb, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { AreaChartBlock, BarChartBlock, ChartBlock, LineChartBlock } from "@/components/mdx/chart-block";
import { FileTree } from "@/components/mdx/file-tree";
import { MermaidDiagram } from "@/components/mdx/mermaid-diagram";
import { CodeFigure } from "@/components/code-block";
import { uniqueHeadingId } from "@/lib/posts";

type CalloutKind = "note" | "tip" | "warning" | "danger" | "interview";

const calloutMeta: Record<CalloutKind, { title: string; icon: React.ElementType; className: string }> = {
  note: { title: "说明", icon: Info, className: "border-[var(--outline)] bg-[var(--surface)]" },
  tip: { title: "提示", icon: Lightbulb, className: "border-[var(--teal)] bg-[var(--teal-soft)]" },
  warning: { title: "注意", icon: TriangleAlert, className: "border-[var(--amber)] bg-[var(--amber-soft)]" },
  danger: { title: "警告", icon: AlertCircle, className: "mdx-callout-danger border-[#b04d4d] bg-[#f9ecec] text-[#8e2f2f]" },
  interview: { title: "面试重点", icon: CheckCircle2, className: "border-[var(--primary)] bg-[var(--primary-soft)]" },
};

export function getMdxComponents(headingCounts: Map<string, number>) {
  return {
    figure: CodeFigure,
    table: MdxTable,
    Callout,
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    MermaidDiagram,
    ChartBlock,
    BarChartBlock,
    LineChartBlock,
    AreaChartBlock,
    FileTree,
    Steps,
    Step,
    Details,
    Badge,
    Card,
    h2: ({ children }: React.ComponentProps<"h2">) => <h2 id={uniqueHeadingId(String(children), headingCounts)}>{children}</h2>,
  };
}

export function MdxTable({ children, ...props }: React.ComponentProps<"table">) {
  return <div className="table-scroll"><table {...props}>{children}</table></div>;
}

export function Callout({ type = "note", title, children }: { type?: CalloutKind; title?: string; children: React.ReactNode }) {
  const meta = calloutMeta[type] ?? calloutMeta.note;
  const Icon = meta.icon;
  return (
    <Alert className={cn("mdx-callout my-8 gap-0 overflow-hidden", meta.className)}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-current/15 bg-white/40">
          <Icon size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <AlertTitle>{title ?? meta.title}</AlertTitle>
          <AlertDescription>{children}</AlertDescription>
        </div>
      </div>
    </Alert>
  );
}

export function Steps({ children }: { children: React.ReactNode }) {
  return <ol className="mdx-steps my-8">{children}</ol>;
}

export function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <li className="mdx-step">
      <div className="mdx-step__title">{title}</div>
      <div className="mdx-step__body">{children}</div>
    </li>
  );
}

export function Details({ title, children, open }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details className="mdx-details my-8" open={open}>
      <summary>{title}</summary>
      <div>{children}</div>
    </details>
  );
}
