# VISION — lootcode

## Phase 1 — Platform ✅ COMPLETE
Static Next.js DSA platform: 20 topics, 63 problems, dual-language (Python/JS) in-browser IDE,
`npm run verify` 63/63 green, build/typecheck/lint green. (See git history for the Phase 1 build log.)

---

## Phase 2 — Tutorial Overhaul (current)

**Status: APPROVED — building. Framework + pilot (Arrays & Hashing, Two Pointers) done; grinding remaining 18 topics.**

### Build progress
- ✅ T-01 schema · T-02 Stepper + array/grid renderers · T-03 hash renderer (others built per-topic on demand)
- ✅ T-04 pilot: arrays-hashing + two-pointers rebuilt (first-principles prose + interactive concept viz)
- ⏳ Remaining 18 topics: sliding-window, binary-search, sorting-divide-conquer, stack, queues-deques,
  linked-lists, trees, tries, heap-priority-queue, backtracking, graphs, advanced-graphs, dp-1d, dp-2d,
  greedy, intervals, math-bit, union-find. Build renderer if missing, then rewrite prose + add concept viz.
- Renderers built: array, grid, hash. Still to build as topics need them: tree, list, stack/queue, bits, graph, interval.

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
