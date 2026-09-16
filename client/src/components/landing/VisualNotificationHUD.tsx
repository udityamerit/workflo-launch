"use client";
import React, { useState, useEffect } from "react";
import {
  Bell,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  Terminal,
  Cpu,
  Globe,
  Lock,
  X,
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Layers,
} from "lucide-react";

export interface TelemetryNotification {
  id: string;
  type: "security" | "ai" | "verification" | "sandbox";
  timestamp: string;
  title: string;
  detail: string;
  badge: string;
  badgeColor: string;
}

const INITIAL_NOTIFICATIONS: TelemetryNotification[] = [
  {
    id: "notif-1",
    type: "sandbox",
    timestamp: "T+00:00.012",
    title: "Enclave #WF-4492 Booted",
    detail: "Hardware-isolated micro-VM online in 11.8ms (cgroup v2 + KVM)",
    badge: "AIR-GAPPED",
    badgeColor: "#c8ff3d",
  },
  {
    id: "notif-2",
    type: "ai",
    timestamp: "T+00:00.038",
    title: "AST Spec Synthesis Complete",
    detail: "Generated 48 invariant Playwright specs from git diff (0 false positives)",
    badge: "99.8% COVERAGE",
    badgeColor: "#38bdf8",
  },
  {
    id: "notif-3",
    type: "security",
    timestamp: "T+00:00.065",
    title: "Unauthorized Egress Blocked",
    detail: "Socket dial to 10.0.4.12 intercepted: strict default-deny policy enforced",
    badge: "DENIED",
    badgeColor: "#ef4444",
  },
  {
    id: "notif-4",
    type: "verification",
    timestamp: "T+00:00.098",
    title: "Cryptographic Receipt Signed",
    detail: "SHA-256 Merkle root 0x8f2d...4a1 attested by hardware enclave key",
    badge: "SEALED",
    badgeColor: "#a855f7",
  },
];

const STREAM_ITEMS: Omit<TelemetryNotification, "id">[] = [
  {
    type: "sandbox",
    timestamp: "T+00:00.124",
    title: "Zero-Memory Residue Purged",
    detail: "Ephemeral tmpfs destroyed; memory pages scrubbed to 0x00",
    badge: "SCRUBBED",
    badgeColor: "#c8ff3d",
  },
  {
    type: "ai",
    timestamp: "T+00:00.142",
    title: "Visual Diff Verified (1440×900)",
    detail: "1,280 / 1,280 pixels identical (0.00% ΔE visual shift)",
    badge: "IDENTICAL",
    badgeColor: "#38bdf8",
  },
  {
    type: "verification",
    timestamp: "T+00:00.178",
    title: "GitHub PR Annotated",
    detail: "Verification badge stamped on PR #284 with cryptographic proof link",
    badge: "CI GATE PASS",
    badgeColor: "#10b981",
  },
  {
    type: "security",
    timestamp: "T+00:00.210",
    title: "Secret Leak Isolation Verified",
    detail: "0 production API keys or host environmental variables exposed",
    badge: "COMPLIANT",
    badgeColor: "#c8ff3d",
  },
];

