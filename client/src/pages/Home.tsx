/**
 * Home — Workflo landing page composed of 7 professionally animated sections,
 * matching the design.jpeg reference. Each section animates part-by-part.
 */
import { useState, type FormEvent } from "react";
import { Link } from "wouter";
import { ArrowUpRight, CircleCheckBig } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import StickyNav from "../components/landing/StickyNav";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import StatsSection from "../components/landing/StatsSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import CtaSection from "../components/landing/CtaSection";
import Footer from "../components/landing/Footer";

const WORK_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Home() {
  const [trialOpen, setTrialOpen] = useState(false);
  const [trialEmail, setTrialEmail] = useState("");
  const [trialConsent, setTrialConsent] = useState(false);
  const [trialConsentAttempted, setTrialConsentAttempted] = useState(false);
  const [trialState, setTrialState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [trialMessage, setTrialMessage] = useState("");

  const trialEmailState =
    trialEmail.length === 0
      ? "idle"
      : WORK_EMAIL_PATTERN.test(trialEmail.trim())
        ? "valid"
        : "invalid";

  const openWaitlist = () => setTrialOpen(true);

  const submitTrial = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (trialState === "submitting") return;
    if (!trialConsent) {
      setTrialConsentAttempted(true);
      return;
    }
    setTrialState("submitting");
    setTrialMessage("");
    try {
      const response = await fetch("/api/trial-signups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trialEmail, consent: trialConsent }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
      };
      if (!response.ok || !payload.ok)
        throw new Error(
          payload.message || "Trial requests are temporarily unavailable. Please try again."
        );
      setTrialState("success");
      setTrialMessage("Your access request is recorded. We'll be in touch about your trial.");
      setTrialEmail("");
    } catch (error) {
      setTrialState("error");
      setTrialMessage(
        error instanceof Error
          ? error.message
          : "Trial requests are temporarily unavailable. Please try again."
      );
    }
  };

  const changeTrialDialog = (open: boolean) => {
    setTrialOpen(open);
    if (!open) {
      setTrialState("idle");
      setTrialMessage("");
      setTrialConsent(false);
      setTrialConsentAttempted(false);
    }
  };

  return (
    <div className="landing-page">
      {/* A. Sticky Nav */}
      <StickyNav onJoinWaitlist={openWaitlist} />

      {/* B. Hero Section */}
      <HeroSection onJoinWaitlist={openWaitlist} />

      {/* C. Features Section — "QA that thinks like you ship" */}
      <FeaturesSection />

      {/* D. Stats + Product Dashboard */}
      <StatsSection />

      {/* E. How It Works — "From commit to confident" */}
      <HowItWorksSection />

      {/* F. Closing CTA */}
      <CtaSection onJoinWaitlist={openWaitlist} />

      {/* G. Footer */}
      <Footer />

      {/* ── Trial Signup Modal ── */}
      <Dialog open={trialOpen} onOpenChange={changeTrialDialog}>
        <DialogContent
          className="trial-modal"
          onPointerDownOutside={() => changeTrialDialog(false)}
          onEscapeKeyDown={() => changeTrialDialog(false)}
        >
          <DialogHeader>
            <span className="trial-modal__eyebrow">WORKFLO / TRIAL ACCESS</span>
            <DialogTitle>Start your free trial.</DialogTitle>
            <DialogDescription>
              Use a work email to request access to Workflo's isolated QA environment.
            </DialogDescription>
          </DialogHeader>

          {trialState === "success" ? (
            <div className="trial-modal__success" role="status">
              <div className="trial-modal__success-mark">
                <CircleCheckBig size={30} />
              </div>
              <strong>Thank you.</strong>
              <p>{trialMessage}</p>
              <button type="button" onClick={() => changeTrialDialog(false)}>
                Close
              </button>
            </div>
          ) : (
            <form className="trial-modal__form" onSubmit={submitTrial}>
              <label>
                <span>WORK EMAIL</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={trialEmail}
                  onChange={(e) => setTrialEmail(e.target.value)}
                  required
                  aria-invalid={trialEmailState === "invalid"}
                  aria-describedby="trial-email-feedback"
                  disabled={trialState === "submitting"}
                />
              </label>
              <p
                id="trial-email-feedback"
                className={`trial-modal__email-feedback is-${trialEmailState}`}
                aria-live="polite"
              >
                {trialEmailState === "invalid"
                  ? "Enter a valid work email address."
                  : trialEmailState === "valid"
                    ? "Email format looks good."
                    : ""}
              </p>
              <div
                className={`trial-modal__consent ${trialConsentAttempted && !trialConsent ? "is-invalid" : ""}`}
              >
                <Checkbox
                  id="trial-consent"
                  checked={trialConsent}
                  aria-invalid={trialConsentAttempted && !trialConsent}
                  aria-describedby="trial-consent-error"
                  onCheckedChange={(checked) => {
                    setTrialConsent(checked === true);
                    if (checked) setTrialConsentAttempted(false);
                  }}
                  disabled={trialState === "submitting"}
                />
                <label htmlFor="trial-consent">
                  I agree that Workflo may use this email to process my trial request. See the{" "}
                  <Link href="/privacy" target="_blank" rel="noreferrer">
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>
              {trialConsentAttempted && !trialConsent && (
                <p id="trial-consent-error" className="trial-modal__consent-error" role="alert">
                  Please confirm consent before requesting a trial.
                </p>
              )}
              {trialState === "error" && (
                <p className="trial-modal__error" role="alert">
                  {trialMessage}
                </p>
              )}
              <button
                type="submit"
                disabled={trialState === "submitting" || trialEmailState !== "valid"}
              >
                {trialState === "submitting" ? "Submitting…" : "Request access"}
                <ArrowUpRight size={16} />
              </button>
              <small>Your email is used only to process this trial request.</small>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
