import type { Topic } from '@/lib/types';

// Comparator min-heap for Dijkstra / Prim (orders by element[0]). Python uses heapq.
const MINHEAP_JS = `class MinHeap {
  constructor(cmp) { this.a = []; this.cmp = cmp || ((x, y) => x - y); }
  size() { return this.a.length; }
  peek() { return this.a[0]; }
  push(x) {
    const a = this.a;
    a.push(x);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.cmp(a[p], a[i]) <= 0) break;
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
        if (l < n && this.cmp(a[l], a[s]) < 0) s = l;
        if (r < n && this.cmp(a[r], a[s]) < 0) s = r;
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
## Advanced Graphs — first principles

Once you're comfortable with plain BFS/DFS, the next tier handles **weighted** graphs and **global
structure**. The core upgrade: a plain queue gives shortest paths only when every edge costs the
same. With varying edge weights you need a **priority queue** so you always expand the
cheapest-known frontier node next.

### BFS still wins for unweighted shortest paths

When every move costs 1 — like word-ladder transformations or grid steps — BFS already finds the
shortest path. Model the states as nodes (each valid word is a node; an edge connects words one
letter apart) and BFS outward from the start. The first time you reach the target, the level count
*is* the shortest length.

### Dijkstra — shortest paths with non-negative weights

Dijkstra is "BFS with a min-heap." Keep tentative distances; repeatedly pop the closest unfinalized
node and relax its edges. Because weights are non-negative, the first time you finalize a node its
distance is optimal.

\`\`\`text
dist = {source: 0}; heap = [(0, source)]
while heap:
    d, u = pop_min(heap)
    if u already finalized: continue
    finalize u
    for (v, w) in edges(u):
        if v not finalized: push (d + w, v)
\`\`\`

### Minimum spanning tree — cheapest way to connect everything

To connect all nodes at minimum total edge cost, grow a tree greedily (**Prim's**: from the current
tree, always add the cheapest edge to a new node — again a min-heap). Kruskal's is the union-find
variant (next topic).

### Key points to remember

- Unweighted shortest path ⇒ plain BFS; weighted (non-negative) ⇒ **Dijkstra** with a min-heap.
- Dijkstra finalizes the closest node each step; skip already-finalized pops instead of decrease-key.
- Model implicit graphs (word transformations, board states) as nodes + edges, then run BFS/Dijkstra.
- **MST** = cheapest connection of all nodes; Prim's grows from a node, Kruskal's sorts edges + union-find.
- Dijkstra needs non-negative weights — negative edges call for Bellman-Ford instead.
`;

