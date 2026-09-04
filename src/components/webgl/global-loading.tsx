"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type LoadingPhase = "visible" | "leaving" | "hidden";
type ThreeModule = typeof import("three");

const initialMinimumMs = 720;
const navigationMinimumMs = 420;
const exitDurationMs = 280;
const navigationTimeoutMs = 8_000;

export function GlobalLoading() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<LoadingPhase>("visible");
  const startedAt = useRef(0);
  const mounted = useRef(false);
  const exitTimer = useRef<number | undefined>(undefined);
  const removalTimer = useRef<number | undefined>(undefined);
  const timeoutTimer = useRef<number | undefined>(undefined);

  const clearTimers = useCallback(() => {
    window.clearTimeout(exitTimer.current);
    window.clearTimeout(removalTimer.current);
    window.clearTimeout(timeoutTimer.current);
  }, []);

  const finish = useCallback((minimumMs: number) => {
    window.clearTimeout(exitTimer.current);
    window.clearTimeout(removalTimer.current);
    const elapsed = performance.now() - startedAt.current;
    exitTimer.current = window.setTimeout(() => {
      setPhase("leaving");
      removalTimer.current = window.setTimeout(() => setPhase("hidden"), exitDurationMs);
    }, Math.max(minimumMs - elapsed, 0));
  }, []);

  const begin = useCallback(() => {
    clearTimers();
    startedAt.current = performance.now();
    setPhase("visible");
    timeoutTimer.current = window.setTimeout(() => finish(0), navigationTimeoutMs);
  }, [clearTimers, finish]);

  useEffect(() => {
    startedAt.current = performance.now();
    finish(initialMinimumMs);
    return clearTimers;
  }, [clearTimers, finish]);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    window.clearTimeout(timeoutTimer.current);
    finish(navigationMinimumMs);
  }, [finish, pathname]);

  useEffect(() => {
    function handleNavigation(event: MouseEvent) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element)) return;

      const anchor = event.target.closest("a");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const destination = new URL(anchor.href, window.location.href);
      const current = new URL(window.location.href);
      if (destination.origin !== current.origin || !["http:", "https:"].includes(destination.protocol)) return;
      if (destination.pathname === current.pathname && destination.search === current.search) return;

      begin();
    }

    document.addEventListener("click", handleNavigation, true);
    window.addEventListener("popstate", begin);
    return () => {
      document.removeEventListener("click", handleNavigation, true);
      window.removeEventListener("popstate", begin);
    };
  }, [begin]);

  if (phase === "hidden") return null;

  return (
    <div
      aria-busy="true"
      aria-label="正在加载页面"
      className="global-loading"
      data-phase={phase}
      role="status"
    >
      <div className="global-loading__stage">
        <LoadingWebgl />
      </div>
      <div className="global-loading__copy">
        <span className="global-loading__brand">GIN<span>.</span></span>
        <span className="global-loading__message">正在装载笔记</span>
        <span className="global-loading__signal"><i /><i /><i /></span>
      </div>
      <span className="global-loading__meta">Loading / Knowledge field</span>
    </div>
  );
}

function LoadingWebgl() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let disposeScene: (() => void) | undefined;

    void import("three")
      .then((THREE) => {
        if (cancelled) return;
        disposeScene = createLoadingScene(THREE, container, () => setReady(true));
      })
      .catch(() => {
        // Keep the immediate CSS 3D construction if WebGL is unavailable.
      });

    return () => {
      cancelled = true;
      disposeScene?.();
    };
  }, []);

  return (
    <div className="global-loading__visual" data-ready={ready} ref={containerRef}>
      <div className="global-loading__css-object">
        <span className="global-loading__css-ring global-loading__css-ring--one" />
        <span className="global-loading__css-ring global-loading__css-ring--two" />
        <span className="global-loading__css-ring global-loading__css-ring--three" />
        <span className="global-loading__css-core" />
      </div>
    </div>
  );
}

