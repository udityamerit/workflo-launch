"use client";
import React from "react";
import { motion } from "framer-motion";
import HeroInteractiveCore3D from "./3d/HeroInteractiveCore3D";

interface HeroProps {
  onJoinEarlyAccess?: () => void;
  onBookDemo?: () => void;
}

export default function Hero({ onJoinEarlyAccess, onBookDemo }: HeroProps) {
  const handleScrollToExplore = () => {
    const nextSection = document.getElementById("stats") || document.getElementById("features");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-transparent text-white flex flex-col justify-between overflow-hidden px-6 md:px-12 lg:px-24 pt-32 pb-12 z-10">
      {/* Background Radial Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#A3E635]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-15%] w-[500px] h-[500px] bg-[#A3E635]/5 rounded-full blur-[130px] pointer-events-none" />

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto z-10">
        
        {/* Left Column: Typography & CTAs */}
        <div className="lg:col-span-7 flex flex-col items-start space-y-6 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-white/60">
              Dimension 01 // Early Access
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] text-white"
          >
            Ship software. <br />
            <span className="text-white/40">Not regressions.</span> <br />
            Not risk.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base md:text-lg text-white/50 leading-relaxed font-normal"
          >
            workflo is the AI-powered QA copilot that tests, validates, and ships production-ready Web/SaaS—so you can move fast with confidence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 pt-4 w-full sm:w-auto"
          >
            <button
              onClick={onJoinEarlyAccess}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#A3E635] text-black font-semibold text-sm transition-all duration-300 hover:bg-[#b5f547] hover:shadow-[0_0_30px_rgba(163,230,53,0.35)] flex items-center justify-center space-x-2 group cursor-pointer"
            >
              <span>Join early access</span>
              <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
            <button
              onClick={onBookDemo || onJoinEarlyAccess}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white font-medium text-sm transition-all duration-300 hover:bg-white/10 flex items-center justify-center cursor-pointer"
            >
              Book a demo
            </button>
          </motion.div>
        </div>

        {/* Right Column: 3D Scene / Asset Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="lg:col-span-5 relative w-full aspect-square lg:aspect-auto lg:h-[550px] flex items-center justify-center"
        >
          <div className="w-full h-full relative rounded-3xl flex items-center justify-center overflow-hidden border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
            {/* Live Interactive WebGL 3D Quantum Scene */}
            <HeroInteractiveCore3D />
            
            {/* Ambient Corner Glow Tracks */}
            <div className="absolute w-[80%] h-[2px] bg-gradient-to-r from-transparent via-[#A3E635]/40 to-transparent rotate-[-25deg] blur-sm animate-pulse pointer-events-none" />
          </div>
        </motion.div>
      </div>

      {/* Footer Branding Row (Trusted By Section) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="w-full border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 z-10"
      >
        <div className="flex items-center space-x-6 text-xs text-white/40 tracking-wider uppercase font-mono">
          <span>Trusted by engineers at</span>
          <div className="flex items-center space-x-4 grayscale opacity-60 contrast-125">
            <span className="font-bold text-white text-sm tracking-normal">▲ Vercel</span>
            <span className="font-bold text-white text-sm tracking-normal">Linear</span>
            <span className="font-bold text-white text-sm tracking-normal">Framer</span>
            <span className="font-bold text-white text-sm tracking-normal">Supabase</span>
          </div>
        </div>
        <button
          onClick={handleScrollToExplore}
          className="text-xs text-white/30 hover:text-[#A3E635] transition-colors font-mono tracking-widest flex items-center space-x-2 cursor-pointer"
        >
          <span>↓</span>
          <span>Scroll to explore dimensions</span>
        </button>
      </motion.div>
    </section>
  );
}
