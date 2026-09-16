# Workflo Immersive Website --- PRD

**Status:** Production website specification\
**Reference direction:** User-provided Workflo visual + Anime.js website
as interaction/animation inspiration\
**Scope:** Public Workflo website only\
**Primary objective:** Build a futuristic, 3D, immersive product-launch
website that makes Workflo's core promise memorable while remaining
fast, credible and usable.

------------------------------------------------------------------------

## 1. Product / Website Thesis

Workflo is the privacy-first autonomous QA agent that runs software in
isolated sandboxes and produces verifiable test receipts.

The website must make the following mental model obvious:

``` text
CODE
  ↓
ISOLATE
  ↓
GENERATE
  ↓
VALIDATE
  ↓
CAPTURE EVIDENCE
  ↓
SIGN
  ↓
VERIFY
```

The experience should therefore feel less like a normal SaaS landing
page and more like entering a **live execution system**.

The core design language comes from the supplied image:

-   near-black canvas,
-   acid-lime signal color,
-   oversized editorial type,
-   premium engineered 3D objects,
-   product UI embedded into the story,
-   strong section transitions,
-   compact navigation and buttons,
-   cinematic product-launch pacing.

The Anime.js reference adds an important interaction principle:
animation should be tied to **state, scroll position, timelines and
content**, rather than random decoration. Anime.js currently provides
timeline orchestration, scroll observers with synchronized/eased
playback, text splitting, and a Three.js adapter, making those patterns
particularly relevant to the Workflo experience. See the implementation
notes in `Tech.md`.

------------------------------------------------------------------------

# 2. Website Goals

### Primary

-   Establish Workflo as a premium engineering product.
-   Explain the product in under 10 seconds.
-   Make isolation and verifiable receipts the key differentiation.
-   Demonstrate product intelligence visually.
-   Make the site memorable through controlled 3D and scroll
    choreography.
-   Convert visitors into early access, demo, docs or product
    exploration.

### Secondary

-   Establish a visual identity that can later extend into the Workflo
    application.
-   Explain the trust model without overwhelming visitors.
-   Communicate privacy/security principles precisely.
-   Create a premium foundation for future product and docs surfaces.

------------------------------------------------------------------------

# 3. Non-Goals

The website does **not** become the Workflo execution platform.

Out of scope for the public website:

-   arbitrary visitor code execution,
-   real sandbox creation for anonymous visitors,
-   hosted repository ingestion,
-   production CI execution,
-   actual production receipt signing for visitor submissions,
-   enterprise tenancy,
-   full Workflo control-plane functionality.

The website can use deterministic demo data and simulations. They must
not be represented as real customer execution.

------------------------------------------------------------------------

# 4. Target Audience

## Primary

### Software engineers

Question:

> "Why should I use this instead of my existing test runner?"

Answer:

> Workflo adds autonomous QA, isolation and verifiable execution
> evidence.

### QA engineers

Question:

> "Can it expand coverage without creating more maintenance work?"

Answer:

> Workflo can generate and execute candidate QA scenarios while
> retaining a clear execution record.

### Engineering leads

Question:

> "Can I trust the testing process behind a release?"

Answer:

> Workflo makes execution conditions and evidence inspectable.

### Security-conscious teams

Question:

> "What happens to code and network access during testing?"

Answer:

> Workflo is designed around explicit execution boundaries and
> restrictive defaults.

------------------------------------------------------------------------

# 5. Core Message Hierarchy

## Level 1

> **Ship software. Not regressions. Not risk.**

## Level 2

> Workflo is the privacy-first autonomous QA agent that tests software
> in isolated sandboxes and produces verifiable execution receipts.

## Level 3

``` text
Autonomous QA
Isolated execution
Evidence
Cryptographic verification
```

Every major section should reinforce one or more of these.

------------------------------------------------------------------------

# 6. Homepage Experience

The homepage is an approximately 8--10 act cinematic story.

``` text
ACT 01   ARRIVAL
ACT 02   THE PROBLEM
ACT 03   AUTONOMOUS QA
ACT 04   EXECUTION
ACT 05   EVIDENCE
ACT 06   RECEIPT
ACT 07   VERIFICATION
ACT 08   SECURITY
ACT 09   USE CASES
ACT 10   CONVERSION
```

------------------------------------------------------------------------

# 7. Act 01 --- Arrival / Hero

### Goal

Create immediate product recognition.

### Content

``` text
EARLY ACCESS

Ship software.
Not regressions.
Not risk.

Workflo is the privacy-first autonomous QA agent
that tests software in isolated sandboxes and produces
verifiable execution receipts.

[Join early access →] [Book a demo →]
```

### Hero visual

A large 3D Workflo execution core.

Concept:

``` text
                         ┌── TEST NODE
                         │
CODE → [SANDBOX CORE] → [EVIDENCE] → [RECEIPT]
                         │
                         └── POLICY
```

Visual characteristics:

-   smoked transparent glass,
-   dark metal,
-   translucent rails,
-   lime emissive pathways,
-   floating micro-panels,
-   subtle depth of field.

