# Workflo Immersive Website --- Technical Stack & Engineering Specification

**Scope:** Public Workflo marketing/product-launch website\
**Goal:** Production-ready immersive web experience with heavy 3D and
scroll-linked animation without compromising accessibility, SEO or
performance.

------------------------------------------------------------------------

# 1. Recommended Stack

## Application

**Next.js + React + TypeScript**

Use:

-   App Router,
-   Server Components by default,
-   Client Components only where interactivity requires them.

## Styling

**Tailwind CSS + CSS variables**

Use a Workflo token layer rather than relying on default utility
aesthetics.

## 3D

**Three.js + React Three Fiber + Drei**

Use for:

-   hero,
-   sandbox scene,
-   evidence graph,
-   receipt,
-   final CTA.

## Animation

### Primary animation engine

**Anime.js**

Use it for:

-   scroll synchronization,
-   timelines,
-   text splitting,
-   stagger,
-   DOM/UI animation,
-   selected Three.js targets.

Anime.js currently documents `createTimeline()` for synchronizing
animation/timers/callbacks, `onScroll()` for scroll-linked animation,
`splitText()` for line/word/character animation, and a built-in Three.js
adapter.
citeturn750947search2turn121188search3turn750947search0turn121188search0

### Alternative / complementary animation

**GSAP**

Use only if a specific interaction is materially easier to implement or
maintain with GSAP.

Do not create a mixed animation architecture where Anime.js and GSAP
both control the same elements.

For this website, the preferred default is:

``` text
Anime.js = motion system
Three.js/R3F = rendering
React = state/component lifecycle
CSS = simple transitions
```

------------------------------------------------------------------------

# 2. Why Anime.js Fits Workflo

The desired website uses animation as a narrative system.

Anime.js provides:

-   animation primitives,
-   timelines,
-   staggered values,
-   scroll observers,
-   smooth/eased scroll synchronization,
-   text utilities,
-   WAAPI integration,
-   Three.js adapters.
    citeturn750947search2turn121188search1turn121188search0turn750947search3

That aligns well with the desired model:

``` text
scroll position
       ↓
animation timeline
       ↓
3D scene
       ↓
UI state
```

Anime.js also supports subpath imports so only the required modules need
to be loaded, which is useful for keeping the animation stack
controlled. citeturn750947search3

------------------------------------------------------------------------

# 3. High-Level Architecture

``` text
Browser
│
├── Next.js
│   ├── Server-rendered content
│   ├── SEO metadata
│   └── Static pages
│
├── React
│   ├── UI components
│   ├── interaction state
│   └── demo state
│
├── Anime.js
│   ├── timelines
│   ├── scroll
│   ├── text
│   └── micro-interactions
│
├── React Three Fiber
│   └── Three.js scenes
│
└── External services
    ├── analytics
    └── contact / waitlist
```

------------------------------------------------------------------------

# 4. Project Structure

``` text
workflo-web/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── product/page.tsx
│   ├── how-it-works/page.tsx
│   ├── use-cases/page.tsx
│   ├── pricing/page.tsx
│   ├── security/page.tsx
│   ├── docs/page.tsx
│   ├── contact/page.tsx
│   ├── privacy/page.tsx
│   └── terms/page.tsx
│
├── components/
│   ├── layout/
│   ├── navigation/
│   ├── hero/
│   ├── scenes/
│   ├── motion/
│   ├── product/
│   ├── receipt/
│   ├── sections/
│   ├── forms/
│   └── ui/
│
├── content/
│   ├── pages/
│   ├── use-cases/
│   └── docs/
│
├── lib/
│   ├── animation/
│   ├── analytics/
│   ├── metadata/
│   └── validation/
│
├── scenes/
│   ├── HeroScene.tsx
│   ├── SandboxScene.tsx
│   ├── EvidenceScene.tsx
│   └── ReceiptScene.tsx
│
├── public/
│   ├── models/
│   ├── textures/
│   ├── images/
│   └── fonts/
│
├── styles/
│   └── globals.css
│
├── tests/
│   ├── unit/
│   ├── component/
│   └── e2e/
│
└── package.json
```

------------------------------------------------------------------------

# 5. Animation Architecture

Create a single animation utility layer.

