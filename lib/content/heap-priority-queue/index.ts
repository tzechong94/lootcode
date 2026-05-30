import type { Topic } from '@/lib/types';

// Provided to JS solutions (JS has no built-in heap). Python uses heapq.
const MINHEAP_JS = `class MinHeap {
  constructor() { this.a = []; }
  size() { return this.a.length; }
  peek() { return this.a[0]; }
  push(x) {
    const a = this.a;
    a.push(x);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (a[p] <= a[i]) break;
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }
  pop() {
    const a = this.a;
    const top = a[0];
    const last = a.pop();
    if (a.length) {
      a[0] = last;
      let i = 0;
      const n = a.length;
      while (true) {
        let s = i;
        const l = 2 * i + 1, r = 2 * i + 2;
        if (l < n && a[l] < a[s]) s = l;
        if (r < n && a[r] < a[s]) s = r;
        if (s === i) break;
        [a[s], a[i]] = [a[i], a[s]];
        i = s;
      }
    }
    return top;
  }
}
`;

const tutorial = `
## Heap / Priority Queue — first principles

A **priority queue** serves elements by priority rather than arrival order: you can always pull the
smallest (or largest) element next. A **binary heap** is the standard implementation — a complete
binary tree (stored compactly in an array) with the **heap property**: every parent is ≤ both
children (a min-heap). That single invariant gives you:

| Operation | Cost |
|-----------|------|
| Peek min/max | O(1) |
| Push | O(log n) |
| Pop min/max | O(log n) |
| Build from n items | O(n) |

Push/pop are cheap because you only fix one root-to-leaf path (sift up / sift down), not the whole tree.

### When to reach for a heap

Whenever you repeatedly need the **current extreme** of a changing set:

- **"Top k" / "kth largest"** — keep a heap of size k. For the kth *largest*, use a **min-heap of size
  k**: the smallest of the k biggest sits at the top, and anything smaller than it gets discarded.
- **Merging / scheduling** — repeatedly take the smallest front element across many sequences
  (merge k sorted lists, task scheduling, Dijkstra's algorithm).
- **Running median, "smash the two heaviest"** — any greedy that always consumes the current extreme.

### Min-heap vs max-heap

Most libraries give a min-heap (Python's \`heapq\`; here a \`MinHeap\` is provided in JS). To simulate a
**max-heap**, push **negated** values (or negated keys) and negate again on the way out.

### Key points to remember

- A heap gives O(1) peek and O(log n) push/pop of the extreme — not a sorted structure, just fast access to one end.
- "Kth largest" ⇒ a **min-heap of size k** (and "kth smallest" ⇒ a max-heap of size k).
- Simulate a max-heap with a min-heap by negating values.
- Don't sort (O(n log n)) when you only need the top k — a size-k heap is O(n log k).
- Heaps shine for *streaming*/repeated-extreme queries; for a one-shot "k most frequent", bucketing by count can be O(n).
`;

