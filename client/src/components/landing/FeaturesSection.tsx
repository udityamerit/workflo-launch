/**
 * FeaturesSection — Code editor card with typing reveal + "Passed" badge.
 * 4-feature grid with staggered entrance from right.
 */
import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Check, Zap, Eye, Layers, Shield } from "lucide-react";
import { EASE_OUT } from "./animations";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

const editorVariants: Variants = {
  hidden: { opacity: 0, x: -60, rotateY: -8 },
  visible: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: { duration: 0.9, ease: EASE_OUT },
  },
};

const lineVariants = (i: number): Variants => ({
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: EASE_OUT, delay: 0.4 + i * 0.06 },
  },
});

const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 400, damping: 20, delay: 1.1 },
  },
};

const featureItemVariants = (i: number): Variants => ({
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: EASE_OUT, delay: 0.3 + i * 0.12 },
  },
});

const iconVariants: Variants = {
  hidden: { opacity: 0, rotate: -15 },
  visible: {
    opacity: 1,
    rotate: 0,
    transition: { duration: 0.4, ease: EASE_OUT },
  },
};

const CODE_LINES = [
  { num: 1, content: <><span className="code-editor__keyword">describe</span>(<span className="code-editor__string">'Checkout Flow'</span>, () =&gt; {"{"}</> },
  { num: 2, content: <>&nbsp;&nbsp;<span className="code-editor__keyword">it</span>(<span className="code-editor__string">'completes purchase'</span>, <span className="code-editor__keyword">async</span> () =&gt; {"{"}</> },
  { num: 3, content: <>&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-editor__keyword">await</span> <span className="code-editor__function">login</span>(user);</> },
  { num: 4, content: <>&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-editor__keyword">await</span> <span className="code-editor__function">addToCart</span>(product);</> },
  { num: 5, content: <>&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-editor__keyword">await</span> <span className="code-editor__function">checkout</span>();</> },
  { num: 6, content: <>&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-editor__keyword">await</span> <span className="code-editor__function">expect</span>(orderId).<span className="code-editor__method">toBeDefined</span>();</> },
  { num: 7, content: <>&nbsp;&nbsp;{"}"});</> },
  { num: 8, content: <>{"}"});</> },
];

const FEATURES = [
  {
    icon: Zap,
    title: "AI-generated tests",
    desc: "Auto-generate comprehensive tests from your codebase and UI.",
  },
  {
    icon: Eye,
    title: "Visual regression",
    desc: "Pixel-perfect visual testing across browsers and breakpoints.",
  },
  {
    icon: Layers,
    title: "E2E at scale",
    desc: "Parallel execution across real devices and environments.",
  },
  {
    icon: Shield,
    title: "Smart flake detection",
    desc: "Automatically detect and quarantine flaky tests.",
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-15%" });

  return (
    <section className="landing-features landing-section" id="features" ref={sectionRef}>
      {/* Section header */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-15%" }}
        style={{ marginBottom: 56 }}
      >
        <motion.div className="landing-eyebrow" variants={fadeUp}>
          <span className="landing-eyebrow__icon">◈</span>
          BUILT FOR ENGINEERS
        </motion.div>
        <motion.h2
          variants={fadeUp}
          style={{
            margin: 0,
            color: "var(--text-primary)",
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(36px, 4vw, 52px)",
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
          }}
        >
          QA that thinks<br />like you ship.
        </motion.h2>
      </motion.div>

      {/* Content grid */}
      <div className="landing-features__grid">
        {/* Code editor */}
        <motion.div
          className="code-editor"
          variants={editorVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-15%" }}
          style={{ perspective: "800px" }}
        >
          <div className="code-editor__header">
            <div className="code-editor__dots">
              <span className="code-editor__dot code-editor__dot--red" />
              <span className="code-editor__dot code-editor__dot--yellow" />
              <span className="code-editor__dot code-editor__dot--green" />
            </div>
            <span className="code-editor__tab">test.spec.ts</span>
          </div>
          <div className="code-editor__body">
            {CODE_LINES.map((line, i) => (
              <motion.div
                key={line.num}
                className="code-editor__line"
                variants={lineVariants(i)}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
              >
                <span className="code-editor__line-num">{line.num}</span>
                <span>{line.content}</span>
              </motion.div>
            ))}
          </div>
          <motion.div
            className="code-editor__badge"
            variants={badgeVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <Check size={14} /> Passed
          </motion.div>
        </motion.div>

        {/* Feature list */}
        <div className="feature-list">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              className="feature-item"
              variants={featureItemVariants(i)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
            >
              <motion.div className="feature-item__icon" variants={iconVariants}>
                <feat.icon size={20} />
              </motion.div>
              <div className="feature-item__content">
                <h4>{feat.title}</h4>
                <p>{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
