"use client";
import React, { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  Cpu,
  ShieldCheck,
  FileCheck2,
  Sparkles,
  Layers,
  Terminal,
  Lock,
  ArrowUpRight,
  Fingerprint,
  Zap,
  Activity,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

interface CardData {
  id: string;
  badge: string;
  tag: string;
  title: string;
  subtitle: string;
  metric: string;
  metricLabel: string;
  icon: LucideIcon;
  description: string;
  chips: string[];
  telemetry: { label: string; val: string }[];
  accentColor: string;
}

const CARDS: CardData[] = [
  {
    id: "engine",
    badge: "CORE ENGINE",
    tag: "DIMENSION // 01",
    title: "Autonomous Quantum Spec",
    subtitle: "Multi-Model AST Synthesis",
    metric: "99.8%",
    metricLabel: "Test Synthesis Accuracy",
    icon: Cpu,
    description:
      "Inspects code diffs and frontend visual state trees in real time. Generates self-healing Playwright and Jest test runs before code hits staging.",
    chips: ["AST Graph Mapping", "Self-Healing Selectors", "Instant Zero-Flake"],
    telemetry: [
      { label: "SYNTHESIS LATENCY", val: "380ms" },
      { label: "HEURISTIC ACCURACY", val: "99.8%" },
      { label: "PARALLEL THREADS", val: "32 Nodes" },
    ],
    accentColor: "#FFAE33",
  },
  {
    id: "sandbox",
    badge: "SECURITY VAULT",
    tag: "DIMENSION // 02",
    title: "Air-Gapped Neural Sandbox",
    subtitle: "Hardware-Isolated Micro-Containers",
    metric: "0.00%",
    metricLabel: "Secret Exposure Vector",
    icon: ShieldCheck,
    description:
      "Every pull request executes in an isolated, memory-shielded container. Zero customer data, proprietary database states, or production keys are ever touched.",
    chips: ["TLS 1.3 Strict", "Zero-Memory Residue", "SOC 2 Type II Certified"],
    telemetry: [
      { label: "CONTAINER SPINUP", val: "1.4s" },
      { label: "ENCRYPTION CIPHER", val: "AES-256-GCM" },
      { label: "SECRET LEAK ISOLATION", val: "100% Strict" },
    ],
    accentColor: "#38BDF8",
  },
  {
    id: "receipts",
    badge: "PROOF PROTOCOL",
    tag: "DIMENSION // 03",
    title: "Cryptographic Proof Receipts",
    subtitle: "Immutable SHA-256 Audit Trail",
    metric: "100%",
    metricLabel: "Verifiable On-Chain & CI",
    icon: FileCheck2,
    description:
      "Every passed run stamps a signed cryptographic proof receipt with full DOM snapshots, network payloads, video replays, and execution telemetry.",
    chips: ["SHA-256 Digest", "Automated PR Annotations", "Audit Telemetry"],
    telemetry: [
      { label: "DIGEST HASH", val: "0x8f2d...4a1" },
      { label: "TRACE ARTIFACTS", val: "DOM + Video + Logs" },
      { label: "CI GATE VERIFICATION", val: "Pass Guaranteed" },
    ],
    accentColor: "#C084FC",
  },
];

/* ── Interactive 3D Holographic Card Component ───────────────── */
function HolographicCard({ card }: { card: CardData }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse Parallax Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [16, -16]), {
    stiffness: 300,
    damping: 24,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-16, 16]), {
    stiffness: 300,
    damping: 24,
  });

  // Glare position
  const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), {
    stiffness: 300,
    damping: 24,
  });
  const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), {
    stiffness: 300,
    damping: 24,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const Icon = card.icon;

  return (
    <div
      ref={cardRef}
      className="relative w-full h-[520px] flex items-center justify-center cursor-pointer select-none"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="relative w-full h-full rounded-3xl border border-white/10 bg-[#090e0b]/90 backdrop-blur-2xl p-7 flex flex-col justify-between overflow-hidden transition-all duration-300 shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
        style={{
          transformStyle: "preserve-3d",
          rotateX,
          rotateY,
          borderColor: isHovered ? `${card.accentColor}55` : "rgba(255,255,255,0.1)",
        }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Dynamic Holographic Glare Layer */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.35 : 0,
            background: `radial-gradient(circle 320px at ${glareX}% ${glareY}%, ${card.accentColor}33, transparent 70%)`,
          }}
        />

        {/* Ambient Neon Top Corner Glow */}
        <div
          className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-[80px] pointer-events-none transition-opacity duration-500"
          style={{
            backgroundColor: card.accentColor,
            opacity: isHovered ? 0.25 : 0.08,
          }}
        />

        {/* Cyber Holographic Scanning Line */}
        {isHovered && (
          <motion.div
            className="absolute left-0 right-0 h-[2px] pointer-events-none z-30"
            style={{
              background: `linear-gradient(90deg, transparent, ${card.accentColor}, transparent)`,
              boxShadow: `0 0 12px ${card.accentColor}`,
            }}
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 2.2,
              ease: "linear",
            }}
          />
        )}

        {/* Top Header Row (Preserves 3D Depth) */}
        <div
          className="flex items-center justify-between z-10"
          style={{ transform: "translateZ(30px)" }}
        >
          <div className="flex items-center space-x-2">
            <div
              className="w-8 h-8 rounded-xl border flex items-center justify-center"
              style={{
                borderColor: `${card.accentColor}40`,
                backgroundColor: `${card.accentColor}15`,
              }}
            >
              <Icon size={16} style={{ color: card.accentColor }} />
            </div>
            <span className="text-[11px] font-mono tracking-widest text-white/50 uppercase">
              {card.tag}
            </span>
          </div>

          <span
            className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider border"
            style={{
              borderColor: `${card.accentColor}40`,
              backgroundColor: `${card.accentColor}15`,
              color: card.accentColor,
            }}
          >
            {card.badge}
          </span>
        </div>

        {/* Middle Core Body (Deep 3D Layer) */}
        <div className="space-y-4 my-auto z-10" style={{ transform: "translateZ(40px)" }}>
          <div>
            <h3 className="text-2xl font-bold font-mono tracking-tight text-white flex items-center space-x-2">
              <span>{card.title}</span>
            </h3>
            <p className="text-xs font-mono text-white/40 mt-1">
              {card.subtitle}
            </p>
          </div>

          {/* Metric Highlight Box */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-baseline justify-between">
            <div>
              <div
                className="text-3xl font-bold font-mono tracking-tight"
                style={{ color: card.accentColor }}
              >
                {card.metric}
              </div>
              <div className="text-[10px] font-mono text-white/50 uppercase mt-0.5">
                {card.metricLabel}
              </div>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-white/40">
              <Activity size={13} style={{ color: card.accentColor }} />
              <span className="font-mono text-[11px]">ACTIVE</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-normal">
            {card.description}
          </p>

          {/* Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {card.chips.map((chip) => (
              <span
                key={chip}
                className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/5 border border-white/10 text-white/70"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Telemetry HUD Matrix (Deep 3D Layer) */}
        <div
          className="pt-4 border-t border-white/5 space-y-2 z-10"
          style={{ transform: "translateZ(25px)" }}
        >
          <div className="grid grid-cols-3 gap-2 text-left">
            {card.telemetry.map((t) => (
              <div key={t.label} className="flex flex-col">
                <span className="text-[9px] font-mono text-white/30 truncate">
                  {t.label}
                </span>
                <span className="text-[10px] font-mono text-white/80 font-semibold truncate mt-0.5">
                  {t.val}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 text-[11px] font-mono text-white/40">
            <span className="flex items-center space-x-1">
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: card.accentColor }}
              />
              <span>Tamper-Proof Verified</span>
            </span>
            <div
              className="flex items-center space-x-1 transition-transform group-hover:translate-x-1"
              style={{ color: card.accentColor }}
            >
              <span>Inspect protocol</span>
              <ArrowUpRight size={12} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Holographic Cards Section Wrapper ───────────────────────── */
export default function HolographicCardsSection() {
  return (
    <section id="capabilities" className="relative w-full bg-transparent text-white py-28 px-6 md:px-12 lg:px-24 border-t border-white/5 overflow-hidden z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-[#FFAE33]/30 bg-[#FFAE33]/10 backdrop-blur-md mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFAE33] animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#FFAE33]">
                Dimension 04 // Holographic Artifacts
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Immersion you can inspect. <br />
              <span className="text-white/40">Real 3D cryptographic proof.</span>
            </h2>
          </div>

          <p className="max-w-md text-sm text-white/50 font-normal leading-relaxed">
            Hover, tilt, and explore the core structural layers of the Workflo protocol. Every test, container, and verification artifact exists as an immutable 3D cryptographic node.
          </p>
        </div>

        {/* 3D Holographic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
          {CARDS.map((card) => (
            <HolographicCard key={card.id} card={card} />
          ))}
        </div>

      </div>
    </section>
  );
}
