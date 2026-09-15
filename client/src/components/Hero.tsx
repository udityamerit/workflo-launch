"use client";
import React from "react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen bg-[#060606] text-white flex flex-col justify-between overflow-hidden px-6 md:px-12 lg:px-24 pt-32 pb-12">
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
            <span className="text-xs font-mono uppercase tracking-widest text-white/60">Early Access</span>
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
            <button className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#A3E635] text-black font-semibold text-sm transition-all duration-300 hover:bg-[#b5f547] hover:shadow-[0_0_30px_rgba(163,230,53,0.35)] flex items-center justify-center space-x-2 group">
              <span>Join early access</span>
              <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
            <button className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white font-medium text-sm transition-all duration-300 hover:bg-white/10 flex items-center justify-center">
              Book a demo
            </button>
          </motion.div>
        </div>

        {/* Right Column: 3D Scene / Asset Canvas Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="lg:col-span-5 relative w-full aspect-square lg:aspect-auto lg:h-[550px] flex items-center justify-center"
        >
          {/* 
            Drop your Spline scene component or 3D canvas right here.
            Example wrapper with a placeholder graphic:
          */}
          <div className="w-full h-full glass-card relative rounded-2xl flex items-center justify-center overflow-hidden border border-white/5 bg-gradient-to-br from-white/5 to-transparent">
            {/* Embedded 3D Canvas / Spline Viewer Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center text-white/20 font-mono text-xs select-none">
              [ Connect Spline / React Three Fiber Scene here ]
            </div>
            
            {/* Visual simulation of glowing structural tracks matching your UI */}
            <div className="absolute w-[80%] h-[2px] bg-gradient-to-r from-transparent via-[#A3E635]/30 to-transparent rotate-[-25deg] blur-sm animate-pulse" />
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
            {/* Replace with your exact partner icons/SVGs */}
            <span className="font-bold text-white text-sm tracking-normal">▲ Vercel</span>
            <span className="font-bold text-white text-sm tracking-normal">Linear</span>
            <span className="font-bold text-white text-sm tracking-normal">Framer</span>
          </div>
        </div>
        <div className="text-xs text-white/30 font-mono tracking-widest flex items-center space-x-2">
          <span>↓</span>
          <span>Scroll to explore</span>
        </div>
      </motion.div>
    </section>
  );
}
