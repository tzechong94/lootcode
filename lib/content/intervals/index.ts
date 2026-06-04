import type { Topic, TutorialBlock } from '@/lib/types';

const tutorial = `
## Intervals — first principles

Interval problems give you ranges \`[start, end]\` and ask about overlaps, merges, or how many fit
without conflict. The unlocking insight is almost always the same: **sort the intervals first**, then
sweep through them once. The right sort key turns a tangle of ranges into a clean left-to-right pass.

### Do two intervals overlap?

\`[a, b]\` and \`[c, d]\` overlap iff \`a <= d\` **and** \`c <= b\` — i.e. each starts before the other ends.
Most interval logic is built from this one test.

### The two canonical strategies

**1. Sort by start, then merge.** For merging or inserting, sort by start time and walk left to right.
Keep the "current" interval; if the next one starts before the current ends, **extend** the current
end; otherwise the current is finished — emit it and start a new one.

\`\`\`text
sort by start
for [s, e] in intervals:
    if result and s <= result.last.end:
        result.last.end = max(result.last.end, e)   # overlap → merge
    else:
        result.append([s, e])                        # gap → new interval
\`\`\`

**2. Sort by end, then take greedily.** For "maximum non-overlapping intervals" / "minimum
removals", sort by **end time** and always keep the interval that finishes earliest — it leaves the
most room for the rest. This is the classic activity-selection greedy.

### Why the sort key matters

Sorting by **start** keeps merges contiguous; sorting by **end** maximizes how many disjoint
intervals you can pack. Picking the wrong key is the most common interval-problem mistake — decide
based on whether you're *combining* overlaps (start) or *selecting* disjoint ones (end).

### Key points to remember

- Sort first — by **start** to merge/insert, by **end** to select the most non-overlapping.
- Overlap test: \`a <= d and c <= b\`.
- Merge sweep: extend the current interval while the next one overlaps, else emit and restart.
- "Max non-overlapping / min removals" = earliest-finish-first greedy.
- After sorting, a single linear pass solves most interval problems — O(n log n) overall.
`;

const blocks: TutorialBlock[] = [
  {
    kind: 'md',
    md: `## Intervals — from first principles

Interval problems hand you ranges \`[start, end]\` and ask about overlaps, merges, or how many fit
without conflict. Almost all of them yield to the same realization: **once you sort the intervals, a
single left-to-right sweep solves it** — the right sort key turns a tangle of ranges into a clean
linear pass. (The overlap test itself is simple: \`[a,b]\` and \`[c,d]\` overlap iff \`a ≤ d\` and \`c ≤ b\`.)

The canonical move for merging: **sort by start**, keep a "current" interval, and as you walk, either
extend it (if the next overlaps) or emit it and start fresh (if there's a gap):`,
  },
  {
    kind: 'viz',
    spec: {
      type: 'interval',
      title: 'Merge overlapping intervals: sort by start, then sweep',
      span: 11,
      frames: [
        { caption: 'Sort intervals by start time so overlaps become adjacent.', bars: [{ start: 1, end: 3 }, { start: 2, end: 6 }, { start: 8, end: 10 }] },
        { caption: 'Take [1,3] as the current merged interval.', bars: [{ start: 1, end: 3, state: 'active' }, { start: 2, end: 6 }, { start: 8, end: 10 }] },
        { caption: '[2,6] starts at 2 ≤ current end 3 → they overlap. Extend the current end to 6.', bars: [{ start: 1, end: 6, state: 'active', label: '[1,6]' }, { start: 2, end: 6, state: 'dim' }, { start: 8, end: 10 }] },
        { caption: '[8,10] starts at 8 > 6 → a gap. Emit [1,6] and start a new current interval.', bars: [{ start: 1, end: 6, state: 'done', label: '[1,6]' }, { start: 8, end: 10, state: 'active' }] },
        { caption: 'Result: [1,6] and [8,10]. One sort + one sweep → O(n log n).', bars: [{ start: 1, end: 6, state: 'done', label: '[1,6]' }, { start: 8, end: 10, state: 'done' }] },
      ],
    },
  },
  {
    kind: 'md',
    md: `The *other* canonical strategy flips the sort key: for "maximum non-overlapping intervals" /
"minimum removals," **sort by end time** and greedily keep the interval that finishes earliest — it
leaves the most room for the rest (classic activity selection). Picking the wrong key is the most
common interval-problem mistake.

### Key points to remember

- Sort first — by **start** to merge/insert, by **end** to select the most non-overlapping.
- Overlap test: \`a ≤ d and c ≤ b\`.
- Merge sweep: extend the current interval while the next overlaps, else emit and restart.
- "Max non-overlapping / min removals" = earliest-finish-first greedy.
- After sorting, a single linear pass solves most interval problems → O(n log n) overall.`,
  },
];

