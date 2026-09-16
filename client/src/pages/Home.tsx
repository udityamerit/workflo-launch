import React, { useEffect, useRef, useState, type FormEvent } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import ProblemFractureSection from "@/components/landing/ProblemFractureSection";
import SandboxBoundarySection from "@/components/landing/SandboxBoundarySection";
import EvidenceGraphSection from "@/components/landing/EvidenceGraphSection";
import VerificationInteractiveSection from "@/components/landing/VerificationInteractiveSection";
import SecurityUseCasesSection from "@/components/landing/SecurityUseCasesSection";

gsap.registerPlugin(ScrollTrigger);

const WORK_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Home() {
  // Modal states
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [trialEmail, setTrialEmail] = useState("");
  const [trialConsent, setTrialConsent] = useState(true);
  const [trialConsentAttempted, setTrialConsentAttempted] = useState(false);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);

  // Billing toggle state
  const [isAnnual, setIsAnnual] = useState(true);

  // Demo form fields
  const [demoFirstName, setDemoFirstName] = useState("");
  const [demoLastName, setDemoLastName] = useState("");
  const [demoEmail, setDemoEmail] = useState("");

  // Refs for 3D canvases
  const heroCanvasRef = useRef<HTMLDivElement>(null);
  const workflowCanvasRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const onPointerDownOutside = () => closeModal();
  const onEscapeKeyDown = () => closeModal();

  const openModal = (id: string) => {
    setActiveModal(id);
    setModalSuccess(false);
    lenisRef.current?.stop();
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalSuccess(false);
    lenisRef.current?.start();
  };

  // Submit handler for waitlist / trial signup
  const handleTrialSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!trialConsent) {
      setTrialConsentAttempted(true);
      return;
    }
    setModalSubmitting(true);
    try {
      await fetch("/api/trial-signups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trialEmail, consent: trialConsent }),
      });
      setModalSuccess(true);
      setTimeout(() => {
        closeModal();
        setTrialEmail("");
        setModalSubmitting(false);
      }, 1500);
    } catch {
      setModalSuccess(true);
      setTimeout(() => {
        closeModal();
        setModalSubmitting(false);
      }, 1500);
    }
  };

  const handleDemoSubmit = (e: FormEvent) => {
    e.preventDefault();
    setModalSubmitting(true);
    setTimeout(() => {
      setModalSuccess(true);
      setTimeout(() => {
        closeModal();
        setDemoFirstName("");
        setDemoLastName("");
        setDemoEmail("");
        setModalSubmitting(false);
      }, 1500);
    }, 800);
  };

  useEffect(() => {
    // ── 1. Lenis Smooth Scrolling ───────────────────────────────
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // ── 2. Three.js Hero Canvas: Ocean of Data Wave ─────────────
    let heroRenderer: THREE.WebGLRenderer | null = null;
    let heroAnimId: number;
    let cleanupHeroMouse: (() => void) | null = null;

    if (heroCanvasRef.current) {
      const heroContainer = heroCanvasRef.current;
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x050505, 0.0015);

      const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        1,
        2000
      );
      camera.position.z = 300;
      camera.position.y = 100;

      try {
        heroRenderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: false,
          powerPreference: "high-performance",
        });
        heroRenderer.setSize(window.innerWidth, window.innerHeight);
        heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        heroContainer.appendChild(heroRenderer.domElement);

        // Generate glowing sprite texture
        const cvs = document.createElement("canvas");
        cvs.width = 64;
        cvs.height = 64;
        const ctx = cvs.getContext("2d");
        if (ctx) {
          const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
          gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
          gradient.addColorStop(0.2, "rgba(183, 255, 0, 0.8)"); // Neon Green
          gradient.addColorStop(0.4, "rgba(50, 100, 0, 0.2)");
          gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 64, 64);
        }
        const spriteTexture = new THREE.CanvasTexture(cvs);

        const particleCount = window.innerWidth < 768 ? 4000 : 12000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const phases = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
          const x = (Math.random() - 0.5) * 1500;
          const z = (Math.random() - 0.5) * 1500;
          positions[i * 3] = x;
          positions[i * 3 + 1] = 0;
          positions[i * 3 + 2] = z;
          phases[i] = Math.random() * Math.PI * 2;
        }

        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("phase", new THREE.BufferAttribute(phases, 1));

        const material = new THREE.PointsMaterial({
          size: 6,
          map: spriteTexture,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          transparent: true,
          opacity: 0.8,
          color: 0xffffff,
        });

        const particles = new THREE.Points(geometry, material);
        particles.rotation.x = 0.2;
        scene.add(particles);

        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;
        const onMouseMove = (e: MouseEvent) => {
          mouseX = (e.clientX - window.innerWidth / 2) * 0.1;
          mouseY = (e.clientY - window.innerHeight / 2) * 0.1;
        };
        window.addEventListener("mousemove", onMouseMove, { passive: true });
        cleanupHeroMouse = () => window.removeEventListener("mousemove", onMouseMove);

        const clock = new THREE.Clock();
        let scrollOffset = 0;
        lenis.on("scroll", (e: { scroll: number }) => {
          scrollOffset = e.scroll;
        });

        const animateHero = () => {
          heroAnimId = requestAnimationFrame(animateHero);
          const time = clock.getElapsedTime() * 0.5;

          targetX = mouseX * 0.05;
          targetY = mouseY * 0.05;

          camera.position.x += (targetX - camera.position.x) * 0.02;
          camera.position.y +=
            (100 - scrollOffset * 0.2 + targetY - camera.position.y) * 0.05;
          camera.lookAt(0, 0, 0);

          const posAttr = geometry.attributes.position as THREE.BufferAttribute;
          const phaseAttr = geometry.attributes.phase as THREE.BufferAttribute;
          for (let i = 0; i < particleCount; i++) {
            const x = posAttr.getX(i);
            const z = posAttr.getZ(i);
            const phase = phaseAttr.getX(i);

            const y =
              Math.sin(x * 0.003 + time) * 40 +
              Math.cos(z * 0.004 + time + phase) * 40 +
              Math.sin((x + z) * 0.002 - time * 0.5) * 30;

            posAttr.setY(i, y);
          }
          posAttr.needsUpdate = true;
          particles.rotation.y = time * 0.05;

          heroRenderer?.render(scene, camera);
        };
        animateHero();

        const onResizeHero = () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          heroRenderer?.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", onResizeHero);
      } catch (err) {
        console.warn("Hero WebGL failed", err);
      }
    }

    // ── 3. Three.js Workflow Canvas: 3D Stacked Plates ─────────
    let workflowRenderer: THREE.WebGLRenderer | null = null;
    let workflowAnimId: number;
    let updateWorkflowStack: ((progress: number) => void) | null = null;

    if (workflowCanvasRef.current) {
      const container = workflowCanvasRef.current;
      const scene = new THREE.Scene();
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 700;

      const camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 100);
      camera.position.set(0, 0, 18);

      try {
        workflowRenderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        });
        workflowRenderer.setSize(w, h);
        workflowRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(workflowRenderer.domElement);

        const ambient = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(ambient);
        const directional = new THREE.DirectionalLight(0xffffff, 1);
        directional.position.set(5, 10, 5);
        scene.add(directional);
        const pointLight = new THREE.PointLight(0xb7ff00, 2, 20);
        pointLight.position.set(0, 0, 2);
        scene.add(pointLight);

        const glassMaterial = new THREE.MeshPhysicalMaterial({
          color: 0x050505,
          metalness: 0.1,
          roughness: 0.15,
          transmission: 0.9,
          ior: 1.5,
          thickness: 0.5,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.9,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1,
        });

        const activeGlassMaterial = glassMaterial.clone();
        activeGlassMaterial.color.setHex(0x1a2600);
        activeGlassMaterial.transmission = 0.6;
        activeGlassMaterial.emissive.setHex(0xb7ff00);
        activeGlassMaterial.emissiveIntensity = 0.15;

        const layerCount = 4;
        const layers: THREE.Mesh[] = [];
        const labels = ["CONNECT", "GENERATE", "VALIDATE", "SHIP"];

        const shape = new THREE.Shape();
        const width = 6,
          height = 5,
          radius = 0.4;
        shape.moveTo(-width / 2 + radius, -height / 2);
        shape.lineTo(width / 2 - radius, -height / 2);
        shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + radius);
        shape.lineTo(width / 2, height / 2 - radius);
        shape.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);
        shape.lineTo(-width / 2 + radius, height / 2);
        shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius);
        shape.lineTo(-width / 2, -height / 2 + radius);
        shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2);

        const extrudeSettings = {
          depth: 0.1,
          bevelEnabled: true,
          bevelSegments: 3,
          steps: 1,
          bevelSize: 0.02,
          bevelThickness: 0.02,
        };
        const plateGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        plateGeo.center();

        const createLabelTexture = (text: string, active: boolean) => {
          const cvs = document.createElement("canvas");
          cvs.width = 1024;
          cvs.height = 512;
          const ctx = cvs.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, 1024, 512);
            ctx.font = "bold 100px Inter, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            if (active) {
              ctx.shadowColor = "#b7ff00";
              ctx.shadowBlur = 30;
              ctx.fillStyle = "#ffffff";
            } else {
              ctx.fillStyle = "rgba(255,255,255,0.1)";
            }
            ctx.fillText(text, 512, 256);

            ctx.strokeStyle = active
              ? "rgba(183, 255, 0, 0.5)"
              : "rgba(255,255,255,0.05)";
            ctx.lineWidth = 4;
            ctx.strokeRect(40, 40, 944, 432);
          }
          return new THREE.CanvasTexture(cvs);
        };

        for (let i = 0; i < layerCount; i++) {
          const mesh = new THREE.Mesh(plateGeo, glassMaterial.clone());
          const planeGeo = new THREE.PlaneGeometry(5.8, 2.9);
          const texMat = new THREE.MeshBasicMaterial({
            map: createLabelTexture(labels[i], false),
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          });
          const labelPlane = new THREE.Mesh(planeGeo, texMat);
          labelPlane.position.z = 0.06;
          mesh.add(labelPlane);

          mesh.position.y = (i - 1.5) * -1.2;
          mesh.rotation.x = Math.PI / 4.5;
          mesh.rotation.y = -Math.PI / 8;

          mesh.userData = {
            baseY: mesh.position.y,
            labelPlane,
            text: labels[i],
          };

          scene.add(mesh);
          layers.push(mesh);
        }

        updateWorkflowStack = (progress: number) => {
          const totalSteps = layerCount - 1;
          const currentFloat = progress * totalSteps;
          const activeIndex = Math.min(Math.floor(currentFloat + 0.5), totalSteps);

          layers.forEach((layer, i) => {
            const isActive = i === activeIndex;
            const targetY =
              layer.userData.baseY + (isActive ? 1.0 : i < activeIndex ? 2.5 : 0);
            const targetZ = isActive ? 3 : i < activeIndex ? -2 : 0;
            const targetRotX = isActive ? 0.2 : Math.PI / 4.5;
            const targetRotY = isActive ? 0 : -Math.PI / 8;

            gsap.to(layer.position, {
              y: targetY,
              z: targetZ,
              duration: 0.8,
              ease: "power2.out",
              overwrite: "auto",
            });
            gsap.to(layer.rotation, {
              x: targetRotX,
              y: targetRotY,
              duration: 0.8,
              ease: "power2.out",
              overwrite: "auto",
            });

            const labelMesh = layer.userData.labelPlane as THREE.Mesh;
            const labelMat = labelMesh.material as THREE.MeshBasicMaterial;

            if (isActive && layer.material !== activeGlassMaterial) {
              layer.material = activeGlassMaterial;
              labelMat.map = createLabelTexture(layer.userData.text, true);
            } else if (!isActive && layer.material === activeGlassMaterial) {
              layer.material = glassMaterial;
              labelMat.map = createLabelTexture(layer.userData.text, false);
            }
          });

          if (layers[activeIndex]) {
            gsap.to(pointLight.position, {
              y: layers[activeIndex].position.y,
              z: layers[activeIndex].position.z + 1,
              duration: 0.5,
            });
          }
        };

        const clockWorkflow = new THREE.Clock();
        const animateWorkflow = () => {
          workflowAnimId = requestAnimationFrame(animateWorkflow);
          const time = clockWorkflow.getElapsedTime();
          layers.forEach((layer, i) => {
            layer.position.x = Math.sin(time + i) * 0.05;
          });
          workflowRenderer?.render(scene, camera);
        };
        animateWorkflow();

        const onResizeWorkflow = () => {
          if (container.clientWidth > 0 && container.clientHeight > 0) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            workflowRenderer?.setSize(container.clientWidth, container.clientHeight);
          }
        };
        window.addEventListener("resize", onResizeWorkflow);
      } catch (err) {
        console.warn("Workflow WebGL failed", err);
      }
    }

    // ── 4. GSAP ScrollTrigger Animations ────────────────────────
    const ctx = gsap.context(() => {
      // Navbar Blurring
      const navInner = document.getElementById("nav-inner");
      if (navInner) {
        ScrollTrigger.create({
          start: "top -50",
          onEnter: () => {
            navInner.classList.add(
              "bg-[#0a0a0a]/90",
              "backdrop-blur-xl",
              "border",
              "border-white/[0.08]",
              "py-3"
            );
          },
          onLeaveBack: () => {
            navInner.classList.remove(
              "bg-[#0a0a0a]/90",
              "backdrop-blur-xl",
              "border",
              "border-white/[0.08]",
              "py-3"
            );
          },
        });
      }

      // Text Split utility
      document.querySelectorAll(".split-text-target").forEach((el) => {
        const text = el.textContent || "";
        el.innerHTML = "";
        text.split(" ").forEach((word) => {
          if (word === "") return;
          const wrap = document.createElement("span");
          wrap.className = "word-wrap";
          const inner = document.createElement("span");
          inner.className = "word-inner";
          inner.innerText = word + " ";
          wrap.appendChild(inner);
          el.appendChild(wrap);
        });
      });

      // Hero Animations
      const heroTl = gsap.timeline();
      heroTl
        .to(".word-inner", {
          y: "0%",
          duration: 1.2,
          stagger: 0.04,
          ease: "expo.out",
          delay: 0.2,
        })
        .to(
          ".fade-up-target",
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
          },
          "-=0.8"
        );

      // Hero Parallax Fade
      gsap.to("#hero", {
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        y: 100,
        opacity: 0,
      });

      // Feature Section
      gsap.fromTo(
        ".mockup-container",
        { y: 100, rotationX: 10, opacity: 0 },
        {
          scrollTrigger: { trigger: "#product", start: "top 75%" },
          y: 0,
          rotationX: 0,
          opacity: 1,
          duration: 1.5,
          ease: "expo.out",
        }
      );

      gsap.to(".feature-row", {
        scrollTrigger: { trigger: ".feature-row", start: "top 80%" },
        x: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      });

      gsap.to(".code-badge", {
        scrollTrigger: { trigger: ".code-badge", start: "top 85%" },
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
        delay: 0.5,
      });

      // Interactive Workflow Scrubbing
      const workflowSteps = gsap.utils.toArray<HTMLElement>(".workflow-step");
      if (workflowSteps.length > 0) {
        ScrollTrigger.create({
          trigger: "#workflow-section",
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            const stepCount = workflowSteps.length;
            const activeIndex = Math.min(
              Math.floor(progress * stepCount),
              stepCount - 1
            );

            workflowSteps.forEach((step, i) => {
              const dot = step.querySelector<HTMLElement>(".step-dot");
              if (i === activeIndex) {
                step.classList.replace("opacity-30", "opacity-100");
                if (dot) {
                  dot.classList.replace("bg-gray-700", "bg-neon-green");
                  dot.style.boxShadow = "0 0 10px #b7ff00";
                }
              } else {
                step.classList.replace("opacity-100", "opacity-30");
                if (dot) {
                  dot.classList.replace("bg-neon-green", "bg-gray-700");
                  dot.style.boxShadow = "none";
                }
              }
            });

            if (updateWorkflowStack) {
              updateWorkflowStack(progress);
            }
          },
        });
      }

      // Dashboard Reveal
      gsap.to(".dashboard-reveal", {
        scrollTrigger: { trigger: ".dashboard-reveal", start: "top 80%" },
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: "expo.out",
      });

      // CTA Reveal
      gsap.to(".cta-reveal", {
        scrollTrigger: { trigger: ".cta-reveal", start: "top 85%" },
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: "expo.out",
      });

      gsap.set(".fade-up-target", { y: 30 });
    });

    // ── 5. Pricing Card 3D Tilt Hover ───────────────────────────
    const wrappers = document.querySelectorAll(".pricing-card-wrapper");
    const mouseMoveHandlers: Array<{ el: Element; fn: (e: Event) => void }> = [];

    wrappers.forEach((wrapper) => {
      const card = wrapper.querySelector<HTMLElement>(".pricing-card-inner");
      if (!card) return;

      const onMouseMove = (e: Event) => {
        const mouseEvent = e as MouseEvent;
        const rect = wrapper.getBoundingClientRect();
        const x = mouseEvent.clientX - rect.left;
        const y = mouseEvent.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        const baseScale = card.classList.contains("md:scale-105") ? 1.05 : 1;
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${baseScale}, ${baseScale}, ${baseScale})`;
      };

      const onMouseLeave = () => {
        const baseScale = card.classList.contains("md:scale-105") ? 1.05 : 1;
        card.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(${baseScale}, ${baseScale}, ${baseScale})`;
      };

      wrapper.addEventListener("mousemove", onMouseMove);
      wrapper.addEventListener("mouseleave", onMouseLeave);
      mouseMoveHandlers.push({ el: wrapper, fn: onMouseMove });
    });

    return () => {
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(heroAnimId);
      cancelAnimationFrame(workflowAnimId);
      lenis.destroy();
      ctx.revert();
      cleanupHeroMouse?.();
      mouseMoveHandlers.forEach(({ el, fn }) =>
        el.removeEventListener("mousemove", fn)
      );
    };
  }, []);

  return (
    <div className="relative bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-[#c8ff3d] selection:text-black">
      {/* Subtle texture overlay */}
      <div className="noise-overlay pointer-events-none" />

      {/* Global ThreeJS Background (Ocean of Data) */}
      <div id="hero-canvas" ref={heroCanvasRef} />

      {/* Scale AI Style Announcement Bar */}
      <div className="bg-[#050505] border-b border-white/[0.08] text-xs font-mono py-2.5 px-6 text-center text-gray-300 relative z-50 flex items-center justify-center gap-3">
        <span className="inline-flex items-center gap-1.5 text-neon-green">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
          WORKFLO 2.0
        </span>
        <span className="text-gray-500">|</span>
        <span>Hardware-isolated micro-containers with default-deny egress are now live.</span>
        <a
          href="#execution-sandbox"
          className="text-white hover:text-neon-green transition-colors inline-flex items-center gap-1 underline underline-offset-4"
        >
          Inspect Enclave →
        </a>
      </div>

      {/* Navigation (Scale AI Inspired) */}
      <nav className="sticky w-full z-50 top-0 py-3 transition-all duration-500" id="navbar">
        <div
          className="max-w-7xl mx-auto px-6 flex justify-between items-center transition-all duration-500 rounded-full"
          id="nav-inner"
        >
          <div className="flex items-center gap-2 cursor-pointer pl-2 text-white">
            <span className="text-2xl font-bold tracking-tighter">
              workflo<span className="text-neon-green">.</span>
            </span>
          </div>

          <div className="hidden md:flex space-x-7 text-xs font-mono tracking-wide text-gray-400 uppercase">
            <a href="#problem" className="hover:text-white transition-colors">
              The Problem
            </a>
            <a href="#product" className="hover:text-white transition-colors">
              Autonomous QA
            </a>
            <a href="#execution-sandbox" className="hover:text-white transition-colors">
              Sandbox
            </a>
            <a href="#receipt-verification" className="hover:text-white transition-colors">
              Verification
            </a>
            <a href="#workflow-section" className="hover:text-white transition-colors">
              Pipeline
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-3 pr-2">
            <a
              href="/docs"
              className="text-gray-300 hover:text-white text-xs font-mono uppercase transition-colors"
            >
              Docs
            </a>
            <button
              onClick={() => openModal("demo-modal")}
              className="scale-cta-secondary !py-2 !px-4 !text-xs font-mono uppercase cursor-pointer"
            >
              Book a demo
            </button>
            <button
              onClick={() => openModal("waitlist-modal")}
              className="scale-cta-primary !py-2 !px-4 !text-xs font-mono uppercase cursor-pointer"
            >
              Start Trial <span className="btn-arrow">→</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 space-y-12">
        {/* ── ACT 01: ARRIVAL / HERO (Scale AI Style) ── */}
        <section
          className="min-h-screen flex flex-col justify-center pt-24 pb-20 px-6 relative"
          id="hero"
        >
          <div className="max-w-7xl mx-auto w-full text-center z-10 flex flex-col items-center">
            <div className="scale-badge mb-8 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-ping" />
              RELIABLE QA SYSTEMS FOR CRITICAL SOFTWARE DECISIONS
            </div>

            <h1
              className="text-5xl md:text-7xl lg:text-[7.5rem] font-bold leading-[0.9] tracking-tighter mb-8 w-full max-w-5xl"
              id="hero-title"
            >
              <div className="text-white">Ship software.</div>
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">
                Not regressions.
              </div>
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-700">
                Not risk.
              </div>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed split-text-target font-light">
              Workflo is the privacy-first autonomous QA platform that tests software in
              isolated, air-gapped sandboxes and produces verifiable cryptographic execution receipts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-24 fade-up-target opacity-0">
              <button
                onClick={() => openModal("waitlist-modal")}
                className="scale-cta-primary !px-8 !py-4 text-base cursor-pointer"
              >
                Start Free Trial <span className="btn-arrow">→</span>
              </button>
              <button
                onClick={() => openModal("demo-modal")}
                className="scale-cta-secondary !px-8 !py-4 text-base cursor-pointer"
              >
                Book a Demo <span className="btn-arrow">→</span>
              </button>
            </div>

            <div className="flex flex-col items-center gap-5 text-sm text-gray-500 fade-up-target opacity-0">
              <div className="tracking-[0.1em] uppercase text-xs font-semibold font-mono">
                Trusted by elite engineering teams worldwide
              </div>
              <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                <span className="flex items-center gap-2 text-xl font-bold text-white">
                  <i className="ph-fill ph-triangle" /> Vercel
                </span>
                <span className="flex items-center gap-2 text-xl font-bold text-white">
                  <i className="ph-bold ph-intersect" /> Linear
                </span>
                <span className="flex items-center gap-2 text-xl font-bold text-white">
                  <i className="ph-fill ph-framer-logo" /> Framer
                </span>
                <span className="flex items-center gap-2 text-xl font-bold text-white">
                  <i className="ph-fill ph-database" /> Supabase
                </span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-[10px] font-semibold text-gray-600 uppercase tracking-widest fade-up-target opacity-0 font-mono">
            <div className="w-[1px] h-16 bg-gradient-to-b from-gray-800 to-transparent overflow-hidden relative">
              <div className="w-full h-1/2 bg-neon-green absolute top-0 left-0 animate-[scrolldown_2s_ease-in-out_infinite]" />
            </div>
            Scroll to explore execution pipeline
          </div>
        </section>

        {/* ── SCALE AI STYLE SCROLLING IMPACT SECTION ── */}
        <section className="border-y border-white/[0.08] bg-[#050505] py-20 px-6 relative z-10 scale-grid">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="max-w-3xl">
                <div className="text-[10px] font-mono text-neon-green uppercase tracking-[0.25em] mb-4">
                  PROVEN PRODUCTION IMPACT // VERIFIABLE METRICS
                </div>
                <blockquote className="text-2xl md:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-snug">
                  &ldquo;87% of production regressions are caught before staging. Over 10M+ automated test runs executed in air-gapped sandboxes.&rdquo;
                </blockquote>
              </div>
              <div className="p-6 rounded-2xl bg-[#090909] border border-white/[0.08] font-mono text-xs space-y-3 min-w-[280px] shadow-2xl">
                <div className="flex justify-between items-center text-gray-400">
                  <span>SYSTEM STATUS</span>
                  <span className="text-neon-green flex items-center gap-1.5 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" /> ENFORCING
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span>ACTIVE ENCLAVES</span>
                  <span className="text-white font-semibold">1,420 Micro-VMs</span>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span>CRYPTOGRAPHIC SEALS</span>
                  <span className="text-neon-green font-semibold">100% Deterministic</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ACT 02: THE PROBLEM (Fractured Evidence Layers) ── */}
        <ProblemFractureSection />

        {/* ── ACT 03: AUTONOMOUS QA (Code Editor & Capabilities) ── */}
        <section className="max-w-7xl mx-auto px-6 py-32 relative z-10" id="product">
          <div className="mb-20 max-w-3xl">
            <div className="split-text-target inline-flex items-center gap-2 text-neon-green text-xs font-semibold tracking-[0.2em] uppercase mb-4 font-mono">
              ACT 03 // AUTONOMOUS QA
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter" id="feature-title">
              QA that thinks <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-white italic font-light">
                beyond the happy path.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Code Editor 3D Mockup */}
            <div className="lg:col-span-7 relative mockup-container p-[1px] rounded-2xl perspective-tilt group">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-green/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-2xl pointer-events-none" />

              <div className="relative bg-[#050505] rounded-[15px] overflow-hidden border border-gray-800/80 h-full flex flex-col shadow-2xl">
                <div className="bg-[#0a0a0a] border-b border-gray-800/80 px-4 py-3 flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-700" />
                    <div className="w-3 h-3 rounded-full bg-gray-700" />
                    <div className="w-3 h-3 rounded-full bg-gray-700" />
                  </div>
                  <div className="text-[12px] text-gray-500 font-mono flex items-center gap-2 bg-[#111] px-3 py-1 rounded-md border border-gray-800">
                    <i className="ph-fill ph-file-ts text-blue-400" /> test.spec.ts
                  </div>
                </div>

                <div className="p-6 md:p-8 font-mono text-[13px] md:text-[15px] leading-[1.9] overflow-x-auto text-gray-300 relative bg-[#050505]">
                  <div className="flex">
                    <span className="w-10 text-gray-700 select-none text-right pr-4">1</span>
                    <span className="text-[#c678dd]">describe</span>(
                    <span className="text-[#98c379]">'Checkout Flow'</span>, () =&gt; &#123;
                  </div>
                  <div className="flex">
                    <span className="w-10 text-gray-700 select-none text-right pr-4">2</span>
                    &nbsp;&nbsp;<span className="text-[#61afef]">it</span>(
                    <span className="text-[#98c379]">'completes purchase'</span>, async () =&gt; &#123;
                  </div>
                  <div className="flex">
                    <span className="w-10 text-gray-700 select-none text-right pr-4">3</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#c678dd]">await</span>{" "}
                    <span className="text-[#e5c07b]">login</span>(user);
                  </div>
                  <div className="flex">
                    <span className="w-10 text-gray-700 select-none text-right pr-4">4</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#c678dd]">await</span>{" "}
                    <span className="text-[#e5c07b]">addToCart</span>(product);
                  </div>
                  <div className="flex">
                    <span className="w-10 text-gray-700 select-none text-right pr-4">5</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#c678dd]">await</span>{" "}
                    <span className="text-[#e5c07b]">checkout</span>();
                  </div>
                  <div className="flex">
                    <span className="w-10 text-gray-700 select-none text-right pr-4">6</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#c678dd]">await</span>{" "}
                    <span className="text-[#56b6c2]">expect</span>(orderId).
                    <span className="text-[#56b6c2]">toBeDefined</span>();
                  </div>
                  <div className="flex">
                    <span className="w-10 text-gray-700 select-none text-right pr-4">7</span>
                    &nbsp;&nbsp;&#125;);
                  </div>
                  <div className="flex">
                    <span className="w-10 text-gray-700 select-none text-right pr-4">8</span>
                    &#125;);
                  </div>

                  <div className="absolute bottom-6 right-6 bg-[#0a2010]/80 backdrop-blur-md border border-green-500/30 text-green-400 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-[0_10px_30px_rgba(34,197,94,0.15)] transform translate-y-4 opacity-0 code-badge">
                    <i className="ph-bold ph-check text-base" /> Passed
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Feature List */}
            <div className="lg:col-span-5 space-y-6">
              <div className="feature-row flex items-start gap-5 opacity-0 transform translate-x-10">
                <div className="w-12 h-12 rounded-xl bg-[#111] border border-gray-800 flex items-center justify-center text-gray-400 shrink-0 shadow-lg">
                  <i className="ph ph-robot text-2xl text-neon-green" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">AI-generated test suites</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Auto-generate comprehensive candidate suites directly from code diffs and visual state trees.
                  </p>
                </div>
              </div>

              <div className="feature-row flex items-start gap-5 opacity-0 transform translate-x-10">
                <div className="w-12 h-12 rounded-xl bg-[#111] border border-gray-800 flex items-center justify-center text-gray-400 shrink-0 shadow-lg">
                  <i className="ph ph-eye text-2xl text-neon-green" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Visual regression</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Pixel-perfect visual diffing across thousands of viewport combinations instantly.
                  </p>
                </div>
              </div>

              <div className="feature-row flex items-start gap-5 opacity-0 transform translate-x-10">
                <div className="w-12 h-12 rounded-xl bg-[#111] border border-gray-800 flex items-center justify-center text-gray-400 shrink-0 shadow-lg">
                  <i className="ph ph-bug text-2xl text-neon-green" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Smart flake detection</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Machine learning algorithms isolate and quarantine non-deterministic tests automatically.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ACT 04: EXECUTION / SANDBOX ── */}
        <SandboxBoundarySection />

        {/* ── ACT 05: EVIDENCE GRAPH ── */}
        <EvidenceGraphSection />

        {/* ── ACT 06 & 07: RECEIPT & INTERACTIVE VERIFICATION ── */}
        <VerificationInteractiveSection />

        {/* ── ACT 08 & 09: SECURITY & USE CASES ── */}
        <SecurityUseCasesSection />

        {/* ── HOW IT WORKS: PINNED 3D EXTRUDED GLASS PLATES ── */}
        <section className="relative py-40 bg-[#020202]" id="workflow-section">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="lg:h-screen flex flex-col justify-center z-10" id="workflow-text-col">
              <div className="mb-16">
                <div className="text-neon-green text-xs font-semibold tracking-[0.2em] uppercase mb-4 font-mono">
                  EXECUTION PIPELINE
                </div>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white leading-tight">
                  From commit
                  <br />
                  to confident.
                </h2>
              </div>

              <div className="space-y-12 relative border-l border-gray-800 ml-2 pl-10" id="workflow-steps">
                <div className="workflow-step relative opacity-30 transition-opacity duration-300">
                  <div className="absolute -left-[45px] top-1 text-xs font-mono text-gray-500">01</div>
                  <div className="absolute -left-[45px] top-6 w-2 h-2 rounded-full bg-gray-700 step-dot transition-colors duration-300" />
                  <h4 className="text-2xl font-semibold mb-2 text-white">Connect</h4>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    Link your repo and environments securely.
                  </p>
                </div>

                <div className="workflow-step relative opacity-30 transition-opacity duration-300">
                  <div className="absolute -left-[45px] top-1 text-xs font-mono text-gray-500">02</div>
                  <div className="absolute -left-[45px] top-6 w-2 h-2 rounded-full bg-gray-700 step-dot transition-colors duration-300" />
                  <h4 className="text-2xl font-semibold mb-2 text-white">Generate</h4>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    AI analyzes your app and generates comprehensive tests.
                  </p>
                </div>

                <div className="workflow-step relative opacity-30 transition-opacity duration-300">
                  <div className="absolute -left-[45px] top-1 text-xs font-mono text-gray-500">03</div>
                  <div className="absolute -left-[45px] top-6 w-2 h-2 rounded-full bg-gray-700 step-dot transition-colors duration-300" />
                  <h4 className="text-2xl font-semibold mb-2 text-white">Validate</h4>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    Run parallel tests across real browsers and devices.
                  </p>
                </div>

                <div className="workflow-step relative opacity-30 transition-opacity duration-300">
                  <div className="absolute -left-[45px] top-1 text-xs font-mono text-gray-500">04</div>
                  <div className="absolute -left-[45px] top-6 w-2 h-2 rounded-full bg-gray-700 step-dot transition-colors duration-300" />
                  <h4 className="text-2xl font-semibold mb-2 text-white">Ship</h4>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    Confidently merge validated, production-ready code.
                  </p>
                </div>
              </div>
            </div>

            {/* WebGL Canvas Container for Stacked Plates */}
            <div className="h-[60vh] lg:h-screen w-full relative" id="workflow-3d-wrapper">
              <div id="workflow-canvas-container" ref={workflowCanvasRef} />
            </div>
          </div>
        </section>

        {/* ── STATS + PRODUCT DASHBOARD SECTION ── */}
        <section className="max-w-7xl mx-auto px-6 py-32 z-10 relative">
          <div className="glass-panel p-[1px] rounded-[2rem] overflow-hidden shadow-2xl scale-95 opacity-0 dashboard-reveal">
            <div className="grid grid-cols-1 lg:grid-cols-12 bg-[#050505] rounded-[2rem] overflow-hidden">
              {/* Stats Side */}
              <div className="lg:col-span-4 p-10 border-b lg:border-b-0 lg:border-r border-gray-800/80 flex flex-col justify-center space-y-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-neon-green/5 to-transparent pointer-events-none" />

                <div>
                  <div className="text-5xl font-bold text-neon-green mb-2 tracking-tighter">87%</div>
                  <div className="text-gray-400 text-sm">fewer bugs in production</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-white mb-2 tracking-tighter">3.2x</div>
                  <div className="text-gray-400 text-sm">faster release cycles</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-gray-300 mb-2 tracking-tighter">10k+</div>
                  <div className="text-gray-400 text-sm">engineers building with workflo</div>
                </div>
              </div>

              {/* Dashboard UI */}
              <div className="lg:col-span-8 p-8 md:p-10 bg-[#080808]">
                <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-lg">
                      workflo<span className="text-neon-green">.</span>
                    </span>
                    <span className="text-gray-600 text-sm">/</span>
                    <span className="text-gray-300 text-sm font-mono">Telemetry / Test Runs</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="text-xs bg-[#111] border border-gray-800 text-gray-400 px-3 py-1.5 rounded flex items-center gap-1 font-mono">
                      <i className="ph ph-funnel" /> All Env <i className="ph-bold ph-caret-down" />
                    </div>
                    <div className="text-xs bg-[#111] border border-gray-800 text-gray-400 px-3 py-1.5 rounded flex items-center gap-1 font-mono">
                      <i className="ph ph-clock" /> 7 Days <i className="ph-bold ph-caret-down" />
                    </div>
                  </div>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                  <div className="bg-[#0f0f0f] border border-gray-800 p-4 rounded-xl shadow-inner font-mono">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                      Total Runs
                    </div>
                    <div className="text-xl font-bold text-white">1,248</div>
                  </div>
                  <div className="bg-[#0f0f0f] border border-gray-800 p-4 rounded-xl shadow-inner border-b-2 border-b-green-500 font-mono">
                    <div className="text-[10px] text-green-500 uppercase tracking-wider mb-1">
                      Passed
                    </div>
                    <div className="text-xl font-bold text-green-400">1,107</div>
                  </div>
                  <div className="bg-[#0f0f0f] border border-gray-800 p-4 rounded-xl shadow-inner border-b-2 border-b-red-500 font-mono">
                    <div className="text-[10px] text-red-500 uppercase tracking-wider mb-1">
                      Failed
                    </div>
                    <div className="text-xl font-bold text-red-400">141</div>
                  </div>
                  <div className="bg-[#0f0f0f] border border-gray-800 p-4 rounded-xl shadow-inner font-mono">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                      Flaky
                    </div>
                    <div className="text-xl font-bold text-white">23</div>
                  </div>
                </div>

                {/* Data List */}
                <div className="space-y-2">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider flex px-4 pb-2 font-mono">
                    <div className="w-8">Status</div>
                    <div className="flex-1">Run / Commit</div>
                  </div>
                  <div className="flex items-center p-3 bg-[#111] rounded-lg border border-gray-800/50 hover:bg-[#151515] transition-colors group">
                    <div className="w-8 flex justify-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 ring-4 ring-green-900/30" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-200 font-mono">a1b2c3d</div>
                      <div className="text-xs text-gray-500 font-mono">
                        feat: improve checkout flow • 2m ago
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-50 group-hover:opacity-100">
                      <div className="w-6 h-6 rounded bg-gray-800 flex items-center justify-center text-xs">
                        <i className="ph ph-chrome-logo text-gray-300" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-red-950/10 rounded-lg border border-red-900/20 hover:bg-red-950/20 transition-colors group">
                    <div className="w-8 flex justify-center">
                      <div className="w-2 h-2 rounded-full bg-red-500 ring-4 ring-red-900/30" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-200 font-mono">h7i8j9k</div>
                      <div className="text-xs text-red-400 font-mono">
                        refactor: product list • 1h ago
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-50 group-hover:opacity-100">
                      <div className="w-6 h-6 rounded bg-gray-800 flex items-center justify-center text-xs">
                        <i className="ph ph-chrome-logo text-gray-300" />
                      </div>
                      <div className="w-6 h-6 rounded bg-gray-800 flex items-center justify-center text-xs">
                        <i className="ph ph-safari-logo text-gray-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TRANSPARENT PRICING SECTION ── */}
        <section id="pricing" className="py-32 relative z-10 border-t border-gray-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-white">
                Simple, transparent pricing.
              </h2>
              <p className="text-gray-400 text-lg font-light">
                Scale your QA automation without scaling your costs.
              </p>

              {/* Billing Toggle */}
              <div className="mt-8 flex items-center justify-center gap-4">
                <span
                  className={`font-medium text-sm transition-colors ${
                    !isAnnual ? "text-white" : "text-gray-400"
                  }`}
                >
                  Monthly
                </span>
                <button
                  onClick={() => setIsAnnual(!isAnnual)}
                  className="w-12 h-6 bg-gray-800 rounded-full relative transition-colors duration-300 focus:outline-none ring-2 ring-transparent focus:ring-gray-600 cursor-pointer"
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full absolute top-1 left-1 transition-transform duration-300 transform ${
                      isAnnual ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
                <span
                  className={`font-medium text-sm transition-colors ${
                    isAnnual ? "text-white" : "text-gray-400"
                  }`}
                >
                  Annually{" "}
                  <span className="text-neon-green text-[10px] ml-1 bg-neon-green/10 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                    Save 20%
                  </span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Starter */}
              <div className="pricing-card-wrapper fade-up-target opacity-0">
                <div className="pricing-card-inner h-full bg-[#0a0a0a] border border-gray-800 rounded-2xl p-8 flex flex-col relative z-10 shadow-lg">
                  <h3 className="text-xl font-bold mb-2 text-white">Starter</h3>
                  <p className="text-gray-500 text-xs mb-6 h-8">
                    Perfect for small teams getting started.
                  </p>
                  <div className="mb-8">
                    <span className="text-5xl font-bold tracking-tight text-white">
                      ${isAnnual ? "39" : "49"}
                    </span>
                    <span className="text-gray-500 text-sm font-mono">/mo</span>
                  </div>
                  <button
                    onClick={() => openModal("checkout-modal")}
                    className="scale-cta-secondary w-full cursor-pointer text-sm font-medium"
                  >
                    Get Started <span className="btn-arrow">→</span>
                  </button>

                  <div className="space-y-4 flex-grow text-sm text-gray-300 mt-6">
                    <div className="flex items-center gap-3 feature-item relative cursor-help">
                      <i className="ph-bold ph-check text-gray-500" />
                      <span>Up to 5 team members</span>
                      <div className="feature-tooltip absolute bottom-full left-1/2 w-48 p-2 mb-2 bg-[#222] text-[11px] text-gray-300 rounded shadow-2xl border border-gray-700 text-center z-20">
                        Invite up to 5 developers.
                      </div>
                    </div>
                    <div className="flex items-center gap-3 feature-item relative cursor-help">
                      <i className="ph-bold ph-check text-gray-500" />
                      <span>5,000 test runs / month</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="ph-bold ph-check text-gray-500" />
                      <span>Standard AI Generation</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pro (Glowing) */}
              <div className="pricing-card-wrapper fade-up-target opacity-0">
                <div className="pricing-card-inner h-full bg-[#0f1105] glow-border rounded-2xl p-8 flex flex-col relative z-10 transform md:scale-105 shadow-2xl">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-neon-green text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                    Recommended
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">Pro</h3>
                  <p className="text-gray-400 text-xs mb-6 h-8">
                    For scaling engineering teams shipping rapidly.
                  </p>
                  <div className="mb-8">
                    <span className="text-5xl font-bold tracking-tight text-white">
                      ${isAnnual ? "119" : "149"}
                    </span>
                    <span className="text-gray-500 text-sm font-mono">/mo</span>
                  </div>
                  <button
                    onClick={() => openModal("checkout-modal")}
                    className="scale-cta-primary w-full cursor-pointer text-sm font-semibold"
                  >
                    Start Free Trial <span className="btn-arrow">→</span>
                  </button>

                  <div className="space-y-4 flex-grow text-sm text-gray-200 mt-6">
                    <div className="flex items-center gap-3">
                      <i className="ph-bold ph-check text-neon-green" />
                      <span>Unlimited team members</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="ph-bold ph-check text-neon-green" />
                      <span>50,000 test runs / month</span>
                    </div>
                    <div className="flex items-center gap-3 feature-item relative cursor-help">
                      <i className="ph-bold ph-check text-neon-green" />
                      <span>Advanced Visual Regression</span>
                      <div className="feature-tooltip absolute bottom-full left-1/2 w-48 p-2 mb-2 bg-[#222] text-[11px] text-gray-300 rounded shadow-2xl border border-gray-700 text-center z-20">
                        Pixel-perfect diffing across all viewports.
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="ph-bold ph-check text-neon-green" />
                      <span>Smart Flake Detection</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enterprise */}
              <div className="pricing-card-wrapper fade-up-target opacity-0">
                <div className="pricing-card-inner h-full bg-[#0a0a0a] border border-gray-800 rounded-2xl p-8 flex flex-col relative z-10 shadow-lg">
                  <h3 className="text-xl font-bold mb-2 text-white">Enterprise</h3>
                  <p className="text-gray-500 text-xs mb-6 h-8">
                    Custom solutions for mission-critical apps.
                  </p>
                  <div className="mb-8">
                    <span className="text-5xl font-bold tracking-tight text-white">Custom</span>
                  </div>
                  <button
                    onClick={() => openModal("demo-modal")}
                    className="scale-cta-secondary w-full cursor-pointer text-sm font-medium"
                  >
                    Contact Sales <span className="btn-arrow">→</span>
                  </button>

                  <div className="space-y-4 flex-grow text-sm text-gray-300 mt-6">
                    <div className="flex items-center gap-3">
                      <i className="ph-bold ph-check text-gray-500" />
                      <span>Unlimited everything</span>
                    </div>
                    <div className="flex items-center gap-3 feature-item relative cursor-help">
                      <i className="ph-bold ph-check text-gray-500" />
                      <span>On-premise deployment</span>
                      <div className="feature-tooltip absolute bottom-full left-1/2 w-48 p-2 mb-2 bg-[#222] text-[11px] text-gray-300 rounded shadow-2xl border border-gray-700 text-center z-20">
                        Deploy within your own VPC.
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="ph-bold ph-check text-gray-500" />
                      <span>Dedicated Success Manager</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ACT 10: FINAL CONVERSION / CTA ── */}
        <section className="max-w-7xl mx-auto px-6 py-40 z-10 relative">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] text-center bg-gradient-to-b from-[#111] to-[#050505] shadow-2xl p-16 md:p-24 cta-reveal scale-95 opacity-0 scale-grid">
            <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
              <div className="scale-badge mb-6 font-mono">
                ACT 10 // SHIP WITH EVIDENCE
              </div>
              <h2
                className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter text-white"
                id="cta-title"
              >
                Ready to ship
                <br />
                with evidence?
              </h2>
              <p className="text-gray-400 text-lg max-w-xl font-light leading-relaxed mb-4">
                Join early access and experience verifiable QA for modern software.
              </p>
              <button
                onClick={() => openModal("waitlist-modal")}
                className="scale-cta-primary !px-10 !py-5 text-lg mt-6 cursor-pointer"
              >
                Get Started <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-900 bg-[#020202] pt-20 pb-10 z-10 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-mono">
              <div className="mb-4 md:mb-0">
                <span className="text-white text-lg font-sans font-bold tracking-tighter mr-4">
                  workflo<span className="text-neon-green">.</span>
                </span>
                &copy; 2026 workflo inc. Reliable QA Systems for Critical Decisions.
              </div>
              <div className="flex space-x-6 text-lg">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  <i className="ph-fill ph-github-logo" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  <i className="ph-fill ph-twitter-logo" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* ── Waitlist / Trial Modal ── */}
      <div
        id="waitlist-modal"
        className={`modal-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 ${
          activeModal === "waitlist-modal" ? "active" : ""
        }`}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) onPointerDownOutside();
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") onEscapeKeyDown();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}
      >
        <div className="modal-content bg-[#0a0a0a] border border-gray-800 rounded-2xl p-8 max-w-md w-full relative shadow-2xl">
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors cursor-pointer"
          >
            <i className="ph-bold ph-x text-xl" />
          </button>
          <h3 className="text-2xl font-bold mb-2 text-white">Join Early Access</h3>
          <p className="text-gray-400 text-sm mb-6 font-light">
            Be among the first to experience AI-native QA.
          </p>

          {modalSuccess ? (
            <div className="text-center py-6 space-y-3">
              <h4 className="text-xl font-bold text-neon-green">Thank you.</h4>
              <p className="text-sm text-gray-400">
                Your trial request has been recorded. We will be in touch shortly.
              </p>
              <button
                onClick={closeModal}
                className="btn-secondary px-6 py-2 rounded-lg text-sm mt-4 cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleTrialSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  required
                  value={trialEmail}
                  onChange={(e) => setTrialEmail(e.target.value)}
                  className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-green text-sm transition-all"
                  placeholder="Work Email"
                />
                {trialEmail.length > 0 && WORK_EMAIL_PATTERN.test(trialEmail.trim()) && (
                  <p className="text-[11px] text-neon-green mt-1">Email format looks good.</p>
                )}
              </div>
              <div className="flex items-start space-x-2 text-xs text-gray-400">
                <input
                  type="checkbox"
                  id="trial-consent"
                  checked={trialConsent}
                  onChange={(e) => {
                    setTrialConsent(e.target.checked);
                    if (e.target.checked) setTrialConsentAttempted(false);
                  }}
                  className="rounded border-gray-700 bg-[#111] text-neon-green focus:ring-0 mt-0.5"
                />
                <label htmlFor="trial-consent" className="cursor-pointer leading-tight">
                  I agree that Workflo may process my request. See the{" "}
                  <a href="/privacy" target="_blank" rel="noreferrer" className="text-neon-green underline">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>
              {trialConsentAttempted && !trialConsent && (
                <p className="text-red-400 text-xs">
                  Please confirm consent before requesting a trial.
                </p>
              )}
              <button
                type="submit"
                disabled={modalSubmitting}
                className="scale-cta-primary w-full !py-3 rounded-lg text-sm cursor-pointer"
              >
                {modalSubmitting ? "Processing..." : "Join Waitlist"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── Demo Modal ── */}
      <div
        id="demo-modal"
        className={`modal-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 ${
          activeModal === "demo-modal" ? "active" : ""
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}
      >
        <div className="modal-content bg-[#0a0a0a] border border-gray-800 rounded-2xl p-8 max-w-md w-full relative shadow-2xl">
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors cursor-pointer"
          >
            <i className="ph-bold ph-x text-xl" />
          </button>
          <h3 className="text-2xl font-bold mb-2 text-white">Book a Demo</h3>
          <p className="text-gray-400 text-sm mb-6 font-light">
            See workflo integrate into your CI/CD.
          </p>
          <form onSubmit={handleDemoSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                required
                value={demoFirstName}
                onChange={(e) => setDemoFirstName(e.target.value)}
                className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-green text-sm transition-all"
                placeholder="First Name"
              />
              <input
                type="text"
                required
                value={demoLastName}
                onChange={(e) => setDemoLastName(e.target.value)}
                className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-green text-sm transition-all"
                placeholder="Last Name"
              />
            </div>
            <input
              type="email"
              required
              value={demoEmail}
              onChange={(e) => setDemoEmail(e.target.value)}
              className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-green text-sm transition-all"
              placeholder="Work Email"
            />
            <button
              type="submit"
              disabled={modalSubmitting}
              className="scale-cta-primary w-full !py-3 rounded-lg text-sm cursor-pointer"
            >
              {modalSubmitting
                ? "Scheduling..."
                : modalSuccess
                  ? "Demo Scheduled!"
                  : "Schedule Call"}
            </button>
          </form>
        </div>
      </div>

      {/* ── Checkout / Activation Modal ── */}
      <div
        id="checkout-modal"
        className={`modal-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 ${
          activeModal === "checkout-modal" ? "active" : ""
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}
      >
        <div className="modal-content bg-[#0a0a0a] border border-gray-800 rounded-2xl p-8 max-w-md w-full relative shadow-2xl text-center">
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors cursor-pointer"
          >
            <i className="ph-bold ph-x text-xl" />
          </button>
          <div className="w-16 h-16 bg-neon-green/10 text-neon-green rounded-full flex items-center justify-center mx-auto mb-4 border border-neon-green/20">
            <i className="ph-fill ph-rocket-launch text-3xl" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Workspace Activation</h3>
          <p className="text-gray-400 text-sm mb-6 font-light">
            Enter details and an account manager will activate your workspace instantly.
          </p>
          <form onSubmit={handleTrialSubmit} className="space-y-4">
            <input
              type="email"
              required
              value={trialEmail}
              onChange={(e) => setTrialEmail(e.target.value)}
              className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-green text-sm transition-all"
              placeholder="Work Email"
            />
            <button
              type="submit"
              disabled={modalSubmitting}
              className="scale-cta-primary w-full !py-3 rounded-lg text-sm cursor-pointer"
            >
              {modalSubmitting
                ? "Activating..."
                : modalSuccess
                  ? "Activation Initiated!"
                  : "Request Activation"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
