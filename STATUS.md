# Local quiz launch preparation

Status: local implementation and acceptance complete; commit authorized under EPI-1178 and not deployed. Owner: Codex, delegated from the main Epiphany Dynamics redesign task.

The sole rendered-source change is `.ambient-glow::before` width from `600px` to `min(600px, 100%)` in `src/styles/globals.css`. It removes mobile horizontal overflow while preserving the existing 600px wider-screen glow.

Build and typecheck: PASS. Chromium and WebKit, 320/375/1280px, light/dark: 24/24 before/after cases passed. Original phone overflow was reproduced in all eight baseline cases. Corrected phone header, menu, theme persistence, first-question entry, and horizontal bounds passed. All four desktop geometry/style comparisons were unchanged. Final compiled CSS differs only by the width expression; all four JS chunks are byte-identical.

Evidence: `.verify/mobile-glow-20260905/REPORT.md`, `source.patch`, `source-receipt.json`, `build-integrity-receipt.json`, `acceptance-summary.json`, `browser-results.json`, build/typecheck logs, and 24 screenshots. The rejected first after-build is preserved as `initial-after-dist`; the final build excludes only local verification artifacts using `.verify/.gitignore`. No product config change.

All owned browser and loopback preview processes are closed. Fresh browser contexts blocked service workers and all external analytics requests; no real form/API submissions or physical-device testing occurred.

Main tracked files and HEAD remain unchanged at the time of this historical
snapshot. Its only new untracked item is the `.worktrees/` container for this
task. No deployment or production change occurred. The host completed the
actual final Claude delivery22 review: CLEAN, carrying forward the accepted
quiz fix. The later EPI-1178 release handoff below supersedes this snapshot's
uncommitted state.

The existing Start navigation pill is flush to the right edge at320px because the original navigation removes its narrow-screen gutter. This predates the glow fix and remains an owner-visible layout note, not a regression or a claimed repair. JavaScript bytes are unchanged; the CSS-dependent entry filename differs.

## Global cursor integration

The canonical approved cursor is mounted once at src/App.tsx and scopes
ordinary links/buttons to body. Props are globalTargets, cursorSize=37.5,
magneticFactor=0.2, hoverPadding=6, contrastBoost=1, and
blendMode=exclusion. The navbar's actual full-screen menu container is
excluded with data-magnetic-exclude; no broad selector suppression was added.
Only gsap@3.15.0 and vecteur@0.3.0 were added.

Focused acceptance passed: pnpm typecheck, pnpm build, Chromium/WebKit
desktop link pull and restoration, theme toggle, menu exclusion, quiz Q1
entry, near-edge native click, touch mobile at 320/375px with zero cursor portals and no horizontal
overflow, and reduced-motion desktop with zero cursor portals. pnpm lint
remains unavailable because eslint is not installed. Evidence:
.verify/global-cursor-20260905/REPORT.md,
.verify/global-cursor-20260905/browser-results.json, and
.verify/global-cursor-20260905/source-receipt.json.

The final canonical source keeps the contrasting edge visible during hover and
the first detach frame, uses a 120ms dwell, and adds pointer-release/reset
handling. After warm-up, Chromium and WebKit in both themes each passed 35
semi-fast pointer samples with zero hidden frames. A near-edge translated-link
click dispatched the native click event without navigation.

Preview http://127.0.0.1:4175/ remains running for root's combined Claude
review. No email, provider, deployment, or production action occurred. Root
owns final reviewed release under EPI-1178.

## Quiz copy accuracy repair

The rendered result metadata and emailed report now describe scores on the
actual 0–100 display scale. Business and general track descriptions no longer
promise fragile question totals. Unsupported percentile, performance, timing,
budget, account, and privacy claims were replaced with practical next steps:
test a small workflow, review current tool terms, and set review timing around
scope and dependencies. The same changes are mirrored in `content/report-copy.md`
and `api/report-templates.js`; scoring weights and the existing clamp are
unchanged.

Validation: all content JSON parses; report template syntax passes; report HTML
acceptance passes for business and general examples with `out of 100` and no
retired claims; pnpm typecheck and pnpm build pass. Raw reachable totals remain
business 1–127 and general 0–125 before clamping to the displayed 0–100 range.
Lint remains a known baseline failure because eslint is not installed.

## Release handoff

Root explicitly authorized the local commit for EPI-1178 after this acceptance
pass. This worker will not push, deploy, submit provider forms, or send quiz
results; root owns the reviewed conditional release and exact delivery state.
