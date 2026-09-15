/**
 * StickyNav — transparent over hero, blurred glass on scroll.
 * Animated entrance from top on first load.
 */
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Product", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Use cases", href: "#stats" },
  { label: "Pricing", href: "#cta" },
  { label: "Docs", href: "/docs" },
];

interface StickyNavProps {
  onJoinWaitlist: () => void;
}

export default function StickyNav({ onJoinWaitlist }: StickyNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("#")) {
      const el = document.getElementById(href.slice(1));
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.header
        className={`landing-nav ${scrolled ? "landing-nav--scrolled" : ""}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
      >
        <div className="landing-nav__inner">
          <Link href="/" className="landing-nav__logo">
            workflo<span>.</span>
          </Link>

          <nav className="landing-nav__links" aria-label="Main navigation">
            {NAV_LINKS.map((link) =>
              link.href.startsWith("#") ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="landing-nav__link"
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                >
                  {link.label}
                </a>
              ) : (
                <Link key={link.label} href={link.href} className="landing-nav__link">
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className="landing-nav__actions">
            <button
              className="landing-btn landing-btn--outline landing-btn--sm"
              onClick={() => handleNavClick("#cta")}
            >
              Book a demo <ArrowRight size={14} />
            </button>
            <button
              className="landing-btn landing-btn--primary landing-btn--sm"
              onClick={onJoinWaitlist}
            >
              Join waitlist <ArrowRight size={14} />
            </button>
            <button
              className="landing-nav__mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <div className={`landing-nav__mobile-menu ${mobileOpen ? "is-open" : ""}`}>
        {NAV_LINKS.map((link) =>
          link.href.startsWith("#") ? (
            <a key={link.label} href={link.href} onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}>
              {link.label}
            </a>
          ) : (
            <Link key={link.label} href={link.href} onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          )
        )}
        <button className="landing-btn landing-btn--primary" onClick={() => { setMobileOpen(false); onJoinWaitlist(); }} style={{ marginTop: 8 }}>
          Join waitlist <ArrowRight size={14} />
        </button>
      </div>
    </>
  );
}
