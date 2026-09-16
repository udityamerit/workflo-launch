"use client";
import React, { useState } from "react";
import { Shield, Lock, AlertTriangle, Play, Server, Database, Globe, RefreshCw, Cpu, Layers, Box, Terminal, Eye, Maximize2 } from "lucide-react";
import SandboxScene, { type SandboxHotspotId, type ScenePerformanceMode } from "../SandboxScene";
import HotspotDemoViewer from "./HotspotDemoViewer";

export default function SandboxBoundarySection() {
  const [viewMode, setViewMode] = useState<"3d" | "process">("3d");
  const [activeHotspot, setActiveHotspot] = useState<SandboxHotspotId | null>("runtime");
  const [resetSignal, setResetSignal] = useState(0);
  const [performanceMode, setPerformanceMode] = useState<ScenePerformanceMode>("balanced");

  // Egress firewall simulation state
  const [simulating, setSimulating] = useState(false);
  const [deniedPacket, setDeniedPacket] = useState<string | null>(null);
  const [blockedCount, setBlockedCount] = useState(42);

  const triggerEgressSimulation = (target: string) => {
    if (simulating) return;
    setSimulating(true);
    setDeniedPacket(target);

    setTimeout(() => {
      setBlockedCount((prev) => prev + 1);
      setSimulating(false);
    }, 1200);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-32 relative z-10" id="execution-sandbox">
      <div className="mb-16 max-w-3xl">
        <div className="scale-badge mb-4 font-mono">
          <span>ACT 04 // AIR-GAPPED SANDBOX ENCLAVE</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-medium tracking-tighter text-white leading-tight">
          Your code enters <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-white font-light italic">
            an air-gapped boundary.
          </span>
        </h2>
        <p className="text-gray-400 text-lg mt-6 font-light leading-relaxed max-w-2xl">
          Zero trust required. Workflo provisions hardware-isolated, ephemeral micro-containers with
          strict default-deny egress rules, preventing socket leakage and secret exfiltration.
        </p>
      </div>

      {/* Main Sandbox Enclosure Visualization */}
      <div className="sandbox-boundary-box rounded-3xl p-6 md:p-10 relative overflow-hidden scale-dot-grid scale-corner-plus bg-[#050505] border border-white/[0.1]">
        {/* Top Control Bar with View Mode Switcher */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-white/[0.08] pb-5">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-neon-green hotspot-beacon" />
            <div className="font-mono text-xs uppercase tracking-widest text-white font-semibold">
              ENCLAVE BOUNDARY // HARDWARE-ISOLATED MICRO-VM
            </div>
            <span className="text-[10px] font-mono text-neon-green bg-neon-green/10 border border-neon-green/30 px-2 py-0.5 rounded-full">
              ENFORCING
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* 3D vs Process Tree Toggle */}
            <div className="p-1 bg-[#111] rounded-xl border border-white/[0.08] flex items-center font-mono text-xs">
              <button
                type="button"
                onClick={() => setViewMode("3d")}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "3d" ? "bg-[#222] text-[#c8ff3d] font-bold shadow" : "text-gray-400 hover:text-white"
                }`}
              >
                <Box size={13} />
                <span>3D Model & Hotspots</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("process")}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "process" ? "bg-[#222] text-[#c8ff3d] font-bold shadow" : "text-gray-400 hover:text-white"
                }`}
              >
                <Layers size={13} />
                <span>Firewall Simulator</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── MODE A: Interactive 3D Model with Pulsing Hotspots & Looping Demos ── */}
        {viewMode === "3d" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* 3D WebGL Canvas Viewport */}
            <div className="lg:col-span-7 relative h-[420px] sm:h-[500px] w-full rounded-2xl overflow-hidden bg-[#060b0f] border border-white/[0.1] shadow-2xl group">
              {/* Three.js Canvas */}
              <SandboxScene
                scrollProgress={0.45}
                resetSignal={resetSignal}
                performanceMode={performanceMode}
                runProgress={0.88}
                executionStage={1}
                activeHotspot={activeHotspot}
                onHotspotSelect={(id) => setActiveHotspot(id)}
                showHotspots={true}
              />

              {/* 3D Canvas Top Overlay: Hotspot Quick Navigation with Pulsing Beacons */}
              <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none z-10">
                <div className="flex items-center gap-2 pointer-events-auto bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/[0.1]">
                  <span className="text-[10px] font-mono text-gray-400 uppercase mr-1">Hotspots:</span>

                  <button
                    type="button"
                    onClick={() => setActiveHotspot("runtime")}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeHotspot === "runtime"
                        ? "bg-[#c8ff3d] text-black font-bold shadow-lg"
                        : "bg-white/[0.06] text-gray-300 hover:text-white"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c8ff3d] hotspot-beacon" />
                    01 Runtime
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveHotspot("network")}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeHotspot === "network"
                        ? "bg-[#c8ff3d] text-black font-bold shadow-lg"
                        : "bg-white/[0.06] text-gray-300 hover:text-white"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 hotspot-beacon" />
                    02 Network
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveHotspot("receipt")}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeHotspot === "receipt"
                        ? "bg-[#c8ff3d] text-black font-bold shadow-lg"
                        : "bg-white/[0.06] text-gray-300 hover:text-white"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c8ff3d] hotspot-beacon" />
                    03 Receipt
                  </button>
                </div>

                {/* Reset View Button */}
                <button
                  type="button"
                  onClick={() => setResetSignal((c) => c + 1)}
                  className="pointer-events-auto px-2.5 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/[0.1] text-gray-400 hover:text-white text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                  title="Reset 3D camera"
                >
                  <RefreshCw size={11} /> Reset 3D
                </button>
              </div>

              {/* 3D Canvas Bottom Helper Notice */}
              <div className="absolute bottom-4 left-4 pointer-events-none z-10 flex items-center gap-2 text-[10px] font-mono text-gray-400 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/[0.06]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c8ff3d] animate-pulse" />
                <span>DRAG TO ROTATE 3D MODEL • CLICK PULSING HOTSPOTS</span>
              </div>
            </div>

            {/* Right Column: Hotspot Tooltip Card with Auto-playing Looping GIF Demo & Mobile Expand */}
            <div className="lg:col-span-5">
              {activeHotspot ? (
                <HotspotDemoViewer
                  hotspotId={activeHotspot}
                  onClose={() => setActiveHotspot(null)}
                  className="w-full"
                />
              ) : (
                <div className="p-8 rounded-2xl bg-[#0a0a0a] border border-white/[0.08] text-center font-mono text-xs text-gray-400">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-3 text-[#c8ff3d]">
                    <Eye size={20} />
                  </div>
                  <h4 className="text-white text-sm font-semibold mb-1">Select a 3D Hotspot</h4>
                  <p className="text-gray-500 text-[11px] mb-4">
                    Click any pulsing beacon inside the 3D model or choose from the top bar to inspect auto-playing looping demonstrations.
                  </p>
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveHotspot("runtime")}
                      className="px-3 py-1.5 rounded-lg bg-[#161616] hover:bg-[#222] text-[#c8ff3d] border border-white/[0.1] cursor-pointer text-[11px]"
                    >
                      Inspect Runtime →
                    </button>
                  </div>
                </div>
              )}

              {/* Security Compliance Seal */}
              <div className="mt-4 p-3.5 rounded-xl border border-white/[0.08] bg-[#070707] font-mono text-[11px] text-gray-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Shield size={13} className="text-[#c8ff3d]" />
                  <span>Hardware-Isolated Micro-VM</span>
                </span>
                <span className="text-[#c8ff3d] font-bold">SOC 2 Type II Certified</span>
              </div>
            </div>
          </div>
        )}

        {/* ── MODE B: Firewall & Egress Simulator ── */}
        {viewMode === "process" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Inside Boundary Container */}
            <div className="lg:col-span-7 bg-[#080808]/95 border border-neon-green/30 rounded-2xl p-6 md:p-8 relative shadow-2xl">
              <div className="absolute top-3 right-4 font-mono text-[10px] text-neon-green uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3 h-3" /> INSIDE ENCLAVE (SECURED)
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-[#0d0d0d] border border-white/[0.08] rounded-xl flex items-start gap-3">
                  <Cpu className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white font-semibold text-sm">Target Application</div>
                    <div className="text-gray-400 text-xs font-mono mt-0.5">Isolated ephemeral process tree</div>
                  </div>
                </div>

                <div className="p-4 bg-[#0d0d0d] border border-white/[0.08] rounded-xl flex items-start gap-3">
                  <Layers className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white font-semibold text-sm">Autonomous Tests</div>
                    <div className="text-gray-400 text-xs font-mono mt-0.5">Playwright & Jest runners</div>
                  </div>
                </div>

                <div className="p-4 bg-[#0d0d0d] border border-white/[0.08] rounded-xl flex items-start gap-3">
                  <Server className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white font-semibold text-sm">Synthetic Mocks</div>
                    <div className="text-gray-400 text-xs font-mono mt-0.5">Isolated API fixture stubs</div>
                  </div>
                </div>

                <div className="p-4 bg-[#0d0d0d] border border-white/[0.08] rounded-xl flex items-start gap-3">
                  <Globe className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white font-semibold text-sm">Headless Browser</div>
                    <div className="text-gray-400 text-xs font-mono mt-0.5">Chromium sandbox kernel</div>
                  </div>
                </div>
              </div>

              {/* Simulated blocked egress pulse notification */}
              {simulating && (
                <div className="mt-6 p-4 rounded-xl bg-red-950/40 border border-red-500/50 flex items-center justify-between font-mono text-xs sandbox-packet-blocked">
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertTriangle className="w-4 h-4 text-red-400 animate-bounce" />
                    <span>PACKET EXFILTRATION BLOCKED: Destination [{deniedPacket}]</span>
                  </div>
                  <span className="text-[10px] bg-red-900/60 text-red-200 px-2 py-0.5 rounded uppercase">
                    DENIED BY POLICY
                  </span>
                </div>
              )}
            </div>

            {/* Outside Boundary & Interactive Firewall Controls */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6 shadow-xl">
                <div className="font-mono text-xs text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-400" /> OUTSIDE WORLD // RESTRICTED ACCESS
                </div>

                <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                  Zero production keys, host filesystems, or unauthorized cloud networks are reachable.
                  Test our firewall filter live:
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => triggerEgressSimulation("https://api.production-db.internal")}
                    disabled={simulating}
                    className="w-full text-left p-3.5 rounded-xl bg-[#111] hover:bg-[#161616] border border-white/[0.08] text-xs font-mono flex items-center justify-between text-gray-300 transition-colors group cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-gray-500 group-hover:text-red-400 transition-colors" />
                      Simulate DB Exfiltration Attempt
                    </span>
                    <span className="text-[10px] text-neon-green uppercase font-semibold">Test Deny →</span>
                  </button>

                  <button
                    onClick={() => triggerEgressSimulation("https://unverified-third-party.com/exfil")}
                    disabled={simulating}
                    className="w-full text-left p-3.5 rounded-xl bg-[#111] hover:bg-[#161616] border border-white/[0.08] text-xs font-mono flex items-center justify-between text-gray-300 transition-colors group cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-500 group-hover:text-red-400 transition-colors" />
                      Simulate Public Web Socket Dial
                    </span>
                    <span className="text-[10px] text-neon-green uppercase font-semibold">Test Deny →</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/[0.08] bg-[#060606] font-mono text-[11px] text-gray-400 flex items-center justify-between">
                <span>Egress Violations Blocked: <strong className="text-white font-bold">{blockedCount}</strong></span>
                <span className="text-neon-green font-bold">Default Deny Active</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
