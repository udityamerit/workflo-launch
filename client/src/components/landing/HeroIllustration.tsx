/**
 * HeroIllustration — Interactive 3D Glass Assembly with:
 * - Real-time 3D mouse tracking & parallax tilt
 * - Scroll-linked disassembly/explosion (faces and keycaps expand as you scroll down)
 * - Glowing neon lime core with volumetric ambient breathing
 * - Floating glass keycaps with physics oscillations and checkmark emblems
 */
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  type Variants,
} from "framer-motion";
import { Check } from "lucide-react";
import { EASE_OUT } from "./animations";

const cubeEntrance: Variants = {
  hidden: { scale: 0.82, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 1.1, ease: EASE_OUT, delay: 0.3 },
  },
};

const keycapEntrance = (delay: number, x: number, y: number): Variants => ({
  hidden: { opacity: 0, x, y, scale: 0.5 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: { duration: 0.85, ease: EASE_OUT, delay: 0.6 + delay },
  },
});

export default function HeroIllustration() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll tracking from hero (0 at top, 1 as you scroll past hero)
  const { scrollY } = useScroll();
  const scrollExplode = useTransform(scrollY, [0, 450], [0, 1]);
  const smoothExplode = useSpring(scrollExplode, { stiffness: 220, damping: 28 });

  // Disassembly transforms tied to scroll
  const frontZ = useTransform(smoothExplode, [0, 1], [110, 185]);
  const topZ = useTransform(smoothExplode, [0, 1], [110, 175]);
  const leftZ = useTransform(smoothExplode, [0, 1], [110, 160]);
  const rightZ = useTransform(smoothExplode, [0, 1], [110, 160]);
  const coreScale = useTransform(smoothExplode, [0, 1], [1, 1.35]);
  const coreGlow = useTransform(smoothExplode, [0, 1], [0.35, 0.75]);

  // Keycap explosion spreads
  const keycap1X = useTransform(smoothExplode, [0, 1], [0, 35]);
  const keycap1Y = useTransform(smoothExplode, [0, 1], [0, -35]);
  const keycap2X = useTransform(smoothExplode, [0, 1], [0, -45]);
  const keycap2Y = useTransform(smoothExplode, [0, 1], [0, -25]);
  const keycap3X = useTransform(smoothExplode, [0, 1], [0, 40]);
  const keycap3Y = useTransform(smoothExplode, [0, 1], [0, 35]);
  const keycap4X = useTransform(smoothExplode, [0, 1], [0, -30]);
  const keycap4Y = useTransform(smoothExplode, [0, 1], [0, 40]);

  // Mouse Parallax 3D Tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [-6, -20]), {
    stiffness: 240,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-28, -12]), {
    stiffness: 240,
    damping: 25,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      className="hero-3d"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-hidden="true"
    >
      {/* Ambient Breathing Glow */}
      <motion.div
        className="hero-3d__glow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 1.5, delay: 0.6 }}
        style={{ opacity: coreGlow }}
      />

      {/* 3D Scene with Mouse Parallax */}
      <motion.div
        className="hero-3d__scene"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Main 3D Cube Assembly */}
        <motion.div
          className="hero-3d__cube"
          variants={cubeEntrance}
          initial="hidden"
          animate="visible"
        >
          {/* Luminous Core (revealed when cube splits on scroll) */}
          <motion.div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 90,
              height: 90,
              borderRadius: "50%",
              transform: "translate(-50%, -50%) translateZ(50px)",
              background: "radial-gradient(circle, #C6FF3D 0%, rgba(198,255,61,0.4) 50%, transparent 80%)",
              filter: "blur(8px)",
              scale: coreScale,
              boxShadow: "0 0 50px rgba(198,255,61,0.6)",
              pointerEvents: "none",
            }}
          />

          {/* Front Face with Embossed glowing W. */}
          <motion.div
            className="hero-3d__face hero-3d__face--front"
            style={{
              translateZ: frontZ,
              boxShadow: "0 25px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.18)",
            }}
          >
            <span className="hero-3d__w">W.</span>
          </motion.div>

          {/* Back Face */}
          <div className="hero-3d__face hero-3d__face--back" />

          {/* Top Face */}
          <motion.div
            className="hero-3d__face hero-3d__face--top"
            style={{
              transform: "rotateX(90deg)",
              translateZ: topZ,
            }}
          />

          {/* Bottom Face */}
          <div className="hero-3d__face hero-3d__face--bottom" />

          {/* Left Face */}
          <motion.div
            className="hero-3d__face hero-3d__face--left"
            style={{
              transform: "rotateY(-90deg)",
              translateZ: leftZ,
            }}
          />

          {/* Right Face */}
          <motion.div
            className="hero-3d__face hero-3d__face--right"
            style={{
              transform: "rotateY(90deg)",
              translateZ: rightZ,
            }}
          />
        </motion.div>

        {/* 4 Floating Glass Keycaps (expand on scroll) */}
        <motion.div
          className="hero-3d__keycap hero-3d__keycap--1"
          variants={keycapEntrance(0, 30, -20)}
          initial="hidden"
          animate="visible"
          style={{ x: keycap1X, y: keycap1Y }}
        >
          <Check />
        </motion.div>

        <motion.div
          className="hero-3d__keycap hero-3d__keycap--2"
          variants={keycapEntrance(0.12, -25, -15)}
          initial="hidden"
          animate="visible"
          style={{ x: keycap2X, y: keycap2Y }}
        >
          <Check />
        </motion.div>

        <motion.div
          className="hero-3d__keycap hero-3d__keycap--3"
          variants={keycapEntrance(0.24, 20, 25)}
          initial="hidden"
          animate="visible"
          style={{ x: keycap3X, y: keycap3Y }}
        >
          <Check />
        </motion.div>

        <motion.div
          className="hero-3d__keycap hero-3d__keycap--4"
          variants={keycapEntrance(0.36, -15, 20)}
          initial="hidden"
          animate="visible"
          style={{ x: keycap4X, y: keycap4Y }}
        >
          <Check />
        </motion.div>

        {/* Angled Glowing Light Rods */}
        <div className="hero-3d__rod hero-3d__rod--1" />
        <div className="hero-3d__rod hero-3d__rod--2" />
        <div className="hero-3d__rod hero-3d__rod--3" />
      </motion.div>
    </div>
  );
}
