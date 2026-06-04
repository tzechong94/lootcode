# lootcode

A static, browser-based platform for self-studying **data structures & algorithms** and getting
interview-ready. The curriculum is split into two sections, both **tutorial-first** with
**interactive concept visualizers** (step through a hash table filling, a binary search halving its
range, BFS expanding in rings, a heap sifting, union-find merging sets):

- **Data Structures** — learn how each structure works, then **implement it yourself**
  (CSPrimer-style): you write a real class (`Stack`, `Queue`, `Deque`, `HashMap`, `LinkedList`,
  `BST`, `Trie`, `MinHeap`, `DSU`) and a scripted **sequence of operations** runs against your
  instance to check it. Then you apply it via the topic's problems. Flow: *Tutorial → Build → Apply*.
- **Algorithms** — first-principles techniques, organized by **family** (Searching, Sorting &
  Divide and Conquer, Two Pointers & Sliding Window, Graph Traversal, Backtracking, Dynamic
  Programming, Greedy, Intervals, Math & Bit), each derived from the problem it solves.

You write **Python or JavaScript**, run it against real tests, and see pass/fail. Everything runs
client-side (Python via Pyodide, JS via a Web Worker), so it deploys as a static site with no backend.

The visualizers are built from a small reusable library (`components/viz/`): a generic `<Stepper>`
(prev/next/play) plus renderers for arrays, grids, trees, linked lists, stacks/queues, hash buckets,
bits, graphs, and timelines. A topic's tutorial is an ordered list of blocks (`{kind:'md'}` /
`{kind:'viz'}`) in its content module — see `lib/types.ts` (`TutorialBlock`, `VizSpec`).

## Curriculum

20 topics, all with reference solutions in both languages.

**Data Structures** (each with an implement-it-yourself build): Arrays & Hashing · Stack ·
Queues & Deques · Linked Lists · Trees · Tries · Heap / Priority Queue · Union-Find.

**Algorithms** (by family): Binary Search · Sorting & Divide and Conquer · Two Pointers ·
Sliding Window · Graphs · Advanced Graphs · Backtracking · 1-D DP · 2-D DP · Greedy · Intervals ·
Math & Bit Manipulation.

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

`npm run verify` is the project's core invariant: **every exercise — problems AND implement-it-
yourself builds — ships reference solutions in both Python and JS that pass its own test suite.** It
runs JS in a Node `vm` and Python via the system `python3` (no browser needed), and exits non-zero if
any reference fails. Requires `python3` on PATH.

## Adding content

1. Create `lib/content/<slug>/index.ts` exporting a `Topic` (see `lib/types.ts` for the schema). A
   topic has a markdown `tutorial`/`blocks`, a `section` (`'data-structure'` | `'algorithm'`, plus a
   `family` for algorithms), optional `implementations`, and a list of `Problem`s.
2. Each `Problem` needs: statement, `functionName`/`starter`/`reference` per language, `tests`
   (`{ input: [...args], expected }`), and optionally `compare` (`'deep'` | `'unordered'` |
   `'unorderedOuter'`), `preamble`, `hints`, and `complexity`.
3. Each `Implementation` (implement-it-yourself build) needs: `statement`, `className`/`starter`/
   `reference` per language, and `tests` — a list of `DsTestCase`s, each an ordered list of `DsOp`s
   (`{ call, args?, expect? }`) run against one fresh instance. Use `methodAliases` to keep method
   names idiomatic per language (e.g. `is_empty` in Python, `isEmpty` in JS). Builds live in a sibling
   `lib/content/<slug>/implement.ts`.
4. Register the topic in `lib/curriculum.ts` (import + add to `TOPICS`).
5. Run `npm run verify` — it must stay green before you commit.

## Project layout

```
app/                     Next.js routes (landing, /topics/[slug]) + global CSS
components/              Sidebar, TopicView, ProblemWorkspace, ImplementWorkspace, CodeEditor, Markdown
lib/
  types.ts               Topic / Problem / Implementation / TestCase / DsOp schema
  curriculum.ts          the manifest (TOPICS + section/family groupings)
  compare.ts             result comparison (deep / unordered / unorderedOuter)
  runners.ts             in-browser execution (runProblem + runImplementation; Web Worker / Pyodide)
  progress.ts            localStorage solved-state + code drafts
  content/<slug>/        one folder per topic (index.ts; implement.ts for DS builds)
scripts/verify.mts       build-time reference checker — problems + implementations (Node + python3)
```

Built autonomously with the `autopilot` skill (`.claude/skills/autopilot/`); see `VISION.md` for the
definition-of-done and build log.
