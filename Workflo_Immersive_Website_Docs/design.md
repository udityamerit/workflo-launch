# Workflo Immersive Website --- Design System & Motion Design

**Purpose:** Define the visual, interaction and motion language for the
Workflo public website.

**References:** - Primary visual reference: user-supplied Workflo launch
page image. - Interaction reference: Anime.js website and its animation
patterns, especially timeline composition, scroll synchronization, text
splitting and Three.js integration.
citeturn750947search2turn121188search3turn121188search0

------------------------------------------------------------------------

# 1. Design North Star

> **A cinematic developer-infrastructure control room that you can
> scroll through.**

The visitor should feel like they are moving through Workflo's execution
pipeline rather than reading a conventional website.

The entire page is a single narrative:

``` text
ARRIVE
 ↓
UNDERSTAND
 ↓
ENTER SANDBOX
 ↓
WATCH EXECUTION
 ↓
COLLECT EVIDENCE
 ↓
SEAL RECEIPT
 ↓
VERIFY
 ↓
TRUST
 ↓
ACT
```

------------------------------------------------------------------------

# 2. Visual Identity

## Background

``` text
#050505
```

Almost-black should dominate.

## Primary text

``` text
#F5F5F2
```

## Secondary text

``` text
#A1A19A
```

## Muted text

``` text
#686862
```

## Accent

``` text
#C8FF3D
```

The accent is a system signal, not a decorative theme.

Use it for:

-   active status,
-   execution path,
-   verified state,
-   primary CTA,
-   important edges,
-   3D emissive details.

------------------------------------------------------------------------

# 3. Typography

## Primary

**Inter**

## Technical

**JetBrains Mono**

Large headline:

``` text
76–112px desktop
```

Section titles:

``` text
48–64px
```

Body:

``` text
16–18px
```

Technical labels:

``` text
12–14px
```

Use tight leading and controlled letter spacing.

------------------------------------------------------------------------

# 4. Spatial Language

Use substantial negative space.

The page should alternate between:

``` text
dense technical object
        ↓
open black space
        ↓
large headline
        ↓
technical UI
```

Do not fill every pixel.

------------------------------------------------------------------------

# 5. Surface Language

Surfaces should look manufactured.

Preferred:

-   black glass,
-   smoked transparent acrylic,
-   hard dark metal,
-   thin luminous edges,
-   subtle internal reflections.

Avoid:

-   soft generic SaaS cards,
-   excessive blur,
-   pastel gradients,
-   colorful AI motifs.

------------------------------------------------------------------------

# 6. 3D Visual Grammar

## Primary object

**Workflo Execution Core**

A physical cube/capsule containing a pipeline.

Internal modules:

``` text
SOURCE
SANDBOX
TEST
EVIDENCE
RECEIPT
```

Objects should physically interact.

For example:

``` text
source block
    ↓
enters sandbox rail
    ↓
test blocks activate
    ↓
evidence fragments appear
    ↓
receipt slab seals
```

------------------------------------------------------------------------

# 7. Hero Camera

Start:

``` text
camera = 3/4 view
distance = far
```

As user scrolls:

``` text
camera approaches
object rotates
internal components separate
```

At the end of the hero:

``` text
receipt becomes visible
```

This gives the first major scroll section an actual payoff.

------------------------------------------------------------------------

# 8. Scroll Choreography

Scroll is not simply used to reveal sections.

It controls the narrative timeline.

Conceptually:

``` text
scrollProgress 0.00
    ↓
object idle

0.15
    ↓
source enters

0.30
    ↓
sandbox closes

0.45
    ↓
tests activate

0.60
    ↓
evidence appears

0.75
    ↓
manifest compresses

0.90
    ↓
receipt seals

1.00
    ↓
transition to next act
```

Anime.js timelines support synchronized animation/timer/callback
sequences and precise child positioning, which is useful for building
these deterministic story beats.
citeturn750947search2turn750947search1

