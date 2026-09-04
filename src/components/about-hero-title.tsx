import { RouteScene } from "@/components/webgl/route-scene";

export function AboutHeroTitle() {
  return (
    <div className="about-hero-title">
      <RouteScene className="about-hero-title__scene" variant="about" />
      <div className="about-hero-title__copy">
        <p className="eyebrow">Memo profile</p>
        <h1 className="mt-5 text-[clamp(4rem,11vw,7.6rem)] font-semibold leading-none tracking-[-0.08em] text-[var(--text)]">
          关于<span className="mx-3 text-[var(--primary)]">我</span>
        </h1>
        <p className="about-hero-title__legend">Frontend / Backend / Agent</p>
      </div>
    </div>
  );
}
