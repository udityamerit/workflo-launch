"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ArrowUpRight } from "lucide-react";

interface AICapsuleHero3DProps {
  onLaunchClick?: () => void;
}

export default function AICapsuleHero3D({ onLaunchClick }: AICapsuleHero3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Scene & Camera
    const scene = new THREE.Scene();

    const width = container.clientWidth || 560;
    const height = container.clientHeight || 640;

    const camera = new THREE.PerspectiveCamera(38, width / height, 1, 1000);
    camera.position.set(0, 10, 480);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // ── Lighting ─────────────────────────────────────────────────
    // Soft studio ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    // Directional Key Light from Top-Left
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(-150, 250, 200);
    scene.add(keyLight);

    // Cool Rim Light from Back-Right (highlights edge of capsule)
    const rimLight = new THREE.DirectionalLight(0xe0e7ff, 2.0);
    rimLight.position.set(200, 100, -180);
    scene.add(rimLight);

    // Soft bottom fill
    const fillLight = new THREE.DirectionalLight(0x606570, 0.8);
    fillLight.position.set(0, -200, 100);
    scene.add(fillLight);

    // Capsule Group
    const capsuleGroup = new THREE.Group();
    scene.add(capsuleGroup);

    const radius = 95;
    const cylinderHeight = 150;

    // ── 1. Top Dome (Matte Satin Obsidian Cap) ───────────────────
    const domeGeom = new THREE.SphereGeometry(
      radius,
      48,
      24,
      0,
      Math.PI * 2,
      0,
      Math.PI / 2
    );
    const domeMat = new THREE.MeshPhysicalMaterial({
      color: 0x16171a,
      roughness: 0.28,
      metalness: 0.12,
      clearcoat: 0.35,
      clearcoatRoughness: 0.2,
    });
    const domeMesh = new THREE.Mesh(domeGeom, domeMat);
    domeMesh.position.y = cylinderHeight / 2;
    capsuleGroup.add(domeMesh);

    // ── 2. Workflo 4-Loop Clover Emblem Texture on Top Dome ─────
    const emblemCanvas = document.createElement("canvas");
    emblemCanvas.width = 256;
    emblemCanvas.height = 256;
    const emblemCtx = emblemCanvas.getContext("2d");
    if (emblemCtx) {
      emblemCtx.clearRect(0, 0, 256, 256);
      emblemCtx.fillStyle = "rgba(0, 0, 0, 0)";
      emblemCtx.fillRect(0, 0, 256, 256);

      const cx = 128;
      const cy = 128;
      const r = 36;
      const offset = 26;

      emblemCtx.lineWidth = 14;
      emblemCtx.strokeStyle = "#FFFFFF";
      emblemCtx.shadowColor = "rgba(255, 255, 255, 0.6)";
      emblemCtx.shadowBlur = 16;

      const positions = [
        [cx - offset, cy - offset],
        [cx + offset, cy - offset],
        [cx + offset, cy + offset],
        [cx - offset, cy + offset],
      ];

      positions.forEach(([x, y]) => {
        emblemCtx.beginPath();
        emblemCtx.arc(x, y, r, 0, Math.PI * 2);
        emblemCtx.stroke();
      });
    }

    const emblemTexture = new THREE.CanvasTexture(emblemCanvas);
    const emblemGeom = new THREE.PlaneGeometry(68, 68);
    const emblemMat = new THREE.MeshBasicMaterial({
      map: emblemTexture,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
    });
    const emblemMesh = new THREE.Mesh(emblemGeom, emblemMat);
    emblemMesh.position.set(0, cylinderHeight / 2 + 38, radius + 2);
    capsuleGroup.add(emblemMesh);

    // ── 3. Bottom Glass Chamber (Translucent Cylinder) ───────────
    const glassGeom = new THREE.CylinderGeometry(
      radius,
      radius,
      cylinderHeight,
      48,
      1,
      true
    );
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.94,
      opacity: 0.45,
      transparent: true,
      roughness: 0.06,
      ior: 1.5,
      thickness: 1.6,
      specularIntensity: 1.0,
      specularColor: 0xffffff,
    });
    const glassMesh = new THREE.Mesh(glassGeom, glassMat);
    glassMesh.position.y = 0;
    capsuleGroup.add(glassMesh);

    // Lower base ring / disc
    const baseGeom = new THREE.CylinderGeometry(radius, radius, 12, 48);
    const baseMat = new THREE.MeshPhysicalMaterial({
      color: 0x131316,
      roughness: 0.3,
      metalness: 0.2,
    });
    const baseMesh = new THREE.Mesh(baseGeom, baseMat);
    baseMesh.position.y = -cylinderHeight / 2;
    capsuleGroup.add(baseMesh);

    // ── 4. Internal Floating Capability Plates ───────────────────
    // Plate 1: AI Prompt Generator Plate
    const promptCanvas = document.createElement("canvas");
    promptCanvas.width = 300;
    promptCanvas.height = 360;
    const pCtx = promptCanvas.getContext("2d");
    if (pCtx) {
      // Rounded Card Background
      pCtx.fillStyle = "#161619";
      pCtx.beginPath();
      pCtx.roundRect(10, 10, 280, 340, 24);
      pCtx.fill();

      // Card border
      pCtx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      pCtx.lineWidth = 3;
      pCtx.stroke();

      // Chat bubble icon
      pCtx.fillStyle = "#FFFFFF";
      pCtx.beginPath();
      pCtx.arc(150, 100, 42, 0, Math.PI * 2);
      pCtx.fill();

      pCtx.fillStyle = "#161619";
      pCtx.beginPath();
      pCtx.arc(135, 100, 5, 0, Math.PI * 2);
      pCtx.arc(150, 100, 5, 0, Math.PI * 2);
      pCtx.arc(165, 100, 5, 0, Math.PI * 2);
      pCtx.fill();

      // Title
      pCtx.fillStyle = "#FFFFFF";
      pCtx.font = "bold 20px -apple-system, Inter, sans-serif";
      pCtx.textAlign = "center";
      pCtx.fillText("AI PROMPT", 150, 185);
      pCtx.fillText("GENERATOR", 150, 212);

      // Skeleton lines
      pCtx.fillStyle = "rgba(255, 255, 255, 0.25)";
      pCtx.beginPath();
      pCtx.roundRect(50, 250, 200, 10, 5);
      pCtx.roundRect(70, 275, 160, 10, 5);
      pCtx.fill();
    }

    const promptTexture = new THREE.CanvasTexture(promptCanvas);
    const promptPlateGeom = new THREE.PlaneGeometry(62, 74);
    const promptPlateMat = new THREE.MeshBasicMaterial({
      map: promptTexture,
      transparent: true,
    });
    const promptPlate = new THREE.Mesh(promptPlateGeom, promptPlateMat);
    promptPlate.position.set(-26, 12, 28);
    capsuleGroup.add(promptPlate);

    // Plate 2: Code Editor Plate (</>)
    const codeCanvas = document.createElement("canvas");
    codeCanvas.width = 320;
    codeCanvas.height = 400;
    const cCtx = codeCanvas.getContext("2d");
    if (cCtx) {
      cCtx.fillStyle = "#111114";
      cCtx.beginPath();
      cCtx.roundRect(10, 10, 300, 380, 24);
      cCtx.fill();

      cCtx.strokeStyle = "rgba(255, 255, 255, 0.14)";
      cCtx.lineWidth = 3;
      cCtx.stroke();

      // Dots
      cCtx.fillStyle = "rgba(255, 255, 255, 0.35)";
      cCtx.beginPath();
      cCtx.arc(45, 45, 6, 0, Math.PI * 2);
      cCtx.arc(65, 45, 6, 0, Math.PI * 2);
      cCtx.arc(85, 45, 6, 0, Math.PI * 2);
      cCtx.fill();

      // Header icon
      cCtx.fillStyle = "rgba(255, 255, 255, 0.8)";
      cCtx.font = "bold 20px monospace";
      cCtx.fillText("</>", 45, 95);

      // Colorful code lines
      const colors = [
        "#93c5fd",
        "#c084fc",
        "#86efac",
        "#fde047",
        "#f472b6",
        "#93c5fd",
        "#cbd5e1",
        "#86efac",
      ];
      colors.forEach((col, idx) => {
        cCtx.fillStyle = col;
        cCtx.beginPath();
        const y = 130 + idx * 28;
        const w = 90 + ((idx * 47) % 150);
        cCtx.roundRect(45, y, w, 8, 4);
        cCtx.fill();
      });
    }

    const codeTexture = new THREE.CanvasTexture(codeCanvas);
    const codePlateGeom = new THREE.PlaneGeometry(66, 82);
    const codePlateMat = new THREE.MeshBasicMaterial({
      map: codeTexture,
      transparent: true,
    });
    const codePlate = new THREE.Mesh(codePlateGeom, codePlateMat);
    codePlate.position.set(32, 10, 18);
    codePlate.rotation.y = -0.15;
    capsuleGroup.add(codePlate);

    // Plate 3: Lower Mini Tiles (Brain, Analytics, API)
    const miniTilesCanvas = document.createElement("canvas");
    miniTilesCanvas.width = 400;
    miniTilesCanvas.height = 140;
    const mCtx = miniTilesCanvas.getContext("2d");
    if (mCtx) {
      mCtx.clearRect(0, 0, 400, 140);

      // 3 Mini Cards
      const cardWidth = 105;
      const cardHeight = 105;
      const startX = 25;
      const gap = 20;

      for (let i = 0; i < 3; i++) {
        const x = startX + i * (cardWidth + gap);
        mCtx.fillStyle = "#18181c";
        mCtx.beginPath();
        mCtx.roundRect(x, 15, cardWidth, cardHeight, 18);
        mCtx.fill();

        mCtx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        mCtx.lineWidth = 2;
        mCtx.stroke();

        // Inner icons
        mCtx.fillStyle = "rgba(255, 255, 255, 0.75)";
        if (i === 0) {
          // Brain icon representation
          mCtx.beginPath();
          mCtx.arc(x + 40, 55, 16, 0, Math.PI * 2);
          mCtx.arc(x + 65, 55, 16, 0, Math.PI * 2);
          mCtx.fill();
          mCtx.fillStyle = "#FFFFFF";
          mCtx.font = "bold 14px sans-serif";
          mCtx.textAlign = "center";
          mCtx.fillText("AI", x + 52, 98);
        } else if (i === 1) {
          // Bar chart
          mCtx.fillRect(x + 28, 65, 10, 30);
          mCtx.fillRect(x + 46, 45, 10, 50);
          mCtx.fillRect(x + 64, 35, 10, 60);
        } else {
          // API Gear
          mCtx.beginPath();
          mCtx.arc(x + 52, 58, 20, 0, Math.PI * 2);
          mCtx.fill();
          mCtx.fillStyle = "#18181c";
          mCtx.beginPath();
          mCtx.arc(x + 52, 58, 10, 0, Math.PI * 2);
          mCtx.fill();
          mCtx.fillStyle = "#FFFFFF";
          mCtx.font = "bold 13px sans-serif";
          mCtx.textAlign = "center";
          mCtx.fillText("API", x + 52, 100);
        }
      }
    }

    const miniTilesTexture = new THREE.CanvasTexture(miniTilesCanvas);
    const miniTilesGeom = new THREE.PlaneGeometry(94, 34);
    const miniTilesMat = new THREE.MeshBasicMaterial({
      map: miniTilesTexture,
      transparent: true,
    });
    const miniTiles = new THREE.Mesh(miniTilesGeom, miniTilesMat);
    miniTiles.position.set(0, -42, 34);
    capsuleGroup.add(miniTiles);

    // ── 5. Mouse Parallax & Interaction ──────────────────────────
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      mouseX = x;
      mouseY = y;

      targetRotY = mouseX * 0.45;
      targetRotX = mouseY * 0.25;
    };

    window.addEventListener("pointermove", onPointerMove);

    // ── 6. Render Loop ───────────────────────────────────────────
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth inertia interpolation
      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;

      capsuleGroup.rotation.y = currentRotY;
      capsuleGroup.rotation.x = currentRotX;

      // Gentle floating levitation
      if (!prefersReducedMotion) {
        capsuleGroup.position.y = Math.sin(elapsedTime * 1.4) * 6;
      }

      renderer.render(scene, camera);
    };

    animate();

    // ── 7. Resize Observer ───────────────────────────────────────
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

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);

      domeGeom.dispose();
      domeMat.dispose();
      emblemTexture.dispose();
      glassGeom.dispose();
      glassMat.dispose();
      baseGeom.dispose();
      baseMat.dispose();
      promptTexture.dispose();
      codeTexture.dispose();
      miniTilesTexture.dispose();
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
      {/* Soft atmospheric white/cool illumination vignette behind the capsule */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[520px] bg-white/[0.04] rounded-full blur-[100px] pointer-events-none" />

      {/* WebGL Canvas */}
      <div ref={containerRef} className="w-full h-full relative z-10 touch-none" />

      {/* Floating Circular "Launch QA ↗" Glass Button matching Dribbble reference */}
      <button
        onClick={onLaunchClick}
        className="capsule-launch-btn top-[48%] right-[8%] sm:right-[12%]"
        aria-label="Launch QA Console"
      >
        <ArrowUpRight size={20} className="mb-0.5 text-white/90" />
        <span className="text-[10px] font-semibold tracking-wider uppercase text-white/90">
          Launch AI
        </span>
      </button>
    </div>
  );
}
