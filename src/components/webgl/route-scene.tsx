"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type RouteSceneVariant = "about" | "timeline";
type ThreeModule = typeof import("three");

type RouteSceneProps = {
  variant: RouteSceneVariant;
  className?: string;
};

type FloatingBlock = {
  object: import("three").Object3D;
  baseY: number;
  phase: number;
};

export function RouteScene({ variant, className }: RouteSceneProps) {
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
        disposeScene = createRouteScene(THREE, container, variant, () => setReady(true));
      })
      .catch(() => {
        // The angular CSS/SVG construction remains visible without WebGL.
      });

    return () => {
      cancelled = true;
      disposeScene?.();
    };
  }, [variant]);

  return (
    <div
      aria-hidden
      className={cn("route-webgl", className)}
      data-ready={ready}
      data-variant={variant}
      ref={containerRef}
    >
      {variant === "about" ? <AboutFallback /> : <TimelineFallback />}
      <span className="route-webgl__meta">{variant === "about" ? "Module assembly" : "Build path"}</span>
    </div>
  );
}

function AboutFallback() {
  return (
    <div className="route-webgl__fallback route-webgl__fallback--about">
      {Array.from({ length: 6 }).map((_, index) => <i key={index} />)}
    </div>
  );
}

function TimelineFallback() {
  return (
    <svg className="route-webgl__fallback route-webgl__fallback--timeline" viewBox="0 0 420 240">
      <path d="M24 184 L92 132 L162 158 L232 86 L304 112 L392 38" />
      <rect height="20" transform="rotate(45 24 184)" width="20" x="14" y="174" />
      <rect height="20" transform="rotate(45 92 132)" width="20" x="82" y="122" />
      <rect height="20" transform="rotate(45 162 158)" width="20" x="152" y="148" />
      <rect height="20" transform="rotate(45 232 86)" width="20" x="222" y="76" />
      <rect height="20" transform="rotate(45 304 112)" width="20" x="294" y="102" />
      <rect height="20" transform="rotate(45 392 38)" width="20" x="382" y="28" />
    </svg>
  );
}

