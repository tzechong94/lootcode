# VISION — DSA Self-Study Platform ("lootcode")

**Status: Full-autopilot build in progress (approved). Building all topics, final review at end.**

### Build progress log
- ✅ M0 Foundation + M1 Arrays & Hashing (3 problems)
- ✅ Two Pointers (3) · Sliding Window (3) · Binary Search (3)
- ✅ Stack (3) · Queues & Deques (3) · Linked Lists (3)
- ✅ Trees (3) · Tries (2) · Heap/PQ (3) · Backtracking (3)
- ✅ Graphs (3) · 1-D DP (4)
- ✅ 2-D DP (4) · Greedy (3) · Intervals (3)
- ✅ Advanced Graphs (3) · Union-Find (3) · Math & Bit (3) · Sorting & D&C (3) — verify 61/61 green
- ✅ ALL 20 roadmap topics built.
- ⏳ Next: back-fills (Stack → Basic Calculator, Linked Lists → Doubly Linked List), then
  final ship-readiness checks (AC-90/91/92: localStorage, build+verify+typecheck+lint, README).
- 🔁 Back-fill into built topics: Stack → Basic Calculator; Linked Lists → Doubly Linked List.

### CSPrimer curriculum integration (per user request, csprimer.com/courses/algorithms)
Fold these problems into the matching topics as they're built:
- Trees: **Process tree** (level-order/BFS)
- Graphs/Advanced Graphs/Backtracking: **Word ladder, Jug pouring, Maze solver, Knight's tour**
- 1-D DP: **House robber, Perfect squares, Staircase ascent (climbing stairs)**
- 2-D DP: **Minimal grid path (min path sum), Edit distance**
- Math & Bit / Greedy: **Convert to Roman, Fizzbuzz sum**
- Sorting & Divide and Conquer (new topic): **Merge sort, Quicksort, Fast exponentiation**
- Binary Search ✅ correct-binary-search · Stack ✅ parenthesis-match · Arrays ✅ finding-duplicates
- To resume: check `lib/curriculum.ts` for built topics; each topic = tutorial + 2–3 problems
  with py+js references; run `npm run verify` (must stay green) then commit.

## Vision

A static, browser-based platform for self-studying data structures & algorithms to get
interview-ready. It is **tutorial-first**: each topic opens with a concise, first-principles
lesson covering the key points you must know, followed by **2–3 problems** to reinforce them.
Each problem has a browser IDE (Monaco) where you write **Python or JavaScript**, run it against
the problem's tests, and see pass/fail. Everything runs client-side — Python via Pyodide (WASM),
JS via a Web Worker — so it deploys as a static site with no backend. Anyone can open it and work
through the curriculum to be ready for coding interviews.

**Non-goals (v1):** large problem banks (2–3 per topic is enough), accounts/auth, a backend,
contest/timed modes, languages beyond Python & JS.

## Core invariant

Every problem ships a **reference solution in both Python and JS that passes its own test suite.**
This is enforced by `npm run verify` (runs each reference solution against its tests using Node
for JS and system `python3` for Python; exits non-zero on any failure). No problem is `done` until
verify is green for it.

## Tech stack

- **Next.js (App Router) + TypeScript**, static export (`output: 'export'`) → deployable to any
  static host.
- **Monaco** editor (client-only).
- **Execution:** Pyodide (Python) + Web Worker (JS), both client-side and sandboxed.
- **Content as data:** typed records — `Topic`, `Tutorial` (markdown), `Problem` (statement,
  constraints, examples, starter + reference code per language, test cases, complexity, hints).
- **Verification:** `npm run verify` (build-time, native runtimes) is the source of truth for the
  core invariant; `npm run build`, typecheck, and lint guard the app itself.

---

## Milestones & acceptance criteria

### Milestone 0 — Foundation
| id | statement | verify | status |
|----|-----------|--------|--------|
| AC-01 | Next.js + TS app scaffolded with static export configured | `npm run build` produces `out/` and exits 0 | **done** |
| AC-02 | Content schema (Topic/Tutorial/Problem types) + curriculum manifest defined | `npm run typecheck` exits 0; manifest imports cleanly | **done** |
| AC-03 | JS execution harness runs a function against test cases in a Web Worker | unit check: sample JS solution passes its tests in-app | **done** `[review]` |
| AC-04 | Python execution harness runs a function against test cases via Pyodide | unit check: sample Python solution passes its tests in-app | **done** `[review]` |
| AC-05 | Generic in-app test runner: loads a problem, runs user code, diffs results, renders pass/fail per case | manual `[review]` + AC-03/04 checks | **done** `[review]` |
| AC-06 | `npm run verify` validates every problem's reference solutions (py+js) against its tests | `npm run verify` exits 0 | **done** |
| AC-07 | App shell: topic sidebar, tutorial pane, problem view, Monaco editor, language switcher (py/js), Run button, results pane | `[review]` (visual) | **done** `[review]` |

### Milestone 1 — Vertical slice: Arrays & Hashing
| id | statement | verify | status |
|----|-----------|--------|--------|
| AC-08 | Arrays & Hashing tutorial written (first-principles, key points, complexity) | `[review]` (prose) | **done** `[review]` |
| AC-09 | 3 problems authored with starter + reference (py+js) + tests | `npm run verify` green for these | **done** |
| AC-10 | Topic renders end-to-end: read tutorial → open problem → solve in both langs → tests pass | `[review]` + verify | **done** `[review]` |

### Milestones 2–18 — Remaining topics (one milestone each)
Each: **tutorial** (first-principles + key points) + **2–3 problems** with reference solutions in
both languages + **`npm run verify` green** + checkpoint pause.

Order: Two Pointers · Sliding Window · Binary Search · Stack · Queues & Deques · Linked Lists ·
Trees · Tries · Heap/Priority Queue · Backtracking · Graphs · Advanced Graphs · 1-D DP · 2-D DP ·
Greedy · Intervals · Math & Bit Manipulation · Union-Find.

Per-topic criteria are templated as: `AC-{topic}-T` (tutorial, `[review]`),
`AC-{topic}-P` (problems + verify green), `AC-{topic}-R` (renders end-to-end, `[review]`).
These get expanded into the ledger as each milestone begins.

### Milestone 19 — Ship-ready
| id | statement | verify | status |
|----|-----------|--------|--------|
| AC-90 | Progress (solved problems) persists in localStorage | `[review]` | todo |
| AC-91 | Full `npm run build` + `npm run verify` + typecheck + lint all green | all four commands exit 0 | todo |
| AC-92 | README with how to run, build, and add content | `[review]` | todo |

---

## Guardrails

- Personal use; problem statements may mirror well-known interview problems (fine per user).
- No pushing, deploying, or publishing without explicit OK. Commit locally per green criterion.
- Checkpoint pause after each milestone (per-topic) for review before continuing.
- Prefer automated checks; `[review]` items are self-assessed and surfaced for user review.

## Ledger

| id | status |
|----|--------|
| AC-01 | done |
| AC-02 | done |
| AC-03 | done [review] |
| AC-04 | done [review] |
| AC-05 | done [review] |
| AC-06 | done |
| AC-07 | done [review] |
| AC-08 | done [review] |
| AC-09 | done |
| AC-10 | done [review] |
| (M2–M18 per-topic ACs expanded as each milestone begins) | — |
| AC-90 | todo |
| AC-91 | todo |
| AC-92 | todo |

## Possible follow-ups (out of scope for this run)
- More problems per topic; difficulty tiers; spaced-repetition review scheduling.
- More languages; timed/mock-interview mode; accounts & cloud progress sync.
