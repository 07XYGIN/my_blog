"use client";

import { ArrowUpRight, Check, Compass, MoveRight, Pause, Play, Radio, RotateCw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { NowSnapshot } from "@/lib/now";

type Mode = "focus" | "ship" | "reset";

const modes: Record<Mode, { label: string; eyebrow: string; copy: string; action: string }> = {
  focus: { label: "深挖", eyebrow: "FOCUS MODE", copy: "把注意力放在一个真正值得继续的问题上。", action: "保持专注" },
  ship: { label: "交付", eyebrow: "SHIP MODE", copy: "让一个小的、可用的结果先离开草稿区。", action: "推进一格" },
  reset: { label: "整理", eyebrow: "RESET MODE", copy: "清理暂时不用的东西，为下一次构建留出空间。", action: "重新排列" },
};

export function NowCommandCenter({ snapshot }: { snapshot: NowSnapshot }) {
  const [mode, setMode] = useState<Mode>("focus");
  const activeMode = modes[mode];

  return (
    <section className="now-console" aria-label="当前状态控制台">
      <div className="now-console__topline">
        <span className="now-console__label"><Radio size={13} /> LIVE CONTEXT</span>
        <span className="now-console__sync">SYNCED / {snapshot.date.replaceAll("-", ".")}</span>
      </div>

      <div className="now-console__body">
        <div className="now-console__signal">
          <div className="now-console__signal-head">
            <span>当前信号</span>
            <strong><i /> STABLE</strong>
          </div>
          <div className="now-pulse" aria-hidden="true">
            <svg viewBox="0 0 640 180" preserveAspectRatio="none">
              <path className="now-pulse__grid" d="M0 30H640M0 90H640M0 150H640M80 0V180M200 0V180M320 0V180M440 0V180M560 0V180" />
              <path className="now-pulse__line" d="M0 112H78L102 112L118 70L136 138L154 96L178 96L194 54L214 126L238 126L258 92L275 107L298 107L320 43L342 135L365 135L389 74L408 106L431 106L454 82L470 110L498 110L522 61L540 121L562 96L588 96L606 66L622 113L640 113" />
              <path className="now-pulse__marker" d="M320 23V157" />
              <rect className="now-pulse__node" height="8" width="8" x="316" y="39" />
              <rect className="now-pulse__node now-pulse__node--amber" height="8" width="8" x="518" y="57" />
            </svg>
          </div>
          <div className="now-console__signal-foot">
            <div><span className="now-console__tiny">SIGNAL / 01</span><strong>{snapshot.signal}</strong></div>
            <span className="now-console__readout">{snapshot.focus[0].progress}%<small> IN MOTION</small></span>
          </div>
        </div>

        <div className="now-console__focus">
          <div className="now-console__focus-head"><span>工作台队列</span><span>{snapshot.focus.length} ACTIVE THREADS</span></div>
          <ol>
            {snapshot.focus.map((item, index) => (
              <li key={item.label}>
                <div className="now-focus__meta"><span><b>0{index + 1}</b>{item.label}</span><span>{item.progress}%</span></div>
                <div className="now-focus__bar" aria-label={`${item.label} 完成度 ${item.progress}%`}><span className={`now-focus__fill now-focus__fill--${item.tone}`} style={{ "--progress": `${item.progress}%` } as React.CSSProperties} /></div>
                <p>{item.detail}</p>
              </li>
            ))}
          </ol>
          <div className="now-console__next"><MoveRight size={15} /><span>下一步</span><strong>{snapshot.next}</strong></div>
        </div>
      </div>

      <div className="now-console__bottom">
        <div className="now-modes" role="tablist" aria-label="工作节奏">
          {(Object.keys(modes) as Mode[]).map((key) => (
            <button className={mode === key ? "is-active" : ""} key={key} onClick={() => setMode(key)} role="tab" aria-selected={mode === key} type="button">
              {mode === key ? <Pause size={12} /> : <Play size={12} />}{modes[key].label}
            </button>
          ))}
        </div>
        <div className="now-console__mode-copy">
          <span>{activeMode.eyebrow}</span><strong>{activeMode.copy}</strong>
        </div>
        <button className="now-console__mode-action" type="button" onClick={() => setMode(mode === "reset" ? "focus" : mode === "focus" ? "ship" : "reset")} aria-label={`${activeMode.action}，切换工作节奏`}>
          <RotateCw size={14} />
        </button>
      </div>

      <div className="now-console__links">
        <span><Check size={13} /> 本周节奏保持轻量</span>
        <Link href="/timeline">查看构建轨迹 <ArrowUpRight size={14} /></Link>
      </div>
    </section>
  );
}

export function NowTrail() {
  return (
    <nav className="now-trail" aria-label="继续探索">
      <div><span className="eyebrow">Continue exploring</span><strong>从近况，走向更完整的上下文。</strong></div>
      <div className="now-trail__links">
        <Link href="/projects"><span>01</span>项目档案<ArrowUpRight size={14} /></Link>
        <Link href="/about"><span>02</span>关于工作台<ArrowUpRight size={14} /></Link>
        <Link href="/now/archive"><span>03</span>历史快照<ArrowUpRight size={14} /></Link>
      </div>
    </nav>
  );
}