function createRouteScene(
  THREE: ThreeModule,
  container: HTMLDivElement,
  variant: RouteSceneVariant,
  onReady: () => void,
) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarsePointer = window.matchMedia("(pointer: coarse)");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
  camera.position.set(0, 0, variant === "about" ? 6.2 : 6.8);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !coarsePointer.matches, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, coarsePointer.matches ? 1.15 : 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.className = "route-webgl__canvas";
  container.prepend(renderer.domElement);

  const rootStyles = getComputedStyle(document.documentElement);
  const colors = {
    primary: new THREE.Color(cssVar(rootStyles, "--primary", "#4d5d30")),
    teal: new THREE.Color(cssVar(rootStyles, "--teal", "#376d66")),
    amber: new THREE.Color(cssVar(rootStyles, "--amber", "#825100")),
    outline: new THREE.Color(cssVar(rootStyles, "--outline", "#d9dbd1")),
  };
  const materials = {
    primarySurface: new THREE.MeshBasicMaterial({ color: colors.primary, opacity: 0.14, transparent: true }),
    tealSurface: new THREE.MeshBasicMaterial({ color: colors.teal, opacity: 0.12, transparent: true }),
    amberSurface: new THREE.MeshBasicMaterial({ color: colors.amber, opacity: 0.1, transparent: true }),
    primaryLine: new THREE.LineBasicMaterial({ color: colors.primary, opacity: 0.78, transparent: true }),
    tealLine: new THREE.LineBasicMaterial({ color: colors.teal, opacity: 0.64, transparent: true }),
    amberLine: new THREE.LineBasicMaterial({ color: colors.amber, opacity: 0.72, transparent: true }),
    outlineLine: new THREE.LineBasicMaterial({ color: colors.outline, opacity: 0.48, transparent: true }),
  };

  const field = new THREE.Group();
  const baseRotation = variant === "about"
    ? { x: -0.2, y: -0.48, z: 0.06 }
    : { x: -0.16, y: -0.24, z: -0.04 };
  field.rotation.set(baseRotation.x, baseRotation.y, baseRotation.z);
  scene.add(field);

  const floatingBlocks: FloatingBlock[] = [];
  const timelineBlocks: import("three").Object3D[] = [];
  let timelineTracer: import("three").Object3D | null = null;
  let timelinePoints: import("three").Vector3[] = [];

  if (variant === "about") {
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const edgeGeometry = new THREE.EdgesGeometry(boxGeometry);
    const blockSpecs = [
      { position: [-1.1, 0.72, -0.15], scale: [1.12, 0.22, 0.68], rotation: [0.08, 0.18, -0.08] },
      { position: [0.05, 0.36, 0.34], scale: [1.34, 0.2, 0.78], rotation: [-0.04, -0.16, 0.04] },
      { position: [1.06, -0.08, -0.26], scale: [0.82, 0.26, 0.82], rotation: [0.06, 0.28, 0.1] },
      { position: [-0.76, -0.52, 0.5], scale: [0.92, 0.24, 0.62], rotation: [-0.06, -0.24, -0.08] },
      { position: [0.42, -0.78, -0.42], scale: [1.22, 0.2, 0.72], rotation: [0.1, 0.12, 0.05] },
      { position: [1.2, 0.72, -0.62], scale: [0.48, 0.48, 0.48], rotation: [0.24, 0.36, 0.16] },
    ] as const;
    const surfaceMaterials = [materials.primarySurface, materials.tealSurface, materials.amberSurface];
    const lineMaterials = [materials.primaryLine, materials.tealLine, materials.amberLine];

    blockSpecs.forEach((spec, index) => {
      const holder = new THREE.Group();
      holder.position.set(spec.position[0], spec.position[1], spec.position[2]);
      holder.scale.set(spec.scale[0], spec.scale[1], spec.scale[2]);
      holder.rotation.set(spec.rotation[0], spec.rotation[1], spec.rotation[2]);
      holder.add(
        new THREE.Mesh(boxGeometry, surfaceMaterials[index % surfaceMaterials.length]),
        new THREE.LineSegments(edgeGeometry, lineMaterials[index % lineMaterials.length]),
      );
      field.add(holder);
      floatingBlocks.push({ object: holder, baseY: spec.position[1], phase: index * 0.82 });
    });
  } else {
    timelinePoints = [
      new THREE.Vector3(-2.25, -0.9, 0.18),
      new THREE.Vector3(-1.48, -0.28, -0.22),
      new THREE.Vector3(-0.68, -0.56, 0.38),
      new THREE.Vector3(0.18, 0.2, -0.26),
      new THREE.Vector3(1.0, -0.02, 0.28),
      new THREE.Vector3(2.08, 0.86, -0.08),
    ];
    const pathGeometry = new THREE.BufferGeometry().setFromPoints(timelinePoints);
    field.add(new THREE.Line(pathGeometry, materials.primaryLine));

    const stemPositions = new Float32Array(timelinePoints.length * 6);
    timelinePoints.forEach((point, index) => {
      stemPositions.set([point.x, -1.25, point.z, point.x, point.y, point.z], index * 6);
    });
    const stemGeometry = new THREE.BufferGeometry();
    stemGeometry.setAttribute("position", new THREE.BufferAttribute(stemPositions, 3));
    field.add(new THREE.LineSegments(stemGeometry, materials.outlineLine));

    const nodeGeometry = new THREE.BoxGeometry(0.28, 0.28, 0.28);
    const nodeEdges = new THREE.EdgesGeometry(nodeGeometry);
    const surfaces = [materials.primarySurface, materials.tealSurface, materials.amberSurface];
    const lines = [materials.primaryLine, materials.tealLine, materials.amberLine];
    timelinePoints.forEach((point, index) => {
      const node = new THREE.Group();
      node.position.copy(point);
      node.rotation.set(0.36, 0.48 + index * 0.12, Math.PI / 4);
      const scale = index === timelinePoints.length - 1 ? 1.45 : 1;
      node.scale.setScalar(scale);
      node.add(
        new THREE.Mesh(nodeGeometry, surfaces[index % surfaces.length]),
        new THREE.LineSegments(nodeEdges, lines[index % lines.length]),
      );
      field.add(node);
      timelineBlocks.push(node);
    });

    timelineTracer = new THREE.Mesh(nodeGeometry, materials.amberSurface);
    timelineTracer.scale.setScalar(0.52);
    timelineTracer.position.copy(timelinePoints[0]);
    field.add(timelineTracer);
  }

  const pointer = { x: 0, y: 0 };
  let frame = 0;
  let visible = true;
  let lastTime = performance.now();

  function updateTheme() {
    const styles = getComputedStyle(document.documentElement);
    colors.primary.set(cssVar(styles, "--primary", "#4d5d30"));
    colors.teal.set(cssVar(styles, "--teal", "#376d66"));
    colors.amber.set(cssVar(styles, "--amber", "#825100"));
    colors.outline.set(cssVar(styles, "--outline", "#d9dbd1"));
    materials.primarySurface.color.copy(colors.primary);
    materials.tealSurface.color.copy(colors.teal);
    materials.amberSurface.color.copy(colors.amber);
    materials.primaryLine.color.copy(colors.primary);
    materials.tealLine.color.copy(colors.teal);
    materials.amberLine.color.copy(colors.amber);
    materials.outlineLine.color.copy(colors.outline);
    render(performance.now());
  }

  function resize() {
    const { width, height } = container.getBoundingClientRect();
    if (width === 0 || height === 0) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    render(performance.now());
  }

  function render(time: number) {
    const delta = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;

    if (!reducedMotion.matches) {
      field.rotation.x += (baseRotation.x - pointer.y * 0.08 - field.rotation.x) * 0.035;
      field.rotation.y += (baseRotation.y + pointer.x * 0.12 - field.rotation.y) * 0.035;

      floatingBlocks.forEach((block) => {
        block.object.position.y = block.baseY + Math.sin(time * 0.00125 + block.phase) * 0.075;
        block.object.rotation.y += delta * 0.1;
      });

      timelineBlocks.forEach((block, index) => {
        block.rotation.y += delta * (0.18 + index * 0.012);
      });

      if (timelineTracer && timelinePoints.length > 1) {
        const position = (time * 0.00016) % 1 * (timelinePoints.length - 1);
        const segment = Math.min(Math.floor(position), timelinePoints.length - 2);
        timelineTracer.position.lerpVectors(timelinePoints[segment], timelinePoints[segment + 1], position - segment);
        timelineTracer.rotation.x += delta * 0.7;
        timelineTracer.rotation.y += delta * 0.9;
      }
    }

    renderer.render(scene, camera);
  }

  function animate(time: number) {
    render(time);
    if (visible && !reducedMotion.matches) frame = window.requestAnimationFrame(animate);
  }

  function startAnimation() {
    window.cancelAnimationFrame(frame);
    lastTime = performance.now();
    if (visible && !reducedMotion.matches) frame = window.requestAnimationFrame(animate);
    else render(lastTime);
  }

  function handlePointerMove(event: PointerEvent) {
    if (coarsePointer.matches || reducedMotion.matches) return;
    pointer.x = event.clientX / window.innerWidth * 2 - 1;
    pointer.y = event.clientY / window.innerHeight * 2 - 1;
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    startAnimation();
  });
  visibilityObserver.observe(container);
  const themeObserver = new MutationObserver(updateTheme);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  reducedMotion.addEventListener("change", startAnimation);

  resize();
  render(performance.now());
  onReady();
  startAnimation();

  return () => {
    window.cancelAnimationFrame(frame);
    window.removeEventListener("pointermove", handlePointerMove);
    reducedMotion.removeEventListener("change", startAnimation);
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    themeObserver.disconnect();
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

function cssVar(styles: CSSStyleDeclaration, name: string, fallback: string) {
  return styles.getPropertyValue(name).trim() || fallback;
}
