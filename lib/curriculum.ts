import type { Problem, Topic } from './types';
import arraysHashing from './content/arrays-hashing';
import twoPointers from './content/two-pointers';
import slidingWindow from './content/sliding-window';
import binarySearch from './content/binary-search';

// The curriculum manifest: built topics in study order.
// Add a topic by importing its module and appending it here.
export const TOPICS: Topic[] = [
  arraysHashing,
  twoPointers,
  slidingWindow,
  binarySearch,
].sort((a, b) => a.order - b.order);

// Full planned curriculum (for the landing-page roadmap). Built topics are
// matched by title; the rest render as "coming soon".
export const ROADMAP: string[] = [
  'Arrays & Hashing',
  'Two Pointers',
  'Sliding Window',
  'Binary Search',
  'Stack',
  'Queues & Deques',
  'Linked Lists',
  'Trees',
  'Tries',
  'Heap / Priority Queue',
  'Backtracking',
  'Graphs',
  'Advanced Graphs',
  '1-D Dynamic Programming',
  '2-D Dynamic Programming',
  'Greedy',
  'Intervals',
  'Math & Bit Manipulation',
  'Union-Find',
];

export function getTopic(slug: string): Topic | undefined {
  return TOPICS.find((t) => t.slug === slug);
}

export function getProblem(topicSlug: string, problemId: string): Problem | undefined {
  return getTopic(topicSlug)?.problems.find((p) => p.id === problemId);
}

export function allProblems(): Problem[] {
  return TOPICS.flatMap((t) => t.problems);
}
