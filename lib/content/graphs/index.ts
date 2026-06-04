import type { Topic, TutorialBlock } from '@/lib/types';

const GRAPH_NODES = [
  { id: 'A', x: 0.08, y: 0.5 },
  { id: 'B', x: 0.35, y: 0.18 },
  { id: 'C', x: 0.35, y: 0.82 },
  { id: 'D', x: 0.62, y: 0.18 },
  { id: 'E', x: 0.62, y: 0.82 },
  { id: 'F', x: 0.9, y: 0.5 },
];
const GRAPH_EDGES = [
  { from: 'A', to: 'B' },
  { from: 'A', to: 'C' },
  { from: 'B', to: 'D' },
  { from: 'C', to: 'E' },
  { from: 'D', to: 'F' },
  { from: 'E', to: 'F' },
];

const tutorial = `
## Graphs — first principles

A graph is the most general structure: **nodes (vertices) connected by edges**. Trees and linked
lists are just graphs with restrictions. Edges can be **directed** or not, **weighted** or not, and
the graph may have **cycles**. Almost every "spread", "reach", "connection", or "dependency" problem
is a graph problem in disguise — including 2-D **grids**, where each cell is a node connected to its
neighbors.

### Representations

- **Adjacency list** — \`graph[u] = [v, w, ...]\`. The default: O(V + E) space, fast to iterate neighbors.
- **Grid** — the graph is implicit; a cell \`(r, c)\` connects to its 4 (or 8) neighbors. No need to build
  an explicit list.
- **Edge list** — just the pairs; handy for union-find and some algorithms.

### The two traversals (memorize these cold)

**DFS** dives as deep as possible before backtracking — recursion or an explicit stack. Great for
"flood fill", connected components, cycle detection, and exploring all of something.

**BFS** explores in rings of increasing distance using a **queue** — and that ordering means **BFS
finds shortest paths in an unweighted graph**. Use it for "fewest steps", "nearest", "minimum moves".

\`\`\`text
# BFS skeleton
seen = {start}; queue = [start]
while queue:
    node = queue.popleft()
    for neighbor in neighbors(node):
        if neighbor not in seen:
            seen.add(neighbor); queue.append(neighbor)
\`\`\`

**The one rule that prevents infinite loops:** mark a node *seen* the moment you enqueue/visit it.
Graphs have cycles; without a visited set you'll revisit forever.

### Multi-source BFS & topological order

- Seed the BFS queue with **every** source at once (rotting oranges, nearest-exit) to compute all
  shortest distances in a single sweep.
- For a **directed acyclic** dependency graph, **topological sort** (Kahn's algorithm: repeatedly
  remove a node with in-degree 0) gives a valid order — and if you can't remove everything, there's a
  **cycle**.

### Key points to remember

- Model it as a graph whenever you see connections, reachability, dependencies, or a grid.
- DFS = stack/recursion (components, flood fill, cycle detection); BFS = queue (**shortest path, unweighted**).
- Always track visited nodes — graphs have cycles, unlike trees.
- A grid is a graph; neighbors are the adjacent cells, bounds-checked.
- Topological sort orders a DAG and detects cycles (leftover nodes ⇒ cycle).
`;

