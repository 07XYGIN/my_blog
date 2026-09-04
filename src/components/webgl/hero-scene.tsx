"use client";

import { useEffect, useRef, useState } from "react";

type ThreeModule = typeof import("three");

type OrbitNode = {
  mesh: import("three").Mesh;
  radius: number;
  speed: number;
  phase: number;
  tiltX: number;
  tiltZ: number;
};

const orbitNodeSettings = [
  { radius: 1.58, speed: 0.42, phase: 0.2, tiltX: 0.28, tiltZ: -0.62 },
  { radius: 1.58, speed: 0.42, phase: 2.3, tiltX: 0.28, tiltZ: -0.62 },
  { radius: 1.58, speed: 0.42, phase: 4.4, tiltX: 0.28, tiltZ: -0.62 },
  { radius: 2.05, speed: -0.25, phase: 1.1, tiltX: 1.02, tiltZ: 0.38 },
  { radius: 2.05, speed: -0.25, phase: 3.2, tiltX: 1.02, tiltZ: 0.38 },
  { radius: 2.05, speed: -0.25, phase: 5.3, tiltX: 1.02, tiltZ: 0.38 },
] as const;

export function HeroScene() {
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
        disposeScene = createScene(THREE, container, () => setReady(true));
      })
      .catch(() => {
        // The CSS construction remains visible when WebGL is unavailable.
      });

    return () => {
      cancelled = true;
      disposeScene?.();
    };
  }, []);

  return (
    <div aria-hidden className="hero-webgl" data-ready={ready} ref={containerRef}>
      <div className="hero-webgl__fallback">
        <span className="hero-webgl__fallback-ring hero-webgl__fallback-ring--outer" />
        <span className="hero-webgl__fallback-ring hero-webgl__fallback-ring--inner" />
        <span className="hero-webgl__fallback-core" />
      </div>
      <span className="hero-webgl__label">WebGL / Knowledge field</span>
    </div>
  );
}

