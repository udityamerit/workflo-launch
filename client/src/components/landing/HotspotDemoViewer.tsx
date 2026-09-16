import React, { useState, useEffect } from "react";
import { Maximize2, Minimize2, Play, Pause, X, Shield, Terminal, Globe, FileCheck, CheckCircle2, Lock, Cpu, Sparkles } from "lucide-react";
import type { SandboxHotspotId } from "../SandboxScene";

interface HotspotDemoViewerProps {
  hotspotId: SandboxHotspotId;
  onClose?: () => void;
  className?: string;
  forceExpanded?: boolean;
}

export interface HotspotMeta {
  id: SandboxHotspotId;
  badge: string;
  title: string;
  tagline: string;
  metrics: { label: string; value: string }[];
  command: string;
}

export const HOTSPOT_DATA: Record<SandboxHotspotId, HotspotMeta> = {
  runtime: {
    id: "runtime",
    badge: "ACT 04 // HOTSPOT 01",
    title: "Ephemeral Container Runtime",
    tagline: "Sub-12ms micro-VM isolation with zero persistent state retention",
    metrics: [
      { label: "Boot Latency", value: "11.8ms" },
      { label: "Isolation Boundary", value: "cgroup v2 + KVM" },
      { label: "State Retention", value: "0 bytes (purged)" },
      { label: "Memory Cap", value: "2,048 MB strict" },
    ],
    command: "workflo run --isolate --enclave=strict",
  },
  network: {
    id: "network",
    badge: "ACT 04 // HOTSPOT 02",
    title: "Zero-Egress Network Boundary",
    tagline: "Air-gapped socket perimeter blocking unauthorized cloud exfiltration",
    metrics: [
      { label: "Egress Policy", value: "Default Deny" },
      { label: "DNS Spoofing Defense", value: "Hardened eBPF" },
      { label: "Exfiltration Attempts Blocked", value: "100%" },
      { label: "Synthetic Mock Latency", value: "0.14ms" },
    ],
    command: "workflo network enforce --policy=zero-egress",
  },
  receipt: {
    id: "receipt",
    badge: "ACT 04 // HOTSPOT 03",
    title: "Cryptographic Execution Receipt",
    tagline: "Merkle-attested SHA-256 state tree signed by hardware enclave key",
    metrics: [
      { label: "Attestation Algorithm", value: "Ed25519 + SHA-256" },
      { label: "Merkle Tree Depth", value: "8 levels" },
      { label: "Verification Status", value: "Immutable Stamp" },
      { label: "Audit Portability", value: "JSON-LD & PDF" },
    ],
    command: "workflo receipt verify --proof=wf-4492.sig",
  },
};

