# lootcode

A static, browser-based platform for self-studying **data structures & algorithms** and getting
interview-ready. It's **tutorial-first**: each topic opens with a first-principles lesson — prose
interleaved with **interactive concept visualizers** (step through a hash table filling, a binary
search halving its range, BFS expanding in rings, a heap sifting, union-find merging sets) — then a
few problems you solve in an in-browser editor: write **Python or JavaScript**, run it against real
tests, and see pass/fail. Everything runs client-side (Python via Pyodide, JS via a Web Worker), so
it deploys as a static site with no backend.

The visualizers are built from a small reusable library (`components/viz/`): a generic `<Stepper>`
(prev/next/play) plus renderers for arrays, grids, trees, linked lists, stacks/queues, hash buckets,
bits, graphs, and timelines. A topic's tutorial is an ordered list of blocks (`{kind:'md'}` /
`{kind:'viz'}`) in its content module — see `lib/types.ts` (`TutorialBlock`, `VizSpec`).

## Curriculum

20 topics, ~63 problems, each with reference solutions in both languages:

Arrays & Hashing · Two Pointers · Sliding Window · Binary Search · Sorting & Divide and Conquer ·
Stack · Queues & Deques · Linked Lists · Trees · Tries · Heap / Priority Queue · Backtracking ·
Graphs · Advanced Graphs · 1-D DP · 2-D DP · Greedy · Intervals · Math & Bit Manipulation ·
Union-Find.

## Tech stack

- **Next.js (App Router) + TypeScript**, static export (`output: 'export'`).
- **Monaco** editor (the VS Code editor), client-side only.
- **Execution:** Python via **Pyodide** (WASM, loaded from CDN on first Python run); JavaScript via a
  sandboxed **Web Worker**.
- **Content as data:** each topic/problem is a typed record under `lib/content/`; no CMS, no database.
- Progress (solved problems) and per-problem code drafts persist in **localStorage**.

## Run it

```bash
npm install        # uses the public npm registry (see .npmrc)
npm run dev        # http://localhost:3000
```

> Note: `npm run dev` writes to `.next`. Don't run `npm run build` while `dev` is running, or the
> dev server's chunks get overwritten and assets 404 — stop dev first.

## Build & verify

```bash
npm run build      # static export to ./out (deploy this anywhere static)
npm run verify     # runs EVERY problem's reference solution against its tests, in Node + python3
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
```

`npm run verify` is the project's core invariant: **every problem ships reference solutions in both
Python and JS that pass its own test suite.** It runs JS in a Node `vm` and Python via the system
`python3` (no browser needed), and exits non-zero if any reference fails. Requires `python3` on PATH.

## Adding content

1. Create `lib/content/<slug>/index.ts` exporting a `Topic` (see `lib/types.ts` for the schema).
   A topic has a markdown `tutorial` and a list of `Problem`s.
2. Each `Problem` needs: statement, `functionName`/`starter`/`reference` per language, `tests`
   (`{ input: [...args], expected }`), and optionally `compare` (`'deep'` | `'unordered'` |
   `'unorderedOuter'`), `preamble` (helper code injected before user code, e.g. a `ListNode`/`DSU`
   class), `hints`, and `complexity`.
3. Register the topic in `lib/curriculum.ts` (import + add to `TOPICS`; add its title to `ROADMAP`).
4. Run `npm run verify` — it must stay green before you commit.

## Project layout

```
app/                     Next.js routes (landing, /topics/[slug]) + global CSS
components/              Sidebar, TopicView, ProblemWorkspace, CodeEditor, Markdown
lib/
  types.ts               Topic / Problem / TestCase schema
  curriculum.ts          the manifest (TOPICS + ROADMAP)
  compare.ts             result comparison (deep / unordered / unorderedOuter)
  runners.ts             in-browser execution (Web Worker for JS, Pyodide for Python)
  progress.ts            localStorage solved-state + code drafts
  content/<slug>/        one folder per topic
scripts/verify.mts       build-time reference-solution checker (Node + python3)
```

Built autonomously with the `autopilot` skill (`.claude/skills/autopilot/`); see `VISION.md` for the
definition-of-done and build log.
