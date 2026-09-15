"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, Maximize2, RotateCcw } from "lucide-react";

export default function HeroInteractiveCore3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isInteractive, setIsInteractive] = useState(true);

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
    camera.position.set(0, 0, 8.5);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const limeLight = new THREE.PointLight(0xa3e635, 4, 30);
    limeLight.position.set(4, 4, 5);
    scene.add(limeLight);

    const cyanLight = new THREE.PointLight(0x38bdf8, 3, 30);
    cyanLight.position.set(-4, -4, 4);
    scene.add(cyanLight);

    // Root Group
    const root = new THREE.Group();
    scene.add(root);

    // Main 3D Keycap / Cube
    const cubeGeo = new THREE.BoxGeometry(2.5, 2.5, 2.5);
    const cubeMat = new THREE.MeshPhysicalMaterial({
      color: 0x080f07,
      metalness: 0.1,
      roughness: 0.15,
      transmission: 0.9,
      transparent: true,
      opacity: 0.85,
      reflectivity: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const mainCube = new THREE.Mesh(cubeGeo, cubeMat);
    root.add(mainCube);

    // Glowing Lime Inner Core (Geometric Matrix)
    const coreGeo = new THREE.OctahedronGeometry(1.2, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xa3e635,
      emissive: 0xa3e635,
      emissiveIntensity: 2.8,
      wireframe: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    root.add(coreMesh);

    // Cube Edge Lines
    const edges = new THREE.EdgesGeometry(cubeGeo);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xa3e635,
      transparent: true,
      opacity: 0.75,
      linewidth: 2,
    });
    const edgeLines = new THREE.LineSegments(edges, lineMat);
    root.add(edgeLines);

    // Orbiting Translucent Keycaps
    const orbiters: THREE.Mesh[] = [];
    const orbitConfigs = [
      { radius: 3.2, speed: 1.2, yOffset: 0.8, size: 0.65 },
      { radius: 3.5, speed: -0.9, yOffset: -0.6, size: 0.55 },
      { radius: 3.8, speed: 0.7, yOffset: 1.4, size: 0.6 },
    ];

    orbitConfigs.forEach((cfg) => {
      const capGeo = new THREE.BoxGeometry(cfg.size, cfg.size * 0.5, cfg.size);
      const capMat = new THREE.MeshPhysicalMaterial({
        color: 0x101a0e,
        metalness: 0.2,
        roughness: 0.2,
        transmission: 0.8,
        transparent: true,
        opacity: 0.8,
      });
      const mesh = new THREE.Mesh(capGeo, capMat);
      const capWire = new THREE.LineSegments(
        new THREE.EdgesGeometry(capGeo),
        new THREE.LineBasicMaterial({ color: 0xa3e635, transparent: true, opacity: 0.6 })
      );
      mesh.add(capWire);
      root.add(mesh);
      orbiters.push(mesh);
    });

    // Orbit Rings
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(3.6, 0.02, 16, 100),
      new THREE.MeshBasicMaterial({ color: 0xa3e635, transparent: true, opacity: 0.4 })
    );
    ring1.rotation.x = Math.PI / 3;
    root.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(4.1, 0.015, 16, 100),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.3 })
    );
    ring2.rotation.y = Math.PI / 4;
    root.add(ring2);

    // Mouse Interaction
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.targetY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    container.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const render = () => {
      animId = requestAnimationFrame(render);
      const elapsed = clock.getElapsedTime();

      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      root.rotation.y = elapsed * 0.35 + mouse.x * 1.1;
      root.rotation.x = Math.sin(elapsed * 0.25) * 0.2 + mouse.y * 0.8;

      coreMesh.rotation.y -= 0.02;
      coreMesh.rotation.z += 0.01;
      coreMat.emissiveIntensity = 2.4 + Math.sin(elapsed * 4) * 0.8;

      orbitConfigs.forEach((cfg, idx) => {
        const mesh = orbiters[idx];
        const angle = elapsed * cfg.speed + idx * (Math.PI / 1.5);
        mesh.position.x = Math.cos(angle) * cfg.radius;
        mesh.position.z = Math.sin(angle) * cfg.radius;
        mesh.position.y = cfg.yOffset + Math.sin(elapsed * 2 + idx) * 0.2;
        mesh.rotation.y += 0.02;
        mesh.rotation.x += 0.01;
      });

      ring1.rotation.z += 0.006;
      ring2.rotation.x -= 0.008;

      renderer.render(scene, camera);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      {/* 3D WebGL Canvas Viewport */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Floating HUD Badges inside 3D Box */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 px-2.5 py-1 rounded-full border border-white/10 bg-black/60 backdrop-blur-md text-[10px] font-mono text-[#A3E635]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635] animate-pulse" />
        <span>3D QUANTUM ARTIFACT // REAL-TIME WEBGL</span>
      </div>

      <div className="absolute bottom-4 right-4 z-10 hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-full border border-white/10 bg-black/60 backdrop-blur-md text-[10px] font-mono text-white/50">
        <Sparkles size={11} className="text-[#A3E635]" />
        <span>CURSOR INTERACTION ENABLED</span>
      </div>
    </div>
  );
}