function createLoadingScene(THREE: ThreeModule, container: HTMLDivElement, onReady: () => void) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 20);
  camera.position.set(0, 0, 4.6);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.4));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.className = "global-loading__canvas";
  container.prepend(renderer.domElement);

  const styles = getComputedStyle(document.documentElement);
  const primary = new THREE.Color(cssVar(styles, "--primary", "#4d5d30"));
  const teal = new THREE.Color(cssVar(styles, "--teal", "#376d66"));
  const outline = new THREE.Color(cssVar(styles, "--outline", "#d9dbd1"));
  const field = new THREE.Group();
  scene.add(field);

  const coreGeometry = new THREE.OctahedronGeometry(0.52, 0);
  const coreMaterial = new THREE.MeshBasicMaterial({ color: primary, opacity: 0.28, transparent: true });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  field.add(core);

  const shellGeometry = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.05, 1));
  const shellMaterial = new THREE.LineBasicMaterial({ color: primary, opacity: 0.78, transparent: true });
  const shell = new THREE.LineSegments(shellGeometry, shellMaterial);
  field.add(shell);

  const innerGeometry = new THREE.WireframeGeometry(new THREE.DodecahedronGeometry(0.72, 0));
  const innerMaterial = new THREE.LineBasicMaterial({ color: teal, opacity: 0.54, transparent: true });
  const inner = new THREE.LineSegments(innerGeometry, innerMaterial);
  field.add(inner);

  const rings = [
    createLoadingOrbit(THREE, 1.3, primary, 0.42, -0.72),
    createLoadingOrbit(THREE, 1.52, teal, 1.08, 0.35),
    createLoadingOrbit(THREE, 1.7, outline, -0.66, 0.12),
  ];
  rings.forEach((ring) => field.add(ring));

  const pointsGeometry = new THREE.BufferGeometry();
  const pointPositions = new Float32Array(42 * 3);
  const random = seededRandom(2909);
  for (let index = 0; index < 42; index += 1) {
    const radius = 1.55 + random() * 0.65;
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    pointPositions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
    pointPositions[index * 3 + 1] = radius * Math.cos(phi);
    pointPositions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }
  pointsGeometry.setAttribute("position", new THREE.BufferAttribute(pointPositions, 3));
  const pointsMaterial = new THREE.PointsMaterial({ color: outline, opacity: 0.5, size: 0.025, transparent: true });
  const points = new THREE.Points(pointsGeometry, pointsMaterial);
  field.add(points);

  let frame = 0;
  let lastTime = performance.now();

  function render(time: number) {
    const delta = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;

    if (!reducedMotion.matches) {
      shell.rotation.y += delta * 0.58;
      shell.rotation.x -= delta * 0.16;
      inner.rotation.y -= delta * 0.82;
      inner.rotation.z += delta * 0.24;
      rings[0].rotation.z += delta * 0.32;
      rings[1].rotation.x -= delta * 0.25;
      rings[2].rotation.y += delta * 0.2;
      points.rotation.y -= delta * 0.12;
      const pulse = 1 + Math.sin(time * 0.004) * 0.08;
      core.scale.setScalar(pulse);
    }

    renderer.render(scene, camera);
  }

  function animate(time: number) {
    render(time);
    if (!reducedMotion.matches) frame = window.requestAnimationFrame(animate);
  }

  function startAnimation() {
    window.cancelAnimationFrame(frame);
    lastTime = performance.now();
    if (reducedMotion.matches) render(lastTime);
    else frame = window.requestAnimationFrame(animate);
  }

  function resize() {
    const { width, height } = container.getBoundingClientRect();
    if (width === 0 || height === 0) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    render(performance.now());
  }

  function updateTheme() {
    const currentStyles = getComputedStyle(document.documentElement);
    primary.set(cssVar(currentStyles, "--primary", "#4d5d30"));
    teal.set(cssVar(currentStyles, "--teal", "#376d66"));
    outline.set(cssVar(currentStyles, "--outline", "#d9dbd1"));
    coreMaterial.color.copy(primary);
    shellMaterial.color.copy(primary);
    innerMaterial.color.copy(teal);
    pointsMaterial.color.copy(outline);
    rings[0].material.color.copy(primary);
    rings[1].material.color.copy(teal);
    rings[2].material.color.copy(outline);
    render(performance.now());
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  const themeObserver = new MutationObserver(updateTheme);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  reducedMotion.addEventListener("change", startAnimation);

  resize();
  render(performance.now());
  onReady();
  startAnimation();

  return () => {
    window.cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    themeObserver.disconnect();
    reducedMotion.removeEventListener("change", startAnimation);
    scene.traverse((object) => {
      if ("geometry" in object && object.geometry instanceof THREE.BufferGeometry) object.geometry.dispose();
      if ("material" in object) {
        const material = object.material as import("three").Material | import("three").Material[];
        (Array.isArray(material) ? material : [material]).forEach((item) => item.dispose());
      }
    });
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
  };
}

function createLoadingOrbit(THREE: ThreeModule, radius: number, color: import("three").Color, rotationX: number, rotationZ: number) {
  const curve = new THREE.EllipseCurve(0, 0, radius, radius * 0.56, 0, Math.PI * 2, false, 0);
  const points = curve.getPoints(120).map((point) => new THREE.Vector3(point.x, point.y, 0));
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color, opacity: 0.52, transparent: true });
  const orbit = new THREE.LineLoop(geometry, material);
  orbit.rotation.set(rotationX, 0, rotationZ);
  return orbit;
}

function cssVar(styles: CSSStyleDeclaration, name: string, fallback: string) {
  return styles.getPropertyValue(name).trim() || fallback;
}

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4_294_967_296;
  };
}
