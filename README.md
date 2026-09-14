# AI Readiness Quiz

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A three minute interactive quiz that scores how ready a person is to use AI, either for a business or for themselves, and returns a shareable result.

Built by [Epiphany Dynamics](https://epiphanydynamics.ai). The canonical URL and Open Graph tags in `index.html` point at `quiz.epiphanydynamics.ai`.

## Why this exists

People hear about AI constantly but have no quick way to tell where they actually stand. This quiz gives one honest score in about three minutes, with the questions chosen from the visitor's own answers instead of a single fixed form.

## Quickstart

Requires Node 22 or newer and pnpm. `pnpm-lock.yaml` is the committed lockfile.

```bash
pnpm install
pnpm dev
```

Open <http://localhost:5173>, click Start the Quiz, answer the entry question to pick the business or personal track, and finish the track. The results screen appears as soon as the last question is answered.

Optional environment. Copy the names below into `.env.local` to turn on result storage:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Without them `src/lib/supabase.ts` exports a null client and the quiz still runs end to end. Results and captured emails are simply not saved. The email report function `api/submit-email.js` reads `RESEND_API_KEY` from the hosting environment.

Other commands:

| Command | Action |
| --- | --- |
| `pnpm build` | Production build. |
| `pnpm typecheck` | TypeScript check across the app. |
| `pnpm preview` | Serve the build locally. |

## How it works

The app is a client side React single page app. All quiz content is static JSON, and branching happens in the browser.

- `src/data/index.ts` holds the entry gate question (id `Q0`), which routes a visitor to the business track or the general track, then lazy loads the matching file from `content/`.
- `src/lib/quiz-engine.ts` picks the next question from `show_if` conditions, so a visitor only sees questions that follow from answers they already gave.
- `src/context/QuizContext.tsx` keeps the session in a reducer and moves through four phases: landing, quiz, calculating, results.
- `src/lib/supabase.ts` writes the finished result and any captured email to Supabase. Both calls are optional and non blocking, so a failed write is logged and the visitor still gets the result.
- `src/components/results/SharePanel.tsx` builds a `?r=&s=&t=` link and `src/hooks/useSharedResult.ts` reads it back, so a result can be shared without an account. The PWA service worker caches the app shell after a first visit.

Content that drives the two tracks lives in `content/questions-business.json`, `content/questions-general.json`, and `content/results.json` for the tier copy.

## Tests

Tests: none yet. The checks that exist today are `pnpm typecheck` and `pnpm build`.

## Roadmap and known limits

- `pnpm lint` is declared in `package.json` but ESLint is not a dependency, so it fails on a clean install.
- Supabase storage and email capture are opt in through environment variables, so a local run without them exercises the interface only.
- Shared result links carry the score in the query string, so anyone holding the link can read it.
- Repo root notes such as `STATUS.md`, `DESIGN-SYSTEM.md`, and `.ralphrc` describe past tooling sessions. They are not part of the runtime.

## License

MIT (see LICENSE).
