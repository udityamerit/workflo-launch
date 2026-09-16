import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const readSrc = (relPath: string) => readFileSync(new URL(relPath, import.meta.url), "utf8");

describe("Workflo Features Section, 3D Hotspots & Reduced-Motion Invariants", () => {
  it("implements reduced-motion media query to gracefully disable pulsing and looping demos", () => {
    const css = readSrc("../landing.css");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain(".hotspot-beacon::before");
    expect(css).toContain(".hotspot-beacon::after");
    expect(css).toContain(".laser-scanline");
    expect(css).toContain(".radar-sweep-beam");
    expect(css).toContain(".gif-demo-loop");
  });

  it("adds subtle pulsing discoverability beacon animations to 3D model hotspots", () => {
    const sceneSource = readSrc("../components/SandboxScene.tsx");
    expect(sceneSource).toContain("waveMaterial");
    expect(sceneSource).toContain("waveMesh");
    expect(sceneSource).toContain("pulseCycle");
    expect(sceneSource).toContain("reduceMotion");
    expect(sceneSource).toContain("prefers-reduced-motion");
  });

  it("provides auto-playing looping demos with click-to-expand controls for mobile devices", () => {
    const viewerSource = readSrc("../components/landing/HotspotDemoViewer.tsx");
    expect(viewerSource).toContain("HotspotDemoViewer");
    expect(viewerSource).toContain("Tap to expand demo");
    expect(viewerSource).toContain("aria-haspopup=\"dialog\"");
    expect(viewerSource).toContain("aria-modal=\"true\"");
    expect(viewerSource).toContain("prefers-reduced-motion");
    expect(viewerSource).toContain("Escape");
  });

  it("replaces remaining feature text descriptions with dynamic visual metrics and animated diagrams", () => {
    const homeSource = readSrc("../pages/Home.tsx");
    expect(homeSource).toContain("AST Synthesis Pipeline");
    expect(homeSource).toContain("laser-scanline");
    expect(homeSource).toContain("Multi-Viewport Diff Matrix");
    expect(homeSource).toContain("radar-sweep-beam");
    expect(homeSource).toContain("Non-Deterministic Quarantine Radar");
    expect(homeSource).toContain("99.8% Comprehensive");
    expect(homeSource).toContain("0.00% Zero Shift");
    expect(homeSource).toContain("99.99% Deterministic");
  });
});