const blocks: TutorialBlock[] = [
  {
    kind: 'md',
    md: `## Graphs — from first principles

A graph is the most general structure: **nodes** connected by **edges**. Trees and linked lists are
just graphs with restrictions, and even a **2-D grid** is a graph in disguise (each cell is a node
wired to its neighbors). Edges may be directed or not, weighted or not, and — unlike a tree — graphs
can have **cycles**. Almost any problem about reach, spread, connection, or dependency is a graph
problem.

You only need two ways to walk a graph, and the difference is everything.

**Breadth-first (BFS)** explores in **rings of increasing distance** using a queue — so on an
unweighted graph it finds **shortest paths**:`,
  },
  {
    kind: 'viz',
    spec: {
      type: 'graph',
      title: 'BFS: expand outward in rings (shortest paths, unweighted)',
      nodes: GRAPH_NODES,
      edges: GRAPH_EDGES,
      frames: [
        { caption: 'BFS from A. A queue will visit nodes in order of distance from the start.', active: ['A'] },
        { caption: 'Distance 1: every direct neighbor of A — B and C.', visited: ['A'], frontier: ['B', 'C'] },
        { caption: 'Distance 2: neighbors of that ring — D and E.', visited: ['A', 'B', 'C'], frontier: ['D', 'E'] },
        { caption: 'Distance 3: F. Each node is reached by its shortest path — that\'s why BFS solves unweighted shortest path.', visited: ['A', 'B', 'C', 'D', 'E'], frontier: ['F'] },
      ],
    },
  },
  {
    kind: 'md',
    md: `**Depth-first (DFS)** instead dives as deep as possible down one path before backtracking (recursion
or an explicit stack) — the tool for flood fill, connected components, and cycle detection:`,
  },
  {
    kind: 'viz',
    spec: {
      type: 'graph',
      title: 'DFS: dive deep, then backtrack',
      nodes: GRAPH_NODES,
      edges: GRAPH_EDGES,
      frames: [
        { caption: 'DFS from A: follow one path as far as it goes before considering alternatives.', active: ['A'] },
        { caption: 'A → B.', visited: ['A'], active: ['B'] },
        { caption: 'Deeper: B → D.', visited: ['A', 'B'], active: ['D'] },
        { caption: 'Deeper: D → F.', visited: ['A', 'B', 'D'], active: ['F'] },
        { caption: 'From F to its unvisited neighbor E.', visited: ['A', 'B', 'D', 'F'], active: ['E'] },
        { caption: 'Backtrack until something is unvisited — C. DFS touches every node once → O(V+E).', visited: ['A', 'B', 'D', 'F', 'E'], active: ['C'] },
      ],
    },
  },
  {
    kind: 'md',
    md: `**The one rule that prevents infinite loops:** mark a node *visited* the moment you reach it — graphs
have cycles, so without a visited set you'd loop forever.

Two more staples: **multi-source BFS** seeds the queue with *every* start at once (rotting oranges,
nearest exit) to get all shortest distances in one sweep; and **topological sort** (repeatedly remove
a node with in-degree 0) orders a directed acyclic graph and **detects cycles** — if you can't remove
everything, there's a cycle.

### Key points to remember

- Model it as a graph whenever you see connections, reachability, dependencies, or a grid.
- DFS = stack/recursion (components, flood fill, cycle detection); BFS = queue (**shortest path, unweighted**).
- Always track **visited** — graphs have cycles, unlike trees.
- A grid is a graph; a cell's neighbors are its adjacent cells, bounds-checked.
- Topological sort orders a DAG and exposes cycles (leftover nodes ⇒ cycle).`,
  },
];