const topic: Topic = {
  slug: 'heap-priority-queue',
  title: 'Heap / Priority Queue',
  order: 10,
  blurb: 'Fast access to the current extreme: top-k, merging, and greedy "consume the max" patterns.',
  tutorial,
  problems: [
    {
      id: 'kth-largest-element',
      title: 'Kth Largest Element in an Array',
      difficulty: 'Medium',
      topicSlug: 'heap-priority-queue',
      statement: `Return the \`k\`-th largest element in \`nums\` (in sorted order, not the k-th distinct element). A \`MinHeap\` class is available in JS; use \`heapq\` in Python.`,
      constraints: ['1 ≤ k ≤ nums.length ≤ 10⁵', '-10⁴ ≤ nums[i] ≤ 10⁴'],
      examples: [
        { input: 'nums = [3,2,1,5,6,4], k = 2', output: '5' },
        { input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4', output: '4' },
      ],
      functionName: { py: 'find_kth_largest', js: 'findKthLargest' },
      preamble: { js: MINHEAP_JS },
      starter: {
        py: 'def find_kth_largest(nums, k):\n    import heapq\n    # keep a min-heap of the k largest seen so far\n    # your code here\n    pass\n',
        js: 'function findKthLargest(nums, k) {\n  const heap = new MinHeap(); // keep the k largest\n  // your code here\n}\n',
      },
      reference: {
        py: 'def find_kth_largest(nums, k):\n    import heapq\n    heap = []\n    for x in nums:\n        heapq.heappush(heap, x)\n        if len(heap) > k:\n            heapq.heappop(heap)\n    return heap[0]\n',
        js: 'function findKthLargest(nums, k) {\n  const heap = new MinHeap();\n  for (const x of nums) {\n    heap.push(x);\n    if (heap.size() > k) heap.pop();\n  }\n  return heap.peek();\n}\n',
      },
      tests: [
        { input: [[3, 2, 1, 5, 6, 4], 2], expected: 5 },
        { input: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], expected: 4 },
        { input: [[1], 1], expected: 1 },
        { input: [[7, 6, 5, 4, 3, 2, 1], 5], expected: 3 },
        { input: [[2, 1], 2], expected: 1 },
      ],
      hints: [
        'You only need the k largest, not a full sort.',
        'Keep a min-heap; once it exceeds size k, pop the smallest.',
        'After processing all numbers, the heap top is the k-th largest.',
      ],
      complexity: { time: 'O(n log k)', space: 'O(k)' },
    },
    {
      id: 'last-stone-weight',
      title: 'Last Stone Weight',
      difficulty: 'Easy',
      topicSlug: 'heap-priority-queue',
      statement: `Each turn, smash the two heaviest stones together: if they weigh \`a\` and \`b\` (\`a ≤ b\`), both are destroyed if equal, otherwise a new stone of weight \`b - a\` remains. Return the weight of the last remaining stone, or \`0\` if none remain.`,
      constraints: ['1 ≤ stones.length ≤ 30', '1 ≤ stones[i] ≤ 1000'],
      examples: [
        { input: 'stones = [2,7,4,1,8,1]', output: '1' },
        { input: 'stones = [1]', output: '1' },
      ],
      functionName: { py: 'last_stone_weight', js: 'lastStoneWeight' },
      preamble: { js: MINHEAP_JS },
      starter: {
        py: 'def last_stone_weight(stones):\n    import heapq\n    # a max-heap helps you always grab the two heaviest\n    # your code here\n    pass\n',
        js: 'function lastStoneWeight(stones) {\n  const heap = new MinHeap(); // push negatives to simulate a max-heap\n  // your code here\n}\n',
      },
      reference: {
        py: 'def last_stone_weight(stones):\n    import heapq\n    heap = [-s for s in stones]\n    heapq.heapify(heap)\n    while len(heap) > 1:\n        a = -heapq.heappop(heap)\n        b = -heapq.heappop(heap)\n        if a != b:\n            heapq.heappush(heap, -(a - b))\n    return -heap[0] if heap else 0\n',
        js: 'function lastStoneWeight(stones) {\n  const heap = new MinHeap();\n  for (const s of stones) heap.push(-s);\n  while (heap.size() > 1) {\n    const a = -heap.pop();\n    const b = -heap.pop();\n    if (a !== b) heap.push(-(a - b));\n  }\n  return heap.size() ? -heap.peek() : 0;\n}\n',
      },
      tests: [
        { input: [[2, 7, 4, 1, 8, 1]], expected: 1 },
        { input: [[1]], expected: 1 },
        { input: [[2, 2]], expected: 0 },
        { input: [[10, 4, 2, 10]], expected: 2 },
        { input: [[3, 7, 2]], expected: 2 },
      ],
      hints: [
        'You repeatedly need the two largest values — a max-heap gives them in O(log n).',
        'Simulate a max-heap with a min-heap by negating values.',
        'Push back the difference when the two stones differ; stop when ≤ 1 remains.',
      ],
      complexity: { time: 'O(n log n)', space: 'O(n)' },
    },
    {
      id: 'top-k-frequent',
      title: 'Top K Frequent Elements',
      difficulty: 'Medium',
      topicSlug: 'heap-priority-queue',
      statement: `Given an integer array \`nums\` and an integer \`k\`, return the \`k\` most frequent elements, in any order. (A heap of size k works in O(n log k); bucketing by count is O(n).)`,
      constraints: ['1 ≤ nums.length ≤ 10⁵', 'The answer is unique.', '1 ≤ k ≤ number of distinct elements'],
      examples: [
        { input: 'nums = [1,1,1,2,2,3], k = 2', output: '[1,2]' },
        { input: 'nums = [1], k = 1', output: '[1]' },
      ],
      functionName: { py: 'top_k_frequent', js: 'topKFrequent' },
      compare: 'unordered',
      starter: {
        py: 'def top_k_frequent(nums, k):\n    # your code here\n    pass\n',
        js: 'function topKFrequent(nums, k) {\n  // your code here\n}\n',
      },
      reference: {
        py: 'def top_k_frequent(nums, k):\n    from collections import Counter\n    count = Counter(nums)\n    buckets = [[] for _ in range(len(nums) + 1)]\n    for val, freq in count.items():\n        buckets[freq].append(val)\n    res = []\n    for freq in range(len(nums), 0, -1):\n        for val in buckets[freq]:\n            res.append(val)\n            if len(res) == k:\n                return res\n    return res\n',
        js: 'function topKFrequent(nums, k) {\n  const count = new Map();\n  for (const x of nums) count.set(x, (count.get(x) || 0) + 1);\n  const buckets = Array.from({ length: nums.length + 1 }, () => []);\n  for (const [val, freq] of count) buckets[freq].push(val);\n  const res = [];\n  for (let freq = nums.length; freq > 0 && res.length < k; freq--) {\n    for (const val of buckets[freq]) {\n      res.push(val);\n      if (res.length === k) break;\n    }\n  }\n  return res;\n}\n',
      },
      tests: [
        { input: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2] },
        { input: [[1], 1], expected: [1] },
        { input: [[4, 4, 4, 5, 5, 6], 2], expected: [4, 5] },
        { input: [[1, 2], 2], expected: [1, 2] },
        { input: [[5, 5, 5, 5], 1], expected: [5] },
      ],
      hints: [
        'Count each value’s frequency first.',
        'A min-heap of size k keeps the k most frequent as you scan the counts.',
        'Or bucket values by frequency (index = count) and read from the high-frequency end — O(n).',
      ],
      complexity: { time: 'O(n)', space: 'O(n)' },
    },
  ],
};

export default topic;
