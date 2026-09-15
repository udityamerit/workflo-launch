# Build Prompt: "Workflo" Style Animated SaaS Landing Page
---

Build a **production-quality, fully animated, single-page dark SaaS landing site** for a fictional AI QA/testing copilot product. Use **Next.js + Tailwind CSS + Framer Motion + Lenis (smooth scroll)**. Every section must animate in with a distinct "layer-by-layer, part-by-part" reveal choreography — not a single generic fade-up. Precision and restraint over flashiness: this is a premium developer-tool aesthetic (think Linear, Vercel, Framer).

### 1. Brand & Visual System

- **Background:** near-black `#0A0A0A` base, with slightly-lighter card surfaces `#131313` / `#161616`, and hairline borders `rgba(255,255,255,0.08)`.
- **Accent:** electric lime-green `#C6FF3D` (primary CTA, highlights, glow effects, chart accents) — used sparingly as a pop color, never as a background fill except on primary buttons.
- **Text:** off-white `#F5F5F5` for headings, `#8A8A8A` / `#A0A0A0` for body/secondary text.
- **Status colors:** soft red `#FF5C5C` for "failed" states, green for "passed" — desaturated, not neon, so the lime accent stays the hero color.
- **Typography:** tight-tracking, bold geometric sans-serif for headlines (e.g. Inter/Geist at 600–700 weight, negative letter-spacing ~-0.02em), regular weight for body copy, monospace font (e.g. JetBrains Mono) for the code snippet block and small eyebrow/kicker labels.
- **Eyebrow labels:** small uppercase kicker text above each section headline (e.g. "◈ EARLY ACCESS", "◈ BUILT FOR ENGINEERS", "◈ HOW IT WORKS"), lime-colored icon + gray uppercase tracked-out text.
- **Corner radius:** consistent 12–16px on cards, 8px on buttons/pills.
- **Buttons:** two variants — filled lime pill (`bg-[#C6FF3D] text-black`) for primary CTAs, and outlined dark pill (`border border-white/15`) for secondary CTAs. Both include a trailing arrow icon that slides right 4px on hover.

### 2. Page Structure (build in this exact order)

**A. Sticky Nav**
- Logo "workflo." left, centered nav links (Product, How it works, Use cases, Pricing, Docs), right-side "Book a demo" (outline) + "Join waitlist" (filled lime) buttons.
- Nav background is transparent over hero, becomes a blurred glass bar (`backdrop-blur-lg bg-black/60 border-b border-white/5`) once scrolled past hero.

**B. Hero Section**
- Left: eyebrow "EARLY ACCESS" → three-line headline "Ship software. / Not regressions. / Not risk." (each line a separate block) → one-paragraph subcopy → two CTA buttons → small "Trusted by engineers at" row with avatar cluster + logo wordmarks (Vercel, Linear, Framer, Supabase).
- Right: a **3D glass/keycap hero illustration** — a large glossy black cube with a glowing lime "W." embossed on its top face, surrounded by smaller floating translucent glass keycaps (each with a lime checkmark), all threaded through with glowing lime light-tubes/rods at an angle. Render this as layered SVG/CSS-3D or Three.js — it should look like frosted glass with lime internal glow and soft bloom.
- Bottom-right: small "SCROLL TO EXPLORE" indicator with an animated bouncing/pulsing dot.

**C. "QA that thinks like you ship" Section**
- Eyebrow "BUILT FOR ENGINEERS" → two-line headline.
- Left: a dark code-editor card (`test.spec.ts` tab) showing a syntax-highlighted Playwright/Jest-style test snippet, with a floating "✓ Passed" pill badge overlapping the bottom-right corner of the card.
- Right: a 2x2 (or stacked) feature list — AI-generated tests, Visual regression, E2E at scale, Smart flake detection — each with a small lime line-icon, bold title, one-line gray description.

**D. Stats + Product Dashboard Section**
- Full-width dark card split into two halves:
  - Left: three stacked big-number stats in lime (`87%` fewer bugs in production, `3.2x` faster release cycles, `10k+` engineers building with workflo), each number huge/bold, label small gray beneath.
  - Right: a realistic mini product-dashboard mockup — sidebar nav (Overview, Test Runs, Suites, Environments, Reports, Settings), top filter bar (All Environments / Last 7 days), 4 KPI mini-cards (Total Runs, Passed, Failed, Flaky — Failed card has a subtle red-tinted background), and a table of recent test runs with colored status dots, avatar stacks, and pass/fail icons.

**E. "From commit to confident" — How It Works**
- Eyebrow "HOW IT WORKS" → two-line headline.
- Left: numbered vertical step list (01 Connect, 02 Generate, 03 Validate, 04 Ship), each with bold title + one-line description, current/active step visually emphasized.
- Right: a **stacked 3D glass card illustration** — four translucent glass panels stacked at a slight isometric tilt, each engraved with a step name in large italic/skewed type (CONNECT, GENERATE, VALIDATE, SHIP bottom-to-top), connected by a glowing lime vertical circuit line running through small icon nodes (code brackets, terminal, globe, image icon) on the left edge of each panel.

