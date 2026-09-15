/**
 * StatsSection — Animated counter stats + interactive product dashboard mockup.
 * Numbers count up from 0 as they enter view. Dashboard builds progressively.
 */
import { motion, useInView, type Variants } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  LayoutDashboard, TestTubes, FolderOpen, Globe,
  BarChart3, Settings, ChevronDown,
} from "lucide-react";
import { EASE_OUT } from "./animations";

/* ── Counter Hook ───────────────────────────────────────────── */
function useCountUp(end: number, suffix = "", duration = 2, decimals = 0) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const [display, setDisplay] = useState(
    decimals > 0 ? `0.${"0".repeat(decimals)}${suffix}` : `0${suffix}`
  );

  useEffect(() => {
    if (!inView) return;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * end;
      setDisplay(
        decimals > 0
          ? `${current.toFixed(decimals)}${suffix}`
          : `${Math.floor(current)}${suffix}`
      );
      if (progress < 1) requestAnimationFrame(animate);
      else {
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

/* ── Animation Variants ─────────────────────────────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (d: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT, delay: d },
  }),
};

const kpiVariants = (i: number): Variants => ({
  hidden: { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: EASE_OUT, delay: 0.5 + i * 0.08 },
  },
});

const rowVariants = (i: number): Variants => ({
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: EASE_OUT, delay: 0.9 + i * 0.06 },
  },
});

const STATS = [
  { end: 87, suffix: "%", label: "fewer bugs in production" },
  { end: 3, suffix: ".2x", label: "faster release cycles" },
  { end: 10, suffix: "k+", label: "engineers building with workflo" },
];

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Overview", active: false },
  { icon: TestTubes, label: "Test Runs", active: true },
  { icon: FolderOpen, label: "Suites", active: false },
  { icon: Globe, label: "Environments", active: false },
  { icon: BarChart3, label: "Reports", active: false },
  { icon: Settings, label: "Settings", active: false },
];

const KPIS = [
  { label: "Total Runs", value: "1,248", fail: false },
  { label: "Passed", value: "1,107", fail: false },
  { label: "Failed", value: "141", fail: true },
  { label: "Flaky", value: "23", fail: false },
];

const RUNS = [
  { hash: "a1b2c3d", desc: "feat: improve checkout flow", pass: true },
  { hash: "d4e5f6g", desc: "fix: cart total calculation", pass: true },
  { hash: "h7i8j9k", desc: "refactor: product list", pass: false },
];

export default function StatsSection() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-15%" });

  const stat1 = useCountUp(87, "%");
  const stat2 = useCountUp(3.2, "x", 2, 1);
  const stat3 = useCountUp(10, "k+");
  const statRefs = [stat1, stat2, stat3];

  return (
    <section className="landing-stats landing-section" id="stats" ref={sectionRef}>
      <div className="landing-stats__card">
        {/* Left: Stats */}
        <div className="landing-stats__numbers">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              className="stat-block"
              custom={i * 0.15}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-15%" }}
            >
              <span className="stat-block__value" ref={statRefs[i].ref}>
                {statRefs[i].display}
              </span>
              <span className="stat-block__label">{s.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Right: Dashboard Mockup */}
        <div className="dashboard-mock">
          {/* Sidebar */}
          <motion.div
            className="dashboard-mock__sidebar"
            variants={fadeUp}
            custom={0.2}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <div className="dashboard-mock__logo">workflo.</div>
            <nav className="dashboard-mock__nav">
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className={`dashboard-mock__nav-item ${item.active ? "dashboard-mock__nav-item--active" : ""}`}
                >
                  <item.icon size={14} /> {item.label}
                </div>
              ))}
            </nav>
          </motion.div>

          {/* Main content */}
          <div className="dashboard-mock__main">
            <motion.div
              className="dashboard-mock__header"
              variants={fadeUp}
              custom={0.3}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              <span className="dashboard-mock__title">Test Runs</span>
              <div className="dashboard-mock__filters">
                <span className="dashboard-mock__filter">
                  All Environments <ChevronDown size={10} style={{ marginLeft: 4 }} />
                </span>
                <span className="dashboard-mock__filter">
                  Last 7 days <ChevronDown size={10} style={{ marginLeft: 4 }} />
                </span>
              </div>
            </motion.div>

            {/* KPI Cards */}
            <div className="dashboard-mock__kpis">
              {KPIS.map((kpi, i) => (
                <motion.div
                  key={kpi.label}
                  className={`dashboard-kpi ${kpi.fail ? "dashboard-kpi--fail" : ""}`}
                  variants={kpiVariants(i)}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                >
                  <span className="dashboard-kpi__label">{kpi.label}</span>
                  <span className="dashboard-kpi__value">{kpi.value}</span>
                </motion.div>
              ))}
            </div>

            {/* Test Runs Table */}
            <div className="dashboard-table">
              <div className="dashboard-table__head">
                <span>Status</span>
                <span>Test / Commit</span>
                <span>Team</span>
                <span>Result</span>
              </div>
              {RUNS.map((run, i) => (
                <motion.div
                  key={run.hash}
                  className="dashboard-table__row"
                  variants={rowVariants(i)}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                >
                  <span>
                    <span
                      className={`dashboard-table__status-dot ${run.pass ? "dashboard-table__status-dot--pass" : "dashboard-table__status-dot--fail"}`}
                      style={{ display: "inline-block" }}
                    />
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <strong style={{ color: "var(--text-primary)", fontSize: 12, fontWeight: 500, fontFamily: "var(--font-mono)" }}>{run.hash}</strong>
                    <small style={{ color: "var(--text-muted)", fontSize: 11 }}>{run.desc}</small>
                  </span>
                  <span>
                    <div className="dashboard-table__avatars">
                      {["A", "B", "C", "D", "E"].map((l) => (
                        <span key={l} className="dashboard-table__mini-avatar">{l}</span>
                      ))}
                    </div>
                  </span>
                  <span className="dashboard-table__status" style={{ color: run.pass ? "var(--status-pass)" : "var(--status-fail)" }}>
                    ● {run.pass ? "Pass" : "Fail"}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
