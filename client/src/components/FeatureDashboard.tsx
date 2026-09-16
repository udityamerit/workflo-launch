"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import {
  LayoutDashboard,
  TestTubes,
  FolderOpen,
  Globe,
  BarChart3,
  Settings,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  ArrowUpRight,
} from "lucide-react";

/* ── Smooth Counter Hook ─────────────────────────────────────── */
function useCountUp(end: number, suffix = "", duration = 2.2, decimals = 0) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [display, setDisplay] = useState(
    decimals > 0 ? `0.${"0".repeat(decimals)}${suffix}` : `0${suffix}`
  );

  useEffect(() => {
    if (!inView) return;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      // Ease Out Expo: 1 - Math.pow(2, -10 * progress)
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = eased * end;

      setDisplay(
        decimals > 0
          ? `${current.toFixed(decimals)}${suffix}`
          : `${Math.floor(current)}${suffix}`
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplay(
          decimals > 0
            ? `${end.toFixed(decimals)}${suffix}`
            : `${end}${suffix}`
        );
      }
    };

    requestAnimationFrame(animate);
  }, [inView, end, suffix, duration, decimals]);

  return { ref, display };
}

/* ── Variants ────────────────────────────────────────────────── */
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardFadeUp: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const kpiBounce: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.3 + i * 0.08,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const tableRowVariant: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.45,
      delay: 0.55 + i * 0.07,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

/* ── Static Mock Data ────────────────────────────────────────── */
const STATS = [
  { value: 87, suffix: "%", decimals: 0, label: "fewer bugs in production" },
  { value: 3.2, suffix: "x", decimals: 1, label: "faster release cycles" },
  { value: 10, suffix: "k+", decimals: 0, label: "engineers building with workflo" },
];

const NAV_ITEMS = [
  { id: "overview", icon: LayoutDashboard, label: "Overview" },
  { id: "runs", icon: TestTubes, label: "Test Runs" },
  { id: "suites", icon: FolderOpen, label: "Suites" },
  { id: "environments", icon: Globe, label: "Environments" },
  { id: "reports", icon: BarChart3, label: "Reports" },
  { id: "settings", icon: Settings, label: "Settings" },
];

const KPIS = [
  { label: "Total Runs", value: "1,248", delta: "+18%", fail: false },
  { label: "Passed", value: "1,107", delta: "91.8%", fail: false },
  { label: "Failed", value: "141", delta: "-4.2%", fail: true },
  { label: "Flaky", value: "23", delta: "1.8%", fail: false },
];

const RUNS = [
  {
    id: "run-982",
    hash: "a1b2c3d",
    branch: "main",
    desc: "feat(checkout): optimize stripe webhooks",
    author: "SL",
    time: "2m ago",
    duration: "14.2s",
    passed: true,
  },
  {
    id: "run-981",
    hash: "d4e5f6g",
    branch: "feat/auth",
    desc: "fix(auth): handle expired token refresh",
    author: "MR",
    time: "12m ago",
    duration: "18.6s",
    passed: true,
  },
  {
    id: "run-980",
    hash: "h7i8j9k",
    branch: "patch/ui",
    desc: "test(e2e): checkout layout boundary assert",
    author: "AK",
    time: "34m ago",
    duration: "8.9s",
    passed: false,
  },
  {
    id: "run-979",
    hash: "m2n3p4q",
    branch: "main",
    desc: "perf(grid): virtualize test matrix canvas",
    author: "JD",
    time: "1h ago",
    duration: "11.1s",
    passed: true,
  },
];

