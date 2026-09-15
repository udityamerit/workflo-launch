/**
 * SingleSlab3D — An individual, high-fidelity 3D isometric glass slab
 * with specular highlights, frosted blur, circuit node, and interactive tilt.
 */
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import type { LucideIcon } from "lucide-react";

export interface SlabTierData {
  number: string;
  title: string;
  kicker: string;
  tag: string;
  badge: string;
  icon: LucideIcon;
  stepDesc: string;
  subTitle: string;
  chips: { label: string; highlight?: boolean; icon?: LucideIcon }[];
  headline: string;
  explanation: string;
  features: { title: string; desc: string }[];
  accentColor: string;
}

interface SingleSlab3DProps {
  tier: SlabTierData;
  isActive?: boolean;
  interactiveTilt?: boolean;
  className?: string;
  scale?: number;
}

export default function SingleSlab3D({
  tier,
  isActive = false,
  interactiveTilt = true,
  className = "",
  scale = 1,
}: SingleSlab3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const IconComponent = tier.icon;

  // Mouse 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [52, 44]), {
    stiffness: 260,
    damping: 24,
  });
  const rotateZ = useSpring(useTransform(mouseX, [-0.5, 0.5], [-34, -26]), {
    stiffness: 260,
    damping: 24,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [6, 12]), {
    stiffness: 260,
    damping: 24,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactiveTilt) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    if (!interactiveTilt) return;
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      className={`single-slab-container ${className}`}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="single-slab-rig"
        style={{
          transformStyle: "preserve-3d",
          rotateX: interactiveTilt ? rotateX : 48,
          rotateY: interactiveTilt ? rotateY : 9,
          rotateZ: interactiveTilt ? rotateZ : -30,
          scale,
        }}
      >
        <div
          className={`glass-slab single-slab ${isActive ? "glass-slab--highlighted" : ""}`}
          style={{ position: "relative" }}
        >
          {/* Node Junction */}
          <div className="glass-slab__node">
            <IconComponent />
          </div>

          {/* Slab Header */}
          <div className="glass-slab__header">
            <span className="glass-slab__kicker">
              <IconComponent size={12} />
              {tier.kicker}
            </span>
            <span className="glass-slab__tag">
              <span className="glass-slab__tag-dot" />
              {tier.tag}
            </span>
          </div>

          {/* Slab Title Row */}
          <div className="glass-slab__title-row">
            <span className="glass-slab__title">{tier.title}</span>
            <span className="glass-slab__sub">{tier.badge}</span>
          </div>

          {/* Slab Content Chips & Metrics */}
          <div className="glass-slab__content">
            {tier.chips.map((chip) => {
              const ChipIcon = chip.icon;
              return (
                <span
                  key={chip.label}
                  className={`glass-slab__chip ${chip.highlight ? "glass-slab__chip--highlight" : ""}`}
                >
                  {ChipIcon && <ChipIcon size={11} />}
                  {chip.label}
                </span>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