``` text
lib/animation/
├── timelines.ts
├── scroll.ts
├── text.ts
├── easing.ts
├── scene.ts
└── cleanup.ts
```

Components should not contain large undocumented animation scripts.

------------------------------------------------------------------------

# 6. Anime.js Module Strategy

Prefer subpath imports where practical.

Examples:

``` ts
import { animate } from 'animejs/animation';
import { createTimeline } from 'animejs/timeline';
import { onScroll } from 'animejs/events';
import { splitText } from 'animejs/text';
import { stagger } from 'animejs/utils';
```

Anime.js documents these subpath imports as a way to limit loaded
functionality. citeturn750947search3

------------------------------------------------------------------------

# 7. Timeline Architecture

Each cinematic section gets a controlled timeline.

Example concept:

``` ts
const timeline = createTimeline({
  defaults: {
    duration: 700,
    ease: 'out(3)',
  },
});
```

Conceptual sequence:

``` text
timeline
  ├─ headline reveal
  ├─ object entrance
  ├─ rail activation
  ├─ node movement
  └─ section handoff
```

Anime.js timelines support labels and relative time positions, allowing
overlapping and sequenced animation without manually calculating every
timestamp. citeturn750947search1

------------------------------------------------------------------------

# 8. Scroll Controller

Each pinned cinematic section should translate scroll distance into
timeline progress.

Concept:

``` text
section enters
      ↓
scroll observer activates
      ↓
timeline progress follows scroll
      ↓
section leaves
      ↓
cleanup / freeze final state
```

Anime.js `onScroll()` supports thresholds and synchronization, including
smooth/eased playback.
citeturn121188search7turn121188search1turn121188search10

------------------------------------------------------------------------

# 9. Three.js Integration

Use React Three Fiber for declarative scene composition.

Architecture:

``` text
<HeroScene>
   <Environment>
   <ExecutionCore>
   <SourceModule>
   <SandboxRail>
   <EvidenceNodes>
   <ReceiptPlate>
</HeroScene>
```

Anime.js may control Three.js mesh properties through its built-in
adapter. citeturn121188search0

------------------------------------------------------------------------

# 10. 3D Asset Pipeline

Preferred:

``` text
Blender
   ↓
GLB/GLTF
   ↓
optimization
   ↓
Three.js / R3F
```

Optimization:

-   Draco/Meshopt,
-   compressed textures,
-   minimal material count,
-   reduced geometry for mobile,
-   baked details where possible.

------------------------------------------------------------------------

# 11. Scene LOD Strategy

### High

Desktop:

``` text
full geometry
full reflections
higher texture resolution
```

### Medium

Tablet:

``` text
reduced geometry
reduced effects
```

### Low

Mobile:

``` text
simplified geometry
minimal particles
lower texture resolution
```

### Fallback

No WebGL:

``` text
static poster / image
```

------------------------------------------------------------------------

# 12. WebGL Lifecycle

Do not initialize all scenes on page load.

Use:

``` text
hero scene
→ immediate / near-immediate

sandbox scene
→ lazy when approaching section

evidence scene
→ lazy on intersection

receipt scene
→ lazy near section
```

Dispose of:

-   geometries,
-   materials,
-   textures,
-   render targets,
-   animation handles.

------------------------------------------------------------------------

# 13. Scroll Scenes

## Scene A --- Hero

Inputs:

``` text
scroll
pointer
viewport size
```

Outputs:

``` text
camera rotation
object rotation
object position
material emission
```

## Scene B --- Sandbox

Outputs:

``` text
camera travel
boundary opacity
packet movement
policy indicator
```

## Scene C --- Evidence

Outputs:

``` text
node spread
graph connections
hash compression
```

## Scene D --- Receipt

Outputs:

``` text
receipt rotation
seal activation
verification animation
```

------------------------------------------------------------------------

# 14. Pointer Interaction

Pointer should affect only selected scenes.

Example:

``` text
small camera parallax
object tilt
```

Limit the effect.

Do not make the entire site move aggressively with the mouse.

------------------------------------------------------------------------

# 15. Verification Demo State

React owns the state.