function createScene(THREE: ThreeModule, container: HTMLDivElement, onReady: () => void) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarsePointer = window.matchMedia("(pointer: coarse)");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0, 6.4);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !coarsePointer.matches, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, coarsePointer.matches ? 1.15 : 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.className = "hero-webgl__canvas";
  container.prepend(renderer.domElement);

  const field = new THREE.Group();
  field.rotation.set(-0.12, -0.2, 0.08);
  scene.add(field);

  const styles = getComputedStyle(document.documentElement);
  const colors = {
    primary: new THREE.Color(cssVar(styles, "--primary", "#4d5d30")),
    muted: new THREE.Color(cssVar(styles, "--muted", "#65685e")),
    outline: new THREE.Color(cssVar(styles, "--outline", "#d9dbd1")),
    teal: new THREE.Color(cssVar(styles, "--teal", "#376d66")),
    amber: new THREE.Color(cssVar(styles, "--amber", "#825100")),
  };

  const coreGeometry = new THREE.IcosahedronGeometry(1.06, 2);
  const coreSurfaceMaterial = new THREE.MeshBasicMaterial({ color: colors.primary, opacity: 0.055, transparent: true });
  const coreSurface = new THREE.Mesh(coreGeometry, coreSurfaceMaterial);
  field.add(coreSurface);

  const coreWireMaterial = new THREE.LineBasicMaterial({ color: colors.primary, opacity: 0.82, transparent: true });
  const coreWire = new THREE.LineSegments(new THREE.WireframeGeometry(coreGeometry), coreWireMaterial);
  field.add(coreWire);

  const rings = [
    createOrbit(THREE, 1.58, colors.primary, 0.38, -0.62, 0.5),
    createOrbit(THREE, 2.05, colors.teal, 1.02, 0.38, 0.42),
    createOrbit(THREE, 2.38, colors.outline, -0.72, 0.18, 0.62),
  ];
  rings.forEach((ring) => field.add(ring));

  const particleCount = coarsePointer.matches ? 52 : 92;
  const particlePositions = new Float32Array(particleCount * 3);
  const random = seededRandom(7319);
  for (let index = 0; index < particleCount; index += 1) {
    const radius = 2.25 + random() * 0.9;
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    particlePositions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
    particlePositions[index * 3 + 1] = radius * Math.cos(phi) * 0.72;
    particlePositions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  const particleMaterial = new THREE.PointsMaterial({ color: colors.muted, opacity: 0.46, size: coarsePointer.matches ? 0.025 : 0.032, sizeAttenuation: true, transparent: true });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  field.add(particles);

  const nodeGeometry = new THREE.SphereGeometry(0.055, 12, 12);
  const nodeMaterials = [colors.primary, colors.teal, colors.amber].map((color) => new THREE.MeshBasicMaterial({ color }));
  const nodes: OrbitNode[] = orbitNodeSettings.map((settings, index) => {
    const mesh = new THREE.Mesh(nodeGeometry, nodeMaterials[index % nodeMaterials.length]);
    field.add(mesh);
    return { mesh, ...settings };
  });

  const spokePositions = new Float32Array(nodes.length * 6);
  const spokeGeometry = new THREE.BufferGeometry();
  spokeGeometry.setAttribute("position", new THREE.BufferAttribute(spokePositions, 3));
  const spokeMaterial = new THREE.LineBasicMaterial({ color: colors.outline, opacity: 0.32, transparent: true });
  const spokes = new THREE.LineSegments(spokeGeometry, spokeMaterial);
  field.add(spokes);

  const pointer = { x: 0, y: 0 };
  let visible = true;
  let frame = 0;
  let lastTime = performance.now();

  function updateColors() {
    const currentStyles = getComputedStyle(document.documentElement);
    colors.primary.set(cssVar(currentStyles, "--primary", "#4d5d30"));
    colors.muted.set(cssVar(currentStyles, "--muted", "#65685e"));
    colors.outline.set(cssVar(currentStyles, "--outline", "#d9dbd1"));
    colors.teal.set(cssVar(currentStyles, "--teal", "#376d66"));
    colors.amber.set(cssVar(currentStyles, "--amber", "#825100"));
    coreSurfaceMaterial.color.copy(colors.primary);
    coreWireMaterial.color.copy(colors.primary);
    particleMaterial.color.copy(colors.muted);
    spokeMaterial.color.copy(colors.outline);
    rings[0].material.color.copy(colors.primary);
    rings[1].material.color.copy(colors.teal);
    rings[2].material.color.copy(colors.outline);
    nodeMaterials[0].color.copy(colors.primary);
    nodeMaterials[1].color.copy(colors.teal);
    nodeMaterials[2].color.copy(colors.amber);
  }

  function resize() {
    const { width, height } = container.getBoundingClientRect();
    if (width === 0 || height === 0) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    render(performance.now());
  }

  function updateNodes(elapsed: number) {
    const positions = spokeGeometry.attributes.position as import("three").BufferAttribute;
    nodes.forEach((node, index) => {
      const angle = node.phase + elapsed * node.speed;
      const point = new THREE.Vector3(Math.cos(angle) * node.radius, 0, Math.sin(angle) * node.radius);
      point.applyEuler(new THREE.Euler(node.tiltX, 0, node.tiltZ));
      node.mesh.position.copy(point);
      positions.setXYZ(index * 2, 0, 0, 0);
      positions.setXYZ(index * 2 + 1, point.x, point.y, point.z);
    });
    positions.needsUpdate = true;
  }

  function render(time: number) {
    const delta = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;
    const elapsed = time / 1000;

    if (!reducedMotion.matches) {
      coreSurface.rotation.y += delta * 0.1;
      coreWire.rotation.y += delta * 0.1;
      coreSurface.rotation.x += delta * 0.035;
      coreWire.rotation.x += delta * 0.035;
      particles.rotation.y -= delta * 0.025;
      field.rotation.y += (pointer.x * 0.18 - field.rotation.y) * 0.035;
      field.rotation.x += (-pointer.y * 0.12 - 0.12 - field.rotation.x) * 0.035;
    }

    updateNodes(reducedMotion.matches ? 0.75 : elapsed);
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

  const themeObserver = new MutationObserver(() => {
    updateColors();
    render(performance.now());
  });
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

function createOrbit(THREE: ThreeModule, radius: number, color: import("three").Color, rotationX: number, rotationZ: number, opacity: number) {
  const curve = new THREE.EllipseCurve(0, 0, radius, radius * 0.62, 0, Math.PI * 2, false, 0);
  const points = curve.getPoints(160).map((point) => new THREE.Vector3(point.x, point.y, 0));
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color, opacity, transparent: true });
  const line = new THREE.LineLoop(geometry, material);
  line.rotation.set(rotationX, 0, rotationZ);
  return line;
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
