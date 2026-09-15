import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { WORKFLO_HERO } from "./workfloHero";

describe("Workflo hero messaging and immersive 3D architecture", () => {
  it("keeps the product promise concise and evidence-led", () => {
    expect(WORKFLO_HERO.tagline).toBe("QA you can verify.");
    expect(WORKFLO_HERO.description).toBe("Isolated runs. Evidence you can review.");
  });

  it("retains immersive 3D elements, trial signup flow, and interactive sections", () => {
    const homeSource = readFileSync(new URL("../pages/Home.tsx", import.meta.url), "utf8");

    // 3D & GSAP WebGL Architecture
    expect(homeSource).toContain("hero-canvas");
    expect(homeSource).toContain("workflow-canvas-container");
    expect(homeSource).toContain("pricing");

    // Trial / Waitlist Signup Flow
    expect(homeSource).toContain("/api/trial-signups");
    expect(homeSource).toContain("trialConsentAttempted");
    expect(homeSource).toContain("Please confirm consent before requesting a trial.");
  });
});
