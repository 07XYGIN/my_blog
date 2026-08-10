"use client";

import { Check, Copy } from "lucide-react";
import { useRef, useState } from "react";

export function CodeFrame({ children }: { children: React.ReactNode }) {
  const codeRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    const value = codeRef.current?.innerText ?? "";
    await navigator.clipboard?.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return <div className="my-8 overflow-hidden rounded-xl border border-[#2a2f38] bg-[#161b22]">
    <div className="flex items-center justify-between border-b border-[#2a2f38] bg-[#0d1117] px-4 py-2"><span className="meta text-[12px] uppercase tracking-wider text-[#8b949e]">Code</span><button type="button" onClick={copy} className="focus-ring flex items-center gap-1 font-meta text-[12px] text-[#8b949e] hover:text-[#c0c1ff]">{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? "已复制" : "复制"}</button></div>
    <pre ref={codeRef} className="overflow-x-auto p-4 font-meta text-[13px] leading-relaxed"><code>{children}</code></pre>
  </div>;
}
