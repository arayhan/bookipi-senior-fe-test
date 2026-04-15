# Quiz Maker — Frontend

A React take-home: build a small quiz, share the ID, take the quiz, see the score with a per-question breakdown and an optional anti-cheat summary. Backend is the provided Node + SQLite service.

## Running locally

Prerequisites: Node 20+ and npm.

```bash
# 1. Install
npm install

# 2. Configure environment (defaults already point at the local backend)
cp .env.example .env

# 3. Start the backend (in the sibling repo)
#    → expects http://localhost:4000 with Bearer dev-token

# 4. Start the frontend
npm run dev          # http://localhost:5173
```

Other scripts:

```bash
npm run typecheck    # tsc -b --noEmit
npm run build        # type-check + production build
npm run preview      # preview the production build
```

Environment variables (`.env`):

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `http://localhost:4000` | Backend base URL |
| `VITE_API_TOKEN` | `dev-token` | Sent as `Authorization: Bearer <token>` on every request |

## Architecture decisions

### Vite + React + TypeScript (SPA)

I picked **Vite** over Next-in-SPA-mode. There's nothing to server-render here (an authenticated tool talking to a local API) and nothing to crawl, so Next's value props don't apply. Vite gives a tighter dev loop and aligns with the spec's "keep scope tight" guidance. The spec also lists Vite first among allowed setups.

### State boundary: Redux Toolkit + TanStack Query v5

- **Redux Toolkit** owns *client/UI* state — the builder draft, current question index in the player, and anti-cheat counters.
- **TanStack Query v5** owns *server* state — quiz creation/publish flow, attempt start, answer save, submit, anti-cheat event POSTs.
- I never copy server payloads into Redux. There's a single source of truth per piece of state.

This is what the spec means by "Tanstack Query v5 is required" — it's the right tool for server state and Redux is the right tool for everything else. Keeping them in their lanes avoids the classic "Redux as a database" anti-pattern.

### Module-driven folder structure

Each feature owns its full surface in one folder:

```text
modules/quiz/
  quiz.model.ts     # types
  quiz.keys.ts      # query-key factory
  quiz.service.ts   # axios calls
  quiz.query.ts     # TanStack Query hooks
  quiz.slice.ts     # Redux slice
  quiz.schema.ts    # zod validation
  components/       # feature-only components
  pages/            # route pages
```

The `attempt` (player) module follows the same shape and adds a `hooks/` folder for the anti-cheat hook and a `utils/` folder for the prompt parser.

Cross-feature reusables live in `src/components` (`ui/`, `code/`, `feedback/`, `layout/`, `toast/`).

### Single error path: axios interceptor → toast

Every API failure is toasted by the response interceptor in `src/services/api-client.ts`. Components don't try/catch, and the TanStack Query `onError` handlers don't double-toast. One pipeline, one source of truth, no duplicates.

### Auto-publish on save

The backend rejects attempts on unpublished quizzes (`isPublished=false`). For a take-home, exposing a separate Save vs. Publish step is a UX wart. The Builder's "Save" button atomically:

1. `POST /quizzes` to create
2. `POST /quizzes/:id/questions` for each question (in declared order)
3. `PATCH /quizzes/:id { isPublished: true }`

In a real product I'd separate Draft from Publish. Trade-off acknowledged.

### Server-trusted grading

Short-answer matching is case-insensitive with whitespace normalization. The backend already does this in `submitAttempt`. I deliberately don't replicate it client-side so there's a single source of truth — the result page renders whatever the server returns.

### Optional code snippets

The backend's `Question` model doesn't have a separate `codeSnippet` column. To keep the contract intact, the Builder appends a fenced code block to the question prompt (` ```\ncode\n``` `). The Player parses fenced code back out and renders it via `react-syntax-highlighter` while showing the plain prompt text on its own.

## Anti-cheat (bonus)

Implemented as designed:

- **Window blur/focus**: a global hook (`useAntiCheat`) attaches `window` blur/focus listeners while an attempt is active. Each event is POSTed to `/attempts/:id/events` with a string name (`tab_blur`, `tab_focus`, `paste`).
- **Paste detection**: short-answer inputs forward their `onPaste` to the same hook, which records and POSTs a `paste` event.
- **Local mirror**: the Redux `attempt` slice keeps counters (`tabSwitches`, `pastes`) so the Result page can show "X tab switches, Y pastes" instantly without an extra round-trip.
- **Server is the audit log**: the counter shown in the UI is for UX immediacy; the authoritative log lives in the backend's `attempt_events` table.

What I deliberately did **not** do: detect dev-tools open, blur signals on each input, or any user-fingerprinting. Those would be extra scope and not requested.

## Routes

| Path | Page |
| --- | --- |
| `/` | Home — entry cards for Builder and Player |
| `/builder` | Quiz Builder |
| `/play` | Quiz ID input |
| `/play/:quizId` | Quiz Player |
| `/play/:quizId/result/:attemptId` | Result page |

## Out of scope (deliberate)

The spec says "avoid extra features beyond requirements." I've held the line on:

- Quiz listing page (`GET /quizzes` exists, but spec UX is "input quizId").
- Editing/deleting quizzes after save.
- Time limits (`timeLimitSeconds`).
- The backend's `code` question type (spec only requires MCQ + short).
- Auth UI — token is fixed via `.env`.
- Tests — happy to add focused vitest coverage for the slice reducers and the prompt parser if asked. Skipped here so the architecture story stays the focal point.

## Tech stack

- React 18, TypeScript (strict), Vite 6
- Redux Toolkit, react-redux
- TanStack Query v5, axios
- React Router v6
- Tailwind CSS v3, clsx, tailwind-merge
- zod (final draft validation before save; the Builder uses controlled Redux state instead of react-hook-form because the form is split across many components and the data is the application state, not a transient form payload)
- react-hot-toast (wrapped under `components/toast`)
- react-icons
- react-syntax-highlighter (Prism)
