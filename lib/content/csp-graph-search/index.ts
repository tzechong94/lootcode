import type { Topic } from '@/lib/types';

const tutorial = `
## Tree and graph traversal

A huge range of problems are secretly **graph search**: model the states as nodes, the legal moves as
edges, then explore. The two core traversals:

- **BFS** (queue) explores in rings of increasing distance, so the first time you reach a goal you've
  found the **shortest path** in edges. Word ladders and the water-jug puzzle are BFS in disguise.
- **DFS / backtracking** (stack or recursion) dives deep and undoes choices that don't pan out — the
  tool for "find *a* full arrangement", like a knight's tour.

When edges have **different costs**, plain BFS isn't enough — you want **Dijkstra** (a priority queue
by cumulative cost), or **A\\*** when you have a good heuristic. That's the maze with weighted terrain.

The trick each time is the modelling: *what is a node, what is an edge, what is the goal?* Once you
answer that, the traversal is boilerplate.

### Key points to remember

- BFS = shortest path in an unweighted graph; track visited states so you never revisit.
- Backtracking = try a move, recurse, undo on failure; great for constraint puzzles.
- Weighted edges ⇒ Dijkstra (min-cost priority queue); a heuristic upgrades it to A\\*.
- The hard part is usually defining the state graph, not the search itself.
`;

