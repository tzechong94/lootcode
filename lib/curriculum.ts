import type { AlgoFamily, Problem, Topic } from './types';
import arraysHashing from './content/arrays-hashing';
import twoPointers from './content/two-pointers';
import slidingWindow from './content/sliding-window';
import binarySearch from './content/binary-search';
import stack from './content/stack';
import queuesDeques from './content/queues-deques';
import linkedLists from './content/linked-lists';
import trees from './content/trees';
import tries from './content/tries';
import heapPriorityQueue from './content/heap-priority-queue';
import backtracking from './content/backtracking';
import graphs from './content/graphs';
import dp1d from './content/dp-1d';
import dp2d from './content/dp-2d';
import greedy from './content/greedy';
import intervals from './content/intervals';
import advancedGraphs from './content/advanced-graphs';
import unionFind from './content/union-find';
import mathBit from './content/math-bit';
import sortingDivideConquer from './content/sorting-divide-conquer';

// The curriculum manifest: built topics in study order.
// Add a topic by importing its module and appending it here.
export const TOPICS: Topic[] = [
  arraysHashing,
  twoPointers,
  slidingWindow,
  binarySearch,
  stack,
  queuesDeques,
  linkedLists,
  trees,
  tries,
  heapPriorityQueue,
  backtracking,
  graphs,
  dp1d,
  dp2d,
  greedy,
  intervals,
  advancedGraphs,
  unionFind,
  mathBit,
  sortingDivideConquer,
].sort((a, b) => a.order - b.order);

// ===== Section & family groupings =====

/** Data-structure topics, in study order. */
export const DATA_STRUCTURE_TOPICS: Topic[] = TOPICS.filter((t) => t.section === 'data-structure');

/** Algorithm topics, in study order. */
export const ALGORITHM_TOPICS: Topic[] = TOPICS.filter((t) => t.section === 'algorithm');

/** Display order for algorithm families. */
export const FAMILY_ORDER: AlgoFamily[] = [
  'Searching',
  'Sorting & Divide and Conquer',
  'Two Pointers & Sliding Window',
  'Graph Traversal',
  'Backtracking',
  'Dynamic Programming',
  'Greedy',
  'Intervals',
  'Math & Bit',
];

/** Algorithm topics grouped by family, families in `FAMILY_ORDER`, topics in study order. */
export function algorithmsByFamily(): { family: AlgoFamily; topics: Topic[] }[] {
  return FAMILY_ORDER.map((family) => ({
    family,
    topics: ALGORITHM_TOPICS.filter((t) => t.family === family),
  })).filter((g) => g.topics.length > 0);
}

export function getTopic(slug: string): Topic | undefined {
  return TOPICS.find((t) => t.slug === slug);
}

export function getProblem(topicSlug: string, problemId: string): Problem | undefined {
  return getTopic(topicSlug)?.problems.find((p) => p.id === problemId);
}

export function allProblems(): Problem[] {
  return TOPICS.flatMap((t) => t.problems);
}

/** Total count of gradable exercises (problems + implement-it-yourself builds). */
export function totalExercises(): number {
  return TOPICS.reduce((n, t) => n + t.problems.length + (t.implementations?.length ?? 0), 0);
}
