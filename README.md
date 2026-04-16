# Quiz Maker - Frontend

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

| Variable            | Default                 | Purpose                                                  |
| ------------------- | ----------------------- | -------------------------------------------------------- |
| `VITE_API_BASE_URL` | `http://localhost:4000` | Backend base URL                                         |
| `VITE_API_TOKEN`    | `dev-token`             | Sent as `Authorization: Bearer <token>` on every request |

## Architecture decisions

### Vite + React + TypeScript (SPA)

I picked **Vite** over Next-in-SPA-mode. There's nothing to server-render here (an authenticated tool talking to a local API) and nothing to crawl, so Next's value props don't apply. Vite gives a tighter dev loop and aligns with the spec's "keep scope tight" guidance. The spec also lists Vite first among allowed setups.

### State boundary: Redux Toolkit + TanStack Query v5

- **Redux Toolkit** owns _client/UI_ state — the builder draft, current question index in the player, and anti-cheat counters.
- **TanStack Query v5** owns _server_ state — quiz creation/publish flow, attempt start, answer save, submit, anti-cheat event POSTs.
- I never copy server payloads into Redux. There's a single source of truth per piece of state.

This is what the spec means by "Tanstack Query v5 is required" — it's the right tool for server state and Redux is the right tool for everything else. Keeping them in their lanes avoids the classic "Redux as a database" anti-pattern.

### Module-driven folder structure

Each feature owns its full surface in one folder. Pages and per-page hooks sit at the module root; sub-features get their own sub-folder:

```text
modules/quiz/           # read-only entity module
  quiz.model.ts         # Quiz / Question / QuestionType
  quiz.keys.ts          # query-key factory
  quiz.service.ts       # quizService.{ list, get }
  quiz.query.ts         # useGetQuizQuery, useGetQuizListQuery

modules/form/           # create + update quiz form
  form.model.ts         # draft types (DraftMcq/Short/Question, BuilderDraft)
  form.slice.ts         # Redux slice (draft state + loadFromQuiz)
  form.schema.ts        # zod validation
  form.service.ts       # formService.{ createQuiz, updateQuiz, publishQuiz, addQuestion, updateQuestion, deleteQuestion }
  form.query.ts         # useSaveQuizFlowMutation, useUpdateQuizFlowMutation
  QuizFormPage.tsx
  useQuizForm.ts
  components/

modules/attempt/        # split into player and result sub-features
  attempt.{model,keys,service,query,slice}.ts
  player/               # QuizPlayerPage, useQuizPlayer, useAntiCheat + components
  result/                # QuizResultPage, useQuizResult + components
  utils/parsePrompt.ts

modules/home/           # published quiz list + ID-entry shortcut
  HomePage.tsx
  useHome.ts
  components/
```

Cross-feature reusables live in `src/components/<component>/<Component>.tsx` (one folder per component: `button`, `card`, `text-field`, `text-area`, `spinner`, `layout`, `toast`, `feedback`, `code`).

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

| Path                              | Page                                                    |
| --------------------------------- | ------------------------------------------------------- |
| `/`                               | Home — published-quiz list + quick "enter quiz ID" form |
| `/create-quiz`                    | Create Quiz (shared form UI)                            |
| `/edit-quiz/:id`                  | Edit Quiz (same form UI, pre-filled via `loadFromQuiz`) |
| `/play/:quizId`                   | Quiz Player                                             |
| `/play/:quizId/result/:attemptId` | Result page                                             |

## Update quiz

The home page shows every quiz the backend knows about via `GET /quizzes`. Each card has an edit pencil that routes to `/edit-quiz/:id`, reusing the same `QuizFormPage` as create. The form hydrates from `GET /quizzes/:id`, stamping each draft question with its server id so the save path can do a proper per-question diff:

1. `PATCH /quizzes/:id` — metadata (title, description)
2. Existing questions not present in the draft → `DELETE /questions/:id`
3. Draft questions with a server id → `PATCH /questions/:id`
4. Draft questions without a server id → `POST /quizzes/:id/questions`

On success, both `quizKeys.detail(id)` and `quizKeys.list()` are invalidated so the next visit sees fresh data.

## Out of scope (deliberate)

The spec says "avoid extra features beyond requirements." I've held the line on:

- Deleting quizzes (the backend supports `DELETE` but the spec doesn't call for a UI).
- Time limits (`timeLimitSeconds`).
- The backend's `code` question type (spec only requires MCQ + short).
- Auth UI — token is fixed via `.env`.
- Optimistic cache updates on mutations — straight invalidation is enough at this size.
- Route-level code splitting — noted as future work (bundle is ~1.1 MB, dominated by `react-syntax-highlighter`).

## Tech stack

- React 18, TypeScript (strict), Vite 6
- Redux Toolkit, react-redux
- TanStack Query v5, axios
- React Router v6
- Tailwind CSS v4 (`@tailwindcss/postcss`, theme declared in `src/index.css` via `@theme`), clsx, tailwind-merge v3
- zod (final draft validation before save; the Builder uses controlled Redux state instead of react-hook-form because the form is split across many components and the data is the application state, not a transient form payload)
- react-hot-toast (wrapped under `components/toast`)
- react-icons
- react-syntax-highlighter (Prism)
- vitest (schema, slice, and `parsePrompt` unit tests)

## Iteration notes

A bit of transparency about the git history, which is refactor-heavy:

- The module layout went through several passes — `/ui` primitives were flattened to per-component folders, `pages/`/`hooks/` subfolders were collapsed into module roots, the `CreateQuiz*` identifiers were renamed to `QuizForm*`, and the form data layer was eventually split out of `modules/quiz/` into its own `modules/form/` (quiz is now a read-only entity module; form owns create + update).
- Early in the project I rewrote history once to rename an `AppShell` component to `AppLayout` at the commit it was introduced. That required a `--force-with-lease` push to main. Avoided on every subsequent change.
- After the first pass there was no force push; every later restructure is a normal fast-forward with `git mv` preserving file similarity (visible in `git log --follow`).

If you want the short version of where things landed, read the Architecture section above and open `src/` — both reflect the final state, not the intermediate ones.
