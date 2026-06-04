# VISION — lootcode

## Phase 1 — Platform ✅ COMPLETE
Static Next.js DSA platform: 20 topics, 63 problems, dual-language (Python/JS) in-browser IDE,
`npm run verify` 63/63 green, build/typecheck/lint green. (See git history for the Phase 1 build log.)

---

## Phase 2 — Tutorial Overhaul (current)

**Status: ✅ COMPLETE — all 20 topics interactive. verify 63/63 · typecheck · lint · build all green. Awaiting final review.**

### Build progress
- ✅ T-01 schema · T-02 Stepper + array/grid renderers · T-03 hash renderer (others built per-topic on demand)
- ✅ T-04 pilot: arrays-hashing + two-pointers rebuilt (first-principles prose + interactive concept viz)
- ✅ Interactive done (20/20): ALL topics — incl. sorting-divide-conquer, intervals, math-bit, union-find.
- Renderers built: array, grid, hash, tree, list, stack/queue, bits, graph, interval (full library complete).

### User-requested content additions (fold in as topics are built)
- ✅ Arrays & Hashing: deeper **collision** handling (chaining vs open addressing, good hash fn, load factor & resizing).
- ⏳ Linked Lists: explicit **array vs linked list** comparison — contiguous memory + O(1) index vs scattered
  nodes + pointers + O(1) splice. Include a memory-layout concept visualizer.

### Vision
Today's tutorials read like a crash course for solving the problems. Rebuild them to **teach from
first principles**: explain *why* each structure/technique exists, build intuition before mechanics,
and make every topic genuinely clearer for a self-learner. Crucially, add **interactive concept
visualizers** — step-through diagrams that teach the *topic's core mechanic generically*, NOT a
specific problem's solution. Examples: watch keys hash into buckets (Arrays & Hashing); watch the
search space halve (Binary Search); watch BFS expand in rings vs DFS dive deep (Graphs); watch a
heap sift up on insert and sift down on pop (Heap); watch union-find merge sets and compress paths
(Union-Find). The learner advances frame by frame to build intuition about the *idea*. Every one of
the 20 topics gets this treatment.

### Approach (technical)
- Extend the `Topic` schema with an optional structured tutorial: an ordered list of **blocks**,
  each either `{ kind: 'md', md }` (prose) or `{ kind: 'viz', spec }` (an interactive diagram).
  Topics without blocks fall back to today's markdown string, so migration is topic-by-topic.
- Build a reusable **`<Stepper>`** (prev / next / play-pause over a list of frames + a caption per
  frame) plus per-data-structure renderers: **array** (cells + named pointers + window/highlights),
  **grid**, **tree**, **linked list**, **stack/queue**, **hash map**, **bits**, **recursion tree**.
- Each topic authors a few frame sequences as typed data (type-checked, build-verified).

### Definition of done
All 20 topics have rewritten first-principles prose **and** at least one interactive diagram; the
app builds clean and `verify`/`typecheck`/`lint` stay green.

### Milestones & acceptance criteria

#### M-T0 — Interactive tutorial framework
| id | statement | verify | status |
|----|-----------|--------|--------|
| T-01 | Schema: tutorial blocks (md + viz) + VizSpec union added to `lib/types.ts`; TopicView renders blocks, falls back to markdown | `npm run typecheck` + `npm run build` green | todo |
| T-02 | `<Stepper>` (prev/next/play + caption) + array & grid renderers built and styled | build green + `[review]` | todo |
| T-03 | Tree, linked-list, stack/queue, hash-map, bits, recursion-tree renderers built | build green + `[review]` | todo |
| T-04 | Pilot: Arrays & Hashing + Two Pointers tutorials rebuilt (deeper prose + interactive **concept** visualizer per topic) | build green + `[review]` | todo |

#### M-T1 … M-T20 — Per-topic overhaul (full autopilot, no per-topic pause)
For every topic: rewrite prose to true first-principles depth + embed ≥1 interactive **concept
visualizer** that teaches the topic's core mechanic *generically* (not tied to a specific problem).
Per-topic AC `T-<slug>`: verify = `npm run build` green (+ typecheck/lint) and `[review]` for prose/viz quality.
Topics: arrays-hashing, two-pointers, sliding-window, binary-search, sorting-divide-conquer, stack,
queues-deques, linked-lists, trees, tries, heap-priority-queue, backtracking, graphs, advanced-graphs,
dp-1d, dp-2d, greedy, intervals, math-bit, union-find. (arrays-hashing + two-pointers done in T-04.)

