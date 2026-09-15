/**
 * CtaSection — Closing CTA with glowing W. mark, light streaks,
 * and staggered content reveal.
 */
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE_OUT } from "./animations";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

const wVariants: Variants = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: EASE_OUT, delay: 0.3 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: EASE_OUT },
  },
};

interface CtaSectionProps {
  onJoinWaitlist: () => void;
}

export default function CtaSection({ onJoinWaitlist }: CtaSectionProps) {
  return (
    <section className="landing-cta landing-section" id="cta">
      <motion.div
        className="landing-cta__card"
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-15%" }}
      >
        {/* Left: Content */}
        <motion.div
          className="landing-cta__content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-15%" }}
        >
          <motion.h2 variants={fadeUp}>
            Ready to ship<br />with confidence?
          </motion.h2>
          <motion.p variants={fadeUp}>
            Join early access and be the first to experience the future of QA.
          </motion.p>
          <motion.div className="landing-cta__actions" variants={fadeUp}>
            <button className="landing-btn landing-btn--primary" onClick={onJoinWaitlist}>
              Join early access <ArrowRight size={16} />
            </button>
            <a
              className="landing-btn landing-btn--outline"
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Book a demo <ArrowRight size={16} />
            </a>
          </motion.div>
        </motion.div>

        {/* Right: Glowing W. */}
        <motion.div
          className="landing-cta__glow"
          variants={wVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-15%" }}
        >
          <div className="landing-cta__streaks">
            <div className="landing-cta__streak landing-cta__streak--1" />
            <div className="landing-cta__streak landing-cta__streak--2" />
            <div className="landing-cta__streak landing-cta__streak--3" />
          </div>
          <span className="landing-cta__w">W.</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
