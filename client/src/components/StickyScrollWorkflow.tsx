"use client";
import React, { useRef, useState } from "react";
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
  CheckCircle2,
  GitBranch,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface StepDetail {
  id: string;
  stepNumber: string;
  title: string;
  tag: string;
  kicker: string;
  badge: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
  codeSnippet: string;
  metric: string;
  highlight: string;
}

const STEPS: StepDetail[] = [
  {
    id: "connect",
    stepNumber: "01",
    title: "CONNECT",
    tag: "GIT INTEGRATION",
    kicker: "Zero-Config Pairing",
    badge: "12ms LATENCY",
    icon: Code2,
    description:
      "Seamlessly link your GitHub or GitLab repository. Workflo spins up an air-gapped, ephemeral sandbox for every PR with zero production risk.",
    codeSnippet: "git://github.com/workflo/core.git -> sandbox:ready",
    metric: "100% Air-gapped",
    highlight: "Ephemeral micro-containers with auto-mocked seed data.",
  },
  {
    id: "generate",
    stepNumber: "02",
    title: "GENERATE",
    tag: "SPEC SYNTHESIS",
    kicker: "Multi-Model AI Agent",
    badge: "CLAUDE 3.7 + GPT-4o",
    icon: Terminal,
    description:
      "Deep AST analysis maps code diffs and visual route boundaries. The agent authors complete Playwright & Jest suites mimicking real human actions.",
    codeSnippet: "spec.synthesize({ target: 'diff', depth: 'exhaustive' })",
    metric: "99.6% UI Coverage",
    highlight: "Autonomous test authored before your PR finishes compiling.",
  },
  {
    id: "validate",
    stepNumber: "03",
    title: "VALIDATE",
    tag: "PARALLEL EXECUTION",
    kicker: "Matrix Test Runner",
    badge: "24x PARALLEL NODES",
    icon: Globe,
    description:
      "Tests execute concurrently across real Chromium, Firefox, and WebKit runtimes with self-healing selectors and automatic flake isolation.",
    codeSnippet: "runner.matrix({ runs: 24, headless: true }) -> pass",
    metric: "0% Flaky Runs",
    highlight: "Flaky network calls or race conditions isolated in real time.",
  },
  {
    id: "ship",
    stepNumber: "04",
    title: "SHIP",
    tag: "VERIFIABLE PROOF",
    kicker: "Cryptographic Receipt",
    badge: "SHA-256 SIGNED",
    icon: ShieldCheck,
    description:
      "Every run delivers an immutable, auditable verification receipt and automatically comments clean pass proof on your GitHub pull request.",
    codeSnippet: "receipt.sign({ cid: '0x8f2d...4a1', status: 'VERIFIED' })",
    metric: "Instant CI Gate",
    highlight: "Complete video telemetry, DOM snapshot, and console trace.",
  },
];

