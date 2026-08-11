"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, LineChart as LineChartIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ChartDatum = Record<string, string | number>;
type ChartKind = "bar" | "line" | "area";

type ChartBlockProps = {
  data: ChartDatum[];
  type?: ChartKind;
  title?: string;
  description?: string;
  xKey?: string;
  yKey?: string;
  height?: number;
  className?: string;
};

const chartColor: Record<ChartKind, string> = {
  bar: "var(--primary)",
  line: "var(--teal)",
  area: "var(--amber)",
};

export function ChartBlock({
  data,
  type = "bar",
  title,
  description,
  xKey = "name",
  yKey = "value",
  height = 280,
  className,
}: ChartBlockProps) {
  const Icon = type === "bar" ? BarChart3 : LineChartIcon;
  const color = chartColor[type];

  if (!Array.isArray(data) || data.length === 0) return null;

  return (
    <Card className={cn("mdx-chart my-8 overflow-hidden p-0", className)}>
      {(title || description) && (
        <div className="border-b border-[var(--outline)] px-5 py-4">
          {title ? (
            <h3 className="flex items-center gap-2 text-base font-semibold leading-6 text-[var(--text)]">
              <Icon size={17} />
              {title}
            </h3>
          ) : null}
          {description ? <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{description}</p> : null}
        </div>
      )}
      <div className="px-3 py-5" style={{ height }}>
        <ResponsiveContainer height="100%" width="100%">
          {type === "line" ? (
            <LineChart data={data} margin={{ bottom: 8, left: 0, right: 18, top: 8 }}>
              <CartesianGrid stroke="var(--outline)" strokeDasharray="3 3" vertical={false} />
              <XAxis axisLine={false} dataKey={xKey} tickLine={false} tickMargin={10} />
              <YAxis axisLine={false} tickLine={false} tickMargin={10} width={38} />
              <Tooltip content={<ChartTooltip />} />
              <Line dataKey={yKey} dot={{ r: 3 }} stroke={color} strokeWidth={2.4} type="monotone" />
            </LineChart>
          ) : type === "area" ? (
            <AreaChart data={data} margin={{ bottom: 8, left: 0, right: 18, top: 8 }}>
              <CartesianGrid stroke="var(--outline)" strokeDasharray="3 3" vertical={false} />
              <XAxis axisLine={false} dataKey={xKey} tickLine={false} tickMargin={10} />
              <YAxis axisLine={false} tickLine={false} tickMargin={10} width={38} />
              <Tooltip content={<ChartTooltip />} />
              <Area dataKey={yKey} fill={color} fillOpacity={0.18} stroke={color} strokeWidth={2.2} type="monotone" />
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ bottom: 8, left: 0, right: 18, top: 8 }}>
              <CartesianGrid stroke="var(--outline)" strokeDasharray="3 3" vertical={false} />
              <XAxis axisLine={false} dataKey={xKey} tickLine={false} tickMargin={10} />
              <YAxis axisLine={false} tickLine={false} tickMargin={10} width={38} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey={yKey} fill={color} radius={[6, 6, 2, 2]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function BarChartBlock(props: Omit<ChartBlockProps, "type">) {
  return <ChartBlock type="bar" {...props} />;
}

export function LineChartBlock(props: Omit<ChartBlockProps, "type">) {
  return <ChartBlock type="line" {...props} />;
}

export function AreaChartBlock(props: Omit<ChartBlockProps, "type">) {
  return <ChartBlock type="area" {...props} />;
}

function ChartTooltip({ active, label, payload }: { active?: boolean; label?: string; payload?: Array<{ value?: number | string; name?: string }> }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-[var(--outline)] bg-[var(--surface)] px-3 py-2 text-sm shadow-sm">
      {label ? <div className="font-medium text-[var(--text)]">{label}</div> : null}
      <div className="mt-1 text-[var(--muted)]">{payload[0]?.name ?? "value"}: {payload[0]?.value}</div>
    </div>
  );
}
