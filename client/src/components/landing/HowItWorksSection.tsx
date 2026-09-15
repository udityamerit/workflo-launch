/**
 * HowItWorksSection — Complete Architecture & Sequential 3D Deep-Dive.
 * 
 * 1. Architecture Overview:
 *    The exact 4-tier 3D stacked glass deck (CONNECT, GENERATE, VALIDATE, SHIP)
 *    with interactive 3D mouse parallax, split/assemble toggle, and annotated
 *    callouts for each tier.
 * 
 * 2. Sequential 3D Deep-Dive:
 *    As you scroll down:
 *    - Stage 1: 3D designed CONNECT slab -> detailed explanation below.
 *    - Stage 2: 3D designed GENERATE slab -> detailed explanation below.
 *    - Stage 3: 3D designed VALIDATE slab -> detailed explanation below.
 *    - Stage 4: 3D designed SHIP slab -> detailed explanation below.
 *    - Reverses seamlessly when scrolling back up.
 */
import { useState, useRef, useEffect, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  type Variants,
} from "framer-motion";
import {
  Code2,
  Terminal,
  Globe,
  ShieldCheck,
  CheckCircle2,
  GitBranch,
  Cpu,
  Layers,
  Sparkles,
  Maximize2,
  Minimize2,
  Zap,
  Lock,
  Box,
  Server,
  RefreshCw,
  FileCheck2,
} from "lucide-react";
import SingleSlab3D, { type SlabTierData } from "./SingleSlab3D";
import { EASE_OUT } from "./animations";

