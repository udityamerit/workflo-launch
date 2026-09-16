"use client";
import React, { useState } from "react";
import { CheckCircle2, Layers, ShieldCheck, Network, Cpu, FileCheck, Key, ChevronRight } from "lucide-react";

interface EvidenceLayer {
  id: string;
  name: string;
  category: string;
  icon: React.ElementType;
  value: string;
  status: "verified" | "isolated" | "enforced";
  detail: string;
}

const EVIDENCE_LAYERS: EvidenceLayer[] = [
  {
    id: "source",
    name: "01 SOURCE",
    category: "Code Provenance",
    icon: Key,
    value: "commit: 8e32c7f",
    status: "verified",
    detail: "Deterministic AST digest computed from pristine git tree. Zero uncommitted mutations.",
  },
  {
    id: "environment",
    name: "02 ENVIRONMENT",
    category: "Kernel Boundary",
    icon: ShieldCheck,
    value: "Isolated Micro-VM",
    status: "isolated",
    detail: "Read-only rootfs with ephemeral copy-on-write scratchpad. Zero host kernel bleed.",
  },
  {
    id: "policy",
    name: "03 POLICY",
    category: "Execution Mandate",
    icon: Layers,
    value: "Default-Deny Egress",
    status: "enforced",
    detail: "Strict network isolation policy attached to repository manifest before container boot.",
  },
  {
    id: "network",
    name: "04 NETWORK",
    category: "Socket Filter",
    icon: Network,
    value: "0 Sockets Leaked",
    status: "isolated",
    detail: "All outbound egress attempts rejected by kernel packet filter. No secret exfiltration.",
  },
  {
    id: "execution",
    name: "05 EXECUTION",
    category: "Test Runtime",
    icon: Cpu,
    value: "Deterministic AST Plan",
    status: "verified",
    detail: "Synthesized Playwright & Jest candidate suites executed with frozen seed and virtual clock.",
  },
  {
    id: "artifacts",
    name: "06 ARTIFACTS",
    category: "Telemetry Capture",
    icon: FileCheck,
    value: "14 Hashed Files",
    status: "verified",
    detail: "DOM snapshots, network HARs, console output, and pixel-diff matrices stamped with SHA-256.",
  },
  {
    id: "signature",
    name: "07 SIGNATURE",
    category: "Cryptographic Seal",
    icon: CheckCircle2,
    value: "ECDSA P-256 Root Seal",
    status: "verified",
    detail: "Root manifest signed by air-gapped enclave key. Tampering renders run cryptographically invalid.",
  },
];

