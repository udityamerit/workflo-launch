"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RotateCcw, Sparkles } from "lucide-react";

export default function ParticleSingularityVaultOrb() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  // Expose a reset callback for user interaction
  const resetOrientationRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Scene setup
    const scene = new THREE.Scene();

    const width = container.clientWidth || 550;
    const height = container.clientHeight || 550;

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.z = 400;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // ── 1. Programmatic Glowing Particle Sprite ──────────────────
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.2, "rgba(255, 220, 130, 0.95)");
      grad.addColorStop(0.5, "rgba(255, 160, 40, 0.45)");
      grad.addColorStop(0.8, "rgba(255, 110, 0, 0.15)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    // ── 2. Fibonacci Sphere Particle Distribution ────────────────
    const particleCount = 11500;
    const baseRadius = 145;

    const geometry = new THREE.BufferGeometry();
    const originalPositions = new Float32Array(particleCount * 3);
    const currentPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const phases = new Float32Array(particleCount);
    const frequencies = new Float32Array(particleCount);

    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden ratio angle

    for (let i = 0; i < particleCount; i++) {
      const y = 1 - (i / (particleCount - 1)) * 2; // -1 to 1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      // Slight radial variation for depth
      const r = baseRadius * (0.95 + Math.random() * 0.1);

      originalPositions[i * 3] = x * r;
      originalPositions[i * 3 + 1] = y * r;
      originalPositions[i * 3 + 2] = z * r;

      currentPositions[i * 3] = originalPositions[i * 3];
      currentPositions[i * 3 + 1] = originalPositions[i * 3 + 1];
      currentPositions[i * 3 + 2] = originalPositions[i * 3 + 2];

      phases[i] = Math.random() * Math.PI * 2;
      frequencies[i] = 1.0 + Math.random() * 2.0;

      // Color gradient: Top is intense incandescent gold (#FFDF73 / #FFAE33),
      // Mid is warm amber (#FF941A), Bottom is silver/chrome (#A3A3A3)
      const normY = (y + 1) / 2; // 0 (bottom) to 1 (top)

      if (normY > 0.65) {
        // Brilliant Apex Gold / Amber
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.85 + (normY - 0.65) * 0.4;
        colors[i * 3 + 2] = 0.35 + (normY - 0.65) * 0.5;
      } else if (normY > 0.3) {
        // Warm Gold / Bronze
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.6 + (normY - 0.3) * 0.7;
        colors[i * 3 + 2] = 0.15 + (normY - 0.3) * 0.4;
      } else {
        // Shimmering Silver / Deep Bronze at base
        const t = normY / 0.3;
        colors[i * 3] = 0.7 + t * 0.3;
        colors[i * 3 + 1] = 0.7 + t * 0.2;
        colors[i * 3 + 2] = 0.75 + t * 0.15;
      }
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(currentPositions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 4.8,
      map: particleTexture,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.95,
    });

    const particleSphere = new THREE.Points(geometry, material);
    scene.add(particleSphere);

    // ── 3. Subtle Outer Atmospheric Radiance Swarm ────────────────
    const haloCount = 1400;
    const haloGeometry = new THREE.BufferGeometry();
    const haloPositions = new Float32Array(haloCount * 3);
    const haloColors = new Float32Array(haloCount * 3);

    for (let i = 0; i < haloCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phiAngle = Math.acos(2.0 * v - 1.0);
      const r = baseRadius * (1.05 + Math.random() * 0.25);

      const sinPhi = Math.sin(phiAngle);
      haloPositions[i * 3] = r * sinPhi * Math.cos(theta);
      haloPositions[i * 3 + 1] = r * Math.cos(phiAngle);
      haloPositions[i * 3 + 2] = r * sinPhi * Math.sin(theta);

      // Warm amber halo sparks
      haloColors[i * 3] = 1.0;
      haloColors[i * 3 + 1] = 0.75 + Math.random() * 0.25;
      haloColors[i * 3 + 2] = 0.25 + Math.random() * 0.3;
    }

    haloGeometry.setAttribute("position", new THREE.BufferAttribute(haloPositions, 3));
    haloGeometry.setAttribute("color", new THREE.BufferAttribute(haloColors, 3));

    const haloMaterial = new THREE.PointsMaterial({
      size: 7.5,
      map: particleTexture,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.65,
    });

    const haloSphere = new THREE.Points(haloGeometry, haloMaterial);
    scene.add(haloSphere);

    // ── 4. Interactive Cursor / Touch Tracking ───────────────────
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0.15;
    let targetRotY = 0;
    let currentRotX = 0.15;
    let currentRotY = 0;

    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let velX = 0;
    let velY = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      if (!isDragging) {
        mouseX = relX * 1.5;
        mouseY = relY * 1.5;
        targetRotY = mouseX * 1.2;
        targetRotX = 0.15 + mouseY * 0.8;
      } else {
        const deltaX = e.clientX - prevPointerX;
        const deltaY = e.clientY - prevPointerY;
        velX = deltaX * 0.005;
        velY = deltaY * 0.005;
        targetRotY += velX;
        targetRotX += velY;
        prevPointerX = e.clientX;
        prevPointerY = e.clientY;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      setIsInteracting(true);
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
      container.setPointerCapture(e.pointerId);
    };

    const onPointerUp = (e: PointerEvent) => {
      isDragging = false;
      setIsInteracting(false);
      try {
        container.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    };

    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointercancel", onPointerUp);

    // Reset function
    resetOrientationRef.current = () => {
      targetRotX = 0.15;
      targetRotY = 0;
      velX = 0;
      velY = 0;
    };

    // ── 5. Render & Animation Loop ───────────────────────────────
    let animId: number;
    let clock = new THREE.Clock();

    const positionAttribute = geometry.getAttribute("position") as THREE.BufferAttribute;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Inertia and continuous ambient spin
      if (!isDragging) {
        targetRotY += 0.0025; // Gentle majestic idle spin
      } else {
        velX *= 0.94;
        velY *= 0.94;
      }

      // Smooth camera/sphere rotation lerp
      currentRotX += (targetRotX - currentRotX) * 0.06;
      currentRotY += (targetRotY - currentRotY) * 0.06;

      particleSphere.rotation.x = currentRotX;
      particleSphere.rotation.y = currentRotY;

      haloSphere.rotation.x = currentRotX * 0.85;
      haloSphere.rotation.y = currentRotY * 1.15;

      // Real-time harmonic wave undulation (skipped if reduced motion)
      if (!prefersReducedMotion) {
        const positions = positionAttribute.array as Float32Array;

        for (let i = 0; i < particleCount; i++) {
          const idx = i * 3;
          const origX = originalPositions[idx];
          const origY = originalPositions[idx + 1];
          const origZ = originalPositions[idx + 2];

          // Harmonic surface ripple
          const wave =
            Math.sin(elapsedTime * 1.6 + phases[i]) * 3.5 +
            Math.cos(elapsedTime * 0.9 + origY * 0.04) * 2.5;

          const factor = 1 + wave / baseRadius;

          positions[idx] = origX * factor;
          positions[idx + 1] = origY * factor;
          positions[idx + 2] = origZ * factor;
        }

        positionAttribute.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // ── 6. Resize Observer ───────────────────────────────────────
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerUp);

      geometry.dispose();
      haloGeometry.dispose();
      material.dispose();
      haloMaterial.dispose();
      particleTexture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      className="relative w-full h-full flex items-center justify-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Overhead warm celestial ambient light spotlight */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#FFAE33]/25 rounded-full blur-[90px] pointer-events-none" />

      {/* WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing relative z-10 touch-none"
      />

      {/* Technical HUD Corner Accents */}
      <div className="absolute top-3 left-4 z-20 font-mono text-[10px] text-white/50 tracking-wider flex items-center gap-2 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FFAE33] animate-pulse" />
        <span className="text-white/80 uppercase font-semibold">QUANTUM VAULT SINGULARITY</span>
        <span className="text-white/30">|</span>
        <span className="text-[#FFAE33]/90">11.5K PARTICLES</span>
      </div>

      <div className="absolute bottom-3 left-4 z-20 font-mono text-[10px] text-white/40 flex items-center gap-2 pointer-events-none">
        <Sparkles size={11} className="text-[#FFAE33]" />
        <span>DRAG TO ROTATE ENCLAVE</span>
      </div>

      {/* Interactive Reset Button */}
      {isHovered && (
        <button
          onClick={() => resetOrientationRef.current?.()}
          className="absolute top-3 right-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 border border-white/10 hover:border-[#FFAE33]/40 text-white/70 hover:text-white font-mono text-[10px] transition-all cursor-pointer backdrop-blur-md"
          title="Reset Orbit Position"
        >
          <RotateCcw size={10} className="text-[#FFAE33]" />
          <span>RESET</span>
        </button>
      )}
    </div>
  );
}