------------------------------------------------------------------------

# 9. Pinned Sections

Use pinned scenes selectively.

Recommended pinned areas:

### Hero

3D object responds to scroll.

### Sandbox

Camera travels through the boundary.

### Receipt

Verification sequence builds as the user scrolls.

Do not pin every section.

Pinned sections should feel like major chapters.

------------------------------------------------------------------------

# 10. Scroll Synchronization

The desired effect is:

``` text
scroll position
      ↓
timeline progress
      ↓
camera / object / text
```

Use smoothed synchronization so that the visual system follows the user
rather than jumping between states.

Anime.js explicitly supports smooth scroll synchronization through
`onScroll()` and synchronization values. citeturn121188search1

------------------------------------------------------------------------

# 11. Text Animation

## Hero

Reveal by line:

``` text
Ship software.
Not regressions.
Not risk.
```

Each line should move vertically through a clipping window.

## Section title

Use word-level reveal.

## Small labels

Fade/slide.

Anime.js `splitText()` supports lines, words and character splitting for
this type of choreography. citeturn750947search0turn750947search6

------------------------------------------------------------------------

# 12. Button Design

Buttons are technical instruments.

## Primary

``` text
┌───────────────────────────────┐
│ JOIN EARLY ACCESS          → │
└───────────────────────────────┘
```

Motion:

-   arrow moves 4px,
-   border/edge brightens,
-   background subtly lifts.

## Secondary

Transparent with thin border.

Do not use giant pills.

------------------------------------------------------------------------

# 13. Cursor / Pointer

Desktop enhancement:

A subtle pointer system can appear in selected scenes.

Examples:

``` text
hover receipt
→ small verification glyph

hover node
→ node label expands

hover 3D control
→ fine technical reticle
```

Do not create a custom cursor that harms basic navigation.

------------------------------------------------------------------------

# 14. Product UI Aesthetic

Dashboard:

``` text
dense
black
precise
monospace
thin borders
small status indicators
```

Suggested navigation:

``` text
Overview
Test Runs
Receipts
Environments
Policies
```

The dashboard should look like a real internal tool rather than a
Behance mockup.

------------------------------------------------------------------------

# 15. Dashboard Motion

When it enters view:

``` text
frame appears
→ metrics count
→ rows materialize
→ one run highlights
→ receipt drawer opens
```

The metrics must not imply real production data if synthetic.

------------------------------------------------------------------------

# 16. Problem Section Motion

Start with:

``` text
✓ PASSED
```

Then the card separates into layers.

Layer 1:

``` text
RESULT
```

Layer 2:

``` text
EXECUTION
```

Layer 3:

``` text
EVIDENCE
```

Layer 4:

``` text
SIGNATURE
```

The user visually discovers why Workflo is different.

------------------------------------------------------------------------

# 17. Sandbox Scene

Physical metaphor:

``` text
outer world
┌────────────────────────────┐
│                            │
│       WORKFLO CORE         │
│    ┌──────────────────┐    │
│    │  application     │    │
│    │  tests           │    │
│    │  dependencies    │    │
│    └──────────────────┘    │
│           ×                │
│        network             │
└────────────────────────────┘
```

Motion:

-   external packet appears,
-   moves toward boundary,
-   is stopped,
-   policy indicator lights.

------------------------------------------------------------------------

# 18. Evidence Graph

Once execution finishes, the sandbox transforms into a graph.

``` text
                    RECEIPT
                       ▲
                       │
             ┌─────────┴─────────┐
             │                   │
           LOGS                TESTS
             │                   │
       SCREENSHOTS            TRACES
             │                   │
             └─────────┬─────────┘
                       │
                     HASH
```

Nodes should emerge from the physical environment.

------------------------------------------------------------------------

# 19. Receipt Visual

Receipt should feel like a **physical security artifact**.

Visual:

-   rectangular translucent plate,
-   engraved metadata,
-   small signature field,
-   lime status line.