export default function ProblemFractureSection() {
  const [isFractured, setIsFractured] = useState(true);
  const [activeLayer, setActiveLayer] = useState<string>("signature");

  const currentLayer = EVIDENCE_LAYERS.find((l) => l.id === activeLayer) || EVIDENCE_LAYERS[6];

  return (
    <section className="max-w-7xl mx-auto px-6 py-32 relative z-10" id="problem">
      <div className="mb-16 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-neon-green text-xs font-semibold tracking-[0.2em] uppercase mb-4 border border-neon-green/20 bg-neon-green/5 px-3.5 py-1.5 rounded-full font-mono">
          <span>ACT 02 // THE PROBLEM</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white leading-tight">
          A green checkmark <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-white font-light italic">
            isn't proof.
          </span>
        </h2>
        <p className="text-gray-400 text-lg mt-6 font-light leading-relaxed max-w-2xl">
          A conventional test runner returns an output: passed or failed. Workflo makes the{" "}
          <span className="text-white font-medium">execution itself inspectable</span> by
          fracturing every run into immutable, verifiable layers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Fracturing Card Stack */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-6 pb-2 border-b border-gray-800">
            <span className="text-xs font-mono uppercase text-gray-400">
              Interactive State: {isFractured ? "Fractured (7 Layers)" : "Standard Checkmark"}
            </span>
            <button
              onClick={() => setIsFractured(!isFractured)}
              className="text-xs font-mono text-neon-green hover:underline flex items-center gap-1 cursor-pointer"
            >
              {isFractured ? "Collapse to Single Card" : "Fracture into Evidence"}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="w-full relative min-h-[460px] flex flex-col justify-center items-center evidence-fracture-stage">
            {!isFractured ? (
              /* Collapsed traditional checkmark */
              <div
                onClick={() => setIsFractured(true)}
                className="w-full max-w-md p-8 bg-[#090909] border border-gray-800 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer shadow-2xl hover:border-neon-green/50 transition-all group"
              >
                <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 mb-6 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="text-2xl font-bold text-white tracking-tight">PASSED</div>
                <div className="text-sm text-gray-400 mt-2 font-mono">14 / 14 tests completed in 2.4s</div>
                <div className="mt-8 text-xs text-neon-green font-mono border border-neon-green/20 bg-neon-green/5 px-4 py-2 rounded-full">
                  Click to fracture into 7 evidence layers →
                </div>
              </div>
            ) : (
              /* Fractured Layer Stack */
              <div className="w-full space-y-2.5">
                {EVIDENCE_LAYERS.map((layer, index) => {
                  const Icon = layer.icon;
                  const isSelected = activeLayer === layer.id;
                  return (
                    <div
                      key={layer.id}
                      onClick={() => setActiveLayer(layer.id)}
                      className={`evidence-layer-card p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? "bg-[#111608] border-neon-green/60 shadow-[0_0_25px_rgba(183,255,0,0.12)] translate-x-2"
                          : "bg-[#090909] border-gray-800/80 hover:bg-[#0f0f0f] hover:border-gray-700"
                      }`}
                      style={{
                        transform: `perspective(1000px) rotateX(${
                          (index - 3) * 1.5
                        }deg) translateZ(${(6 - index) * 4}px)`,
                      }}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
                            isSelected
                              ? "bg-neon-green/10 border-neon-green/40 text-neon-green"
                              : "bg-[#141414] border-gray-800 text-gray-400"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-mono font-semibold text-white tracking-wide">
                            {layer.name}
                          </div>
                          <div className="text-[11px] text-gray-400 font-mono">{layer.category}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-gray-300 bg-[#000] px-2.5 py-1 rounded border border-gray-800">
                          {layer.value}
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-neon-green bg-neon-green/10 px-2 py-0.5 rounded-full border border-neon-green/30">
                          {layer.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Selected Layer Telemetry Inspector */}
        <div className="lg:col-span-6 bg-[#080808] border border-gray-800/90 rounded-2xl p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-green/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <span className="text-xs font-mono uppercase text-gray-400">LAYER TELEMETRY // ACTIVE INSPECT</span>
            </div>
            <span className="text-xs font-mono text-gray-500">SHA256::VERIFIED</span>
          </div>

          <div className="space-y-6">
            <div>
              <div className="text-xs font-mono text-neon-green uppercase tracking-widest mb-1">
                {currentLayer.category}
              </div>
              <h3 className="text-3xl font-bold text-white tracking-tight">{currentLayer.name}</h3>
            </div>

            <div className="bg-[#050505] p-5 rounded-xl border border-gray-800/80 font-mono text-xs leading-relaxed text-gray-300">
              <div className="text-gray-500 mb-2">// Inspection Specification</div>
              <p>{currentLayer.detail}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 bg-[#0d0d0d] border border-gray-800 rounded-xl">
                <div className="text-gray-500 text-[10px] uppercase mb-1">Target Parameter</div>
                <div className="text-white font-semibold">{currentLayer.value}</div>
              </div>
              <div className="p-4 bg-[#0d0d0d] border border-gray-800 rounded-xl">
                <div className="text-gray-500 text-[10px] uppercase mb-1">Enforcement Status</div>
                <div className="text-neon-green font-semibold capitalize">{currentLayer.status}</div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800/80 flex items-center justify-between text-xs font-mono text-gray-500">
              <span>Cryptographic Proof: SHA-256 Digest Valid</span>
              <span className="text-neon-green">100% Deterministic</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