export default function StickyScrollWorkflow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isExploded, setIsExploded] = useState(false);

  // Mouse 3D tilt tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springRotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [52, 42]), {
    stiffness: 220,
    damping: 24,
  });
  const springRotateZ = useSpring(useTransform(mouseX, [-0.5, 0.5], [-34, -26]), {
    stiffness: 220,
    damping: 24,
  });
  const springRotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [6, 12]), {
    stiffness: 220,
    damping: 24,
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

  // Scroll Progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Track active step based on scroll
  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const stepIndex = Math.min(
        Math.floor(latest * STEPS.length),
        STEPS.length - 1
      );
      setActiveStep(stepIndex);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#060606] text-white border-t border-white/5"
    >
      {/* Background Ambience Glow */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-[#A3E635]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-[#A3E635]/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Sticky Container Frame */}
      <div className="sticky top-0 min-h-screen flex flex-col justify-between py-16 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto z-10">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635]" />
              <span className="text-xs font-mono uppercase tracking-widest text-white/60">
                How It Works
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              From commit to confident. <br />
              <span className="text-white/40">The autonomous 4-stage pipeline.</span>
            </h2>
          </div>

          {/* Interactive Stack Control */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsExploded(!isExploded)}
              className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono text-white/80 transition-all flex items-center space-x-2"
            >
              <Layers size={14} className="text-[#A3E635]" />
              <span>{isExploded ? "Assemble Stack" : "Explode Layers"}</span>
            </button>
            <div className="hidden sm:flex items-center px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-xs font-mono text-white/40">
              <span>Scroll to scrub</span>
            </div>
          </div>
        </div>

        {/* Main Sticky Workspace: Left Steps + Right 3D Isometric Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto py-8">
          
          {/* Left Column: Numbered Step Sequencer */}
          <div className="lg:col-span-6 flex flex-col space-y-4">
            {STEPS.map((step, idx) => {
              const isActive = activeStep === idx;
              const Icon = step.icon;

              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(idx)}
                  className={`group relative p-5 rounded-2xl border transition-all duration-400 cursor-pointer ${
                    isActive
                      ? "bg-white/[0.04] border-[#A3E635]/40 shadow-[0_0_30px_rgba(163,230,53,0.08)]"
                      : "bg-white/[0.01] border-white/5 hover:border-white/20 hover:bg-white/[0.02]"
                  }`}
                >
                  {/* Left Indicator Line */}
                  <div
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full transition-all duration-300 ${
                      isActive ? "bg-[#A3E635] h-12" : "bg-transparent"
                    }`}
                  />

                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <span
                        className={`text-sm font-mono font-bold transition-colors ${
                          isActive ? "text-[#A3E635]" : "text-white/30"
                        }`}
                      >
                        {step.stepNumber}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Icon
                          size={16}
                          className={isActive ? "text-[#A3E635]" : "text-white/40"}
                        />
                        <span
                          className={`text-base font-bold tracking-tight ${
                            isActive ? "text-white" : "text-white/60"
                          }`}
                        >
                          {step.title}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                        isActive
                          ? "bg-[#A3E635]/10 border-[#A3E635]/30 text-[#A3E635]"
                          : "bg-white/5 border-white/10 text-white/40"
                      }`}
                    >
                      {step.badge}
                    </span>
                  </div>

                  {/* Expandable Active Step Details */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="mt-4 pt-4 border-t border-white/5 space-y-3"
                    >
                      <p className="text-sm text-white/60 leading-relaxed font-normal">
                        {step.description}
                      </p>

                      <div className="p-2.5 rounded-lg bg-black/60 border border-white/5 font-mono text-xs text-[#A3E635] truncate">
                        {step.codeSnippet}
                      </div>

                      <div className="flex items-center justify-between text-xs text-white/40 pt-1">
                        <span className="flex items-center space-x-1.5 text-white/70">
                          <Sparkles size={12} className="text-[#A3E635]" />
                          <span>{step.highlight}</span>
                        </span>
                        <span className="font-mono text-[#A3E635] font-semibold">
                          {step.metric}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Interactive 3D Stacked Isometric Glass Layers */}
          <div
            className="lg:col-span-6 relative w-full h-[460px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: 1200 }}
          >
            <motion.div
              className="relative w-[340px] sm:w-[400px] h-[260px]"
              style={{
                transformStyle: "preserve-3d",
                rotateX: springRotateX,
                rotateY: springRotateY,
                rotateZ: springRotateZ,
              }}
            >
              {/* Central Glowing Energy Conduit */}
              <div
                className="absolute left-6 top-[-30px] bottom-[-30px] w-[3px] bg-gradient-to-b from-[#A3E635]/10 via-[#A3E635]/80 to-[#A3E635]/20 rounded-full shadow-[0_0_15px_rgba(163,230,53,0.5)] z-20 pointer-events-none"
              />

              {/* 4 Stacked Isometric Glass Slabs (Rendered Bottom to Top: SHIP -> VALIDATE -> GENERATE -> CONNECT) */}
              {STEPS.map((step, index) => {
                const isActive = activeStep === index;
                const Icon = step.icon;

                // Spacing in 3D stack: Exploded view spaces them out further along Z axis
                const layerOffset = isExploded ? index * 70 : index * 42;
                const activeOffset = isActive ? 16 : 0;

                return (
                  <motion.div
                    key={step.id}
                    animate={{
                      z: layerOffset + activeOffset,
                      y: isActive ? -8 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    className={`absolute inset-0 rounded-2xl backdrop-blur-xl border transition-all duration-300 p-6 flex flex-col justify-between ${
                      isActive
                        ? "bg-[#0c1407]/80 border-[#A3E635]/60 shadow-[0_20px_50px_rgba(163,230,53,0.15)]"
                        : "bg-white/[0.03] border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] opacity-85"
                    }`}
                    style={{
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* Conduit Intersection Node */}
                    <div
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        isActive
                          ? "bg-[#A3E635] border-white shadow-[0_0_15px_#A3E635]"
                          : "bg-[#060606] border-white/20"
                      }`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-black" />
                    </div>

                    {/* Slab Top Bar */}
                    <div className="flex items-center justify-between pl-6">
                      <div className="flex items-center space-x-2 font-mono text-xs">
                        <span className="text-[#A3E635] font-bold">
                          {step.stepNumber}
                        </span>
                        <span className="text-white/40">/</span>
                        <span className="text-white/70 uppercase tracking-wider">
                          {step.tag}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-white/40 border border-white/10 px-2 py-0.5 rounded-md">
                        {step.badge}
                      </span>
                    </div>

                    {/* Slab Large Title Typography */}
                    <div className="pl-6 py-2">
                      <h3
                        className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight transition-colors ${
                          isActive ? "text-white" : "text-white/40"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p className="text-xs text-white/50 font-sans mt-1">
                        {step.kicker}
                      </p>
                    </div>

                    {/* Slab Footer Chips */}
                    <div className="flex items-center space-x-2 pl-6 pt-2 border-t border-white/5">
                      <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-white/60 flex items-center space-x-1">
                        <Icon size={11} className="text-[#A3E635]" />
                        <span>VERIFIED NODE</span>
                      </span>
                      <span className="px-2 py-1 rounded bg-[#A3E635]/10 border border-[#A3E635]/20 text-[10px] font-mono text-[#A3E635]">
                        {step.metric}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Bottom Timeline Indicator */}
        <div className="w-full flex items-center justify-between pt-6 border-t border-white/5 text-xs font-mono text-white/40">
          <div className="flex items-center space-x-4">
            <span>PIPELINE ORCHESTRATION</span>
            <div className="flex items-center space-x-1.5">
              {STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeStep === i
                      ? "bg-[#A3E635] w-6"
                      : "bg-white/20"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2 text-[#A3E635]">
            <span>STAGE {activeStep + 1} OF 4</span>
            <ArrowRight size={13} />
          </div>
        </div>

      </div>
    </section>
  );
}
