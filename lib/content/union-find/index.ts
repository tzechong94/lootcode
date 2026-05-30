import type { Topic } from '@/lib/types';

const PREAMBLE_PY = `class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x
    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False
        if self.rank[ra] < self.rank[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        if self.rank[ra] == self.rank[rb]:
            self.rank[ra] += 1
        return True
`;

const PREAMBLE_JS = `class DSU {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }
  find(x) {
    while (this.parent[x] !== x) {
      this.parent[x] = this.parent[this.parent[x]];
      x = this.parent[x];
    }
    return x;
  }
  union(a, b) {
    let ra = this.find(a), rb = this.find(b);
    if (ra === rb) return false;
    if (this.rank[ra] < this.rank[rb]) { const t = ra; ra = rb; rb = t; }
    this.parent[rb] = ra;
    if (this.rank[ra] === this.rank[rb]) this.rank[ra]++;
    return true;
  }
}
`;

const tutorial = `
## Union-Find (Disjoint Set Union) — first principles

Union-Find answers one question incredibly fast: **"are these two elements in the same group?"** —
and lets you **merge** two groups. It's the right tool for **dynamic connectivity**: as edges arrive
one by one, track which things are connected, count components, or detect the moment a cycle forms.

### The structure

Each element points to a **parent**; following parents leads to a group's **representative** (root).
Two elements are in the same set iff they share a root.

- \`find(x)\` — follow parents to the root.
- \`union(a, b)\` — link one root under the other, merging the sets.

### The two optimizations that make it near-O(1)

A naive version degrades to O(n) chains. Two cheap tricks flatten it to **near-constant** amortized
time (inverse-Ackermann, effectively ≤ 4):

1. **Path compression** — during \`find\`, point nodes directly at the root as you walk up, so future
   lookups are flat.
2. **Union by rank/size** — always attach the smaller tree under the larger, keeping trees shallow.

> A ready-made \`DSU\` (with both optimizations) is provided in both languages — construct it with the
> number of elements and call \`union\` / \`find\`.

### When to reach for it

- **Counting connected components** as edges are added (start with \`n\` groups; each successful union
  reduces the count by one).
- **Cycle detection in an undirected graph** — if \`union(a, b)\` finds \`a\` and \`b\` already share a
  root, that edge closes a cycle.
- **Kruskal's MST**, account/email merging, grid percolation.

### Key points to remember

- Union-Find = near-O(1) "same group?" + "merge groups" for **dynamic** connectivity.
- Path compression + union by rank are what make it fast — always use both.
- Components count = \`n\` minus the number of *successful* unions.
- A union that finds both endpoints already joined means that edge creates a **cycle**.
- It handles *incremental* connectivity; for one-shot reachability, plain DFS/BFS is fine too.
`;