It should not resemble a generic invoice.

------------------------------------------------------------------------

# 20. Verification Animation

Sequence:

``` text
RECEIPT RECEIVED
      ↓
PARSE
      ↓
DIGEST
      ↓
SIGNATURE
      ↓
EVIDENCE
      ↓
VERIFIED
```

Each state gets a compact machine-status animation.

At the final state:

``` text
VERIFIED
```

Large but restrained.

------------------------------------------------------------------------

# 21. Failed Verification

Make the failure state visually distinct but not dramatic.

``` text
SIGNATURE    ✕
STATUS       INVALID
```

The receipt should subtly split/glitch and lock.

This teaches that proof can fail.

------------------------------------------------------------------------

# 22. Horizontal Motion

Use horizontal translation inside a few vertical scroll sections.

Potential:

``` text
scroll down
→ evidence cards travel sideways
```

This creates cinematic variety.

Do not build the entire website as horizontal scroll.

------------------------------------------------------------------------

# 23. Parallax

Use three depth layers:

``` text
background
midground
foreground
```

Example:

-   background grid = slow,
-   product object = medium,
-   small evidence nodes = fast.

Keep parallax subtle.

------------------------------------------------------------------------

# 24. Atmospheric Effects

Use sparingly:

-   volumetric light,
-   particles,
-   fine noise,
-   faint scan lines,
-   subtle bloom.

Noise should be barely visible.

Avoid "cyberpunk" overload.

------------------------------------------------------------------------

# 25. Section Transitions

Good transition:

``` text
3D object becomes UI component
```

Good transition:

``` text
sandbox wall becomes section divider
```

Good transition:

``` text
receipt becomes CTA panel
```

These transitions create continuity.

Avoid:

``` text
random fade → random fade → random slide
```

------------------------------------------------------------------------

# 26. Mobile

Mobile should remain immersive but simpler.

Remove or reduce:

-   complex parallax,
-   multiple foreground particles,
-   deep camera moves,
-   huge 3D geometry.

Keep:

-   hero object,
-   receipt,
-   key transitions,
-   verification sequence.

------------------------------------------------------------------------

# 27. Reduced Motion

When:

``` text
prefers-reduced-motion: reduce
```

Use:

-   simple fades,
-   immediate state changes,
-   static 3D frame,
-   no camera movement,
-   no continuous rotation.

Content must remain complete.

------------------------------------------------------------------------

# 28. Component Library

``` text
Header
MobileMenu
Hero
HeroScene
AnimatedHeading
SectionEyebrow
PrimaryButton
SecondaryButton
ProblemScene
CodePanel
SandboxScene
ExecutionTimeline
DashboardMockup
EvidenceGraph
ReceiptCard
VerificationDemo
SecurityScene
UseCaseBlock
Pricing
FinalCTA
Footer
```

------------------------------------------------------------------------

# 29. Design Tokens

``` css
:root {
  --wf-bg: #050505;
  --wf-surface: #090909;
  --wf-surface-2: #101010;
  --wf-border: #1c1c1c;

  --wf-text: #f5f5f2;
  --wf-text-secondary: #a1a19a;
  --wf-text-muted: #686862;

  --wf-accent: #c8ff3d;

  --wf-radius-sm: 6px;
  --wf-radius-md: 8px;
  --wf-radius-lg: 14px;

  --wf-container: 1320px;
}
```

------------------------------------------------------------------------

# 30. Visual Quality Test

At every section ask:

### Does the motion explain the product?

### Does the 3D object have a semantic role?

### Could the section work without decoration?

### Does the user know what to do next?

If any answer is no, simplify.

------------------------------------------------------------------------

# 31. Final Visual Principle

> **Do not animate everything. Animate the system.**

The website should feel intelligent because the motion has cause and
effect:

``` text
scroll → execution
execution → evidence
evidence → receipt
receipt → verification
verification → confidence
```