``` ts
type VerificationState =
  | 'idle'
  | 'parsing'
  | 'hashing'
  | 'signature'
  | 'evidence'
  | 'verified'
  | 'invalid';
```

Anime.js owns the visual transition.

React remains the source of truth.

------------------------------------------------------------------------

# 16. Synthetic Data Model

Use one typed demo object.

``` ts
export const demoRun = {
  id: 'wf_demo_001',
  status: 'passed',
  environment: 'isolated',
  network: 'blocked',
  artifacts: 14,
};
```

Display:

``` text
DEMO ENVIRONMENT
```

where required.

Never scatter fake metrics through JSX.

------------------------------------------------------------------------

# 17. Text Animation

Use `splitText()` for:

-   hero headline,
-   major H2 titles,
-   selected labels.

Preserve an accessible non-split representation. Anime.js documents an
`accessible` option for text splitting that creates an accessible clone
of the original structure. citeturn750947search8

------------------------------------------------------------------------

# 18. Staggering

Use stagger for:

-   code lines,
-   nodes,
-   feature items,
-   verification steps.

Anime.js `stagger()` distributes animation values progressively across
multiple targets. citeturn750947search4

Avoid excessive stagger. It should feel like system sequencing, not a
slideshow.

------------------------------------------------------------------------

# 19. CSS Responsibility

CSS should handle:

-   layout,
-   responsive breakpoints,
-   typography,
-   static states,
-   simple hover transitions,
-   accessibility presentation.

Anime.js should handle:

-   cinematic motion,
-   scroll state,
-   complex sequences.

Three.js should handle:

-   3D rendering,
-   camera,
-   lights,
-   materials,
-   geometry.

------------------------------------------------------------------------

# 20. Performance Budget

Track:

``` text
LCP
INP
CLS
TTFB
JS transfer
WebGL initialization
3D asset weight
```

Rules:

-   first render must not wait on 3D,
-   below-fold scenes load lazily,
-   no unnecessarily large textures,
-   no giant JavaScript bundle for static content,
-   use subpath animation imports where practical.

Anime.js's WAAPI mode is documented as a smaller option for basic
animations, so simple UI transitions can use WAAPI-compatible animation
paths when that reduces client-side work. citeturn121188search5

------------------------------------------------------------------------

# 21. Accessibility Architecture

### Keyboard

Every CTA/button works without pointer motion.

### Reduced motion

Detect:

``` text
prefers-reduced-motion
```

and disable:

-   camera movement,
-   continuous rotation,
-   large parallax,
-   long scroll sequences.

### Screen readers

3D scene:

``` text
aria-hidden="true"
```

when decorative.

Provide semantic text equivalents for meaningful product concepts.

------------------------------------------------------------------------

# 22. SEO Architecture

Next.js Metadata API.

Every page:

``` text
title
description
canonical
openGraph
twitter
```

Generate:

``` text
sitemap.xml
robots.txt
```

Use structured data only for claims the site can substantiate.

------------------------------------------------------------------------

# 23. Forms

Use:

``` text
React Hook Form
Zod
```

Fields:

``` text
name
email
company
role
company size
message
```

States:

``` text
idle
submitting
success
validation error
server error
rate limited
```

Implement server-side validation.

------------------------------------------------------------------------

# 24. Analytics

Create:

``` ts
track(event, properties?)
```

Events:

``` text
hero_cta_click
demo_cta_click
waitlist_submit
verification_start
verification_complete
pricing_view
docs_open
security_open
```

Do not send:

-   source code,
-   private repository names,
-   secrets,
-   arbitrary receipt contents.

------------------------------------------------------------------------

# 25. SEO / Performance and 3D Boundary

Do not put the entire website inside a WebGL canvas.

Preferred structure:

``` text
semantic HTML
   +
CSS layout
   +
selective WebGL scenes
```

The content should remain indexable and accessible.

------------------------------------------------------------------------

# 26. Testing Stack

### Unit

**Vitest**

Test:

-   state machines,
-   content logic,
-   analytics abstraction,
-   utility functions.

### E2E

**Playwright**

Test:

-   navigation,
-   forms,
-   verification interaction,
-   responsive layouts,
-   reduced motion.

### Visual regression

Playwright screenshots at:

``` text
1440
1280
1024
768
390
```

