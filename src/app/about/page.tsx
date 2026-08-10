import { Cloud, Code2, Database, Download, Mail, MessageCircle, PlayCircle, Terminal } from "lucide-react";

const aboutAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuAsXcDhZUjTL8go9yRbOMMnMCPF86JlX4k1n4qlfDNzLDcXm_4Z0powJgSw9vkV0unBqWl-4NoZeD8BbGkouThWFFi-KNOxy9EYkqUDiefWjmVWDZHCUhh3wJml7dWUZ84QDA3Kk_7rmDhjjYlJWl5RooEVNrBWuW_faWcg-pwvWuCBOlZonRVn8CVV9U_0zU-kqQhwNp7L-jVO0W7tS-hljjJguRuM_OeKAm9vPTTdxIZB7W_znGcT";

const frontEnd = ["TypeScript / JavaScript", "React & Next.js", "Tailwind CSS", "WebGL / Three.js"];
const backEnd = ["Node.js / Express", "PostgreSQL", "Redis", "GraphQL"];

export default function AboutPage() {
  return <main className="container section-pad">
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[300px_1fr] lg:gap-16">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="overflow-hidden rounded-xl border border-[var(--outline)] bg-[var(--surface-container)] aspect-[4/3]"><img src={aboutAvatar} alt="作者在明亮工作室中的头像" className="h-full w-full object-cover" /></div>
        <h1 className="mt-6 text-[28px] font-semibold leading-tight">Alex Rivera</h1>
        <p className="meta mt-1 text-[13px] text-[var(--muted)]">资深全栈工程师</p>
        <div className="mt-7 flex items-center gap-5 text-[var(--muted)]"><a aria-label="GitHub" href="#" className="focus-ring hover:text-[var(--primary)]"><Code2 size={18} /></a><a aria-label="Twitter" href="#" className="focus-ring hover:text-[var(--primary)]"><MessageCircle size={18} /></a><a aria-label="YouTube" href="#" className="focus-ring hover:text-[var(--primary)]"><PlayCircle size={18} /></a></div>
        <a href="#" className="focus-ring mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2.5 font-meta text-[13px] font-medium text-white transition hover:brightness-110"><Download size={17} />下载简历</a>
      </aside>
      <div className="min-w-0">
        <section className="max-w-[730px]">
          <h2 className="text-[28px] font-semibold leading-tight">你好，我是 Alex。</h2>
          <div className="mt-7 space-y-6 text-[16px] leading-relaxed text-[var(--text)]">
            <p>我是一名专注于构建出色数字体验的软件工程师。目前，我致力于为领先的科技公司打造无障碍、以人为本的产品。我的技术旅程始于 2012 年，那时我尝试编辑一个 Tumblr 主题，对 HTML 和 CSS 的摸索逐渐变成了对 Web 开发的热爱。</p>
            <p>一路走到今天，我有幸在广告公司、初创企业、大型企业以及由学生主导的设计工作室中工作。我的主要方向是构建可扩展的前端架构并改善开发者体验。</p>
            <p>不在电脑前时，我通常会和我的狗一起散步，探索附近的咖啡馆，或者在厨房里尝试新的菜谱。</p>
          </div>
        </section>

        <section className="mt-16">
          <h3 className="mb-6 flex items-center gap-2 text-[18px] font-semibold"><Terminal size={21} className="text-[var(--primary)]" />技术武器库</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SkillCard icon={<Code2 size={21} />} title="前端" tone="primary" items={frontEnd} />
            <SkillCard icon={<Database size={21} />} title="后端" tone="teal" items={backEnd} />
            <div className="card md:col-span-2 p-6"><div className="flex items-center gap-3"><span className="rounded-lg bg-[var(--amber-soft)] p-2.5 text-[var(--amber)]"><Cloud size={21} /></span><h4 className="text-[18px] font-semibold">工具与架构</h4></div><div className="mt-4 flex flex-wrap gap-2"><span className="tag">Git & GitHub</span><span className="tag">Docker</span><span className="tag">AWS</span><span className="tag">Vercel</span><span className="tag">Figma</span><span className="tag">CI/CD</span></div></div>
          </div>
        </section>

        <section className="mt-16 border-t border-[var(--outline)] pt-12"><div className="rounded-xl border border-[var(--outline)] bg-[var(--surface-low)] px-6 py-10 text-center"><h3 className="text-[28px] font-semibold leading-tight">一起做点有趣的事吧。</h3><p className="mx-auto mt-4 max-w-md text-[16px] text-[var(--muted)]">我的收件箱始终开放。无论你有问题，还是只想打个招呼，我都会尽力回复。</p><a href="mailto:hello@example.com" className="focus-ring mt-7 inline-flex items-center gap-2 rounded-lg border border-[var(--primary)] px-6 py-3 font-meta text-[13px] text-[var(--primary)] transition hover:bg-[var(--primary-soft)]"><Mail size={17} />hello@example.com</a></div></section>
      </div>
    </div>
  </main>;
}

function SkillCard({ icon, title, items, tone }: { icon: React.ReactNode; title: string; items: string[]; tone: "primary" | "teal" }) {
  return <div className="card p-6"><div className="flex items-center gap-3"><span className={`rounded-lg p-2.5 ${tone === "primary" ? "bg-[var(--primary-soft)] text-[var(--primary)]" : "bg-[var(--teal-soft)] text-[var(--teal)]"}`}>{icon}</span><h4 className="text-[18px] font-semibold">{title}</h4></div><ul className="meta mt-4 space-y-2 text-[13px] text-[var(--muted)]">{items.map((item) => <li key={item} className="flex items-center gap-2"><span className={`h-1.5 w-1.5 rounded-sm ${tone === "primary" ? "bg-[var(--primary)]" : "bg-[var(--teal)]"}`} />{item}</li>)}</ul></div>;
}