export default function FeatureDashboard() {
  const [activeNav, setActiveNav] = useState("runs");
  const [activeFilter, setActiveFilter] = useState("all");

  const stat0 = useCountUp(STATS[0].value, STATS[0].suffix, 2.2, STATS[0].decimals);
  const stat1 = useCountUp(STATS[1].value, STATS[1].suffix, 2.2, STATS[1].decimals);
  const stat2 = useCountUp(STATS[2].value, STATS[2].suffix, 2.2, STATS[2].decimals);
  const counters = [stat0, stat1, stat2];

  return (
    <section id="operations-dashboard" className="relative w-full bg-[#060606] text-white py-24 px-6 md:px-12 lg:px-24 overflow-hidden border-t border-white/5">
      {/* Background Lighting Accents */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-[#FFAE33]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#FFAE33]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFAE33]" />
            <span className="text-xs font-mono uppercase tracking-widest text-white/60">
              Observable Performance
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            QA that executes at scale. <br />
            <span className="text-white/40">Verified by every commit.</span>
          </h2>
        </div>

        {/* Two-Column Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Stacked High-Impact Stat Counters */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-15%" }}
            className="lg:col-span-4 flex flex-col justify-between space-y-6"
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={cardFadeUp}
                className="group relative p-8 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:border-[#FFAE33]/30 hover:bg-white/[0.05]"
              >
                <div className="text-5xl sm:text-6xl font-bold font-mono tracking-tight text-[#FFAE33] flex items-baseline">
                  <span ref={counters[i].ref}>{counters[i].display}</span>
                </div>
                <p className="mt-3 text-sm sm:text-base text-white/60 font-medium leading-relaxed">
                  {stat.label}
                </p>
                <div className="mt-4 flex items-center text-xs text-[#FFAE33]/60 font-mono tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Live telemetry benchmark</span>
                  <ArrowUpRight size={14} className="ml-1" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right Column: Realistic Mini Product Dashboard */}
          <motion.div
            variants={cardFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-15%" }}
            className="lg:col-span-8 rounded-2xl border border-white/10 bg-[#0A0A0A] overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Window Titlebar */}
            <div className="px-5 py-3 border-b border-white/10 bg-white/[0.02] flex items-center justify-between text-xs font-mono text-white/40">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFAE33]/80 inline-block" />
                <span className="ml-3 text-white/50">app.workflo.dev/console</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFAE33] animate-pulse" />
                <span className="text-[#FFAE33]">SANDBOX ACTIVE</span>
              </div>
            </div>

            {/* Dashboard Inner Shell */}
            <div className="grid grid-cols-1 md:grid-cols-12 flex-1 min-h-[440px]">
              
              {/* Dashboard Mini Sidebar */}
              <div className="md:col-span-3 border-r border-white/5 p-4 flex flex-col justify-between bg-black/40">
                <div className="space-y-1">
                  <div className="px-3 py-2 text-xs font-mono uppercase tracking-widest text-white/30 font-semibold mb-2">
                    Navigation
                  </div>
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeNav === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveNav(item.id)}
                        className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          isActive
                            ? "bg-[#FFAE33]/10 text-[#FFAE33] border border-[#FFAE33]/20 font-semibold"
                            : "text-white/50 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <Icon size={14} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-white/40 space-y-1">
                  <div className="flex items-center justify-between text-white/60 font-mono">
                    <span>Cluster</span>
                    <span className="text-[#FFAE33]">us-east-1</span>
                  </div>
                  <div>v2.4.0 (isol-sandbox)</div>
                </div>
              </div>

              {/* Dashboard Content Area */}
              <div className="md:col-span-9 p-5 sm:p-6 flex flex-col justify-between space-y-6">
                
                {/* Filters & Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-white/5">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-white">Test Executions</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-white/60">
                      Live Trace
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs text-white/70">
                      <Filter size={12} className="text-white/40" />
                      <span>All Environments</span>
                      <ChevronDown size={12} className="text-white/40" />
                    </div>
                    <div className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs text-white/70">
                      <Clock size={12} className="text-white/40" />
                      <span>Last 7 days</span>
                      <ChevronDown size={12} className="text-white/40" />
                    </div>
                  </div>
                </div>

                {/* KPI Metrics Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {KPIS.map((kpi, i) => (
                    <motion.div
                      key={kpi.label}
                      custom={i}
                      variants={kpiBounce}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className={`p-3.5 rounded-xl border transition-all ${
                        kpi.fail
                          ? "bg-red-500/[0.04] border-red-500/20 text-red-400"
                          : "bg-white/[0.02] border-white/5 text-white"
                      }`}
                    >
                      <div className="text-[11px] text-white/40 uppercase tracking-wider font-mono">
                        {kpi.label}
                      </div>
                      <div className="text-xl font-bold font-mono mt-1 text-white">
                        {kpi.value}
                      </div>
                      <div
                        className={`text-[10px] font-mono mt-0.5 ${
                          kpi.fail ? "text-red-400" : "text-[#FFAE33]"
                        }`}
                      >
                        {kpi.delta}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Recent Test Runs Table */}
                <div className="rounded-xl border border-white/5 bg-black/30 overflow-hidden">
                  <div className="grid grid-cols-12 px-4 py-2.5 bg-white/[0.02] border-b border-white/5 text-[11px] font-mono text-white/40 uppercase tracking-wider">
                    <span className="col-span-2">Status</span>
                    <span className="col-span-6">Commit / Suite</span>
                    <span className="col-span-2 text-center">Author</span>
                    <span className="col-span-2 text-right">Duration</span>
                  </div>

                  <div className="divide-y divide-white/5">
                    {RUNS.map((run, i) => (
                      <motion.div
                        key={run.id}
                        custom={i}
                        variants={tableRowVariant}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-12 px-4 py-3 items-center text-xs hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="col-span-2 flex items-center space-x-2">
                          {run.passed ? (
                            <CheckCircle2 size={15} className="text-[#FFAE33]" />
                          ) : (
                            <XCircle size={15} className="text-red-400" />
                          )}
                          <span
                            className={`font-mono text-[11px] ${
                              run.passed ? "text-[#FFAE33]" : "text-red-400"
                            }`}
                          >
                            {run.passed ? "PASS" : "FAIL"}
                          </span>
                        </div>

                        <div className="col-span-6 flex flex-col pr-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-[11px] text-white/80 font-semibold">
                              {run.hash}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/5 text-white/50 border border-white/10">
                              {run.branch}
                            </span>
                          </div>
                          <span className="text-white/50 text-[11px] truncate mt-0.5">
                            {run.desc}
                          </span>
                        </div>

                        <div className="col-span-2 flex justify-center">
                          <span className="w-6 h-6 rounded-full bg-white/10 border border-white/10 flex items-center justify-center font-mono text-[10px] text-white/70">
                            {run.author}
                          </span>
                        </div>

                        <div className="col-span-2 text-right font-mono text-white/40 text-[11px]">
                          {run.duration}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Footer Status / Run Trigger */}
                <div className="flex items-center justify-between text-xs text-white/40 pt-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFAE33]" />
                    <span>All 24 test nodes healthy</span>
                  </div>
                  <button className="text-xs font-mono text-[#FFAE33] hover:underline flex items-center space-x-1">
                    <span>Inspect live telemetry</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
