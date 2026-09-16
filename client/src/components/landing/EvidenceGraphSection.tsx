"use client";
import React, { useState } from "react";
import { FileText, Image, Activity, Code, ShieldCheck, Hash, ArrowRight, Check } from "lucide-react";

interface EvidenceNode {
  id: string;
  name: string;
  count: string;
  sha256: string;
  description: string;
  icon: React.ElementType;
}

const NODES: EvidenceNode[] = [
  {
    id: "logs",
    name: "Execution Logs",
    count: "1,420 lines",
    sha256: "sha256:4a8f9c...11e2",
    description: "Full stdout/stderr captured with sub-millisecond timestamps and process isolation tags.",
    icon: FileText,
  },
  {
    id: "screenshots",
    name: "Visual Diff Matrices",
    count: "28 viewports",
    sha256: "sha256:7b210e...88f4",
    description: "Pixel-perfect visual regressions captured across Chromium, Firefox, and WebKit viewports.",
    icon: Image,
  },
  {
    id: "traces",
    name: "Playwright Traces",
    count: "14 zip archives",
    sha256: "sha256:0d53ba...99c1",
    description: "Action-by-action DOM replay, network HAR snapshots, and console state timeline.",
    icon: Activity,
  },
  {
    id: "ast",
    name: "AST Synthesized Tests",
    count: "18 spec files",
    sha256: "sha256:9e120f...aa30",
    description: "Autonomous test candidate definitions and deterministic execution assertions.",
    icon: Code,
  },
];

export default function EvidenceGraphSection() {
  const [selectedNode, setSelectedNode] = useState<string>("traces");

  const active = NODES.find((n) => n.id === selectedNode) || NODES[2];

  return (
    <section className="max-w-7xl mx-auto px-6 py-32 relative z-10" id="evidence-graph">
      <div className="mb-16 max-w-3xl">
        <div className="scale-badge mb-4 font-mono">
          <span>ACT 05 // CRYPTOGRAPHIC EVIDENCE GRAPH</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-medium tracking-tighter text-white leading-tight">
          Every run leaves <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-white font-light italic">
            verifiable evidence.
          </span>
        </h2>
        <p className="text-gray-400 text-lg mt-6 font-light leading-relaxed max-w-2xl">
          Like Scale AI's data engine, Workflo constructs a deterministic Merkle DAG of all test artifacts—folding
          raw console logs, pixel diffs, and network payloads into immutable SHA-256 hashes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: Interactive Evidence Tree */}
        <div className="lg:col-span-7 bg-[#080808] border border-white/[0.08] rounded-2xl p-8 relative shadow-2xl scale-corner-plus">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6 font-mono text-xs text-gray-400">
            <span className="flex items-center gap-2">
              <Hash className="w-3.5 h-3.5 text-neon-green" /> CRYPTOGRAPHIC ARTIFACT DAG
            </span>
            <span className="text-neon-green">14 / 14 DIGESTS SIGNED</span>
          </div>

          <div className="space-y-3">
            {NODES.map((node) => {
              const Icon = node.icon;
              const isSelected = selectedNode === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node.id)}
                  className={`evidence-tree-node p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#111608] border-neon-green text-white shadow-[0_0_20px_rgba(183,255,0,0.1)]"
                      : "bg-[#0c0c0c] border-white/[0.08] text-gray-300 hover:border-white/[0.18]"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
                        isSelected
                          ? "bg-neon-green/10 border-neon-green/40 text-neon-green"
                          : "bg-[#141414] border-white/[0.08] text-gray-400"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{node.name}</div>
                      <div className="text-xs font-mono text-gray-500">{node.count}</div>
                    </div>
                  </div>

                  <div className="text-right font-mono text-xs">
                    <div className="text-neon-green">{node.sha256}</div>
                    <div className="text-[10px] text-gray-500">DIGEST VERIFIED</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Root Manifest Compression Footnote */}
          <div className="mt-8 p-4 rounded-xl bg-[#050505] border border-white/[0.08] flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2 text-gray-400">
              <ArrowRight className="w-4 h-4 text-neon-green" />
              <span>Root Merkle Manifest:</span>
            </div>
            <span className="text-neon-green font-semibold">0x8f2dc7a94b00...f91a</span>
          </div>
        </div>

        {/* Right: Selected Artifact Inspector Details */}
        <div className="lg:col-span-5 bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-8 flex flex-col justify-between shadow-2xl scale-corner-plus">
          <div>
            <div className="font-mono text-xs text-neon-green uppercase tracking-wider mb-2">
              ARTIFACT INSPECTOR
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{active.name}</h3>
            <p className="text-sm text-gray-400 leading-relaxed font-light mb-6">
              {active.description}
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-[#111] border border-white/[0.08] rounded-lg">
                <div className="text-gray-500 text-[10px] uppercase">Telemetry Size</div>
                <div className="text-white font-semibold">{active.count}</div>
              </div>

              <div className="p-3 bg-[#111] border border-white/[0.08] rounded-lg">
                <div className="text-gray-500 text-[10px] uppercase">SHA-256 Digest</div>
                <div className="text-neon-green break-all">{active.sha256}</div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-gray-400">
            <span className="flex items-center gap-1.5 text-neon-green">
              <Check className="w-4 h-4" /> Immutable Record
            </span>
            <span>Zero Tampering Possible</span>
          </div>
        </div>
      </div>
    </section>
  );
}