export default function VisualNotificationHUD() {
  const [notifications, setNotifications] = useState<TelemetryNotification[]>(INITIAL_NOTIFICATIONS);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [filter, setFilter] = useState<"all" | "security" | "ai" | "verification" | "sandbox">("all");
  const [unreadCount, setUnreadCount] = useState(INITIAL_NOTIFICATIONS.length);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [latestToast, setLatestToast] = useState<TelemetryNotification | null>(INITIAL_NOTIFICATIONS[0]);
  const [showToast, setShowToast] = useState(true);

  // Periodic simulated live telemetry event stream
  useEffect(() => {
    if (isPaused) return;

    let index = 0;
    const interval = window.setInterval(() => {
      const template = STREAM_ITEMS[index % STREAM_ITEMS.length];
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

      const newNotif: TelemetryNotification = {
        ...template,
        id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        timestamp: timeStr,
      };

      setNotifications((prev) => [newNotif, ...prev.slice(0, 15)]);
      setLatestToast(newNotif);
      setShowToast(true);
      setUnreadCount((c) => Math.min(c + 1, 99));

      // Auto dismiss toast after 4.5s
      const toastTimer = window.setTimeout(() => {
        setShowToast(false);
      }, 4500);

      index++;
      return () => window.clearTimeout(toastTimer);
    }, 6000);

    return () => window.clearInterval(interval);
  }, [isPaused]);

  const filteredNotifications = filter === "all"
    ? notifications
    : notifications.filter((n) => n.type === filter);

  const getIcon = (type: TelemetryNotification["type"]) => {
    switch (type) {
      case "security":
        return <ShieldAlert className="w-3.5 h-3.5 text-red-400" />;
      case "ai":
        return <Cpu className="w-3.5 h-3.5 text-[#38bdf8]" />;
      case "verification":
        return <CheckCircle2 className="w-3.5 h-3.5 text-[#a855f7]" />;
      case "sandbox":
      default:
        return <Terminal className="w-3.5 h-3.5 text-[#c8ff3d]" />;
    }
  };

  return (
    <aside
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-none"
      aria-label="Real-time Visual Telemetry Stream"
    >
      {/* ── Active Toast Popup (Minimalist Sci-Fi Notification Card) ── */}
      {showToast && latestToast && !isExpanded && (
        <div
          onClick={() => {
            setIsExpanded(true);
            setShowToast(false);
          }}
          className="pointer-events-auto mb-3 max-w-sm w-full bg-[#0a0f12]/95 backdrop-blur-xl border border-[#c8ff3d]/30 rounded-2xl p-4 shadow-[0_10px_35px_rgba(0,0,0,0.85)] cursor-pointer transition-all duration-300 hover:border-[#c8ff3d] hover:scale-[1.02] animate-slideInRight scale-corner-plus"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#c8ff3d] hotspot-beacon" />
              <span className="font-mono text-[10px] text-gray-400 uppercase tracking-wider">
                {latestToast.timestamp} // LIVE TELEMETRY
              </span>
            </div>
            <span
              className="text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase"
              style={{
                backgroundColor: `${latestToast.badgeColor}18`,
                color: latestToast.badgeColor,
                border: `1px solid ${latestToast.badgeColor}40`,
              }}
            >
              {latestToast.badge}
            </span>
          </div>

          <div className="flex items-start gap-2.5 mt-1">
            <div className="p-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] shrink-0 mt-0.5">
              {getIcon(latestToast.type)}
            </div>
            <div className="overflow-hidden">
              <h5 className="text-xs font-semibold text-white truncate">
                {latestToast.title}
              </h5>
              <p className="text-[11px] text-gray-400 line-clamp-2 mt-0.5 leading-relaxed font-sans">
                {latestToast.detail}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Expanded Full HUD Panel ── */}
      {isExpanded && (
        <div
          className="pointer-events-auto mb-3 w-[92vw] sm:w-[420px] max-h-[520px] bg-[#07090c]/98 backdrop-blur-2xl border border-white/[0.15] rounded-3xl p-5 shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col scale-dot-grid scale-corner-plus animate-fadeIn"
          role="dialog"
          aria-modal="false"
          aria-label="Live Visual Telemetry HUD"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c8ff3d] hotspot-beacon" />
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-white flex items-center gap-2">
                  TELEMETRY HUD <span className="text-[#c8ff3d]">LIVE</span>
                </h4>
                <span className="text-[9px] font-mono text-gray-500">
                  REAL-TIME WORKFLO RUNTIME STREAM
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Play/Pause Stream */}
              <button
                type="button"
                onClick={() => setIsPaused((p) => !p)}
                className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 hover:text-white transition-colors cursor-pointer"
                title={isPaused ? "Resume stream" : "Pause stream"}
                aria-label={isPaused ? "Resume stream" : "Pause stream"}
              >
                {isPaused ? <Play size={13} /> : <Pause size={13} />}
              </button>

              {/* Close / Collapse */}
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-gray-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close HUD"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 font-mono text-[10px]">
            {(["all", "sandbox", "ai", "security", "verification"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                  filter === f
                    ? "bg-[#c8ff3d] text-black font-bold shadow"
                    : "bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Notification List Stream */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 font-mono text-[11px] scrollbar-thin">
            {filteredNotifications.map((n) => (
              <div
                key={n.id}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.12] transition-colors"
              >
                <div className="flex items-center justify-between text-[9px] text-gray-500 mb-1">
                  <span className="flex items-center gap-1.5">
                    {getIcon(n.type)}
                    <span className="text-gray-400 font-semibold">{n.timestamp}</span>
                  </span>
                  <span
                    className="px-1.5 py-0.5 rounded font-bold uppercase text-[8px]"
                    style={{
                      backgroundColor: `${n.badgeColor}15`,
                      color: n.badgeColor,
                      border: `1px solid ${n.badgeColor}35`,
                    }}
                  >
                    {n.badge}
                  </span>
                </div>
                <div className="text-xs font-semibold text-gray-200">{n.title}</div>
                <div className="text-[10px] text-gray-400 mt-0.5 leading-relaxed font-sans">
                  {n.detail}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Stats Footer */}
          <div className="pt-3 mt-3 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>STATUS: ENFORCING (SOC-2)</span>
            </span>
            <button
              type="button"
              onClick={() => setNotifications([])}
              className="hover:text-gray-300 transition-colors cursor-pointer"
            >
              Clear Logs
            </button>
          </div>
        </div>
      )}

      {/* ── Main HUD Trigger Button ── */}
      <button
        type="button"
        onClick={() => {
          setIsExpanded((prev) => !prev);
          setShowToast(false);
          setUnreadCount(0);
        }}
        className="pointer-events-auto px-4 py-2.5 rounded-full bg-[#0a0e12]/90 hover:bg-[#121920] border border-[#c8ff3d]/40 text-white font-mono text-xs shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center gap-3 cursor-pointer group active:scale-95 transition-all duration-300"
        aria-label="Toggle Telemetry HUD"
        aria-expanded={isExpanded}
      >
        <div className="relative flex items-center justify-center">
          <Bell size={14} className="text-[#c8ff3d] group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#c8ff3d] hotspot-beacon" />
        </div>
        <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-200">
          Telemetry HUD
        </span>
        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#c8ff3d]/20 text-[#c8ff3d] font-bold border border-[#c8ff3d]/40">
          {unreadCount > 0 ? unreadCount : "LIVE"}
        </span>
        {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>
    </aside>
  );
}
