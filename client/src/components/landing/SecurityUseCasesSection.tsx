"use client";
import React from "react";
import { ShieldCheck, HardDrive, Network, Gauge, FileCode, GitPullRequest, Code2, Sparkles, CheckCircle2, Lock } from "lucide-react";

export default function SecurityUseCasesSection() {
  const boundaries = [
    {
      title: "Filesystem Boundary",
      desc: "Ephemeral copy-on-write scratchpad overlay. Discarded immediately upon test termination, leaving zero host traces.",
      icon: HardDrive,
    },
    {
      title: "Network Boundary",
      desc: "Default-deny outbound packet filter. All external requests are blocked or redirected to declared deterministic fixture mocks.",
      icon: Network,
    },
    {
      title: "Resource Boundary",
      desc: "Strict cgroups v2 memory, CPU, and process count ceilings prevent runaway fork-bombs and host resource exhaustion.",
      icon: Gauge,
    },
    {
      title: "Explicit Security Policy",
      desc: "Declarative repository policies auditable by security teams. Every deviation fails the build before execution begins.",
      icon: FileCode,
    },
  ];

  const useCases = [
    {
      step: "01",
      title: "Pre-Merge Protection",
      tagline: "Catch regressions before they hit main.",
      desc: "Workflo synthesizes visual and functional regression suites for pull requests, verifying changes against staging parity without manual QA bottlenecks.",
      icon: GitPullRequest,
    },
    {
      step: "02",
      title: "Untrusted Code & PR Containment",
      tagline: "Safely execute external forks and PRs.",
      desc: "Run untrusted open-source community contributions inside hardware-isolated micro-containers with zero risk to cloud credentials or build secrets.",
      icon: Lock,
    },
    {
      step: "03",
      title: "AI-Generated QA Without Hallucinations",
      tagline: "AI proposes tests; sandboxes prove them.",
      desc: "Harness LLMs to explore edge cases and boundary conditions, while our deterministic sandbox and cryptographic verification guarantee zero false positives.",
      icon: Sparkles,
    },
    {
      step: "04",
      title: "Release Audit Receipts",
      tagline: "Attach tamper-proof proof to deployments.",
      desc: "Replace informal green checkmarks with immutable SHA-256 evidence packages for SOC 2, ISO 27001, and enterprise customer compliance audits.",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-32">
      {/* ── Act 08: Security Architecture ── */}
      <section className="max-w-7xl mx-auto px-6 relative z-10" id="security">
        <div className="mb-16 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-neon-green text-xs font-semibold tracking-[0.2em] uppercase mb-4 border border-neon-green/20 bg-neon-green/5 px-3.5 py-1.5 rounded-full font-mono">
            <span>ACT 08 // SECURITY ARCHITECTURE</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white leading-tight">
            Isolation is a feature. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-white font-light italic">
              Proof is the product.
            </span>
          </h2>
          <p className="text-gray-400 text-lg mt-6 font-light leading-relaxed max-w-2xl">
            We reject the idea of granting unconstrained test runners access to production secrets or the
            open internet. Workflo wraps every run in hardware-isolated boundaries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {boundaries.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="bg-[#090909] border border-gray-800/90 rounded-2xl p-6 flex flex-col justify-between hover:border-gray-700 transition-colors shadow-lg"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#121212] border border-gray-800 text-neon-green flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{b.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-light">{b.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-900 font-mono text-[10px] text-gray-500 uppercase tracking-wider">
                  Enforced at Kernel Level
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Act 09: Editorial Use Cases ── */}
      <section className="max-w-7xl mx-auto px-6 relative z-10" id="use-cases">
        <div className="mb-16 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-neon-green text-xs font-semibold tracking-[0.2em] uppercase mb-4 border border-neon-green/20 bg-neon-green/5 px-3.5 py-1.5 rounded-full font-mono">
            <span>ACT 09 // EDITORIAL USE CASES</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white leading-tight">
            Built for engineering teams <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-white font-light italic">
              shipping mission-critical code.
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {useCases.map((uc, i) => {
            const Icon = uc.icon;
            return (
              <div
                key={i}
                className="bg-[#080808] border border-gray-800/90 rounded-2xl p-8 flex flex-col justify-between hover:border-neon-green/40 transition-all group shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800/60 font-mono">
                    <span className="text-xs text-neon-green font-bold">{uc.step} // SCENARIO</span>
                    <Icon className="w-5 h-5 text-gray-500 group-hover:text-neon-green transition-colors" />
                  </div>
                  <div className="text-xs font-mono text-gray-500 mb-1 uppercase tracking-wider">{uc.tagline}</div>
                  <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{uc.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-light">{uc.desc}</p>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-800/60 flex items-center justify-between text-xs font-mono text-gray-500">
                  <span>Workflo Automated Guarantee</span>
                  <span className="text-neon-green">Validated ✓</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