### Hero interaction

On first load:

1.  logo settles,
2.  headline enters line-by-line,
3.  execution core appears in depth,
4.  internal rails power on,
5.  lime status path travels through the object,
6.  receipt node seals.

The headline and CTA must remain visually stable while the 3D scene
moves.

------------------------------------------------------------------------

# 8. Act 02 --- The Problem

### Headline

> **A green checkmark isn't proof.**

### Interaction

Start with a simple:

``` text
✓ PASSED
```

As the user scrolls, the result fractures into evidence layers:

``` text
SOURCE
ENVIRONMENT
POLICY
NETWORK
EXECUTION
ARTIFACTS
SIGNATURE
```

The layers should physically separate in 3D space.

### Narrative

A test result is an output.

Workflo makes the **execution itself inspectable**.

------------------------------------------------------------------------

# 9. Act 03 --- Autonomous QA

### Headline

> **QA that thinks beyond the happy path.**

Feature sequence:

``` text
GENERATE
VISUALIZE
EXECUTE
ANALYZE
```

Feature content:

-   AI-generated test candidates,
-   visual regression,
-   E2E workflows,
-   intelligent test prioritization,
-   flaky-test detection,
-   failure analysis.

### Visual

Large floating code panel.

As the user scrolls:

``` text
repository
 ↓
test candidates
 ↓
execution plan
 ↓
result
```

The code panel can rotate slightly in 3D.

------------------------------------------------------------------------

# 10. Act 04 --- Execution

### Headline

> **Your code enters a boundary.**

Make isolation the centerpiece.

Visual:

A giant transparent sandbox box.

Inside:

``` text
APP
TESTS
DEPENDENCIES
BROWSER
```

Outside:

``` text
HOST
NETWORK
SECRETS
```

Network packets attempt to leave the sandbox and are denied by policy.

### Interaction

Scroll controls:

-   camera moves closer,
-   boundary becomes transparent,
-   internal processes light up,
-   external network path is blocked,
-   execution completes.

------------------------------------------------------------------------

# 11. Act 05 --- Evidence

### Headline

> **Every run leaves evidence.**

The 3D environment transforms into a technical evidence graph:

``` text
RUN
├── LOGS
├── TEST RESULTS
├── SCREENSHOTS
├── TRACES
└── ARTIFACTS
```

Each item becomes a hashed node.

The visual should progressively simplify:

``` text
many artifacts
      ↓
content digests
      ↓
manifest
```

------------------------------------------------------------------------

# 12. Act 06 --- Receipt

### Headline

> **Then Workflo seals the run.**

Show a premium receipt card.

``` text
WORKFLO RECEIPT

EXECUTION
wf_01J...

SOURCE
commit: 8e32...

ENVIRONMENT
isolated

NETWORK
blocked

RESULT
passed

EVIDENCE
14 artifacts

SIGNATURE
valid
```

The card should feel like a physical object.

Visual treatment:

-   transparent edge,
-   subtle bevel,
-   black surface,
-   lime signature indicator.

------------------------------------------------------------------------

# 13. Act 07 --- Verification

### Headline

> **Don't trust the report. Verify the receipt.**

This is the major interactive hero after the initial hero.

### Interaction

A user-controlled verification sequence:

``` text
[ VERIFY RECEIPT ]
```

Then:

``` text
PARSING              ✓
RECOMPUTING HASH     ✓
CHECKING SIGNATURE   ✓
VERIFYING EVIDENCE   ✓

VERIFIED
```

The UI should visually lock the receipt into place.

### Invalid state

There must also be an intentional invalid animation:

``` text
SIGNATURE             ✕
RECEIPT               INVALID
```

No ambiguous intermediate state.

------------------------------------------------------------------------

# 14. Act 08 --- Security

### Headline

> **Isolation is a feature. Proof is the product.**

Show:

-   filesystem boundary,
-   network boundary,
-   resource boundary,
-   explicit policy.

Use concise technical copy.

Avoid fear-based security marketing.

------------------------------------------------------------------------

# 15. Act 09 --- Use Cases

Use editorial storytelling rather than a card grid.

### Pre-merge

Catch regressions before merge.

### Untrusted code

Run uncertain workloads inside controlled environments.

### AI-generated QA

Use AI for test proposals without making AI the trust boundary.

### Release validation

Attach execution evidence to release workflows.

### Security-sensitive CI

Keep execution policy visible.

------------------------------------------------------------------------

# 16. Act 10 --- Final Conversion

### Headline

> **Ready to ship with evidence?**

Copy:

> Join early access and experience verifiable QA for modern software.

CTA:

``` text
Join early access →
Book a demo →
```

3D visual:

A large Workflo `W.` receipt/seal.

------------------------------------------------------------------------

# 17. Navigation Requirements

Desktop:

``` text
workflo.

Product
How it works
Use cases
Pricing
Docs

Book a demo
Join waitlist →
```

The navigation becomes slightly more opaque after scroll.

Mobile:

``` text
workflo.                     MENU
```

Menu opens as an immersive black panel.

------------------------------------------------------------------------