const topic: Topic = {
  slug: 'union-find',
  title: 'Union-Find',
  order: 19,
  blurb: 'Disjoint sets for dynamic connectivity: count components, detect cycles, build MSTs.',
  tutorial,
  problems: [
    {
      id: 'count-components',
      title: 'Number of Connected Components',
      difficulty: 'Medium',
      topicSlug: 'union-find',
      statement: `Given \`n\` nodes labeled \`0..n-1\` and a list of undirected \`edges\`, return the number of connected components. A \`DSU\` class is provided.`,
      constraints: ['1 ≤ n ≤ 2000', '0 ≤ edges.length ≤ 5000', 'No duplicate edges; no self-loops.'],
      examples: [
        { input: 'n = 5, edges = [[0,1],[1,2],[3,4]]', output: '2' },
        { input: 'n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]', output: '1' },
      ],
      functionName: { py: 'count_components', js: 'countComponents' },
      preamble: { py: PREAMBLE_PY, js: PREAMBLE_JS },
      starter: {
        py: 'def count_components(n, edges):\n    dsu = DSU(n)\n    # start with n components; each successful union merges two\n    # your code here\n    pass\n',
        js: 'function countComponents(n, edges) {\n  const dsu = new DSU(n);\n  // start with n components; each successful union merges two\n  // your code here\n}\n',
      },
      reference: {
        py: 'def count_components(n, edges):\n    dsu = DSU(n)\n    count = n\n    for a, b in edges:\n        if dsu.union(a, b):\n            count -= 1\n    return count\n',
        js: 'function countComponents(n, edges) {\n  const dsu = new DSU(n);\n  let count = n;\n  for (const [a, b] of edges) {\n    if (dsu.union(a, b)) count--;\n  }\n  return count;\n}\n',
      },
      tests: [
        { input: [5, [[0, 1], [1, 2], [3, 4]]], expected: 2 },
        { input: [5, [[0, 1], [1, 2], [2, 3], [3, 4]]], expected: 1 },
        { input: [4, []], expected: 4 },
        { input: [1, []], expected: 1 },
        { input: [6, [[0, 1], [2, 3], [4, 5]]], expected: 3 },
      ],
      hints: [
        'Begin with n separate components.',
        'Each edge that joins two *different* components reduces the count by one.',
        'A union that returns false (already joined) does not change the count.',
      ],
      complexity: { time: 'O((n + e)·α)', space: 'O(n)' },
    },
    {
      id: 'redundant-connection',
      title: 'Redundant Connection',
      difficulty: 'Medium',
      topicSlug: 'union-find',
      statement: `A graph started as a tree with \`n\` nodes (labeled \`1..n\`) and had one extra edge added, creating exactly one cycle. Given the \`edges\` in order, return the edge that can be removed so the result is a tree. If multiple answers, return the one that appears last.`,
      constraints: ['3 ≤ n ≤ 1000', 'edges.length == n', 'Nodes are labeled 1..n.'],
      examples: [
        { input: 'edges = [[1,2],[1,3],[2,3]]', output: '[2,3]' },
        { input: 'edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]', output: '[1,4]' },
      ],
      functionName: { py: 'find_redundant_connection', js: 'findRedundantConnection' },
      preamble: { py: PREAMBLE_PY, js: PREAMBLE_JS },
      starter: {
        py: 'def find_redundant_connection(edges):\n    dsu = DSU(len(edges) + 1)  # nodes are 1-indexed\n    # the first edge whose endpoints are already connected closes the cycle\n    # your code here\n    pass\n',
        js: 'function findRedundantConnection(edges) {\n  const dsu = new DSU(edges.length + 1); // nodes are 1-indexed\n  // the first edge whose endpoints are already connected closes the cycle\n  // your code here\n}\n',
      },
      reference: {
        py: 'def find_redundant_connection(edges):\n    dsu = DSU(len(edges) + 1)\n    for a, b in edges:\n        if not dsu.union(a, b):\n            return [a, b]\n    return []\n',
        js: 'function findRedundantConnection(edges) {\n  const dsu = new DSU(edges.length + 1);\n  for (const [a, b] of edges) {\n    if (!dsu.union(a, b)) return [a, b];\n  }\n  return [];\n}\n',
      },
      tests: [
        { input: [[[1, 2], [1, 3], [2, 3]]], expected: [2, 3] },
        { input: [[[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]], expected: [1, 4] },
        { input: [[[1, 2], [2, 3], [1, 3]]], expected: [1, 3] },
      ],
      hints: [
        'Add edges one by one with union-find.',
        'The first edge whose two endpoints already share a root is the one closing the cycle.',
        'Processing in input order naturally returns the last such edge.',
      ],
      complexity: { time: 'O(n·α)', space: 'O(n)' },
    },
    {
      id: 'number-of-provinces',
      title: 'Number of Provinces',
      difficulty: 'Medium',
      topicSlug: 'union-find',
      statement: `Given an \`n x n\` matrix \`isConnected\` where \`isConnected[i][j] = 1\` means cities \`i\` and \`j\` are directly connected, return the number of provinces (groups of directly or indirectly connected cities).`,
      constraints: ['1 ≤ n ≤ 200', 'isConnected[i][i] = 1', 'isConnected is symmetric.'],
      examples: [
        { input: 'isConnected = [[1,1,0],[1,1,0],[0,0,1]]', output: '2' },
        { input: 'isConnected = [[1,0,0],[0,1,0],[0,0,1]]', output: '3' },
      ],
      functionName: { py: 'find_circle_num', js: 'findCircleNum' },
      preamble: { py: PREAMBLE_PY, js: PREAMBLE_JS },
      starter: {
        py: 'def find_circle_num(is_connected):\n    n = len(is_connected)\n    dsu = DSU(n)\n    # union i,j for every connected pair; count remaining groups\n    # your code here\n    pass\n',
        js: 'function findCircleNum(isConnected) {\n  const n = isConnected.length;\n  const dsu = new DSU(n);\n  // union i,j for every connected pair; count remaining groups\n  // your code here\n}\n',
      },
      reference: {
        py: 'def find_circle_num(is_connected):\n    n = len(is_connected)\n    dsu = DSU(n)\n    count = n\n    for i in range(n):\n        for j in range(i + 1, n):\n            if is_connected[i][j] == 1 and dsu.union(i, j):\n                count -= 1\n    return count\n',
        js: 'function findCircleNum(isConnected) {\n  const n = isConnected.length;\n  const dsu = new DSU(n);\n  let count = n;\n  for (let i = 0; i < n; i++) {\n    for (let j = i + 1; j < n; j++) {\n      if (isConnected[i][j] === 1 && dsu.union(i, j)) count--;\n    }\n  }\n  return count;\n}\n',
      },
      tests: [
        { input: [[[1, 1, 0], [1, 1, 0], [0, 0, 1]]], expected: 2 },
        { input: [[[1, 0, 0], [0, 1, 0], [0, 0, 1]]], expected: 3 },
        { input: [[[1, 1, 1], [1, 1, 1], [1, 1, 1]]], expected: 1 },
        { input: [[[1]]], expected: 1 },
      ],
      hints: [
        'Each city starts as its own province.',
        'Scan the upper triangle of the matrix; union i and j whenever they are connected.',
        'Each successful union reduces the province count by one.',
      ],
      complexity: { time: 'O(n²·α)', space: 'O(n)' },
    },
  ],
};

export default topic;