export default function HotspotDemoViewer({
  hotspotId,
  onClose,
  className = "",
  forceExpanded = false,
}: HotspotDemoViewerProps) {
  const [isExpanded, setIsExpanded] = useState(forceExpanded);
  const [isPlaying, setIsPlaying] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [loopCycle, setLoopCycle] = useState(0);

  const data = HOTSPOT_DATA[hotspotId] || HOTSPOT_DATA.runtime;

  // Listen for reduced-motion media query
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    if (mediaQuery.matches) {
      setIsPlaying(false);
    }

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
      if (e.matches) {
        setIsPlaying(false);
      }
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Handle ESC key for expanded modal dismissal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isExpanded) {
          setIsExpanded(false);
        } else if (onClose) {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded, onClose]);

  // Simulated auto-playing looping GIF frame cycle
  useEffect(() => {
    if (!isPlaying || prefersReducedMotion) return;
    const interval = window.setInterval(() => {
      setLoopCycle((prev) => (prev + 1) % 100);
    }, 80);
    return () => window.clearInterval(interval);
  }, [isPlaying, prefersReducedMotion]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  // Render the looping animation for the active hotspot
  const renderLoopingDemoContent = (expanded: boolean) => {
    const heightClass = expanded ? "h-64 md:h-80" : "h-44";

    if (hotspotId === "runtime") {
      return (
        <div className={`relative ${heightClass} w-full bg-[#070b0e] border border-[#c8ff3d]/20 rounded-xl overflow-hidden font-mono text-[11px] p-4 flex flex-col justify-between select-none shadow-inner`}>
          {/* Top header bar of demo */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 text-[10px] text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#c8ff3d] animate-pulse" />
              <span className="text-white font-semibold">CONTAINER_BOOT // PID 14</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#c8ff3d]">ISOLATED</span>
              <span className="text-gray-500">CYCLE #{Math.floor(loopCycle / 20) + 1}</span>
            </div>
          </div>

          {/* Animated terminal lines representing looping GIF demo */}
          <div className="space-y-1.5 py-2 overflow-hidden text-gray-300">
            <div className="flex items-center gap-2 text-emerald-400">
              <span>[00:00.002]</span>
              <span>KVM microvm initialized: 1 vCPU, 2048 MB memory</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <span>[00:00.006]</span>
              <span>mounting read-only rootfs + ephemeral tmpfs</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <span>[00:00.009]</span>
              <span>applying seccomp sandbox filter (62 syscalls restricted)</span>
            </div>
            <div className="flex items-center gap-2 text-[#c8ff3d]">
              <span>[00:00.012]</span>
              <span>✓ runtime container ready in 11.8ms</span>
            </div>
            {loopCycle > 40 && (
              <div className="flex items-center gap-2 text-sky-400 animate-fadeIn">
                <span>[00:00.024]</span>
                <span>executing test spec: checkout_flow.spec.ts</span>
              </div>
            )}
            {loopCycle > 75 && (
              <div className="flex items-center gap-2 text-emerald-300 animate-fadeIn">
                <span>[00:00.051]</span>
                <span>teardown complete: state memory zeroed & recycled</span>
              </div>
            )}
          </div>

          {/* Bottom visual progress bar */}
          <div>
            <div className="flex justify-between text-[9px] text-gray-500 mb-1">
              <span>SANDBOX LIFECYCLE LOOP</span>
              <span>{loopCycle}%</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#c8ff3d] to-emerald-400 transition-all duration-75"
                style={{ width: `${loopCycle}%` }}
              />
            </div>
          </div>
        </div>
      );
    }

    if (hotspotId === "network") {
      return (
        <div className={`relative ${heightClass} w-full bg-[#08070b] border border-red-500/20 rounded-xl overflow-hidden font-mono text-[11px] p-4 flex flex-col justify-between select-none shadow-inner`}>
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 text-[10px] text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
              <span className="text-white font-semibold">EGRESS_FIREWALL // AIR-GAP ENFORCER</span>
            </div>
            <span className="text-red-400 font-bold">STRICT BLOCK</span>
          </div>

          {/* Animated network packet flow */}
          <div className="relative py-2 flex flex-col items-center justify-center my-auto">
            <div className="w-full flex items-center justify-between px-4 py-2 bg-[#0e0a12] rounded-lg border border-white/[0.06] mb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">https://api.internal-db.prod/exfil</span>
              </div>
              <span className="text-[10px] bg-red-950 text-red-300 border border-red-800/50 px-2 py-0.5 rounded font-bold">
                TCP_RST (BLOCKED)
              </span>
            </div>

            <div className="w-full flex items-center justify-between px-4 py-2 bg-[#09110d] rounded-lg border border-emerald-500/20">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300">synthetic://stripe-mock/v1/charges</span>
              </div>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/50 px-2 py-0.5 rounded font-bold">
                200 OK (MOCK)
              </span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[9px] text-gray-500 mb-1">
              <span>AIR-GAP PACKET INSPECTION</span>
              <span className="text-red-400">0 LEAKED BYTES</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 via-yellow-400 to-[#c8ff3d] transition-all duration-75"
                style={{ width: `${loopCycle}%` }}
              />
            </div>
          </div>
        </div>
      );
    }

    // Default: Receipt Hotspot
    return (
      <div className={`relative ${heightClass} w-full bg-[#070e0a] border border-[#c8ff3d]/30 rounded-xl overflow-hidden font-mono text-[11px] p-4 flex flex-col justify-between select-none shadow-inner`}>
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 text-[10px] text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#c8ff3d] animate-pulse" />
            <span className="text-white font-semibold">MERKLE_PROOF // SHA-256 ATTESTATION</span>
          </div>
          <span className="text-[#c8ff3d] font-bold">SEALED & IMMUTABLE</span>
        </div>

        <div className="space-y-2 my-auto py-2">
          <div className="p-2.5 rounded-lg bg-black/60 border border-[#c8ff3d]/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#c8ff3d]" />
              <div>
                <div className="text-white font-semibold text-xs">Run Attestation WF-4492</div>
                <div className="text-[9px] text-gray-400 truncate max-w-[200px] md:max-w-xs">
                  root: 0x8fa3729e84b2c890184b2efc84210a
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                VALID SIGNATURE
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="p-2 bg-[#0c130e] border border-white/[0.06] rounded">
              <span className="text-gray-500 block">ENCLAVE KEY</span>
              <span className="text-gray-300 font-bold">Ed25519 Hardware</span>
            </div>
            <div className="p-2 bg-[#0c130e] border border-white/[0.06] rounded">
              <span className="text-gray-500 block">TIMESTAMP</span>
              <span className="text-[#c8ff3d] font-bold">RFC 3161 TSA Valid</span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[9px] text-gray-500 mb-1">
            <span>CRYPTOGRAPHIC MERKLE COMMIT</span>
            <span className="text-[#c8ff3d]">100% AUDITABLE</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-[#c8ff3d] transition-all duration-75"
              style={{ width: `${loopCycle}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* ── Main Tooltip Card (Standard View) ── */}
      <div
        className={`bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/[0.12] rounded-2xl p-5 text-left text-white shadow-2xl transition-all duration-300 scale-corner-plus ${className}`}
        role="region"
        aria-label={`${data.title} demonstration`}
      >
        {/* Header with Title & Quick Controls */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#c8ff3d] hotspot-beacon" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#c8ff3d] font-semibold">
                {data.badge}
              </span>
            </div>
            <h4 className="text-base font-semibold text-white tracking-tight mt-1">
              {data.title}
            </h4>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Play/Pause Control */}
            <button
              type="button"
              onClick={togglePlay}
              className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 hover:text-white transition-colors cursor-pointer"
              title={isPlaying ? "Pause demo" : "Play demo"}
              aria-label={isPlaying ? "Pause demo" : "Play demo"}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>

            {/* Click-to-Expand Mobile & Desktop Trigger */}
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 hover:text-white transition-colors cursor-pointer"
              title="Expand demonstration"
              aria-label="Expand demonstration"
            >
              <Maximize2 size={14} />
            </button>

            {/* Close Button if provided */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                title="Close tooltip"
                aria-label="Close tooltip"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Tagline */}
        <p className="text-xs text-gray-400 leading-relaxed mb-3">
          {data.tagline}
        </p>

        {/* Looping GIF / Visual Demo Container */}
        <div className="relative group mb-3">
          {renderLoopingDemoContent(false)}

          {/* Mobile Click-to-Expand Prompt Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl pointer-events-none md:pointer-events-auto">
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="pointer-events-auto px-3 py-1.5 rounded-lg bg-black/80 border border-[#c8ff3d]/40 text-[#c8ff3d] text-xs font-mono flex items-center gap-1.5 hover:bg-black transition-colors shadow-lg"
            >
              <Maximize2 size={12} /> Tap to expand demo ⤢
            </button>
          </div>
        </div>

        {/* Mobile Explicit Expand Action for Touch Accessibility */}
        <div className="block md:hidden mb-3">
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="w-full py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-mono text-gray-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-transform"
            aria-haspopup="dialog"
            aria-expanded={isExpanded}
          >
            <Maximize2 size={13} className="text-[#c8ff3d]" />
            <span>Tap to expand demo ⤢</span>
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.08] text-[11px] font-mono">
          {data.metrics.map((m) => (
            <div key={m.label} className="bg-white/[0.02] p-2 rounded-lg border border-white/[0.04]">
              <span className="text-gray-500 text-[10px] block">{m.label}</span>
              <strong className="text-gray-200 font-semibold">{m.value}</strong>
            </div>
          ))}
        </div>

        {/* Reduced motion indicator if enabled */}
        {prefersReducedMotion && (
          <div className="mt-3 p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-gray-400 flex items-center justify-between">
            <span>Reduced-motion preference active</span>
            <span className="text-[#c8ff3d]">Loop paused</span>
          </div>
        )}
      </div>

      {/* ── Expanded Modal Dialog (Accessible Mobile & Desktop View) ── */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-xl animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-labelledby="expanded-demo-title"
          onClick={() => setIsExpanded(false)}
        >
          <div
            className="relative w-full max-w-3xl bg-[#090909] border border-white/[0.15] rounded-3xl p-6 md:p-10 shadow-2xl max-h-[92vh] overflow-y-auto scale-dot-grid scale-corner-plus"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-6 border-b border-white/[0.08] pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#c8ff3d] hotspot-beacon" />
                  <span className="text-xs font-mono uppercase tracking-widest text-[#c8ff3d] font-bold">
                    {data.badge} // EXPANDED HIGH-RES INSPECTION
                  </span>
                </div>
                <h3 id="expanded-demo-title" className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  {data.title}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {data.tagline}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white flex items-center gap-1.5 text-xs font-mono cursor-pointer transition-colors"
                  aria-label={isPlaying ? "Pause animation" : "Resume animation"}
                >
                  {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                  <span className="hidden sm:inline">{isPlaying ? "Pause Loop" : "Play Loop"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="p-2 rounded-xl bg-white/[0.08] hover:bg-red-500/20 text-gray-300 hover:text-red-400 cursor-pointer transition-colors"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* High-Resolution Expanded Demo Content */}
            <div className="mb-6">
              {renderLoopingDemoContent(true)}
            </div>

            {/* CLI Reproduction Command */}
            <div className="mb-6 p-4 rounded-xl bg-black border border-white/[0.08] font-mono text-xs flex items-center justify-between text-gray-300">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#c8ff3d]" />
                <span className="text-gray-500">$</span>
                <span>{data.command}</span>
              </div>
              <span className="text-[10px] text-gray-500 uppercase">CLI Command</span>
            </div>

            {/* Technical Verification Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {data.metrics.map((m) => (
                <div key={m.label} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] font-mono">
                  <span className="text-gray-500 text-[10px] block mb-1">{m.label}</span>
                  <span className="text-sm text-white font-bold">{m.value}</span>
                </div>
              ))}
            </div>

            {/* Footer with Accessibility Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/[0.08] text-xs text-gray-400 font-mono">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#c8ff3d]" />
                <span>Verified in Workflo Isolated Enclave Architecture</span>
              </div>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#c8ff3d] hover:bg-[#b8ef2d] text-black font-semibold cursor-pointer transition-colors"
              >
                Done (Esc)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