const TIERS: SlabTierData[] = [
  {
    number: "01",
    title: "CONNECT",
    kicker: "01 / GIT REPO HOOK",
    tag: "LIVE SYNC",
    badge: "12ms LATENCY",
    icon: Code2,
    stepDesc: "Link your GitHub or GitLab repo and environments with zero configuration.",
    subTitle: "git://github.com/workflo/core.git",
    chips: [
      { label: "main [3a89f2]", icon: GitBranch },
      { label: "Isolated sandbox online", highlight: true },
      { label: "Webhook TLS 1.3" },
    ],
    headline: "Instant zero-config repository pairing.",
    explanation:
      "Connect your GitHub or GitLab repository in seconds. Workflo spins up an isolated, ephemeral sandbox environment for every pull request, branch, or commit without touching production state or polluting staging databases.",
    features: [
      {
        title: "Ephemeral Micro-Sandboxes",
        desc: "Auto-provisioned isolated container environments with test seed data spun up in under 3 seconds.",
      },
      {
        title: "Event-Driven Webhooks",
        desc: "Hooks trigger automatically on push, pull request open, or commit sync via encrypted TLS 1.3.",
      },
      {
        title: "Zero-Secret Isolation",
        desc: "Tests run in air-gapped sandboxes with zero access to your proprietary customer databases or production keys.",
      },
    ],
    accentColor: "#C6FF3D",
  },
  {
    number: "02",
    title: "GENERATE",
    kicker: "02 / SPEC SYNTHESIS",
    tag: "AI CO-PILOT",
    badge: "CLAUDE 3.7 + GPT-4o",
    icon: Terminal,
    stepDesc: "AI inspects code diffs, routes, and UI states to author comprehensive test suites.",
    subTitle: "spec.synthesize({ depth: 'exhaustive' })",
    chips: [
      { label: "48 E2E suites", icon: Cpu },
      { label: "182 assertions generated", highlight: true },
      { label: "99.6% UI coverage" },
    ],
    headline: "Autonomous test synthesis that understands user intent.",
    explanation:
      "Our multi-model AI agent analyzes AST diffs, routing schemas, and frontend UI states to automatically author production-ready Playwright and Jest test suites that mimic real user behavior.",
    features: [
      {
        title: "Context-Aware Test Authoring",
        desc: "Understands multi-step authentication, checkout flows, and complex form edge cases automatically.",
      },
      {
        title: "Self-Healing Locators",
        desc: "When selectors or DOM classes change, Workflo automatically updates locator paths without broken runs.",
      },
      {
        title: "Deterministic Spec Files",
        desc: "Outputs clean, human-readable TypeScript spec files committed straight into your test repository.",
      },
    ],
    accentColor: "#C6FF3D",
  },
  {
    number: "03",
    title: "VALIDATE",
    kicker: "03 / CLOUD MATRIX",
    tag: "PARALLEL RUNNER",
    badge: "32X CLOUD MATRIX",
    icon: Globe,
    stepDesc: "Execute parallel tests across real Chromium, WebKit, Firefox, and mobile engines concurrently.",
    subTitle: "Matrix: Chromium • WebKit • Firefox • iOS",
    chips: [
      { label: "Chromium (✓ 3.2s)", highlight: true },
      { label: "WebKit (✓ 3.4s)", highlight: true },
      { label: "Firefox (✓ 3.6s)", highlight: true },
      { label: "0 flaky quarantined" },
    ],
    headline: "32x parallel execution with real-device validation.",
    explanation:
      "Tests execute concurrently across distributed cloud containers spanning Chromium, WebKit, Firefox, and mobile viewports. Flaky tests are detected and quarantined automatically so your CI never blocks on network noise.",
    features: [
      {
        title: "Distributed Cloud Concurrency",
        desc: "Thousands of assertions execute simultaneously across isolated runners in under 60 seconds.",
      },
      {
        title: "Visual Regression Layout Diffs",
        desc: "Pixel-by-pixel comparisons highlight unintended layout shifts, padding breaks, or font discrepancies.",
      },
      {
        title: "Smart Flake Quarantine",
        desc: "Isolates intermittent network timeouts from genuine code regressions to keep pipeline signals truthful.",
      },
    ],
    accentColor: "#C6FF3D",
  },
  {
    number: "04",
    title: "SHIP",
    kicker: "04 / PROD GATEWAY",
    tag: "VERIFIED RECEIPT",
    badge: "ZERO REGRESSIONS",
    icon: ShieldCheck,
    stepDesc: "Cryptographically verified receipts give release confidence to ship straight to production.",
    subTitle: "SHA-256 [0x7f4a9b...c018] — Gate: PASSED",
    chips: [
      { label: "Deploy Gate: APPROVED", highlight: true, icon: CheckCircle2 },
      { label: "Zero regression guarantee" },
      { label: "< 2.4 min cycle" },
    ],
    headline: "Cryptographically verified receipts for confident deployment.",
    explanation:
      "Every passing run generates an immutable, tamper-proof test receipt signed with SHA-256 cryptographic proof. Integrate directly with Vercel, AWS, or GitHub Actions to unblock deployment gates automatically.",
    features: [
      {
        title: "Immutable Verification Audit",
        desc: "Full video recordings, network HAR traces, and console logs stored permanently for compliance.",
      },
      {
        title: "Automated Release Gates",
        desc: "Blocks production promotions until 100% verification is achieved, preventing regressions entirely.",
      },
      {
        title: "Instant Slack & PR Receipts",
        desc: "Summaries and rich receipt badges delivered directly to pull requests and team channels.",
      },
    ],
    accentColor: "#C6FF3D",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredTier, setHoveredTier] = useState<number | null>(null);
  const [manualSplit, setManualSplit] = useState<boolean | null>(true);

  // Scroll tracking on entire section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 32,
    restDelta: 0.001,
  });

  // Split progress: 0 = assembled (compact deck), 1 = split (exploded 3D tiers)
  // Default is 1 (exploded view by default)
  const scrollSplitValue = useTransform(smoothScroll, [0.15, 0.45], [0, 1]);
  const [currentSplit, setCurrentSplit] = useState(1);

  useEffect(() => {
    return scrollSplitValue.on("change", (latest) => {
      if (manualSplit === null) {
        const clamped = Math.max(0, Math.min(1, latest));
        setCurrentSplit(clamped);
      }
    });
  }, [scrollSplitValue, manualSplit]);

  useEffect(() => {
    if (manualSplit !== null) {
      setCurrentSplit(manualSplit ? 1 : 0);
    }
  }, [manualSplit]);

  // Mouse 3D Parallax Tilt for the Architecture view
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [54, 46]), {
    stiffness: 220,
    damping: 26,
  });
  const rotateZ = useSpring(useTransform(mouseX, [-0.5, 0.5], [-35, -27]), {
    stiffness: 220,
    damping: 26,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [6, 12]), {
    stiffness: 220,
    damping: 26,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Interpolated 3D transforms for the 4 tiers (with generous 160px non-overlapping spacing)
  const tierTransforms = useMemo(() => {
    return [
      // Tier 0: Connect (base layer)
      {
        y: 45 + currentSplit * (240 - 45),
        z: 0 + currentSplit * (-30 - 0),
        scale: 1,
      },
      // Tier 1: Generate
      {
        y: 15 + currentSplit * (80 - 15),
        z: 28 + currentSplit * (35 - 28),
        scale: 1,
      },
      // Tier 2: Validate
      {
        y: -15 + currentSplit * (-80 - -15),
        z: 56 + currentSplit * (105 - 56),
        scale: 1,
      },
      // Tier 3: Ship (top tier)
      {
        y: -45 + currentSplit * (-240 - -45),
        z: 84 + currentSplit * (175 - 84),
        scale: 1,
      },
    ];
  }, [currentSplit]);

  const isExploded = currentSplit > 0.5;

  return (
    <section className="landing-how landing-section" id="how-it-works" ref={sectionRef}>
      {/* ── Section Header ──────────────────────────────────── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-15%" }}
        style={{ marginBottom: 40 }}
      >
        <motion.div className="landing-eyebrow" variants={fadeUp}>
          <span className="landing-eyebrow__icon">◈</span>
          HOW IT WORKS
        </motion.div>
        <motion.h2
          variants={fadeUp}
          style={{
            margin: "0 0 16px",
            color: "var(--text-primary)",
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(36px, 4vw, 54px)",
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
          }}
        >
          From commit<br />to confident.
        </motion.h2>
        <motion.p
          variants={fadeUp}
          style={{
            margin: 0,
            color: "var(--text-secondary)",
            fontSize: 17,
            maxWidth: 600,
            lineHeight: 1.6,
          }}
        >
          An end-to-end autonomous QA pipeline engineered for modern continuous deployment.
        </motion.p>
      </motion.div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* 1. FULL 3D STACKED ARCHITECTURE OVERVIEW             */}
      {/* ══════════════════════════════════════════════════════ */}
      <motion.div
        className="how-arch-card"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, ease: EASE_OUT }}
      >
        <span className="how-arch-card__badge">
          <span className="glass-stack__badge-dot" />
          SYSTEM ARCHITECTURE OVERVIEW
        </span>
        <h3 className="how-arch-card__title">The 4-Tier Autonomous 3D Stack</h3>
        <p className="how-arch-card__desc">
          Four interconnected verification layers work in unison. Hover over any tier to inspect
          its operational status, or scroll down to explore each tier in depth.
        </p>

        <div className="how-arch-grid">
          {/* Left: Annotated Callout Cards */}
          <div className="how-arch-callouts">
            {TIERS.map((tier, i) => {
              const isSelected = hoveredTier === i;
              const IconComponent = tier.icon;
              return (
                <div
                  key={tier.number}
                  className={`how-arch-callout ${isSelected ? "how-arch-callout--active" : ""}`}
                  onMouseEnter={() => setHoveredTier(i)}
                  onMouseLeave={() => setHoveredTier(null)}
                  onClick={() => setHoveredTier(isSelected ? null : i)}
                >
                  <span className="how-arch-callout__num">{tier.number}</span>
                  <div className="how-arch-callout__content">
                    <h5>
                      <IconComponent size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
                      {tier.title} — {tier.kicker.split("/")[1]?.trim()}
                    </h5>
                    <p>{tier.stepDesc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: The Full 3D Stack Rig (Exact structure from user screenshot) */}
          <div
            className="glass-stack"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Control Bar (positioned with generous clearance above the top slab) */}
            <div className="glass-stack__control-bar">
              <span className="glass-stack__badge">
                <span className="glass-stack__badge-dot" />
                {isExploded ? "3D Exploded View (Split)" : "Assembled 3D Deck"}
              </span>

              <button
                type="button"
                className="glass-stack__toggle-btn"
                onClick={() => setManualSplit((prev) => (prev ? false : true))}
                title="Toggle between assembled and split states"
              >
                {isExploded ? (
                  <>
                    <Minimize2 size={12} /> Assemble Deck
                  </>
                ) : (
                  <>
                    <Maximize2 size={12} /> Split 3D Parts
                  </>
                )}
              </button>
            </div>

            {/* 3D Scene Viewport */}
            <div className="glass-stack__viewport">
              <motion.div
                className="glass-stack__scene"
                style={{
                  rotateX,
                  rotateY,
                  rotateZ,
                }}
              >
                {/* Connecting Laser Circuit Bus */}
                <div className="glass-stack__bus">
                  <div className="glass-stack__bus-line" />
                  <div className="glass-stack__bus-beam" />
                </div>

                {/* 4 Multi-Layered 3D Glass Slabs */}
                {TIERS.map((tier, i) => {
                  const transform = tierTransforms[i];
                  const isHovered = hoveredTier === i;
                  const IconComponent = tier.icon;
                  const activeExtraZ = isHovered ? 45 : 0;
                  const activeExtraY = isHovered ? -8 : 0;

                  return (
                    <motion.div
                      key={tier.number}
                      className={`glass-slab ${isHovered ? "glass-slab--highlighted" : ""}`}
                      style={{
                        transformStyle: "preserve-3d",
                        transform: `translate3d(0px, ${transform.y + activeExtraY}px, ${transform.z + activeExtraZ}px) scale(${transform.scale * (isHovered ? 1.03 : 1)})`,
                        zIndex: isHovered ? 20 : i + 1,
                        transition:
                          "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s, border-color 0.3s",
                      }}
                      onMouseEnter={() => setHoveredTier(i)}
                      onMouseLeave={() => setHoveredTier(null)}
                    >
                      {/* Node Junction */}
                      <div className="glass-slab__node">
                        <IconComponent />
                      </div>

                      {/* Slab Header */}
                      <div className="glass-slab__header">
                        <span className="glass-slab__kicker">
                          <IconComponent size={12} />
                          {tier.kicker}
                        </span>
                        <span className="glass-slab__tag">
                          <span className="glass-slab__tag-dot" />
                          {tier.tag}
                        </span>
                      </div>

                      {/* Slab Title Row */}
                      <div className="glass-slab__title-row">
                        <span className="glass-slab__title">{tier.title}</span>
                        <span className="glass-slab__sub">{tier.badge}</span>
                      </div>

                      {/* Slab Content Chips & Metrics */}
                      <div className="glass-slab__content">
                        {tier.chips.map((chip) => {
                          const ChipIcon = chip.icon;
                          return (
                            <span
                              key={chip.label}
                              className={`glass-slab__chip ${chip.highlight ? "glass-slab__chip--highlight" : ""}`}
                            >
                              {ChipIcon && <ChipIcon size={11} />}
                              {chip.label}
                            </span>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* 2. SEQUENTIAL 3D DEEP-DIVE (ONE AFTER ANOTHER ON SCROLL) */}
      {/* ══════════════════════════════════════════════════════ */}
      <div className="how-sequential-header">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-15%" }}
          variants={fadeUp}
        >
          <span className="how-arch-card__badge" style={{ marginBottom: 16 }}>
            <Sparkles size={12} style={{ marginRight: 6 }} />
            STEP-BY-STEP DEEP DIVE
          </span>
          <h3>Step-by-Step 3D Pipeline Walkthrough</h3>
          <p>
            Scroll down to see each 3D designed verification tier paired with its operational
            mechanics. As one tier concludes, the next seamlessly activates.
          </p>
        </motion.div>
      </div>

      <div className="how-steps-timeline">
        {TIERS.map((tier, index) => {
          const IconComponent = tier.icon;
          return (
            <motion.div
              key={`showcase-${tier.number}`}
              className="how-step-stage"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.8, ease: EASE_OUT }}
            >
              {/* Top: 3D Designed Slab */}
              <div className="how-step-stage__3d-zone">
                <SingleSlab3D tier={tier} isActive={true} scale={1.04} />
              </div>

              {/* Bottom: Detailed Information Below the 3D Slab */}
              <div className="how-step-stage__info">
                <div className="how-step-stage__info-header">
                  <span className="how-step-stage__badge">
                    <IconComponent size={13} />
                    STEP {tier.number} &mdash; {tier.title}
                  </span>
                  <h4 className="how-step-stage__headline">{tier.headline}</h4>
                  <p className="how-step-stage__desc">{tier.explanation}</p>
                </div>

                {/* 3 Feature Capability Cards */}
                <div className="how-step-stage__features">
                  {tier.features.map((feat) => (
                    <div key={feat.title} className="how-step-feature">
                      <h6>
                        <CheckCircle2 size={15} />
                        {feat.title}
                      </h6>
                      <p>{feat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connector line to the next stage if not last */}
              {index < TIERS.length - 1 && <div className="how-step-connector" />}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
