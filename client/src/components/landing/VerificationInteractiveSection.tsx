"use client";
import React, { useState } from "react";
import { CheckCircle2, XCircle, ShieldCheck, RefreshCw, Key, FileCheck, Terminal, AlertTriangle, Play } from "lucide-react";

export type VerificationState =
  | "idle"
  | "parsing"
  | "hashing"
  | "signature"
  | "evidence"
  | "verified"
  | "invalid";

export const demoRun = {
  id: "wf_demo_001",
  status: "passed",
  environment: "isolated",
  network: "blocked",
  artifacts: 14,
};

export default function VerificationInteractiveSection() {
  const [state, setState] = useState<VerificationState>("verified");
  const [isTampered, setIsTampered] = useState(false);

  const runVerification = (tamper = false) => {
    setIsTampered(tamper);
    setState("parsing");

    setTimeout(() => {
      setState("hashing");
      setTimeout(() => {
        setState("signature");
        setTimeout(() => {
          setState("evidence");
          setTimeout(() => {
            setState(tamper ? "invalid" : "verified");
          }, 450);
        }, 450);
      }, 450);
    }, 450);
  };

  const isVerifying = ["parsing", "hashing", "signature", "evidence"].includes(state);

  return (
    <section className="max-w-7xl mx-auto px-6 py-32 relative z-10" id="receipt-verification">
      <div className="mb-16 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-neon-green text-xs font-semibold tracking-[0.2em] uppercase mb-4 border border-neon-green/20 bg-neon-green/5 px-3.5 py-1.5 rounded-full font-mono">
          <span>ACT 06 & 07 // RECEIPT & VERIFICATION</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white leading-tight">
          Don't trust the report. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-white font-light italic">
            Verify the receipt.
          </span>
        </h2>
        <p className="text-gray-400 text-lg mt-6 font-light leading-relaxed max-w-2xl">
          A test report can be edited, faked, or ignored. A Workflo receipt is an immutable,
          cryptographically signed artifact that can be verified in any pipeline or security audit.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        {/* Left: The Physical Cryptographic Receipt Card */}
        <div
          className={`lg:col-span-6 receipt-plate rounded-2xl p-8 flex flex-col justify-between transition-all ${
            state === "invalid" ? "tamper-glitch border-red-500/60 shadow-[0_0_40px_rgba(239,68,68,0.2)]" : ""
          }`}
        >
          <div>
            <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-white tracking-widest uppercase">
                <span>workflo receipt</span>
                <span className="text-neon-green">//</span>
                <span className="text-gray-400">SEALED</span>
              </div>
              <span className="text-[10px] font-mono text-neon-green bg-neon-green/10 border border-neon-green/30 px-2 py-0.5 rounded-full">
                DEMO ENVIRONMENT
              </span>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="flex justify-between items-center py-2 border-b border-gray-800/60">
                <span className="text-gray-500 uppercase">EXECUTION ID</span>
                <span className="text-white font-semibold">wf_01J8K9P2X</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-800/60">
                <span className="text-gray-500 uppercase">SOURCE COMMIT</span>
                <span className="text-gray-300">8e32c7f (main)</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-800/60">
                <span className="text-gray-500 uppercase">CONTAINER RUNTIME</span>
                <span className="text-neon-green">isolated [micro-vm]</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-800/60">
                <span className="text-gray-500 uppercase">NETWORK POLICY</span>
                <span className="text-neon-green">blocked [default-deny]</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-800/60">
                <span className="text-gray-500 uppercase">TEST RUN RESULT</span>
                <span className={state === "invalid" ? "text-red-400" : "text-neon-green"}>
                  {state === "invalid" ? "TAMPERED / CORRUPTED" : "passed [14/14 specs]"}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-800/60">
                <span className="text-gray-500 uppercase">TELEMETRY ARTIFACTS</span>
                <span className="text-gray-300">{demoRun.artifacts} files [SHA-256 manifest]</span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-gray-500 uppercase">ECDSA SIGNATURE</span>
                <span className={state === "invalid" ? "text-red-400 font-bold" : "text-neon-green font-semibold"}>
                  {state === "invalid" ? "INVALID // HASH MISMATCH" : "VALID [P-256 SEAL]"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-800/80 flex items-center justify-between font-mono text-[11px] text-gray-500">
            <span>ROOT ROOT HASH: 0x8f2dc7a9...</span>
            <span className="text-neon-green">STATUS: {state.toUpperCase()}</span>
          </div>
        </div>

        {/* Right: Interactive Verification Engine */}
        <div className="lg:col-span-6 bg-[#080808] border border-gray-800 rounded-2xl p-8 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800 font-mono text-xs text-gray-400">
              <span className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-neon-green" /> CRYPTOGRAPHIC VERIFIER
              </span>
              <span>STANDALONE CLIENT</span>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed font-light mb-6">
              Run our automated verification pipeline. You can also simulate an intentional tamper event
              to inspect how altered hashes fail cryptographic validation.
            </p>

            {/* Verification Stage Progression */}
            <div className="space-y-3 font-mono text-xs mb-8">
              <div
                className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                  state === "parsing"
                    ? "bg-neon-green/10 border-neon-green text-white"
                    : ["hashing", "signature", "evidence", "verified"].includes(state)
                    ? "bg-[#0d0d0d] border-gray-800 text-gray-300"
                    : "bg-[#090909] border-gray-900 text-gray-600"
                }`}
              >
                <span>1. Parsing receipt manifest schema</span>
                {["hashing", "signature", "evidence", "verified"].includes(state) && (
                  <CheckCircle2 className="w-4 h-4 text-neon-green" />
                )}
                {state === "parsing" && <RefreshCw className="w-4 h-4 text-neon-green animate-spin" />}
              </div>

              <div
                className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                  state === "hashing"
                    ? "bg-neon-green/10 border-neon-green text-white"
                    : ["signature", "evidence", "verified"].includes(state)
                    ? "bg-[#0d0d0d] border-gray-800 text-gray-300"
                    : "bg-[#090909] border-gray-900 text-gray-600"
                }`}
              >
                <span>2. Recomputing SHA-256 artifact tree</span>
                {["signature", "evidence", "verified"].includes(state) && (
                  <CheckCircle2 className="w-4 h-4 text-neon-green" />
                )}
                {state === "hashing" && <RefreshCw className="w-4 h-4 text-neon-green animate-spin" />}
              </div>

              <div
                className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                  state === "signature"
                    ? "bg-neon-green/10 border-neon-green text-white"
                    : ["evidence", "verified"].includes(state)
                    ? "bg-[#0d0d0d] border-gray-800 text-gray-300"
                    : state === "invalid"
                    ? "bg-red-950/20 border-red-500/40 text-red-400"
                    : "bg-[#090909] border-gray-900 text-gray-600"
                }`}
              >
                <span>3. Verifying enclave ECDSA signature</span>
                {["evidence", "verified"].includes(state) && (
                  <CheckCircle2 className="w-4 h-4 text-neon-green" />
                )}
                {state === "invalid" && <XCircle className="w-4 h-4 text-red-400" />}
                {state === "signature" && <RefreshCw className="w-4 h-4 text-neon-green animate-spin" />}
              </div>

              <div
                className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                  state === "evidence"
                    ? "bg-neon-green/10 border-neon-green text-white"
                    : state === "verified"
                    ? "bg-neon-green/10 border-neon-green/40 text-neon-green font-bold"
                    : state === "invalid"
                    ? "bg-red-950/20 border-red-500/40 text-red-400 font-bold"
                    : "bg-[#090909] border-gray-900 text-gray-600"
                }`}
              >
                <span>4. Complete Proof Verification</span>
                {state === "verified" && <span>VERIFIED ✓</span>}
                {state === "invalid" && <span>INVALID ✕</span>}
              </div>
            </div>
          </div>

          {/* Interactive Trigger Buttons */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => runVerification(false)}
                disabled={isVerifying}
                className="btn-primary flex-1 py-3 px-5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(183,255,0,0.15)]"
              >
                <Play className="w-4 h-4" /> Verify Valid Receipt
              </button>

              <button
                onClick={() => runVerification(true)}
                disabled={isVerifying}
                className="btn-secondary flex-1 py-3 px-5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer hover:border-red-500 hover:text-red-400 hover:bg-red-950/10"
              >
                <AlertTriangle className="w-4 h-4" /> Simulate Tampered Run
              </button>
            </div>

            <div className="text-[11px] font-mono text-gray-500 text-center">
              Works offline without sending repository secrets to external servers.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