const topic: Topic = {
  slug: 'graphs',
  title: 'Graphs',
  order: 12,
  section: 'algorithm',
  family: 'Graph Traversal',
  blurb: 'Nodes and edges (including grids): DFS for components, BFS for shortest paths, topological order.',
  tutorial,
  blocks,
  problems: [
    {
      id: 'number-of-islands',
      title: 'Number of Islands',
      difficulty: 'Medium',
      topicSlug: 'graphs',
      statement: `Given an \`m x n\` grid of \`"1"\` (land) and \`"0"\` (water), return the number of islands. An island is land connected **4-directionally** (up/down/left/right).`,
      constraints: ['1 ≤ m, n ≤ 300', 'Each cell is "0" or "1".'],
      examples: [
        { input: 'grid = [["1","1","0"],["1","0","0"],["0","0","1"]]', output: '2' },
      ],
      functionName: { py: 'num_islands', js: 'numIslands' },
      starter: {
        py: 'def num_islands(grid):\n    # flood-fill each unvisited land cell\n    # your code here\n    pass\n',
        js: 'function numIslands(grid) {\n  // flood-fill each unvisited land cell\n  // your code here\n}\n',
      },
      reference: {
        py: "def num_islands(grid):\n    if not grid:\n        return 0\n    rows, cols = len(grid), len(grid[0])\n    count = 0\n    def dfs(r, c):\n        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':\n            return\n        grid[r][c] = '0'\n        dfs(r + 1, c)\n        dfs(r - 1, c)\n        dfs(r, c + 1)\n        dfs(r, c - 1)\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == '1':\n                count += 1\n                dfs(r, c)\n    return count\n",
        js: "function numIslands(grid) {\n  if (!grid.length) return 0;\n  const rows = grid.length, cols = grid[0].length;\n  let count = 0;\n  function dfs(r, c) {\n    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n  for (let r = 0; r < rows; r++) {\n    for (let c = 0; c < cols; c++) {\n      if (grid[r][c] === '1') { count++; dfs(r, c); }\n    }\n  }\n  return count;\n}\n",
      },
      tests: [
        { input: [[['1', '1', '0'], ['1', '0', '0'], ['0', '0', '1']]], expected: 2 },
        {
          input: [[['1', '1', '1', '1', '0'], ['1', '1', '0', '1', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '0', '0', '0']]],
          expected: 1,
        },
        {
          input: [[['1', '1', '0', '0', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '1', '0', '0'], ['0', '0', '0', '1', '1']]],
          expected: 3,
        },
        { input: [[['0']]], expected: 0 },
        { input: [[['1']]], expected: 1 },
      ],
      hints: [
        'Each unvisited land cell starts a new island; count those starts.',
        'From a land cell, flood-fill (DFS/BFS) all connected land, marking it visited.',
        'Sinking visited land to "0" is a simple way to mark it.',
      ],
      complexity: { time: 'O(m·n)', space: 'O(m·n)' },
    },
    {
      id: 'rotting-oranges',
      title: 'Rotting Oranges',
      difficulty: 'Medium',
      topicSlug: 'graphs',
      statement: `In a grid, \`0\` = empty, \`1\` = fresh orange, \`2\` = rotten. Every minute, a rotten orange rots any fresh orange **4-directionally** adjacent to it. Return the minutes until no fresh orange remains, or \`-1\` if some can never rot.`,
      constraints: ['1 ≤ m, n ≤ 10', 'Each cell is 0, 1, or 2.'],
      examples: [
        { input: 'grid = [[2,1,1],[1,1,0],[0,1,1]]', output: '4' },
        { input: 'grid = [[2,1,1],[0,1,1],[1,0,1]]', output: '-1', explanation: 'The bottom-left orange is never reached.' },
      ],
      functionName: { py: 'oranges_rotting', js: 'orangesRotting' },
      starter: {
        py: 'def oranges_rotting(grid):\n    # multi-source BFS from every rotten orange at once\n    # your code here\n    pass\n',
        js: 'function orangesRotting(grid) {\n  // multi-source BFS from every rotten orange at once\n  // your code here\n}\n',
      },
      reference: {
        py: 'def oranges_rotting(grid):\n    from collections import deque\n    rows, cols = len(grid), len(grid[0])\n    q = deque()\n    fresh = 0\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == 2:\n                q.append((r, c))\n            elif grid[r][c] == 1:\n                fresh += 1\n    minutes = 0\n    dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)]\n    while q and fresh > 0:\n        minutes += 1\n        for _ in range(len(q)):\n            r, c = q.popleft()\n            for dr, dc in dirs:\n                nr, nc = r + dr, c + dc\n                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:\n                    grid[nr][nc] = 2\n                    fresh -= 1\n                    q.append((nr, nc))\n    return minutes if fresh == 0 else -1\n',
        js: 'function orangesRotting(grid) {\n  const rows = grid.length, cols = grid[0].length;\n  let q = [];\n  let fresh = 0;\n  for (let r = 0; r < rows; r++) {\n    for (let c = 0; c < cols; c++) {\n      if (grid[r][c] === 2) q.push([r, c]);\n      else if (grid[r][c] === 1) fresh++;\n    }\n  }\n  let minutes = 0;\n  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];\n  while (q.length && fresh > 0) {\n    minutes++;\n    const next = [];\n    for (const [r, c] of q) {\n      for (const [dr, dc] of dirs) {\n        const nr = r + dr, nc = c + dc;\n        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {\n          grid[nr][nc] = 2;\n          fresh--;\n          next.push([nr, nc]);\n        }\n      }\n    }\n    q = next;\n  }\n  return fresh === 0 ? minutes : -1;\n}\n',
      },
      tests: [
        { input: [[[2, 1, 1], [1, 1, 0], [0, 1, 1]]], expected: 4 },
        { input: [[[2, 1, 1], [0, 1, 1], [1, 0, 1]]], expected: -1 },
        { input: [[[0, 2]]], expected: 0 },
        { input: [[[1]]], expected: -1 },
        { input: [[[0]]], expected: 0 },
      ],
      hints: [
        'All currently-rotten oranges spread simultaneously — that is multi-source BFS.',
        'Seed the queue with every rotten cell, and count fresh oranges up front.',
        'Process the queue one minute (one level) at a time; if fresh remain at the end, return -1.',
      ],
      complexity: { time: 'O(m·n)', space: 'O(m·n)' },
    },
    {
      id: 'course-schedule',
      title: 'Course Schedule',
      difficulty: 'Medium',
      topicSlug: 'graphs',
      statement: `There are \`numCourses\` courses labeled \`0..numCourses-1\`. \`prerequisites[i] = [a, b]\` means you must take \`b\` before \`a\`. Return \`true\` if you can finish all courses (i.e. the dependency graph has no cycle).`,
      constraints: ['1 ≤ numCourses ≤ 2000', '0 ≤ prerequisites.length ≤ 5000'],
      examples: [
        { input: 'numCourses = 2, prerequisites = [[1,0]]', output: 'true' },
        { input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]', output: 'false', explanation: 'Circular dependency.' },
      ],
      functionName: { py: 'can_finish', js: 'canFinish' },
      starter: {
        py: 'def can_finish(num_courses, prerequisites):\n    # detect a cycle in the directed graph (topological sort)\n    # your code here\n    pass\n',
        js: 'function canFinish(numCourses, prerequisites) {\n  // detect a cycle in the directed graph (topological sort)\n  // your code here\n}\n',
      },
      reference: {
        py: 'def can_finish(num_courses, prerequisites):\n    from collections import deque\n    graph = [[] for _ in range(num_courses)]\n    indeg = [0] * num_courses\n    for a, b in prerequisites:\n        graph[b].append(a)\n        indeg[a] += 1\n    q = deque([i for i in range(num_courses) if indeg[i] == 0])\n    seen = 0\n    while q:\n        node = q.popleft()\n        seen += 1\n        for nxt in graph[node]:\n            indeg[nxt] -= 1\n            if indeg[nxt] == 0:\n                q.append(nxt)\n    return seen == num_courses\n',
        js: 'function canFinish(numCourses, prerequisites) {\n  const graph = Array.from({ length: numCourses }, () => []);\n  const indeg = new Array(numCourses).fill(0);\n  for (const [a, b] of prerequisites) {\n    graph[b].push(a);\n    indeg[a]++;\n  }\n  const q = [];\n  for (let i = 0; i < numCourses; i++) if (indeg[i] === 0) q.push(i);\n  let head = 0, seen = 0;\n  while (head < q.length) {\n    const node = q[head++];\n    seen++;\n    for (const nxt of graph[node]) {\n      if (--indeg[nxt] === 0) q.push(nxt);\n    }\n  }\n  return seen === numCourses;\n}\n',
      },
      tests: [
        { input: [2, [[1, 0]]], expected: true },
        { input: [2, [[1, 0], [0, 1]]], expected: false },
        { input: [1, []], expected: true },
        { input: [4, [[1, 0], [2, 1], [3, 2]]], expected: true },
        { input: [3, [[0, 1], [1, 2], [2, 0]]], expected: false },
      ],
      hints: [
        'Courses + prerequisites form a directed graph; finishing all is possible iff there is no cycle.',
        "Use Kahn's algorithm: repeatedly take a course with no remaining prerequisites (in-degree 0).",
        'If you can process every course this way, there is no cycle; otherwise one exists.',
      ],
      complexity: { time: 'O(V + E)', space: 'O(V + E)' },
    },
  ],
};

export default topic;
