"use client";
import React, { useEffect, useState } from "react";
import { Activity, Compass, Eye, Layers } from "lucide-react";

export default function DimensionHUD() {
  const [scrollDepth, setScrollDepth] = useState(0);
  const [activeDimension, setActiveDimension] = useState("01 // ORBITAL ENTRY");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const progress = scrollY / maxScroll;
      const depthMeters = Math.floor(progress * 4200);
      setScrollDepth(depthMeters);

      if (progress < 0.22) {
        setActiveDimension("01 // ORBITAL ENTRY");
      } else if (progress < 0.48) {
        setActiveDimension("02 // PERFORMANCE BENCHMARK");
      } else if (progress < 0.75) {
        setActiveDimension("03 // 4-TIER PIPELINE");
      } else {
        setActiveDimension("04 // PROOF PROTOCOL");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Left Dimensional Telemetry Rail */}
      <div className="fixed left-6 bottom-12 z-30 hidden xl:flex flex-col space-y-3 font-mono text-[11px] text-white/40 pointer-events-none select-none">
        <div className="flex items-center space-x-2 text-[#A3E635]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635] animate-pulse" />
          <span className="font-semibold tracking-wider">3D PROTOCOL MATRIX</span>
        </div>
        <div className="p-3 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md space-y-1 text-[10px]">
          <div className="flex justify-between space-x-4">
            <span className="text-white/40">SECTOR:</span>
            <span className="text-white/80 font-bold">{activeDimension}</span>
          </div>
          <div className="flex justify-between space-x-4">
            <span className="text-white/40">WARP DEPTH:</span>
            <span className="text-[#A3E635] font-mono">-{scrollDepth}m</span>
          </div>
          <div className="flex justify-between space-x-4">
            <span className="text-white/40">LATENCY:</span>
            <span className="text-white/80 font-mono">11.4ms TLS</span>
          </div>
        </div>
      </div>

      {/* Right Dimensional Scroll Indicator */}
      <div className="fixed right-6 bottom-12 z-30 hidden xl:flex items-center space-x-3 font-mono text-[10px] text-white/40 pointer-events-none select-none">
        <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md flex items-center space-x-2 text-white/60">
          <Activity size={12} className="text-[#A3E635]" />
          <span>REAL-TIME 3D TELEMETRY ACTIVE</span>
        </div>
      </div>
    </>
  );
}