const topic: Topic = {
  slug: 'advanced-graphs',
  title: 'Advanced Graphs',
  order: 13,
  blurb: 'Weighted graphs and global structure: BFS state-search, Dijkstra, and minimum spanning trees.',
  tutorial,
  problems: [
    {
      id: 'word-ladder',
      title: 'Word Ladder',
      difficulty: 'Hard',
      topicSlug: 'advanced-graphs',
      statement: `Given \`beginWord\`, \`endWord\`, and a \`wordList\`, transform \`beginWord\` into \`endWord\` changing **one letter at a time**, where each intermediate word must be in \`wordList\`. Return the number of words in the shortest transformation sequence (including both ends), or \`0\` if impossible. (CSPrimer's "Word ladder".)`,
      constraints: ['1 ≤ word length ≤ 10', '1 ≤ wordList.length ≤ 5000', 'All words are lowercase and the same length.'],
      examples: [
        { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', output: '5', explanation: 'hit→hot→dot→dog→cog.' },
        { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]', output: '0' },
      ],
      functionName: { py: 'ladder_length', js: 'ladderLength' },
      starter: {
        py: 'def ladder_length(begin_word, end_word, word_list):\n    # BFS over words; neighbors differ by exactly one letter\n    # your code here\n    pass\n',
        js: 'function ladderLength(beginWord, endWord, wordList) {\n  // BFS over words; neighbors differ by exactly one letter\n  // your code here\n}\n',
      },
      reference: {
        py: "def ladder_length(begin_word, end_word, word_list):\n    from collections import deque\n    words = set(word_list)\n    if end_word not in words:\n        return 0\n    q = deque([(begin_word, 1)])\n    visited = {begin_word}\n    while q:\n        word, steps = q.popleft()\n        if word == end_word:\n            return steps\n        for i in range(len(word)):\n            for c in 'abcdefghijklmnopqrstuvwxyz':\n                nxt = word[:i] + c + word[i + 1:]\n                if nxt in words and nxt not in visited:\n                    visited.add(nxt)\n                    q.append((nxt, steps + 1))\n    return 0\n",
        js: "function ladderLength(beginWord, endWord, wordList) {\n  const words = new Set(wordList);\n  if (!words.has(endWord)) return 0;\n  const alpha = 'abcdefghijklmnopqrstuvwxyz';\n  let queue = [[beginWord, 1]];\n  const visited = new Set([beginWord]);\n  while (queue.length) {\n    const next = [];\n    for (const [word, steps] of queue) {\n      if (word === endWord) return steps;\n      for (let i = 0; i < word.length; i++) {\n        for (const c of alpha) {\n          const nxt = word.slice(0, i) + c + word.slice(i + 1);\n          if (words.has(nxt) && !visited.has(nxt)) {\n            visited.add(nxt);\n            next.push([nxt, steps + 1]);\n          }\n        }\n      }\n    }\n    queue = next;\n  }\n  return 0;\n}\n",
      },
      tests: [
        { input: ['hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log', 'cog']], expected: 5 },
        { input: ['hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log']], expected: 0 },
        { input: ['a', 'c', ['a', 'b', 'c']], expected: 2 },
        { input: ['hot', 'dog', ['hot', 'dog', 'dot']], expected: 3 },
        { input: ['hot', 'dog', ['hot', 'dog']], expected: 0 },
      ],
      hints: [
        'Each word is a node; two words are adjacent if they differ in exactly one letter.',
        'BFS from beginWord — the first time you reach endWord gives the shortest sequence.',
        'Generate neighbors by trying all 26 letters at each position; only keep those in the word set.',
      ],
      complexity: { time: 'O(N · L · 26)', space: 'O(N · L)' },
    },
    {
      id: 'network-delay-time',
      title: 'Network Delay Time',
      difficulty: 'Medium',
      topicSlug: 'advanced-graphs',
      statement: `\`times[i] = [u, v, w]\` is a directed edge: a signal from \`u\` reaches \`v\` after \`w\` time. Sending a signal from node \`k\`, return the time for **all** \`n\` nodes (labeled 1..n) to receive it, or \`-1\` if some node can't.`,
      constraints: ['1 ≤ k ≤ n ≤ 100', '1 ≤ times.length ≤ 6000', 'Weights are non-negative.'],
      examples: [
        { input: 'times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2', output: '2' },
      ],
      functionName: { py: 'network_delay_time', js: 'networkDelayTime' },
      preamble: { js: MINHEAP_JS },
      starter: {
        py: 'def network_delay_time(times, n, k):\n    import heapq\n    # Dijkstra from k; answer is the max finalized distance (or -1)\n    # your code here\n    pass\n',
        js: 'function networkDelayTime(times, n, k) {\n  const heap = new MinHeap((x, y) => x[0] - y[0]); // [dist, node]\n  // Dijkstra from k; answer is the max finalized distance (or -1)\n  // your code here\n}\n',
      },
      reference: {
        py: 'def network_delay_time(times, n, k):\n    import heapq\n    graph = {i: [] for i in range(1, n + 1)}\n    for u, v, w in times:\n        graph[u].append((v, w))\n    dist = {}\n    heap = [(0, k)]\n    while heap:\n        d, node = heapq.heappop(heap)\n        if node in dist:\n            continue\n        dist[node] = d\n        for v, w in graph[node]:\n            if v not in dist:\n                heapq.heappush(heap, (d + w, v))\n    return max(dist.values()) if len(dist) == n else -1\n',
        js: 'function networkDelayTime(times, n, k) {\n  const graph = new Map();\n  for (let i = 1; i <= n; i++) graph.set(i, []);\n  for (const [u, v, w] of times) graph.get(u).push([v, w]);\n  const dist = new Map();\n  const heap = new MinHeap((x, y) => x[0] - y[0]);\n  heap.push([0, k]);\n  while (heap.size()) {\n    const [d, node] = heap.pop();\n    if (dist.has(node)) continue;\n    dist.set(node, d);\n    for (const [v, w] of graph.get(node)) {\n      if (!dist.has(v)) heap.push([d + w, v]);\n    }\n  }\n  return dist.size === n ? Math.max(...dist.values()) : -1;\n}\n',
      },
      tests: [
        { input: [[[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2], expected: 2 },
        { input: [[[1, 2, 1]], 2, 1], expected: 1 },
        { input: [[[1, 2, 1]], 2, 2], expected: -1 },
        { input: [[[1, 2, 1], [2, 3, 2], [1, 3, 4]], 3, 1], expected: 3 },
      ],
      hints: [
        'This is single-source shortest path with non-negative weights — Dijkstra.',
        'Use a min-heap of (distance, node); finalize each node the first time you pop it.',
        'The answer is the largest finalized distance, or -1 if some node was never reached.',
      ],
      complexity: { time: 'O(E log V)', space: 'O(V + E)' },
    },
    {
      id: 'min-cost-connect-points',
      title: 'Min Cost to Connect All Points',
      difficulty: 'Medium',
      topicSlug: 'advanced-graphs',
      statement: `Given \`points\` on a plane, the cost to connect two points is their Manhattan distance \`|x1-x2| + |y1-y2|\`. Return the minimum total cost to connect all points (a minimum spanning tree).`,
      constraints: ['1 ≤ points.length ≤ 1000', '-10⁶ ≤ xi, yi ≤ 10⁶'],
      examples: [
        { input: 'points = [[0,0],[2,2],[3,10],[5,2],[7,0]]', output: '20' },
      ],
      functionName: { py: 'min_cost_connect_points', js: 'minCostConnectPoints' },
      preamble: { js: MINHEAP_JS },
      starter: {
        py: 'def min_cost_connect_points(points):\n    import heapq\n    # Prim: grow the tree, always adding the cheapest edge to a new point\n    # your code here\n    pass\n',
        js: 'function minCostConnectPoints(points) {\n  const heap = new MinHeap((x, y) => x[0] - y[0]); // [dist, index]\n  // Prim: grow the tree, always adding the cheapest edge to a new point\n  // your code here\n}\n',
      },
      reference: {
        py: 'def min_cost_connect_points(points):\n    import heapq\n    n = len(points)\n    if n <= 1:\n        return 0\n    visited = [False] * n\n    heap = [(0, 0)]\n    total = 0\n    count = 0\n    while count < n:\n        d, i = heapq.heappop(heap)\n        if visited[i]:\n            continue\n        visited[i] = True\n        total += d\n        count += 1\n        for j in range(n):\n            if not visited[j]:\n                dist = abs(points[i][0] - points[j][0]) + abs(points[i][1] - points[j][1])\n                heapq.heappush(heap, (dist, j))\n    return total\n',
        js: 'function minCostConnectPoints(points) {\n  const n = points.length;\n  if (n <= 1) return 0;\n  const visited = new Array(n).fill(false);\n  const heap = new MinHeap((x, y) => x[0] - y[0]);\n  heap.push([0, 0]);\n  let total = 0, count = 0;\n  while (count < n) {\n    const [d, i] = heap.pop();\n    if (visited[i]) continue;\n    visited[i] = true;\n    total += d;\n    count++;\n    for (let j = 0; j < n; j++) {\n      if (!visited[j]) {\n        const dist = Math.abs(points[i][0] - points[j][0]) + Math.abs(points[i][1] - points[j][1]);\n        heap.push([dist, j]);\n      }\n    }\n  }\n  return total;\n}\n',
      },
      tests: [
        { input: [[[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]]], expected: 20 },
        { input: [[[3, 12], [-2, 5], [-4, 1]]], expected: 18 },
        { input: [[[0, 0]]], expected: 0 },
        { input: [[[0, 0], [1, 1]]], expected: 2 },
      ],
      hints: [
        'This is a minimum spanning tree where edge weight is Manhattan distance.',
        "Prim's algorithm: start from any point and repeatedly add the cheapest edge to an unvisited point.",
        'Use a min-heap of (distance, point); skip points already in the tree.',
      ],
      complexity: { time: 'O(n² log n)', space: 'O(n)' },
    },
  ],
};

export default topic;