------------------------------------------------------------------------

# 27. Browser Strategy

Support:

-   current Chrome,
-   current Edge,
-   current Firefox,
-   current Safari.

WebGL failure should automatically select the fallback visual.

------------------------------------------------------------------------

# 28. Security

Website:

-   CSP,
-   HSTS,
-   secure headers,
-   HTTPS,
-   dependency scanning,
-   form rate limiting,
-   bot/spam protection.

Do not place any service secrets in client bundles.

------------------------------------------------------------------------

# 29. Deployment

Recommended initial:

**Vercel**

Alternative:

-   Cloudflare,
-   AWS,
-   self-hosted container.

Deployment should remain portable.

------------------------------------------------------------------------

# 30. CI/CD

``` text
PR
 ↓
typecheck
 ↓
lint
 ↓
unit
 ↓
build
 ↓
Playwright
 ↓
visual regression
 ↓
Lighthouse/performance
 ↓
preview
 ↓
production
```

------------------------------------------------------------------------

# 31. Component Ownership

``` text
Hero
 ├── HeroCopy
 ├── HeroScene
 └── HeroActions

HowItWorks
 ├── TimelineSteps
 └── ArchitectureScene

Receipt
 ├── ReceiptCard
 ├── VerificationDemo
 └── VerificationTimeline

Security
 ├── PolicyDisplay
 └── SandboxScene
```

React owns component structure.

Animation code remains in dedicated hooks/utilities.

------------------------------------------------------------------------

# 32. Recommended Package Set

``` text
next
react
react-dom
typescript

tailwindcss

animejs
three
@react-three/fiber
@react-three/drei

zod
react-hook-form

vitest
@playwright/test

lucide-react
```

Use only packages with a clear role.

------------------------------------------------------------------------

# 33. Architecture Rules

### Rule 1

No scroll animation directly coupled to business data.

### Rule 2

React state is source of truth for interaction state.

### Rule 3

3D scenes are isolated from layout components.

### Rule 4

No global 3D canvas that owns the entire page.

### Rule 5

No animation without reduced-motion behavior.

### Rule 6

No synthetic product metrics presented as real.

### Rule 7

No unsupported security claims.

### Rule 8

No animation library competition inside the same component.

------------------------------------------------------------------------

# 34. Implementation Order

## Phase 01 --- Foundation

-   Next.js
-   Tailwind
-   tokens
-   fonts
-   header/footer
-   route structure

## Phase 02 --- Static story

Build all sections without complex animation.

``` text
hero
problem
QA
execution
evidence
receipt
security
use cases
CTA
```

## Phase 03 --- Motion layer

Implement:

-   text reveals,
-   stagger,
-   buttons,
-   section transitions.

## Phase 04 --- 3D

Implement:

-   hero,
-   sandbox,
-   evidence,
-   receipt.

## Phase 05 --- Scroll engine

Add:

-   pinned sections,
-   progress synchronization,
-   camera choreography,
-   transitions.

## Phase 06 --- Production

-   SEO,
-   forms,
-   analytics,
-   accessibility,
-   performance,
-   testing,
-   deployment.

------------------------------------------------------------------------

# 35. Final Technical Model

``` text
                   WORKFLO WEB

             ┌────────────────────┐
             │      Next.js       │
             │  semantic content  │
             └─────────┬──────────┘
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
       React       Anime.js      CSS/Tailwind
      UI/state     timelines     layout/tokens
          │            │
          │            ▼
          │       scroll state
          │            │
          └──────┬─────┘
                 ▼
        React Three Fiber
                 │
                 ▼
              Three.js
                 │
       ┌─────────┼─────────┐
       ▼         ▼         ▼
      Hero    Sandbox   Receipt
       │         │         │
       └─────────┴─────────┘
                 │
                 ▼
         immersive narrative
```

------------------------------------------------------------------------

# 36. Technical North Star

The website should behave like a controlled system:

``` text
scroll
  ↓
timeline
  ↓
scene
  ↓
state
  ↓
evidence
  ↓
verification
```

Not:

``` text
random animations
+
3D decoration
+
generic SaaS template
```

The implementation should make the website feel like Workflo itself:

**controlled, isolated, technical, observable and verifiable.**
