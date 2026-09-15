"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface ImmersiveDimensionCanvasProps {
  className?: string;
  activeDimension?: number;
}

export default function ImmersiveDimensionCanvas({
  className = "",
}: ImmersiveDimensionCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Verify WebGL availability
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setWebGLSupported(false);
      return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setClearColor(0x060606, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060606, 0.018);

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
    camera.position.set(0, 0, 15);

    // ── 1. Lighting Setup ──────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const limePointLight = new THREE.PointLight(0xa3e635, 3.5, 50);
    limePointLight.position.set(5, 5, 8);
    scene.add(limePointLight);

    const cyanPointLight = new THREE.PointLight(0x38bdf8, 2.0, 60);
    cyanPointLight.position.set(-6, -4, 4);
    scene.add(cyanPointLight);

    // ── 2. Hyperspace Particle Tunnel (Star/Data Stream) ───────────
    const particleCount = 1800;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const limeColor = new THREE.Color(0xa3e635);
    const darkLime = new THREE.Color(0x4d7c0f);
    const whiteColor = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Cylinder / tunnel distribution
      const radius = 4 + Math.random() * 22;
      const angle = Math.random() * Math.PI * 2;
      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = Math.sin(angle) * radius;
      positions[i3 + 2] = (Math.random() - 0.5) * 120;

      const choice = Math.random();
      const pColor = choice > 0.6 ? limeColor : choice > 0.3 ? darkLime : whiteColor;
      colors[i3] = pColor.r;
      colors[i3 + 1] = pColor.g;
      colors[i3 + 2] = pColor.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Particle sprite
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.3, "rgba(163, 230, 53, 0.8)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.6,
      map: particleTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── 3. Cybernetic Infinite Grid Floors (Ceiling & Floor) ───────
    const gridHelperFloor = new THREE.GridHelper(120, 60, 0xa3e635, 0x1f3412);
    gridHelperFloor.position.y = -7;
    scene.add(gridHelperFloor);

    const gridHelperCeil = new THREE.GridHelper(120, 60, 0x38bdf8, 0x0f2430);
    gridHelperCeil.position.y = 8;
    scene.add(gridHelperCeil);

    // ── 4. Central 3D Quantum Hero Core (Interactive Glass Mesh) ───
    const coreGroup = new THREE.Group();
    coreGroup.position.set(4.2, 0.2, 3);
    scene.add(coreGroup);

    // Inner Glowing Core (Icosahedron)
    const innerGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0xa3e635,
      emissive: 0xa3e635,
      emissiveIntensity: 2.5,
      wireframe: true,
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerCore);

    // Outer Translucent Frosted Glass Box
    const outerBoxGeo = new THREE.BoxGeometry(2.4, 2.4, 2.4);
    const outerBoxMat = new THREE.MeshPhysicalMaterial({
      color: 0x182410,
      metalness: 0.2,
      roughness: 0.1,
      transmission: 0.9,
      transparent: true,
      opacity: 0.75,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const outerBox = new THREE.Mesh(outerBoxGeo, outerBoxMat);
    coreGroup.add(outerBox);

    // Outer Wireframe Edges
    const wireEdges = new THREE.EdgesGeometry(outerBoxGeo);
    const wireLineMat = new THREE.LineBasicMaterial({
      color: 0xa3e635,
      transparent: true,
      opacity: 0.8,
      linewidth: 2,
    });
    const wireframeBox = new THREE.LineSegments(wireEdges, wireLineMat);
    coreGroup.add(wireframeBox);

    // Orbital Circuit Rings
    const ringGeo1 = new THREE.TorusGeometry(2.3, 0.02, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xa3e635,
      transparent: true,
      opacity: 0.6,
    });
    const orbitalRing1 = new THREE.Mesh(ringGeo1, ringMat1);
    orbitalRing1.rotation.x = Math.PI / 3;
    coreGroup.add(orbitalRing1);

    const ringGeo2 = new THREE.TorusGeometry(2.7, 0.015, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.4,
    });
    const orbitalRing2 = new THREE.Mesh(ringGeo2, ringMat2);
    orbitalRing2.rotation.y = Math.PI / 4;
    coreGroup.add(orbitalRing2);

    // Floating Glass Keycaps around the core
    const keycaps: THREE.Mesh[] = [];
    const keycapOffsets = [
      { x: 2.4, y: 1.6, z: 0.8, rot: 0.2 },
      { x: -2.3, y: 1.2, z: 1.2, rot: -0.3 },
      { x: 2.1, y: -1.7, z: -0.6, rot: 0.4 },
      { x: -2.0, y: -1.4, z: -1.2, rot: -0.2 },
    ];

    keycapOffsets.forEach((cfg) => {
      const capGeo = new THREE.BoxGeometry(0.7, 0.35, 0.7);
      const capMat = new THREE.MeshPhysicalMaterial({
        color: 0x0a1408,
        metalness: 0.3,
        roughness: 0.15,
        transmission: 0.85,
        transparent: true,
        opacity: 0.7,
      });
      const keycap = new THREE.Mesh(capGeo, capMat);
      keycap.position.set(cfg.x, cfg.y, cfg.z);
      keycap.rotation.set(cfg.rot, cfg.rot * 1.5, 0);

      const capWire = new THREE.LineSegments(
        new THREE.EdgesGeometry(capGeo),
        new THREE.LineBasicMaterial({ color: 0xa3e635, opacity: 0.6, transparent: true })
      );
      keycap.add(capWire);

      coreGroup.add(keycap);
      keycaps.push(keycap);
    });

    // ── 5. Mouse Interaction & Parallax ───────────────────────────
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // ── 6. Scroll Tracking & Dimension Travel ─────────────────────
    let scrollY = window.scrollY;
    let targetScrollY = window.scrollY;
    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // ── 7. Resize Handler ─────────────────────────────────────────
    const handleResize = () => {
      const newW = window.innerWidth;
      const newH = window.innerHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    // ── 8. Render & Animation Loop ────────────────────────────────
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Smooth scroll lerp
      scrollY += (targetScrollY - scrollY) * 0.08;
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const scrollRatio = scrollY / maxScroll; // 0 to 1

      // ── Dimensional Camera Travel ────────────────────────────────
      // As user scrolls, camera plunges deeper into the cybernetic tunnel
      const targetCamZ = 15 - scrollRatio * 45; // camera moves along Z
      const targetCamY = mouse.y * 1.5 - scrollRatio * 4;
      const targetCamX = mouse.x * 2.5 + Math.sin(scrollRatio * Math.PI * 2) * 2;

      camera.position.z += (targetCamZ - camera.position.z) * 0.08;
      camera.position.y += (targetCamY - camera.position.y) * 0.08;
      camera.position.x += (targetCamX - camera.position.x) * 0.08;
      camera.lookAt(0, targetCamY * 0.3, camera.position.z - 15);

      // ── Core Group Movement & Rotation ───────────────────────────
      coreGroup.rotation.y = elapsedTime * 0.4 + mouse.x * 0.8;
      coreGroup.rotation.x = Math.sin(elapsedTime * 0.3) * 0.2 + mouse.y * 0.6;
      coreGroup.rotation.z = Math.cos(elapsedTime * 0.2) * 0.1;

      // Disperse / explode keycaps as scroll starts
      keycaps.forEach((cap, idx) => {
        const spreadFactor = 1 + scrollRatio * 3.5;
        const base = keycapOffsets[idx];
        cap.position.x = base.x * spreadFactor + Math.sin(elapsedTime * 1.5 + idx) * 0.15;
        cap.position.y = base.y * spreadFactor + Math.cos(elapsedTime * 1.5 + idx) * 0.15;
        cap.position.z = base.z * spreadFactor;
        cap.rotation.x += 0.01;
        cap.rotation.y += 0.015;
      });

      orbitalRing1.rotation.z += 0.008;
      orbitalRing2.rotation.x -= 0.006;
      innerCore.rotation.y -= 0.015;

      // Pulse inner core brightness
      innerMat.emissiveIntensity = 2.0 + Math.sin(elapsedTime * 3) * 0.8;

      // Move particle streams along Z to create infinite hyperspace warp
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;
      const speed = 0.3 + scrollRatio * 1.5;

      for (let i = 0; i < particleCount; i++) {
        const zIndex = i * 3 + 2;
        posArray[zIndex] += speed;
        if (posArray[zIndex] > camera.position.z + 20) {
          posArray[zIndex] -= 120;
        }
      }
      posAttr.needsUpdate = true;

      // Scroll-linked grid animation (infinite rolling terrain)
      gridHelperFloor.position.z = ((elapsedTime * 4 + scrollY * 0.05) % 4) - 2;
      gridHelperCeil.position.z = ((elapsedTime * 4 + scrollY * 0.05) % 4) - 2;

      // Dynamic fog shift based on dimension/scroll
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.density = 0.018 + scrollRatio * 0.012;
      }

      renderer.render(scene, camera);
    };

    animate();

    // ── Cleanup ───────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  if (!webGLSupported) {
    return null;
  }

  return (
    <div
      ref={mountRef}
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
}
