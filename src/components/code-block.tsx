"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { isValidElement } from "react";

const DEFAULT_CODE = `package main

import (
    "context"
    "log"
    "time"

    "github.com/sony/gobreaker"
)

func main() {
    // 初始化断路器
    cb := gobreaker.NewCircuitBreaker(gobreaker.Settings{
        Name:        "user-service",
        MaxRequests: 3,
        Interval:    5 * time.Second,
        Timeout:     10 * time.Second,
    })

    // 包装调用
    body, err := cb.Execute(func() (interface{}, error) {
        return fetchUserData(context.Background())
    })

    if err != nil {
        log.Printf("触发降级: %v", err)
    }
}`;

export function CodeBlock({ children }: { children?: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const extractText = (node: React.ReactNode): string => {
    if (typeof node === "string" || typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(extractText).join("");
    if (isValidElement<{ children?: React.ReactNode }>(node)) return extractText(node.props.children);
    return "";
  };
  const code = extractText(children) || DEFAULT_CODE;
  async function copy() {
    await navigator.clipboard?.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }
  return <div className="my-8 overflow-hidden rounded-xl border border-[#2a2f38] bg-[#161b22]">
    <div className="flex items-center justify-between border-b border-[#2a2f38] bg-[#0d1117] px-4 py-2"><span className="meta text-[13px] text-[#8b949e]">main.go</span><button type="button" onClick={copy} className="focus-ring flex items-center gap-1 font-meta text-[13px] text-[#8b949e] hover:text-[#c0c1ff]">{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? "已复制" : "复制"}</button></div>
    <pre className="overflow-x-auto p-4 font-meta text-[13px] leading-relaxed text-[#e6edf3]"><code>{code}</code></pre>
  </div>;
}