# 18. Interaction Principles

Every significant animation must serve one of:

-   explain,
-   orient,
-   confirm,
-   transition,
-   emphasize.

No animation should exist solely because it looks cool.

### Desired behavior

``` text
scroll = camera control
hover = local feedback
click = state transition
section entry = narrative event
verification = proof event
```

------------------------------------------------------------------------

# 19. Scroll Requirements

Scroll is the main interaction layer.

Use:

-   scroll-linked object rotation,
-   pinned scenes,
-   progressive reveal,
-   horizontal sequences inside vertical sections,
-   3D camera movement,
-   text transformations,
-   staggered element entrances,
-   section-to-section morphing.

Anime.js's `onScroll()` supports scroll-synchronized animation playback
with configurable thresholds and smoothing/easing, which maps directly
to the desired narrative model.
citeturn121188search3turn121188search1turn121188search10

------------------------------------------------------------------------

# 20. Button Requirements

Primary button:

``` text
┌─────────────────────────────┐
│ JOIN EARLY ACCESS        →  │
└─────────────────────────────┘
```

Interaction:

-   thin lime glow,
-   arrow travels slightly,
-   label tracks subtly,
-   border/surface transitions in 180--250ms.

Secondary button:

``` text
BOOK A DEMO                →
```

No giant pill buttons.

The product should feel precise and engineered.

------------------------------------------------------------------------

# 21. Typography Motion

Large headlines should not simply fade in.

Use:

``` text
line reveal
word reveal
character micro-stagger
```

Anime.js provides `splitText()` for lines, words and characters and
includes accessible text handling, which is useful for this kind of
motion system. citeturn750947search0turn750947search8

Use text motion sparingly for:

-   hero headline,
-   major section headings,
-   final CTA.

Do not animate every paragraph.

------------------------------------------------------------------------

# 22. 3D Requirements

3D is a core part of the experience, not an optional decorative
background.

Required scenes:

1.  Hero execution core.
2.  Sandbox boundary.
3.  Evidence graph.
4.  Receipt/seal.
5.  Final CTA object.

Each scene should have:

-   desktop quality,
-   mobile fallback,
-   reduced-motion fallback,
-   lazy initialization,
-   GPU-aware quality reduction.

------------------------------------------------------------------------

# 23. Performance Requirement

The site must feel premium **because it is controlled**, not because it
is heavy.

Principle:

``` text
HTML arrives first.
Typography arrives first.
Hero visual arrives second.
3D enhances the experience.
```

Never make the user wait for a 3D scene to understand the product.

------------------------------------------------------------------------

# 24. Responsive Requirements

### Desktop

Full cinematic compositions.

### Tablet

Reduce:

-   object scale,
-   camera depth,
-   scroll duration.

### Mobile

Use:

``` text
headline
↓
copy
↓
CTA
↓
3D object
```

Do not keep desktop side-by-side hero geometry.

------------------------------------------------------------------------

# 25. Accessibility

Requirements:

-   semantic HTML,
-   keyboard navigation,
-   visible focus,
-   accessible buttons/forms,
-   good contrast,
-   reduced-motion mode,
-   readable content independent of animation.

Anime.js includes accessible text-splitting support; Workflo should
preserve the source text as an accessible representation rather than
making split visual nodes the only accessible content.
citeturn750947search8

------------------------------------------------------------------------

# 26. SEO

Homepage:

``` text
Title:
Workflo — Autonomous QA with Verifiable Execution

Description:
Run software tests in isolated environments and produce verifiable execution receipts.
```

Create:

-   sitemap,
-   robots,
-   canonical URLs,
-   OG images,
-   structured data,
-   semantic headings.

------------------------------------------------------------------------

# 27. Conversion Metrics

Track:

``` text
hero_cta_click
demo_cta_click
waitlist_submit
pricing_view
docs_open
security_open
verification_demo_start
verification_demo_complete
```

Do not track source code or sensitive product data.

------------------------------------------------------------------------

# 28. Launch Acceptance Criteria

-   [ ] Homepage communicates Workflo within 10 seconds.
-   [ ] Main visual story is comprehensible without animation.
-   [ ] 3D hero works on supported desktop browsers.
-   [ ] Mobile has a dedicated composition.
-   [ ] Reduced motion works.
-   [ ] Verification demo has verified + invalid states.
-   [ ] Product UI data is labeled as demo where applicable.
-   [ ] No fake metrics or customer logos.
-   [ ] No unsupported security claims.
-   [ ] Page is responsive.
-   [ ] Navigation and CTAs function.
-   [ ] Contact/waitlist forms have real states.
-   [ ] Core Web Vitals are monitored.
-   [ ] 3D assets are optimized.
-   [ ] E2E and visual tests pass.

------------------------------------------------------------------------

# 29. Definition of Done

The website is complete when a developer can:

1.  understand Workflo immediately,
2.  see why standard pass/fail reporting is insufficient,
3.  understand isolation,
4.  understand evidence,
5.  understand receipts,
6.  see verification in action,
7.  trust the technical tone,
8.  take a clear next action.