#### M-T-final — Ship
| id | statement | verify | status |
|----|-----------|--------|--------|
| T-99 | Full `npm run build` + `npm run verify` + typecheck + lint green; README mentions interactive tutorials | all commands exit 0 | todo |

### Process note (avoid breaking the live dev server)
`next dev` and `next build` share `.next`; running `build` while `dev` is up wipes the dev server's
chunks → assets 404 → unstyled page. **During loop iterations verify with `npm run typecheck` +
`npm run lint` only** (they don't touch `.next`). Run the full `npm run build` ONLY at the final ship
check, with the dev server stopped.

### Guardrails
- Problems, tests, and the `verify` invariant (63/63) must stay green — this phase touches tutorials/UI only.
- No pushing/deploying without explicit OK. Commit per topic.
- Full autopilot: no per-topic pause; stop only if blocked or done (user requested "until all is done").
- Prefer automated checks (build/typecheck/lint); prose & diagram quality are `[review]`, self-assessed and flagged.

### Ledger
| id | status |
|----|--------|
| T-01 | todo |
| T-02 | todo |
| T-03 | todo |
| T-04 | todo |
| per-topic T-<slug> (18 remaining after pilot) | todo |
| T-99 | todo |

### Possible follow-ups (out of scope)
- User-editable inputs that drive the visualization live; animated auto-play with speed control;
  complexity-curve charts; per-step pseudocode highlighting synced to the diagram.

---

## Phase 3 — Data Structures ⟂ Algorithms (current)

**Status: 🚧 IN PROGRESS (autopilot). Started 2026-06-04.**

### Vision
Go further first-principles by **separating data structures from algorithms** into two distinct
sections, each with the format/aesthetic of the current site.

- **Data Structures** — for each structure (stack, queue/deque, linked list, hash map, tree, trie,
  heap, union-find) the learner reads a short "how it's built" tutorial and then **implements the
  structure themselves** (CSPrimer-style): they write a real class with its methods, and a scripted
  **sequence of operations** runs against their implementation to check it. After building it, they
  **apply** it via the topic's existing problems. Flow per DS topic: *Tutorial → Implement → Apply*.
- **Algorithms** — first-principles, **categorized by family** (Searching, Sorting & Divide and
  Conquer, Two Pointers & Sliding Window, Graph Traversal, Backtracking, Dynamic Programming,
  Greedy, Intervals, Math & Bit). Each topic derives the technique from the problem it solves.

### Approach (technical)
- Add `section: 'data-structure' | 'algorithm'` to every `Topic`, plus `family` for algorithm topics.
  Navigation (landing + sidebar) groups by section; algorithms sub-grouped by family.
- New exercise type `Implementation` on DS topics: a class the learner writes, verified by
  `DsTestCase`s — each an ordered list of `DsOp` (`{ call, args?, expect? }`) run against one fresh
  instance. Dual-language (Python class / JS class), same in-browser run + the `verify` invariant.
- New `runImplementation` runner (JS Web Worker + Pyodide op-sequence) and `verify.mts` extension so
  every implementation's reference solution is build-gated exactly like problems.
- New `ImplementWorkspace` UI mirroring `ProblemWorkspace`; `TopicView` shows Tutorial → Implement(s)
  → Problems tabs. Reuses Monaco editor, progress (localStorage), results pane.

### Section mapping (reorganize the existing 20 in place)
- **Data Structures (8):** arrays-hashing, stack, queues-deques, linked-lists, trees, tries,
  heap-priority-queue, union-find. Each gets ≥1 implement-it-yourself exercise; existing problems kept as "Apply".
- **Algorithms (12):** binary-search (Searching); sorting-divide-conquer (Sorting & D&C);
  two-pointers + sliding-window (Two Pointers & Sliding Window); graphs + advanced-graphs (Graph
  Traversal); backtracking (Backtracking); dp-1d + dp-2d (Dynamic Programming); greedy (Greedy);
  intervals (Intervals); math-bit (Math & Bit).

### Guardrails
- Existing problems, tests, and the `verify` invariant must stay green — additive + reorganizing only.
- Implementations are build-gated: every `Implementation.reference` must pass its op-sequence tests in BOTH languages (`npm run verify`).
- Dual-language parity: every implementation ships Python AND JS starter + reference.
- No pushing/deploying without explicit OK. Commit per green criterion.
- Full autopilot: no per-milestone pause unless blocked; user requested unattended completion.
- Avoid `npm run build` while `next dev` runs (shared `.next`) — verify per-iteration with typecheck + lint; full build only at ship.

### Milestones & acceptance criteria

#### M3-A — Sections & navigation
| id | statement | verify | status |
|----|-----------|--------|--------|
| P3-01 | `Topic` gains `section` + optional `family`; all 20 topics tagged; curriculum exposes section/family groupings | `npm run typecheck` green | todo |
| P3-02 | Landing page + sidebar render two sections (Data Structures, Algorithms by family) keeping current aesthetic | typecheck + lint green + `[review]` | todo |

#### M3-B — Implement-it-yourself harness
| id | statement | verify | status |
|----|-----------|--------|--------|
| P3-03 | Schema: `Implementation` + `DsTestCase` + `DsOp` types added to `lib/types.ts`; `Topic.implementations?` | typecheck green | todo |
| P3-04 | `runImplementation` (JS worker + Pyodide op-sequence) in `lib/runners.ts` | typecheck green | todo |
| P3-05 | `verify.mts` extended: every `Implementation.reference` runs its op-sequence in JS + Py; exits non-zero on failure | `npm run verify` green incl. impls | todo |
| P3-06 | `ImplementWorkspace` UI + `TopicView` shows Tutorial → Implement(s) → Problems | typecheck + lint green + `[review]` | todo |
| P3-07 | Pilot: Stack implementation authored (class + ops), reference passes verify in both languages | `npm run verify` green | todo |

#### M3-C — Data Structures: implement exercises for all DS topics
Per DS topic, author one implement-it-yourself exercise with a passing dual-language reference + a
short "how it's built" tutorial framing. AC `P3-ds-<slug>`: verify = `npm run verify` green for that impl.
| id | structure | verify | status |
|----|-----------|--------|--------|
| P3-08 | arrays-hashing → HashMap (chaining, put/get/remove/keys) | verify green | todo |
| P3-09 | queues-deques → Queue + Deque (ring buffer) | verify green | todo |
| P3-10 | linked-lists → LinkedList (push/pop/insert/remove/get) | verify green | todo |
| P3-11 | trees → BST (insert/contains/inorder/min) | verify green | todo |
| P3-12 | tries → Trie (insert/search/startsWith) | verify green | todo |
| P3-13 | heap-priority-queue → MinHeap (push/pop/peek) | verify green | todo |
| P3-14 | union-find → DSU (find/union/connected with path compression) | verify green | todo |

#### M3-D — Algorithms: first-principles by family
| id | statement | verify | status |
|----|-----------|--------|--------|
| P3-15 | Every algorithm topic assigned a family; algorithms shown grouped by family | typecheck + lint green + `[review]` | todo |
| P3-16 | Each algorithm topic opens by deriving the technique from first principles (fill any gaps) | `[review]` | todo |

#### M3-E — Ship
| id | statement | verify | status |
|----|-----------|--------|--------|
| P3-99 | Full `npm run verify` (problems + implementations) + typecheck + lint + build all green; README + VISION updated to describe the DS/Algo split + implement-it-yourself | all commands exit 0 | todo |

### Ledger
| id | status |
|----|--------|
| P3-01 | todo |
| P3-02 | todo |
| P3-03 | todo |
| P3-04 | todo |
| P3-05 | todo |
| P3-06 | todo |
| P3-07 | todo |
| P3-08 | todo |
| P3-09 | todo |
| P3-10 | todo |
| P3-11 | todo |
| P3-12 | todo |
| P3-13 | todo |
| P3-14 | todo |
| P3-15 | todo |
| P3-16 | todo |
| P3-99 | todo |

### Possible follow-ups (Phase 3, out of scope)
- Animated step-through of the learner's own structure as ops run; complexity self-check per method;
  "stress test" mode (randomized op sequences); visual diff of expected vs actual instance state.
