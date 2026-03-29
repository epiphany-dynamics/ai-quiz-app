# AI Quiz App — Design System
> EPI-217 | Byte | 2026-03-26

## Overview

The AI Quiz App shares its **entire design system** with [epiphany-learn](../epiphany-learn). Same colors, typography, spacing, shadows, gradients, and micro-interaction patterns. Same dopamine-inducing feel, same brand identity.

**Source of truth for the shared system:** `epiphany-learn/tailwind.config.ts` and `epiphany-learn/app/globals.css`.

This doc covers the quiz-specific **extensions** layered on top.

---

## What's Shared (Do Not Diverge)

| Token Group | Values |
|-------------|--------|
| Brand colors | `brand` (Electric Violet `#8b5cf6`) |
| Accent colors | `accent` (Electric Cyan `#06b6d4`) |
| Gamification | `xp` (Gold), `streak` (Orange), `win` (Green), `lose` (Red) |
| Dark surfaces | `surface.*` (#07070e → #222246), `--bg-*` CSS vars |
| Typography | Geist Sans + Geist Mono, same font scale |
| Shadows | `card-dark`, `card-hover`, all `glow-*` variants |
| Gradients | `gradient-brand`, `gradient-hero`, all tier gradients |
| Animations | All keyframes — `fadeInUp`, `popIn`, `bounceIn`, `wrongShake`, etc. |
| Easing | `spring`, `smooth`, `sharp`, `decelerate` |
| Component classes | `.card`, `.btn-*`, `.pill-*`, `.toast-*`, `.xp-bar`, `.skeleton` |

---

## Quiz-Specific Extensions

### 1. Result Tier Colors

Maps to the 4 AI Readiness Score tiers (Track A — Business Owner).

| Tier | Score | Color | CSS Var |
|------|-------|-------|---------|
| AI-Ready Operator | 85–100 | Emerald `#10b981` | `--tier-operator` |
| AI Builder | 65–84 | Cyan `#06b6d4` | `--tier-builder` |
| AI Explorer | 40–64 | Violet `#8b5cf6` | `--tier-explorer` |
| AI Observer | 0–39 | Gray `#9ca3af` | `--tier-observer` |

Each tier also has a `-dim` (background fill) and `-border` variant. CSS classes:
- `.result-card-operator`, `.result-card-builder`, `.result-card-explorer`, `.result-card-observer`
- `.text-gradient-operator`, `.text-gradient-builder`, `.text-gradient-explorer`

Track B (General Public) archetypes reuse the same tier colors — assign at runtime based on archetype category.

---

### 2. Answer Option Cards (`.answer-option`)

Full-width tap targets. Key states:

```
default → hover → selected → [correct | wrong]
```

- **Default:** `--border-default` border, `--bg-card` background
- **Hover:** brand border + `--brand-dim` bg + `-1px` lift
- **Selected:** brand border with 2px glow ring + `answerSelect` spring animation
- **Correct:** `--win` border + green tint bg
- **Wrong:** `--lose` border + red tint bg + `wrongShake` animation
- **Disabled:** 45% opacity, no pointer events

Include `.answer-option-letter` (A/B/C/D badge) inside each option for visual scanning.

---

### 3. Quiz Progress Track

Two options — use based on question count:

**Linear bar** (`.quiz-progress-bar` + `.quiz-progress-fill`):
- 4px tall, `--quiz-progress-fill` color, shimmer overlay
- Set `style={{ width: `${(currentQ / totalQ) * 100}%` }}` on fill div

**Step dots** (`.quiz-step-dots` + `.quiz-step-dot`):
- `.quiz-step-dot-done` → green
- `.quiz-step-dot-active` → brand violet, wider pill shape
- `.quiz-step-dot` (inactive) → muted

Recommendation: use linear bar for 10+ questions, dots for ≤7.

---

### 4. Result Card (`.result-card`)

Large celebratory card at quiz end. Structure:
```html
<div class="result-card result-card-{tier}">
  <div class="result-card-header">
    <!-- tier badge, emoji, tier name -->
  </div>
  <div class="result-card-body">
    <!-- score gauge, description, insight cards -->
  </div>
</div>
```

Score display: `.score-display` (giant number) + `.score-bar` + `.score-bar-fill` (brand→cyan gradient, 1.2s fill animation).

Insight cards (`.insight-card`) stagger in with 80ms delay per card via nth-child CSS.

---

### 5. Share Button (`.share-btn`)

Primary CTA on result screen. Distinguishing features:
- Brand gradient (violet → violet → cyan)
- `sharePulse` animation — continuous subtle glow ring to draw the eye
- Shimmer sweep on hover (CSS `::after`)
- Pauses `sharePulse` animation on hover for clean interaction

Usage:
```tsx
<button className="share-btn">
  <ShareIcon />
  Share My Score
</button>
```

---

### 6. Entry Gate Cards (`.entry-card`)

Used only on Q0 (track selection). Full-width, centered, icon-forward. Stacks vertically on mobile, 2-column on desktop.

---

### 7. Track Badge (`.track-badge`)

Small pill shown during quiz to remind user which path they're on.
- Business: `.track-badge-business` (brand violet)
- General: `.track-badge-general` (accent cyan)

---

## Quiz-Specific Animations

| Name | Usage |
|------|-------|
| `answerSelect` | Spring pop when an answer is tapped |
| `questionEnter` | Slide in from right — new question appears |
| `questionExit` | Slide out to left — old question leaves |
| `scoreFill` | Progress bar width fill on result reveal |
| `scoreCount` | Score number scales in |
| `resultReveal` | Result card entrance (spring bounce) |
| `insightCardIn` | Each insight card fades/slides up |
| `sharePulse` | Share button continuous glow ring |

---

## Typography Usage in Quiz

| Use Case | Class |
|----------|-------|
| Question text | `.question-text` (1.25rem → 1.5rem@sm, 700, tight tracking) |
| Answer options | `font-medium text-base` |
| Result tier label | `text-3xl font-bold` + `.text-gradient-{tier}` |
| Score number | `.score-display` (4rem, 900 weight) |
| Insight card title | `text-base font-semibold` |
| Track badge | `text-xs font-bold uppercase tracking-wider` |

---

## Mobile-First Constraints

- All tap targets: minimum 44×44px (`.tap-target` utility or explicit sizing)
- Answer options: `min-height: 3.25rem`, full width
- `-webkit-tap-highlight-color: transparent` on interactive elements
- `touch-action: manipulation` to prevent 300ms delay
- Safe area insets: `.pb-safe` on bottom of quiz container
- Entry gate cards: single column on mobile (`flex-col`), 2-col on `sm:`

---

## Fonts

Both apps share the same font files via symlinks:
- `ai-quiz-app/app/fonts/GeistVF.woff` → `epiphany-learn/app/fonts/GeistVF.woff`
- `ai-quiz-app/app/fonts/GeistMonoVF.woff` → `epiphany-learn/app/fonts/GeistMonoVF.woff`

No font duplication. If epiphany-learn fonts are updated, quiz app picks them up automatically.
