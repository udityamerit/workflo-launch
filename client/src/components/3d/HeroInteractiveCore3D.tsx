"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, RotateCcw, Eye, Move } from "lucide-react";

export default function HeroInteractiveCore3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const resetSignalRef = useRef<() => void>(() => {});

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 480;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.8);

    // ── 1. Lighting Setup ──────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const limeLight = new THREE.PointLight(0xc8ff3d, 4.2, 35);
    limeLight.position.set(4.5, 4.5, 5.5);
    scene.add(limeLight);

    const cyanLight = new THREE.PointLight(0x38bdf8, 3.4, 35);
    cyanLight.position.set(-4.5, -4.5, 4.5);
    scene.add(cyanLight);

    // ── 2. Root Group ──────────────────────────────────────────────
    const root = new THREE.Group();
    scene.add(root);

    // ── 3. Main Glass Quantum Keycap / Cube ────────────────────────
    const cubeGeo = new THREE.BoxGeometry(2.5, 2.5, 2.5);
    const cubeMat = new THREE.MeshPhysicalMaterial({
      color: 0x08100c,
      metalness: 0.15,
      roughness: 0.12,
      transmission: 0.92,
      transparent: true,
      opacity: 0.88,
      reflectivity: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      ior: 1.52,
    });
    const mainCube = new THREE.Mesh(cubeGeo, cubeMat);
    root.add(mainCube);

    // Glowing Neon Lime Outer Edge Lines
    const edges = new THREE.EdgesGeometry(cubeGeo);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xc8ff3d,
      transparent: true,
      opacity: 0.85,
      linewidth: 2,
    });
    const edgeLines = new THREE.LineSegments(edges, lineMat);
    root.add(edgeLines);

    // ── 4. Nested Double Geometric Core (Octahedron + Icosahedron) ──
    const outerCoreGeo = new THREE.OctahedronGeometry(1.25, 0);
    const outerCoreMat = new THREE.MeshStandardMaterial({
      color: 0xc8ff3d,
      emissive: 0xc8ff3d,
      emissiveIntensity: 2.8,
      wireframe: true,
    });
    const outerCoreMesh = new THREE.Mesh(outerCoreGeo, outerCoreMat);
    root.add(outerCoreMesh);

    const innerCoreGeo = new THREE.IcosahedronGeometry(0.72, 0);
    const innerCoreMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 3.2,
      wireframe: true,
    });
    const innerCoreMesh = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    root.add(innerCoreMesh);

    // ── 5. Orbiting Translucent Keycaps ────────────────────────────
    const orbiters: THREE.Mesh[] = [];
    const orbitConfigs = [
      { radius: 3.3, speed: 1.1, yOffset: 0.8, size: 0.65 },
      { radius: 3.6, speed: -0.9, yOffset: -0.65, size: 0.55 },
      { radius: 3.9, speed: 0.75, yOffset: 1.35, size: 0.6 },
    ];

    orbitConfigs.forEach((cfg) => {
      const capGeo = new THREE.BoxGeometry(cfg.size, cfg.size * 0.5, cfg.size);
      const capMat = new THREE.MeshPhysicalMaterial({
        color: 0x0c1410,
        metalness: 0.2,
        roughness: 0.18,
        transmission: 0.85,
        transparent: true,
        opacity: 0.82,
        clearcoat: 0.8,
      });
      const mesh = new THREE.Mesh(capGeo, capMat);
      const capWire = new THREE.LineSegments(
        new THREE.EdgesGeometry(capGeo),
        new THREE.LineBasicMaterial({ color: 0xc8ff3d, transparent: true, opacity: 0.7 })
      );
      mesh.add(capWire);
      root.add(mesh);
      orbiters.push(mesh);
    });

    // ── 6. Rotating Orbital Rings ──────────────────────────────────
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(3.6, 0.022, 16, 100),
      new THREE.MeshBasicMaterial({ color: 0xc8ff3d, transparent: true, opacity: 0.45 })
    );
    ring1.rotation.x = Math.PI / 3;
    root.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(4.1, 0.016, 16, 100),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 })
    );
    ring2.rotation.y = Math.PI / 4;
    root.add(ring2);

    // ── 7. Floating Quantum Data Particle Swarm ────────────────────
    const particleCount = 110;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleGeometry = new THREE.BufferGeometry();

    for (let i = 0; i < particleCount; i++) {
      const r = 1.8 + Math.random() * 3.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      particlePositions[i * 3] = r * Math.cos(theta) * Math.cos(phi);
      particlePositions[i * 3 + 1] = r * Math.sin(phi);
      particlePositions[i * 3 + 2] = r * Math.sin(theta) * Math.cos(phi);
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xc8ff3d,
      size: 0.045,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particleField = new THREE.Points(particleGeometry, particleMaterial);
    root.add(particleField);

    // ── 8. Drag & Cursor Interaction ───────────────────────────────
    let isUserDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragYaw = 0;
    let dragPitch = 0;
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const onPointerDown = (e: PointerEvent) => {
      isUserDragging = true;
      setIsDragging(true);
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      renderer.domElement.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.targetY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;

      if (isUserDragging) {
        const deltaX = e.clientX - dragStartX;
        const deltaY = e.clientY - dragStartY;
        dragYaw += deltaX * 0.01;
        dragPitch += deltaY * 0.01;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      isUserDragging = false;
      setIsDragging(false);
      try {
        renderer.domElement.releasePointerCapture(e.pointerId);
      } catch {
        // Pointer capture release safeguard
      }
    };

    resetSignalRef.current = () => {
      dragYaw = 0;
      dragPitch = 0;
      mouse.targetX = 0;
      mouse.targetY = 0;
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ── 9. Animation Render Loop ───────────────────────────────────
    let animId: number;
    const clock = new THREE.Clock();

    const render = () => {
      animId = requestAnimationFrame(render);
      const elapsed = clock.getElapsedTime();

      // Inertial smoothing for mouse parallax
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      root.rotation.y = elapsed * 0.35 + dragYaw + mouse.x * 0.8;
      root.rotation.x = Math.sin(elapsed * 0.25) * 0.18 + dragPitch - mouse.y * 0.6;

      // Nested Core Rotations
      outerCoreMesh.rotation.y -= 0.02;
      outerCoreMesh.rotation.z += 0.012;
      outerCoreMat.emissiveIntensity = 2.4 + Math.sin(elapsed * 3.5) * 0.9;

      innerCoreMesh.rotation.x += 0.025;
      innerCoreMesh.rotation.y += 0.018;
      innerCoreMat.emissiveIntensity = 2.8 + Math.cos(elapsed * 4.0) * 0.8;

      // Orbiting keycaps
      orbitConfigs.forEach((cfg, idx) => {
        const mesh = orbiters[idx];
        const angle = elapsed * cfg.speed + idx * (Math.PI / 1.5);
        mesh.position.x = Math.cos(angle) * cfg.radius;
        mesh.position.z = Math.sin(angle) * cfg.radius;
        mesh.position.y = cfg.yOffset + Math.sin(elapsed * 2 + idx) * 0.2;
        mesh.rotation.y += 0.025;
        mesh.rotation.x += 0.015;
      });

      // Rings
      ring1.rotation.z += 0.007;
      ring2.rotation.x -= 0.009;

      // Particle Field gentle breathing
      particleField.rotation.y = elapsed * 0.08;
      particleField.rotation.x = Math.sin(elapsed * 0.12) * 0.1;

      renderer.render(scene, camera);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("resize", onResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none cursor-grab active:cursor-grabbing">
      {/* 3D WebGL Canvas Viewport */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Floating HUD Badges inside 3D Box */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 px-2.5 py-1 rounded-full border border-white/10 bg-black/60 backdrop-blur-md text-[10px] font-mono text-[#c8ff3d]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#c8ff3d] animate-pulse" />
        <span>3D QUANTUM ARTIFACT // REAL-TIME WEBGL</span>
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          type="button"
          onClick={() => resetSignalRef.current()}
          className="px-2 py-1 rounded-full border border-white/10 bg-black/60 hover:bg-black/90 text-gray-300 hover:text-white text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors backdrop-blur-md"
          title="Reset 3D orientation"
        >
          <RotateCcw size={11} />
          <span>Reset</span>
        </button>
      </div>

      <div className="absolute bottom-4 right-4 z-10 hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-full border border-white/10 bg-black/60 backdrop-blur-md text-[10px] font-mono text-white/50">
        <Move size={11} className="text-[#c8ff3d]" />
        <span>DRAG TO ROTATE 3D CUBE</span>
      </div>
    </div>
  );
}
