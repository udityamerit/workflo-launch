/**
 * HeroSection — Left copy (eyebrow → headline → description → CTAs → trust)
 * with staggered reveal. Right side 3D illustration.
 * "SCROLL TO EXPLORE" at bottom-right.
 */
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import HeroIllustration from "./HeroIllustration";
import { EASE_OUT } from "./animations";

/* ── Animation Variants ─────────────────────────────────────── */
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

const headlineLineVariants = (i: number): Variants => ({
  hidden: {
    opacity: 0,
    y: 36,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: EASE_OUT,
      delay: 0.15 + i * 0.12,
    },
  },
});

const btnVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
};

const HEADLINE_LINES = ["Ship software.", "Not regressions.", "Not risk."];
const TRUST_BRANDS = ["Vercel", "Linear", "Framer", "Supabase"];
const AVATAR_INITIALS = ["JD", "AK", "MR", "SL"];

interface HeroSectionProps {
  onJoinWaitlist: () => void;
}

export default function HeroSection({ onJoinWaitlist }: HeroSectionProps) {
  return (
    <section className="landing-hero" id="hero">
      <div className="landing-hero__grid">
        {/* ── Left: Copy ─────────────────────────────────── */}
        <motion.div
          className="landing-hero__content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          viewport={{ once: true }}
        >
          {/* Eyebrow */}
          <motion.div className="landing-eyebrow" variants={fadeUp}>
            <span className="landing-eyebrow__icon">◈</span>
            EARLY ACCESS
          </motion.div>

          {/* Headline — each line reveals independently */}
          <h1 className="landing-hero__headline">
            {HEADLINE_LINES.map((line, i) => (
              <motion.span
                key={line}
                className="landing-hero__headline-line"
                variants={headlineLineVariants(i)}
                initial="hidden"
                animate="visible"
              >
                {line}
              </motion.span>
            ))}
          </h1>

          {/* Description */}
          <motion.p className="landing-hero__description" variants={fadeUp}>
            workflo is the AI-powered QA copilot that tests, validates, and ships
            production-ready Web/SaaS—so you can move fast with confidence.
          </motion.p>

          {/* CTAs */}
          <motion.div className="landing-hero__ctas" variants={fadeUp}>
            <motion.button
              className="landing-btn landing-btn--primary"
              variants={btnVariants}
              onClick={onJoinWaitlist}
            >
              Join early access <ArrowRight size={16} />
            </motion.button>
            <motion.a
              className="landing-btn landing-btn--outline"
              href="#cta"
              variants={btnVariants}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Book a demo <ArrowRight size={16} />
            </motion.a>
          </motion.div>

          {/* Trust row */}
          <motion.div className="landing-hero__trust" variants={fadeUp}>
            <div className="landing-hero__avatars">
              {AVATAR_INITIALS.map((init) => (
                <div key={init} className="landing-hero__avatar">{init}</div>
              ))}
            </div>
            <span className="landing-hero__trust-label">Trusted by engineers at</span>
            <div className="landing-hero__trust-logos">
              {TRUST_BRANDS.map((brand) => (
                <span key={brand}>
                  <BrandDot /> {brand}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* ── Right: 3D Illustration ─────────────────────── */}
        <div className="landing-hero__illustration">
          <HeroIllustration />
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="landing-hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        <span className="landing-hero__scroll-dot" />
        SCROLL TO EXPLORE
      </motion.div>
    </section>
  );
}

function BrandDot() {
  return (
    <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
      <circle cx="3" cy="3" r="2" fill="#6B6B6B" />
    </svg>
  );
}
