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
  tests: TestCase[];
  compare?: CompareMode;
  hints?: string[];
  complexity?: { time: string; space: string };
}

export interface Topic {
  slug: string;
  title: string;
  order: number;
  /** One-line description for the sidebar / landing page. */
  blurb: string;
  /** Markdown tutorial: first-principles explanation + key points. */
  tutorial: string;
  problems: Problem[];
}
