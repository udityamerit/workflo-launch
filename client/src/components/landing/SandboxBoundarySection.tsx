"use client";
import React, { useState } from "react";
import { Shield, Lock, AlertTriangle, Play, Server, Database, Globe, RefreshCw, Cpu, Layers } from "lucide-react";

export default function SandboxBoundarySection() {
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
      <div className="sandbox-boundary-box rounded-3xl p-8 md:p-12 relative overflow-hidden scale-dot-grid scale-corner-plus">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 border-b border-white/[0.08] pb-6">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-neon-green animate-ping" />
            <div className="font-mono text-xs uppercase tracking-widest text-white font-semibold">
              ENCLAVE BOUNDARY // HARDWARE-ISOLATED MICRO-VM
            </div>
            <span className="text-[10px] font-mono text-neon-green bg-neon-green/10 border border-neon-green/30 px-2 py-0.5 rounded-full">
              ENFORCING
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-gray-400">
            <span>Egress Violations Blocked: <strong className="text-white font-bold">{blockedCount}</strong></span>
          </div>
        </div>

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
              <span>Read-Only Rootfs: Strict Enforced</span>
              <span className="text-neon-green font-bold">SOC 2 Type II Compatible</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
