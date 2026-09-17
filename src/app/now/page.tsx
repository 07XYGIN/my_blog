import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { NowCommandCenter, NowTrail } from "@/components/now-command-center";
import { NowSnapshotSections } from "@/components/now-snapshot-sections";
import { getNowSnapshots } from "@/lib/now";

export const metadata: Metadata = {
  title: "近况 | Gin",
  description: "记录最近在学什么、在做什么，以及阶段性的想法和暂时放下的事情。",
};

export default function NowPage() {
  const [latest] = getNowSnapshots();

  return (
    <main className="container section-pad now-page">
      <header className="now-hero">
        <div className="now-hero__copy">
          <p className="eyebrow">Now / Current state</p>
          <div className="now-hero__title-line">
            <h1>NOW</h1>
            <span className="now-hero__stamp"><i /> WORKING / QUIETLY</span>
          </div>
          <p className="now-hero__lede">此刻正在学习、构建和整理的东西。不是履历，是一张仍在变化的工作台。</p>
          <p className="meta now-hero__date">最后更新 · {latest.date}</p>
        </div>
        <Link className="now-hero__archive focus-ring" href="/now/archive">
          <span>03</span><strong>历史<br />快照</strong><ArrowUpRight size={18} />
        </Link>
      </header>

      <NowCommandCenter snapshot={latest} />

      <section aria-label="当前近况" className="now-notes-section">
        <div className="now-section-heading">
          <div><p className="eyebrow">Field notes / 现场笔记</p><h2>正在发生的四件事</h2></div>
          <span>04 / 04<br /><small>HONEST SNAPSHOT</small></span>
        </div>
        <NowSnapshotSections snapshot={latest} />
      </section>

      <NowTrail />
    </main>
  );
}
