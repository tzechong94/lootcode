// Core content schema for lootcode.
// Everything is plain serializable data so the same records can be consumed by
// the Next.js app (in-browser) and the build-time `npm run verify` script (Node).

export type Lang = 'py' | 'js';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

/** How a test's actual output is compared against `expected`. */
export type CompareMode =
  | 'deep' // strict deep equality (default)
  | 'unordered' // deep equality after recursively sorting arrays (fully order-insensitive)
  | 'unorderedOuter'; // top-level array order-insensitive, but inner elements compared as-is

export interface TestCase {
  /** Positional arguments passed to the solution function. */
  input: unknown[];
  expected: unknown;
  /** Optional human label shown in the results pane. */
  name?: string;
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

/** A labelled alternative reference solution (see `Problem.alternates`). */
export interface AltReference {
  /** Short name for the approach, e.g. 'Recursive (memoized)'. */
  label: string;
  code: Record<Lang, string>;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  topicSlug: string;
  /** Markdown problem statement. */
  statement: string;
  constraints?: string[];
  examples?: Example[];
  /** Function the harness invokes, per language (py: snake_case, js: camelCase). */
  functionName: Record<Lang, string>;
  /**
   * Optional helper code prepended before user/reference code in every execution
   * path (e.g. a ListNode/TreeNode class + array<->structure builders). Lets the
   * solution function take/return plain JSON while still working with real nodes.
   */
  preamble?: Partial<Record<Lang, string>>;
  /** Editor starting code, per language. */
  starter: Record<Lang, string>;
  /** Reference solution that MUST pass `tests`, per language. */
  reference: Record<Lang, string>;
  /**
   * Names the primary `reference` when `alternates` are present (e.g. 'Iterative').
   * Ignored when there are no alternates.
   */
  referenceLabel?: string;
  /**
   * Further reference solutions taking a different approach to the same problem, e.g.
   * the recursive counterpart to an iterative primary. Each one must also pass `tests`
   * in both languages: `npm run verify` checks them exactly like `reference`.
   */
  alternates?: AltReference[];
  tests: TestCase[];
  compare?: CompareMode;
  hints?: string[];
  complexity?: { time: string; space: string };
}

/** Top-level division of the curriculum. */
export type Section = 'data-structure' | 'algorithm' | 'csprimer';

/**
 * Family an algorithm topic belongs to (for grouping the Algorithms section).
 * Data-structure topics leave this undefined.
 */
export type AlgoFamily =
  | 'Searching'
  | 'Sorting & Divide and Conquer'
  | 'Two Pointers & Sliding Window'
  | 'Graph Traversal'
  | 'Backtracking'
  | 'Dynamic Programming'
  | 'Greedy'
  | 'Intervals'
  | 'Math & Bit';

export interface Topic {
  slug: string;
  title: string;
  order: number;
  /** Which half of the curriculum this topic lives in. */
  section: Section;
  /** For `section: 'algorithm'` topics — the family they group under. */
  family?: AlgoFamily;
  /** One-line description for the sidebar / landing page. */
  blurb: string;
  /** Markdown tutorial: first-principles explanation + key points. */
  tutorial: string;
  /**
   * Optional structured tutorial: an ordered list of prose + interactive concept
   * visualizers. When present, rendered instead of `tutorial`. Lets topics migrate
   * to the interactive format one at a time.
   */
  blocks?: TutorialBlock[];
  /**
   * For data-structure topics: "implement the structure yourself" exercises.
   * The learner writes a class; a scripted sequence of operations checks it.
   */
  implementations?: Implementation[];
  problems: Problem[];
}

// ===== Implement-it-yourself exercises (data structures) =====
// A learner writes a real class (e.g. Stack) and a scripted sequence of operations
// runs against one fresh instance, optionally asserting the return of each call.

/** One step in an op-sequence: construct (`call: 'new'`) or invoke a method. */
export interface DsOp {
  /** Method name to call, or `'new'` to (re)construct the instance with `args`. */
  call: string;
  /** Positional arguments for the call. */
  args?: unknown[];
  /** When present, the call's return value is compared against this (omit for void ops like push). */
  expect?: unknown;
}

/** An ordered list of ops run against a single fresh instance. */
export interface DsTestCase {
  /** Optional human label shown in the results pane. */
  name?: string;
  ops: DsOp[];
}

/** "Implement this data structure" exercise. */
export interface Implementation {
  id: string;
  title: string;
  /** Markdown brief: what to build and the method contracts. */
  statement: string;
  /** Optional method reference shown in the UI (name + signature + one-line contract). */
  methods?: { name: string; sig: string; doc: string }[];
  /** Class the harness instantiates, per language (e.g. { py: 'Stack', js: 'Stack' }). */
  className: Record<Lang, string>;
  /**
   * Per-language method-name overrides so each language stays idiomatic while op
   * sequences use one canonical name. Maps canonical op name → real method name.
   * E.g. `{ py: { isEmpty: 'is_empty', pushFront: 'push_front' } }`. The `'new'`
   * op is never aliased. Unmapped names are used as-is.
   */
  methodAliases?: Partial<Record<Lang, Record<string, string>>>;
  /** Optional helper code prepended before user/reference code in every execution path. */
  preamble?: Partial<Record<Lang, string>>;
  /** Editor starting code (class skeleton), per language. */
  starter: Record<Lang, string>;
  /** Reference implementation that MUST pass `tests`, per language. */
  reference: Record<Lang, string>;
  tests: DsTestCase[];
  /** How each op's return value is compared (default 'deep'). */
  compare?: CompareMode;
  hints?: string[];
  complexity?: { time: string; space: string };
}

// ===== Interactive tutorial blocks =====
// A tutorial is prose interleaved with step-through "concept visualizers" that teach
// a topic's core mechanic generically (not a specific problem). Each visualizer is a
// list of frames the learner advances through; each frame carries a caption.

export interface MdBlock {
  kind: 'md';
  md: string;
}
export interface VizBlock {
  kind: 'viz';
  spec: VizSpec;
}
export type TutorialBlock = MdBlock | VizBlock;

export type VizSpec =
  | ArrayViz
  | GridViz
  | TreeViz
  | ListViz
  | StackViz
  | HashViz
  | BitsViz
  | GraphViz
  | IntervalViz;

export type CellState = 'active' | 'compare' | 'match' | 'done' | 'window' | 'dim' | 'eliminated';
export interface Pointer {
  name: string;
  index: number;
}

/** Row of cells with named pointers — arrays, two pointers, sliding window, binary search, DP table, bits-as-cells. */
export interface ArrayFrame {
  caption: string;
  cells: { value: string | number; state?: CellState }[];
  pointers?: Pointer[];
}
export interface ArrayViz {
  type: 'array';
  title?: string;
  frames: ArrayFrame[];
}

export type GridState = 'active' | 'visited' | 'frontier' | 'wall' | 'start' | 'end' | 'path' | 'dim';
export interface GridFrame {
  caption: string;
  grid: { value?: string | number; state?: GridState }[][];
}
export interface GridViz {
  type: 'grid';
  title?: string;
  frames: GridFrame[];
}

/** Binary tree laid out from a level-order array; frames highlight node indices. */
export interface TreeFrame {
  caption: string;
  /** Override the node values for this frame (e.g. heap sift swapping values). */
  nodes?: (number | string | null)[];
  active?: number[];
  visited?: number[];
  faded?: number[];
}
export interface TreeViz {
  type: 'tree';
  title?: string;
  nodes: (number | string | null)[];
  frames: TreeFrame[];
}

export interface ListFrame {
  caption: string;
  nodes: { value: string | number; state?: CellState }[];
  pointers?: { name: string; index: number | null }[];
}
export interface ListViz {
  type: 'list';
  title?: string;
  frames: ListFrame[];
}

/** Stack (LIFO, vertical) or queue (FIFO, horizontal). */
export interface StackFrame {
  caption: string;
  items: (string | number)[];
  highlight?: number[];
}
export interface StackViz {
  type: 'stack' | 'queue';
  title?: string;
  frames: StackFrame[];
}

/** Hash buckets with an optional incoming key being routed to a bucket. */
export interface HashFrame {
  caption: string;
  buckets: (string | number)[][];
  incoming?: { key: string | number; bucket: number };
  activeBucket?: number;
}
export interface HashViz {
  type: 'hash';
  title?: string;
  frames: HashFrame[];
}

export interface BitsFrame {
  caption: string;
  bits: (0 | 1)[];
  highlight?: number[];
  label?: string;
}
export interface BitsViz {
  type: 'bits';
  title?: string;
  frames: BitsFrame[];
}

export interface GraphNode {
  id: string | number;
  x: number; // 0..1
  y: number; // 0..1
}
export interface GraphEdge {
  from: string | number;
  to: string | number;
  directed?: boolean;
  weight?: number;
  state?: 'active' | 'tree' | 'dim';
}
export interface GraphFrame {
  caption: string;
  active?: (string | number)[];
  visited?: (string | number)[];
  frontier?: (string | number)[];
  /** Override edges for this frame (e.g. union-find parent links changing). */
  edges?: GraphEdge[];
}
export interface GraphViz {
  type: 'graph';
  title?: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  frames: GraphFrame[];
}

/** Intervals on a timeline. */
export interface IntervalFrame {
  caption: string;
  bars: { start: number; end: number; label?: string; state?: 'active' | 'done' | 'dim' | 'removed' }[];
}
export interface IntervalViz {
  type: 'interval';
  title?: string;
  span: number;
  frames: IntervalFrame[];
}