const topic: Topic = {
  slug: 'csp-graph-search',
  title: 'Graph Search',
  order: 106,
  section: 'csprimer',
  blurb: 'Model states as a graph: BFS for shortest paths, backtracking, Dijkstra.',
  tutorial,
  problems: [
    {
      id: 'pstree',
      title: 'Process Tree',
      difficulty: 'Medium',
      topicSlug: 'csp-graph-search',
      statement: `Unix processes form a tree: every process has exactly one parent. Given \`processes\`, a list of \`[pid, ppid]\` pairs (process id, parent id), and the \`root\` pid, build the tree.

Return the tree as a nested pair \`[pid, [child-subtrees…]]\`, where each node's children are ordered by ascending pid. A leaf is \`[pid, []]\`.`,
      constraints: ['pids are distinct positive integers.', 'Every non-root process has its parent present.', 'The structure is a single tree rooted at root.'],
      examples: [
        { input: 'processes = [[1,0],[2,1],[3,1],[4,3]], root = 1', output: '[1,[[2,[]],[3,[[4,[]]]]]]' },
      ],
      functionName: { py: 'build_tree', js: 'buildTree' },
      starter: {
        py: 'def build_tree(processes, root):\n    # your code here\n    pass\n',
        js: 'function buildTree(processes, root) {\n  // your code here\n}\n',
      },
      reference: {
        py: `def build_tree(processes, root):
    children = {}
    for pid, ppid in processes:
        children.setdefault(ppid, []).append(pid)

    def build(pid):
        kids = sorted(children.get(pid, []))
        return [pid, [build(k) for k in kids]]

    return build(root)
`,
        js: `function buildTree(processes, root) {
  const children = new Map();
  for (const [pid, ppid] of processes) {
    if (!children.has(ppid)) children.set(ppid, []);
    children.get(ppid).push(pid);
  }
  const build = (pid) => {
    const kids = (children.get(pid) || []).slice().sort((a, b) => a - b);
    return [pid, kids.map(build)];
  };
  return build(root);
}
`,
      },
      tests: [
        { input: [[[1, 0], [2, 1], [3, 1], [4, 3]], 1], expected: [1, [[2, []], [3, [[4, []]]]]] },
        { input: [[[1, 0]], 1], expected: [1, []] },
        { input: [[[1, 0], [2, 1], [3, 2], [5, 1], [4, 2]], 1], expected: [1, [[2, [[3, []], [4, []]]], [5, []]]] },
        { input: [[[10, 0], [7, 10], [3, 10]], 10], expected: [10, [[3, []], [7, []]]] },
        // Multi-digit siblings: every other case has single-digit pids, so a JS `.sort()`
        // (lexicographic by default) would order 10 before 2 and still pass them all.
        { input: [[[1, 0], [10, 1], [2, 1], [9, 1]], 1], expected: [1, [[2, []], [9, []], [10, []]]] },
        { input: [[[100, 0], [20, 100], [3, 100], [9, 20], [11, 20]], 100], expected: [100, [[3, []], [20, [[9, []], [11, []]]]]] },
        // Degenerate linear chain: depth without branching.
        { input: [[[1, 0], [2, 1], [3, 2], [4, 3], [5, 4]], 1], expected: [1, [[2, [[3, [[4, [[5, []]]]]]]]]] },
        // Flat star whose root pid exceeds every child.
        { input: [[[5, 0], [1, 5], [2, 5], [3, 5], [4, 5]], 5], expected: [5, [[1, []], [2, []], [3, []], [4, []]]] },
      ],
      hints: [
        'First build a map from parent pid → list of child pids.',
        'Recurse from the root: a node is [pid, [subtrees of its children]].',
        "Sort each node's children by pid so the output is deterministic.",
      ],
      complexity: { time: 'O(n log n)', space: 'O(n)' },
    },
    {
      id: 'word-ladder',
      title: 'Word Ladder',
      difficulty: 'Medium',
      topicSlug: 'csp-graph-search',
      statement: `Given \`begin\` and \`end\` (equal-length lowercase words) and a list \`words\`, find the length of the **shortest transformation sequence** from \`begin\` to \`end\`, changing exactly **one letter at a time**, where every intermediate word must be in \`words\`.

Return the number of words in the shortest ladder (counting both ends), or \`0\` if no ladder exists. Model each word as a node with edges to words one letter away, and BFS.`,
      constraints: ['All words have the same length.', 'Words are lowercase a–z.', 'end must be in words for a ladder to exist.'],
      examples: [
        { input: 'begin = "hit", end = "cog", words = ["hot","dot","dog","lot","log","cog"]', output: '5', explanation: 'hit → hot → dot → dog → cog.' },
        { input: 'begin = "hit", end = "cog", words = ["hot","dot","dog","lot","log"]', output: '0', explanation: '"cog" is not in the list.' },
      ],
      functionName: { py: 'ladder_length', js: 'ladderLength' },
      starter: {
        py: 'def ladder_length(begin, end, words):\n    # your code here\n    pass\n',
        js: 'function ladderLength(begin, end, words) {\n  // your code here\n}\n',
      },
      reference: {
        py: `from collections import deque


def ladder_length(begin, end, words):
    word_set = set(words)
    if end not in word_set:
        return 0
    q = deque([(begin, 1)])
    seen = {begin}
    while q:
        word, dist = q.popleft()
        if word == end:
            return dist
        for i in range(len(word)):
            for ch in "abcdefghijklmnopqrstuvwxyz":
                nxt = word[:i] + ch + word[i + 1:]
                if nxt in word_set and nxt not in seen:
                    seen.add(nxt)
                    q.append((nxt, dist + 1))
    return 0
`,
        js: `function ladderLength(begin, end, words) {
  const wordSet = new Set(words);
  if (!wordSet.has(end)) return 0;
  const queue = [[begin, 1]];
  const seen = new Set([begin]);
  let head = 0;
  const alpha = 'abcdefghijklmnopqrstuvwxyz';
  while (head < queue.length) {
    const [word, dist] = queue[head++];
    if (word === end) return dist;
    for (let i = 0; i < word.length; i++) {
      for (const ch of alpha) {
        const nxt = word.slice(0, i) + ch + word.slice(i + 1);
        if (wordSet.has(nxt) && !seen.has(nxt)) {
          seen.add(nxt);
          queue.push([nxt, dist + 1]);
        }
      }
    }
  }
  return 0;
}
`,
      },
      tests: [
        { input: ['hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log', 'cog']], expected: 5 },
        { input: ['hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log']], expected: 0 },
        { input: ['a', 'c', ['a', 'b', 'c']], expected: 2 },
        { input: ['hot', 'dog', ['hot', 'dog', 'dot']], expected: 3 },
        { input: ['red', 'tax', ['ted', 'tex', 'red', 'tax', 'tad', 'den', 'rex', 'pee']], expected: 4 },
        // begin == end: the ladder is just [begin].
        { input: ['hit', 'hit', ['hit']], expected: 1 },
        // end IS in words but unreachable, so this reaches the "BFS exhausted" return. The existing
        // 0-case only exercises the `end not in words` early return.
        { input: ['hit', 'cog', ['hot', 'cog']], expected: 0 },
        // Cycle plus a disconnected goal: loops forever without a visited set.
        { input: ['aaa', 'ccc', ['aab', 'abb', 'bbb', 'baa', 'aaa', 'ccc']], expected: 0 },
        { input: ['aa', 'bb', ['ab', 'bb']], expected: 3 },
      ],
      hints: [
        'This is shortest-path on a graph where words are nodes and one-letter changes are edges — use BFS.',
        'To find neighbours of a word, try every position × every letter a–z and keep those in the word set.',
        'Track visited words so you never re-enqueue; return the distance when you dequeue end (0 if unreachable).',
      ],
      complexity: { time: 'O(N · L · 26)', space: 'O(N)' },
    },
    {
      id: 'jug-pouring',
      title: 'Jug Pouring (Die Hard)',
      difficulty: 'Medium',
      topicSlug: 'csp-graph-search',
      statement: `You have two jugs of capacities \`a\` and \`b\` gallons and an unlimited water supply. Starting from both empty, return the **minimum number of operations** to get exactly \`target\` gallons in **either** jug, or \`-1\` if it's impossible.

Each of these counts as one operation: fill a jug to the top, empty a jug completely, or pour one jug into the other until the source is empty or the destination is full. This is BFS over states \`(x, y)\`.`,
      constraints: ['0 ≤ target', '1 ≤ a, b'],
      examples: [
        { input: 'a = 3, b = 5, target = 4', output: '6', explanation: 'The classic Die Hard puzzle.' },
        { input: 'a = 2, b = 6, target = 5', output: '-1', explanation: 'Only multiples of gcd(2,6)=2 are reachable.' },
      ],
      functionName: { py: 'min_pours', js: 'minPours' },
      starter: {
        py: 'def min_pours(a, b, target):\n    # your code here\n    pass\n',
        js: 'function minPours(a, b, target) {\n  // your code here\n}\n',
      },
      reference: {
        py: `from collections import deque


def min_pours(a, b, target):
    if target == 0:
        return 0
    start = (0, 0)
    seen = {start}
    q = deque([(start, 0)])
    while q:
        (x, y), steps = q.popleft()
        if x == target or y == target:
            return steps
        pour_ab = min(x, b - y)
        pour_ba = min(y, a - x)
        nexts = [
            (a, y),
            (x, b),
            (0, y),
            (x, 0),
            (x - pour_ab, y + pour_ab),
            (x + pour_ba, y - pour_ba),
        ]
        for state in nexts:
            if state not in seen:
                seen.add(state)
                q.append((state, steps + 1))
    return -1
`,
        js: `function minPours(a, b, target) {
  if (target === 0) return 0;
  const key = (x, y) => x + ',' + y;
  const seen = new Set([key(0, 0)]);
  const queue = [[0, 0, 0]];
  let head = 0;
  while (head < queue.length) {
    const [x, y, steps] = queue[head++];
    if (x === target || y === target) return steps;
    const pourAB = Math.min(x, b - y);
    const pourBA = Math.min(y, a - x);
    const nexts = [
      [a, y],
      [x, b],
      [0, y],
      [x, 0],
      [x - pourAB, y + pourAB],
      [x + pourBA, y - pourBA],
    ];
    for (const [nx, ny] of nexts) {
      if (!seen.has(key(nx, ny))) {
        seen.add(key(nx, ny));
        queue.push([nx, ny, steps + 1]);
      }
    }
  }
  return -1;
}
`,
      },
      tests: [
        { input: [3, 5, 4], expected: 6 },
        { input: [2, 6, 5], expected: -1 },
        { input: [3, 5, 5], expected: 1 },
        { input: [3, 5, 0], expected: 0 },
        { input: [2, 3, 1], expected: 2 },
        // target == a + b. The classic LeetCode version accepts the jugs' *combined* contents,
        // but this statement says "in either jug", so 8 is unreachable.
        { input: [3, 5, 8], expected: -1 },
        // target above both capacities. The existing -1 case has target ≤ b, so it only
        // probes the gcd reason for failure, never the out-of-range one.
        { input: [3, 5, 9], expected: -1 },
        // Equal capacities, untested until now: reachable in one op, vs unreachable by gcd.
        { input: [4, 4, 4], expected: 1 },
        { input: [4, 4, 2], expected: -1 },
        { input: [1, 1, 1], expected: 1 },
      ],
      hints: [
        'A state is the pair of current amounts (x, y); the start is (0, 0).',
        'From a state there are six moves: fill either jug, empty either jug, pour either direction.',
        'BFS gives the fewest operations; track seen states and return -1 if you exhaust them.',
      ],
      complexity: { time: 'O(a · b)', space: 'O(a · b)' },
    },
    {
      id: 'knights-tour',
      title: "Knight's Tour Exists?",
      difficulty: 'Hard',
      topicSlug: 'csp-graph-search',
      statement: `On an \`n × n\` chessboard, a knight starts at the top-left corner \`(0, 0)\`. An **open knight's tour** visits every square exactly once using legal knight moves.

Return \`true\` if such a tour exists starting from the corner, \`false\` otherwise. This is backtracking; **Warnsdorff's heuristic** (always move to the square with the fewest onward moves) makes it fast enough.`,
      constraints: ['1 ≤ n ≤ 6', 'The knight starts at (0, 0).'],
      examples: [
        { input: 'n = 5', output: 'true' },
        { input: 'n = 4', output: 'false', explanation: "No knight's tour exists on a 4×4 board." },
      ],
      functionName: { py: 'has_tour', js: 'hasTour' },
      starter: {
        py: 'def has_tour(n):\n    # your code here\n    pass\n',
        js: 'function hasTour(n) {\n  // your code here\n}\n',
      },
      reference: {
        py: `MOVES = [(1, 2), (2, 1), (2, -1), (1, -2), (-1, -2), (-2, -1), (-2, 1), (-1, 2)]


def has_tour(n):
    if n == 1:
        return True
    visited = [[False] * n for _ in range(n)]

    def onward(r, c):
        count = 0
        for dr, dc in MOVES:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and not visited[nr][nc]:
                count += 1
        return count

    def solve(r, c, count):
        if count == n * n:
            return True
        candidates = []
        for dr, dc in MOVES:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and not visited[nr][nc]:
                candidates.append((onward(nr, nc), nr, nc))
        candidates.sort()
        for _, nr, nc in candidates:
            visited[nr][nc] = True
            if solve(nr, nc, count + 1):
                return True
            visited[nr][nc] = False
        return False

    visited[0][0] = True
    return solve(0, 0, 1)
`,
        js: `const MOVES = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];

function hasTour(n) {
  if (n === 1) return true;
  const visited = Array.from({ length: n }, () => new Array(n).fill(false));

  const onward = (r, c) => {
    let count = 0;
    for (const [dr, dc] of MOVES) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < n && nc >= 0 && nc < n && !visited[nr][nc]) count++;
    }
    return count;
  };

  const solve = (r, c, count) => {
    if (count === n * n) return true;
    const candidates = [];
    for (const [dr, dc] of MOVES) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < n && nc >= 0 && nc < n && !visited[nr][nc]) {
        candidates.push([onward(nr, nc), nr, nc]);
      }
    }
    candidates.sort((p, q) => p[0] - q[0] || p[1] - q[1] || p[2] - q[2]);
    for (const [, nr, nc] of candidates) {
      visited[nr][nc] = true;
      if (solve(nr, nc, count + 1)) return true;
      visited[nr][nc] = false;
    }
    return false;
  };

  visited[0][0] = true;
  return solve(0, 0, 1);
}
`,
      },
      tests: [
        { input: [1], expected: true },
        { input: [3], expected: false },
        { input: [4], expected: false },
        { input: [5], expected: true },
        { input: [6], expected: true },
        // The only board size in 1 ≤ n ≤ 6 left untested, and the one that fails because the
        // knight has no legal move at all, rather than because the search exhausts.
        { input: [2], expected: false },
      ],
      hints: [
        'Model it as DFS/backtracking: mark a square visited, recurse, unmark on failure.',
        'A tour is complete when the number of visited squares equals n·n.',
        "Order candidate moves by Warnsdorff's rule — fewest onward moves first — so you rarely need to backtrack.",
      ],
      complexity: { time: 'Exponential worst case (heuristic-guided)', space: 'O(n²)' },
    },
    {
      id: 'maze-solver',
      title: 'Weighted Maze (Dijkstra)',
      difficulty: 'Hard',
      topicSlug: 'csp-graph-search',
      statement: `You are given a maze as a list of equal-length strings. Cells are: \`'O'\` start, \`'X'\` goal, \`' '\` field, \`'.'\` bog, \`'#'\` mountain. Moving into a cell costs by terrain: field **1**, bog **3**, mountain **10** (start and goal count as field, cost 1). You may move up/down/left/right.

Return the **minimum total cost** to travel from \`'O'\` to \`'X'\` (sum of the costs of the cells you enter), or \`-1\` if the goal is unreachable. Different edge weights ⇒ **Dijkstra**.`,
      constraints: ['The grid is rectangular.', "Exactly one 'O' and one 'X'.", '1 ≤ rows, cols ≤ 60'],
      examples: [
        { input: 'grid = ["O#X"]', output: '11', explanation: 'Enter mountain (10) then goal (1).' },
        { input: 'grid = ["O.X"]', output: '4', explanation: 'Enter bog (3) then goal (1).' },
      ],
      functionName: { py: 'min_cost', js: 'minCost' },
      starter: {
        py: 'def min_cost(grid):\n    # your code here\n    pass\n',
        js: 'function minCost(grid) {\n  // your code here\n}\n',
      },
      reference: {
        py: `import heapq


def min_cost(grid):
    rows = len(grid)
    cols = len(grid[0])
    cost = {" ": 1, ".": 3, "#": 10, "O": 1, "X": 1}
    start = end = None
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "O":
                start = (r, c)
            elif grid[r][c] == "X":
                end = (r, c)
    dist = [[float("inf")] * cols for _ in range(rows)]
    dist[start[0]][start[1]] = 0
    pq = [(0, start[0], start[1])]
    while pq:
        d, r, c = heapq.heappop(pq)
        if (r, c) == end:
            return d
        if d > dist[r][c]:
            continue
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols:
                nd = d + cost[grid[nr][nc]]
                if nd < dist[nr][nc]:
                    dist[nr][nc] = nd
                    heapq.heappush(pq, (nd, nr, nc))
    return -1
`,
        js: `function minCost(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const cost = { ' ': 1, '.': 3, '#': 10, O: 1, X: 1 };
  let start, end;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 'O') start = [r, c];
      else if (grid[r][c] === 'X') end = [r, c];
    }
  }
  const dist = Array.from({ length: rows }, () => new Array(cols).fill(Infinity));
  const done = Array.from({ length: rows }, () => new Array(cols).fill(false));
  dist[start[0]][start[1]] = 0;
  while (true) {
    let br = -1, bc = -1, best = Infinity;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!done[r][c] && dist[r][c] < best) {
          best = dist[r][c];
          br = r;
          bc = c;
        }
      }
    }
    if (br === -1) break;
    done[br][bc] = true;
    if (br === end[0] && bc === end[1]) return dist[br][bc];
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = br + dr, nc = bc + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !done[nr][nc]) {
        const nd = dist[br][bc] + cost[grid[nr][nc]];
        if (nd < dist[nr][nc]) dist[nr][nc] = nd;
      }
    }
  }
  return -1;
}
`,
      },
      tests: [
        { input: [['OX']], expected: 1 },
        { input: [['O X']], expected: 2 },
        { input: [['O#X']], expected: 11 },
        { input: [['O.X']], expected: 4 },
        { input: [['O  ', '## ', '  X']], expected: 4 },
        // The cheapest path is NOT the shortest one: straight through the bogs is 3 steps
        // costing 7, while detouring along the field row is 5 steps costing 5. A BFS that
        // counts hops passes every other case here and fails this one.
        { input: [['O..X', '    ']], expected: 5 },
        // Nx1: every other case is 1xN, so this is the cheap catch for a row/col transposition.
        { input: [['O', '#', 'X']], expected: 11 },
        { input: [['O#', '#X']], expected: 11 },
        // 'X' comes before 'O' in scan order.
        { input: [['XO']], expected: 1 },
      ],
      hints: [
        'Because moves have different costs, BFS is not enough — use Dijkstra with a min-priority queue on cumulative cost.',
        'The cost of an edge is the terrain cost of the cell you move into; the start contributes 0.',
        'Pop the lowest-cost frontier cell; the first time you pop the goal, that cost is the answer.',
      ],
      complexity: { time: 'O(V log V)', space: 'O(V)' },
    },
  ],
};

export default topic;
