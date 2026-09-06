# AI Quiz App: cross-agent record

## Current state: EPI-1178 release handoff

The later release handoff at the end of this record supersedes earlier
preparation notes that said to keep the worktree uncommitted. Root authorized
the local verified commit; this worker still does not push, deploy, submit
provider forms, or send quiz results.

Current state: read `STATUS.md`. Repository behavior and commands are also documented in `README.md` and `package.json`.

## 2026-09-05: local launch mobile-overflow follow-up

Patrick explicitly approved fixing the quiz locally for launch. The assigned scope is only the ambient hero glow width and its verification. No commit, push, merge, deployment, production edit, or real form submission is authorized. The main website host owns the combined final Claude delivery review; no new plan review is needed.

The main checkout was clean at `e1d01116d4a51381d29d27cff58ed7d6017107a0`; origin/main was fetched and matched it. Work proceeds only in `.worktrees/2026-09-05-quiz-mobile-glow` on `codex/2026-09-05-quiz-mobile-glow`. No project AGENTS, CLAUDE, STATUS, or BRIEF existed, so the minimal instruction/state files were created inside the isolated worktree.

Next: baseline capture, bounded CSS width correction, production build and phone/wide acceptance. Keep the resulting local work uncommitted for the combined delivery review.

## 2026-09-05: local verification complete

The sole rendering change constrains `.ambient-glow::before` with `width: min(600px, 100%)`. The original 600px glow expanded the page to 460px at a 320px viewport and 488px at a 375px viewport, pushing header controls off-screen. Both phone widths now have zero horizontal overflow in Chromium and WebKit, in light and dark themes. Header controls, menu open/close, theme switching/persistence, and entry into the first quiz question passed. No answers, result generation, email capture, or form/API submissions were performed.

Production build and TypeScript checks passed. All 24 before/after browser cases passed and all four wider-screen comparisons were unchanged. The final compiled CSS differs by the width expression alone; every emitted JS chunk is byte-identical to baseline. The first after-build included extra Tailwind classes because verification output was scanned; that rejected build is preserved, and the final build used a verification-folder-only `.gitignore`, with no product config change.

The source patch, hashes, complete browser results, screenshots, and limits are under `.verify/mobile-glow-20260905/`; start with `REPORT.md`. All owned browser/preview processes are closed. Main tracked files and HEAD are unchanged; main has only the newly created `.worktrees/` untracked container. The local change remains uncommitted for the host's combined Claude delivery review. No push, merge, deployment, or production change occurred. Next action belongs to the main website host: review this local artifact together with the main redesign, then follow Patrick's launch approval boundary.


## September5 host review completion

The host completed final Claude delivery22 CLEAN, carrying forward acceptance of this one-line glow fix. Receipt: /Users/epiphanydynamics/epiphany/Epiphany-Dynamics-V2/.worktrees/2026-08-30-ed-homepage-redesign/.verify/magnetic-cursor20/claude-delivery-final22-review.md. The original320px Start-pill edge alignment and changed CSS-dependent JS filename are disclosed; JavaScript bytes are unchanged. No additional product edits or deployment. Worktree remains intact for launch approval.

## September5 global cursor integration

Patrick authorized the global cursor rollout across the website surfaces. In this
quiz worktree, the canonical approved cursor now mounts once at the App.tsx
shell with globalTargets, scopeSelector="body", cursorSize=30,
magneticFactor=0.2, hoverPadding=6, contrastBoost=1, and
blendMode="exclusion". It automatically recognizes links and controls,
preserves native behavior for touch and reduced motion, outlines dense
controls/forms, and excludes the actual full-screen navbar menu through
data-magnetic-exclude. The existing mobile glow repair remains unchanged.

The only dependency additions are gsap@3.15.0 and vecteur@0.3.0. The
component is canonical except for strict-TypeScript non-null assertions needed
for this app's tsc -b check. pnpm typecheck and pnpm build pass.
Chromium/WebKit browser checks pass for 1280px desktop pull/restoration, theme
toggle, excluded menu state, quiz Q1 entry, touch mobile at 320/375px with no
overflow, and reduced-motion with no cursor portal. The existing pnpm lint
script cannot run because eslint is not installed in this app.

Evidence is in .verify/global-cursor-20260905/REPORT.md,
browser-results.json, and source-receipt.json. Preview
http://127.0.0.1:4175/ remains running for the root agent. No forms,
provider submissions, commits, deploys, or production changes occurred.

## September5 final cursor refinement

The final canonical cursor source SHA is
9cff044bd5a6d1e602ab7f97c4cbcc2649b53461a2142f0944d1da788aa326a8. Q
ports it with only three strict-TypeScript non-null assertions. The shell now
passes cursorSize=37.5. The final source retains the contrasting edge during
hover and detach, uses the canonical 120ms dwell, and preserves pointer-release
reset handling so native clicks survive translated-link hover.

Final checks: pnpm typecheck and pnpm build pass; pnpm lint remains unavailable
because eslint is not installed. Chromium and WebKit in light and dark at
1280px each pass 35 semi-fast pointer samples after warm-up with zero hidden
frames, keep edge opacity during hover and first detach, restore translated
footer links, and dispatch a near-edge native click. Theme toggle, excluded
navbar menu, Q1 entry, touch 320/375px no-overflow with zero cursor portals,
and reduced-motion zero cursor portals pass. Preview
http://127.0.0.1:4175/ remains running for the root agent.

No forms, provider submissions, commits, deploys, or production changes
occurred. The final evidence is in
.verify/global-cursor-20260905/{REPORT.md,browser-results.json,source-receipt.json}.

## September6 quiz copy accuracy repair

The rendered result copy and emailed report copy were audited for stale scores,
fragile question counts, unsupported benchmarks, owner pricing, and product
account/privacy promises. Result metadata and email output now use the actual
0–100 display contract. Business and general track descriptions say adaptive
assessment without fixed totals. Percentile, performance, timing, budget,
account, and privacy assurances were replaced with practical workflow tests,
current-terms guidance, and timing based on scope and dependencies. Scoring
weights and the existing 0–100 clamp are unchanged.

Reachability evidence: business raw totals 1–127 and general raw totals 0–125;
the UI clamps these to business 1–100 and general 0–100. JSON parsing, report
template syntax, report HTML acceptance, pnpm typecheck, pnpm build, and git
diff check pass. Lint remains unavailable because eslint is not installed.

## Release handoff

Root explicitly authorized the local commit under EPI-1178 after the copy and
cursor acceptance pass. No push, deployment, provider submission, email, or
quiz-result send occurred here. Root owns the combined Claude review and
conditional release state.