**F. Closing CTA Section**
- Dark bordered card: left side "Ready to ship with confidence?" headline + subcopy + two CTA buttons; right side a large glowing lime 3D "W." mark echoing the hero illustration (smaller/simplified), with light streaks trailing behind it.

**G. Footer**
- Logo + one-line tagline, left.
- Three link columns: Product (Features, Pricing, Roadmap, Changelog), Resources (Docs, Blog, Guides, API Reference), Company (About, Careers, Contact, Privacy).
- Bottom row: copyright text + social icons (GitHub, Twitter/X, LinkedIn), separated by a hairline border.

### 3. Animation Choreography (this is the critical part — layer-by-layer, part-by-part)

Use **Framer Motion `whileInView` + staggered `variants`**, with **Lenis** for buttery smooth scroll, and a shared `viewport={{ once: true, margin: "-15%" }}` so each section animates once as it enters ~15% before it's fully in view.

General rules:
- Never animate a whole section as one block. Break every section into its constituent layers and stagger them with `staggerChildren: 0.08–0.15s` and `delayChildren`.
- Standard child transition: `y: 24 → 0`, `opacity: 0 → 1`, `duration: 0.6–0.8`, `ease: [0.16, 1, 0.3, 1]` (expo-out).
- Nav: fades/slides down on initial page load only (`initial`, not `whileInView`).

Section-by-section timing:
1. **Hero:** eyebrow fades in first (0ms) → headline lines reveal one at a time top-to-bottom with a slight mask/clip-path wipe (each line 100ms after the previous) → subcopy fades up → both buttons scale/fade in together → trust row fades in last. In parallel, the 3D keycap illustration's pieces (main cube, each floating keycap, each glass rod) animate in independently: cube scales up from 0.9 with a soft glow pulse, individual keycaps drift in from slightly offset positions with their own small delays (like debris settling into formation), rods draw themselves in (`pathLength` animation if SVG). Add a slow continuous idle float (translateY ±6px, ~4s loop) on the whole illustration after entrance completes, plus subtle parallax on scroll (illustration moves slower than page scroll, ~0.3x speed).
2. **Code + Features section:** code editor card slides in from left with a subtle 3D tilt-to-flat rotation (`rotateY: -8deg → 0`), then its lines of code type/reveal top-to-bottom with a very short stagger (like a terminal printing), and the "Passed" badge pops in last with a spring bounce. On the right, the 4 feature rows stagger in from the right, one per ~120ms, icon rotates in (`rotate: -15deg → 0`) slightly before its text fades up.
3. **Stats + Dashboard:** the three stat numbers count up from 0 to their target value (use a number-tween, not just opacity) as they enter, staggered ~150ms apart, labels fade in right after each number settles. The dashboard mockup builds itself: sidebar slides in from left, top filter bar fades down, the 4 KPI cards pop in left-to-right with a slight scale bounce staggered ~80ms each, then table rows slide in from the left one at a time (~60ms stagger) as if being populated live, with status dots pulsing once on appearance.
4. **How It Works:** numbered steps fade/slide up top-to-bottom in sequence, each number ticking in slightly before its title+description. The stacked glass panels animate as a true stack build: bottom panel (CONNECT) appears first, then GENERATE slides/settles on top of it, then VALIDATE, then SHIP — each with a soft drop/settle motion (`y: -20 → 0` with slight overshoot) and the connecting lime line "grows" upward (`pathLength` or `scaleY` animation) in sync as each panel lands, finally the small icon nodes pop in at each junction.
5. **Closing CTA:** card border draws itself in (or fades), headline/subcopy/buttons stagger up together, glowing "W." mark on the right scales in with a bloom/glow pulse and trailing light streaks animate outward from behind it.
6. **Footer:** simple fade-up, no heavy choreography — footers shouldn't compete for attention.

Micro-interactions (apply throughout):
- All buttons: hover = slight scale (1.02), arrow icon translates right 4px, filled lime button gets a soft glow-shadow on hover.
- Cards: subtle hover lift (`y: -2px`, shadow increase) where cards are meant to feel interactive (dashboard, code card).
- Nav links: underline-from-center or color fade to lime on hover.
- Respect `prefers-reduced-motion`: fall back to simple opacity fades, no parallax/float loops, when set.

### 4. Technical Requirements

- Fully responsive: stack all two-column sections to single-column on mobile, reduce headline sizes, keep animation stagger but shorten distances (e.g. `y: 24 → y: 12` on mobile) for performance.
- Use CSS variables for the color palette so theming is centralized.
- Illustrations (hero cube, stacked glass panels, closing "W.") should be built as layered SVG or lightweight Three.js/React Three Fiber scenes — not static raster images — so each piece can be animated independently and stay crisp at any size.
- Optimize for 60fps: use `transform`/`opacity` only for animated properties, `will-change` on actively animating elements, and lazy-mount below-the-fold sections.
- Semantic HTML, accessible labels on icon-only buttons, sufficient color contrast for body text against the near-black background.