const topic: Topic = {
  slug: 'intervals',
  title: 'Intervals',
  order: 17,
  section: 'algorithm',
  family: 'Intervals',
  blurb: 'Sort by the right key, then sweep: merge overlaps or pack the most non-overlapping ranges.',
  tutorial,
  blocks,
  problems: [
    {
      id: 'merge-intervals',
      title: 'Merge Intervals',
      difficulty: 'Medium',
      topicSlug: 'intervals',
      statement: `Given an array of intervals \`[start, end]\`, merge all overlapping intervals and return the non-overlapping intervals that cover all the input, sorted by start.`,
      constraints: ['1 ≤ intervals.length ≤ 10⁴', 'start ≤ end'],
      examples: [
        { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' },
        { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]' },
      ],
      functionName: { py: 'merge', js: 'merge' },
      starter: {
        py: 'def merge(intervals):\n    # sort by start, then extend the current interval while it overlaps\n    # your code here\n    pass\n',
        js: 'function merge(intervals) {\n  // sort by start, then extend the current interval while it overlaps\n  // your code here\n}\n',
      },
      reference: {
        py: 'def merge(intervals):\n    intervals.sort(key=lambda x: x[0])\n    res = []\n    for s, e in intervals:\n        if res and s <= res[-1][1]:\n            res[-1][1] = max(res[-1][1], e)\n        else:\n            res.append([s, e])\n    return res\n',
        js: 'function merge(intervals) {\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [];\n  for (const [s, e] of intervals) {\n    if (res.length && s <= res[res.length - 1][1]) {\n      res[res.length - 1][1] = Math.max(res[res.length - 1][1], e);\n    } else {\n      res.push([s, e]);\n    }\n  }\n  return res;\n}\n',
      },
      tests: [
        { input: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
        { input: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
        { input: [[[1, 4]]], expected: [[1, 4]] },
        { input: [[[1, 4], [0, 4]]], expected: [[0, 4]] },
        { input: [[[1, 4], [2, 3]]], expected: [[1, 4]] },
      ],
      hints: [
        'Sort intervals by their start so overlaps are adjacent.',
        'Keep the last interval in your result; if the next starts at or before its end, they overlap.',
        'Merge by extending the end to the max of the two.',
      ],
      complexity: { time: 'O(n log n)', space: 'O(n)' },
    },
    {
      id: 'insert-interval',
      title: 'Insert Interval',
      difficulty: 'Medium',
      topicSlug: 'intervals',
      statement: `Given a list of **non-overlapping** intervals sorted by start, insert \`newInterval\` and merge if necessary. Return the resulting sorted, non-overlapping list.`,
      constraints: ['0 ≤ intervals.length ≤ 10⁴', 'intervals is sorted by start and non-overlapping.'],
      examples: [
        { input: 'intervals = [[1,3],[6,9]], newInterval = [2,5]', output: '[[1,5],[6,9]]' },
        { input: 'intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]', output: '[[1,2],[3,10],[12,16]]' },
      ],
      functionName: { py: 'insert', js: 'insert' },
      starter: {
        py: 'def insert(intervals, new_interval):\n    # add intervals before, merge overlapping ones, then add the rest\n    # your code here\n    pass\n',
        js: 'function insert(intervals, newInterval) {\n  // add intervals before, merge overlapping ones, then add the rest\n  // your code here\n}\n',
      },
      reference: {
        py: 'def insert(intervals, new_interval):\n    res = []\n    i = 0\n    n = len(intervals)\n    s, e = new_interval[0], new_interval[1]\n    while i < n and intervals[i][1] < s:\n        res.append(intervals[i])\n        i += 1\n    while i < n and intervals[i][0] <= e:\n        s = min(s, intervals[i][0])\n        e = max(e, intervals[i][1])\n        i += 1\n    res.append([s, e])\n    while i < n:\n        res.append(intervals[i])\n        i += 1\n    return res\n',
        js: 'function insert(intervals, newInterval) {\n  const res = [];\n  let i = 0;\n  const n = intervals.length;\n  let s = newInterval[0], e = newInterval[1];\n  while (i < n && intervals[i][1] < s) res.push(intervals[i++]);\n  while (i < n && intervals[i][0] <= e) {\n    s = Math.min(s, intervals[i][0]);\n    e = Math.max(e, intervals[i][1]);\n    i++;\n  }\n  res.push([s, e]);\n  while (i < n) res.push(intervals[i++]);\n  return res;\n}\n',
      },
      tests: [
        { input: [[[1, 3], [6, 9]], [2, 5]], expected: [[1, 5], [6, 9]] },
        { input: [[[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]], expected: [[1, 2], [3, 10], [12, 16]] },
        { input: [[], [5, 7]], expected: [[5, 7]] },
        { input: [[[1, 5]], [2, 3]], expected: [[1, 5]] },
        { input: [[[1, 5]], [6, 8]], expected: [[1, 5], [6, 8]] },
      ],
      hints: [
        'Three phases: intervals entirely before the new one, the overlapping middle, then the rest.',
        'An interval overlaps the new one when its start ≤ the (growing) new end.',
        'Expand the new interval’s start/end across every overlap, then append it once.',
      ],
      complexity: { time: 'O(n)', space: 'O(n)' },
    },
    {
      id: 'non-overlapping-intervals',
      title: 'Non-overlapping Intervals',
      difficulty: 'Medium',
      topicSlug: 'intervals',
      statement: `Given intervals \`[start, end]\`, return the minimum number you must remove so the rest are non-overlapping. (Touching endpoints like \`[1,2]\` and \`[2,3]\` do **not** overlap.)`,
      constraints: ['1 ≤ intervals.length ≤ 10⁵', 'start < end'],
      examples: [
        { input: 'intervals = [[1,2],[2,3],[3,4],[1,3]]', output: '1', explanation: 'Remove [1,3].' },
        { input: 'intervals = [[1,2],[1,2],[1,2]]', output: '2' },
      ],
      functionName: { py: 'erase_overlap_intervals', js: 'eraseOverlapIntervals' },
      starter: {
        py: 'def erase_overlap_intervals(intervals):\n    # sort by end; greedily keep the interval that finishes earliest\n    # your code here\n    pass\n',
        js: 'function eraseOverlapIntervals(intervals) {\n  // sort by end; greedily keep the interval that finishes earliest\n  // your code here\n}\n',
      },
      reference: {
        py: "def erase_overlap_intervals(intervals):\n    if not intervals:\n        return 0\n    intervals.sort(key=lambda x: x[1])\n    count = 0\n    prev_end = float('-inf')\n    for s, e in intervals:\n        if s >= prev_end:\n            prev_end = e\n        else:\n            count += 1\n    return count\n",
        js: 'function eraseOverlapIntervals(intervals) {\n  if (!intervals.length) return 0;\n  intervals.sort((a, b) => a[1] - b[1]);\n  let count = 0;\n  let prevEnd = -Infinity;\n  for (const [s, e] of intervals) {\n    if (s >= prevEnd) prevEnd = e;\n    else count++;\n  }\n  return count;\n}\n',
      },
      tests: [
        { input: [[[1, 2], [2, 3], [3, 4], [1, 3]]], expected: 1 },
        { input: [[[1, 2], [1, 2], [1, 2]]], expected: 2 },
        { input: [[[1, 2], [2, 3]]], expected: 0 },
        { input: [[[1, 100], [11, 22], [1, 11], [2, 12]]], expected: 2 },
        { input: [[[1, 2]]], expected: 0 },
      ],
      hints: [
        'Keeping the most intervals is the same as removing the fewest.',
        'Sort by end time and always keep the interval that ends earliest — it leaves the most room.',
        'Count an interval as removed whenever it starts before the last kept interval ends.',
      ],
      complexity: { time: 'O(n log n)', space: 'O(1)' },
    },
  ],
};

export default topic;
