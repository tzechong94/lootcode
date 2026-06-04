import type { Implementation } from '@/lib/types';

const implementations: Implementation[] = [
  {
    id: 'impl-dsu',
    title: 'Build a Union-Find (DSU)',
    statement: `**Union-Find** (a disjoint-set union, or DSU) tracks a partition of \`n\` items into groups, answering "are these two in the same group?" and "merge these two groups" in almost O(1).

Each item points to a **parent**; following parents leads to a group's **root**. Two items are connected iff they share a root. Two optimizations make it nearly constant time:
- **Path compression** — during \`find\`, re-point nodes closer to the root.
- **Union by rank** — attach the shorter tree under the taller one.

The constructor takes \`n\`; items are \`0..n-1\`. Build a \`DSU\`:

- \`find(x)\` — the root of \`x\`'s group.
- \`union(a, b)\` — merge the two groups (no-op if already together).
- \`connected(a, b)\` — \`True\`/\`true\` if \`a\` and \`b\` share a root.
- \`count()\` — how many groups remain (starts at \`n\`, drops by one on each real union).`,
    methods: [
      { name: 'find', sig: 'find(x) -> root', doc: "Root of x's group." },
      { name: 'union', sig: 'union(a, b)', doc: 'Merge the groups of a and b.' },
      { name: 'connected', sig: 'connected(a, b) -> bool', doc: 'True if a and b share a root.' },
      { name: 'count', sig: 'count() -> int', doc: 'Number of groups remaining.' },
    ],
    className: { py: 'DSU', js: 'DSU' },
    complexity: { time: 'O(α(n)) ≈ O(1) amortized per op', space: 'O(n)' },
    hints: [
      'The constructor receives n. Start with parent[i] = i (each item its own group) and count = n.',
      'find follows parent links to the root; compress by pointing nodes at their grandparent as you climb.',
      'union finds both roots; if different, attach one under the other (by rank) and decrement count.',
    ],
    starter: {
      py: `class DSU:
    def __init__(self, n):
        # TODO: parent[i] = i, rank/size, count = n
        pass

    def find(self, x):
        pass

    def union(self, a, b):
        pass

    def connected(self, a, b):
        pass

    def count(self):
        pass
`,
      js: `class DSU {
  constructor(n) {
    // TODO: parent[i] = i, rank/size, count = n
  }

  find(x) {}
  union(a, b) {}
  connected(a, b) {}
  count() {}
}
`,
    },
    reference: {
      py: `class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self._count = n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return
        if self.rank[ra] < self.rank[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        if self.rank[ra] == self.rank[rb]:
            self.rank[ra] += 1
        self._count -= 1

    def connected(self, a, b):
        return self.find(a) == self.find(b)

    def count(self):
        return self._count
`,
      js: `class DSU {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
    this._count = n;
  }

  find(x) {
    while (this.parent[x] !== x) {
      this.parent[x] = this.parent[this.parent[x]];
      x = this.parent[x];
    }
    return x;
  }

  union(a, b) {
    let ra = this.find(a);
    let rb = this.find(b);
    if (ra === rb) return;
    if (this.rank[ra] < this.rank[rb]) { const t = ra; ra = rb; rb = t; }
    this.parent[rb] = ra;
    if (this.rank[ra] === this.rank[rb]) this.rank[ra]++;
    this._count--;
  }

  connected(a, b) {
    return this.find(a) === this.find(b);
  }

  count() {
    return this._count;
  }
}
`,
    },
    tests: [
      {
        name: 'merging groups',
        ops: [
          { call: 'new', args: [10] },
          { call: 'connected', args: [1, 2], expect: false },
          { call: 'union', args: [1, 2] },
          { call: 'connected', args: [1, 2], expect: true },
          { call: 'count', expect: 9 },
          { call: 'union', args: [2, 3] },
          { call: 'connected', args: [1, 3], expect: true },
          { call: 'count', expect: 8 },
        ],
      },
      {
        name: 'redundant unions are no-ops',
        ops: [
          { call: 'new', args: [5] },
          { call: 'union', args: [0, 1] },
          { call: 'union', args: [0, 1] },
          { call: 'union', args: [1, 0] },
          { call: 'count', expect: 4 },
          { call: 'connected', args: [0, 1], expect: true },
        ],
      },
      {
        name: 'two clusters then bridge',
        ops: [
          { call: 'new', args: [7] },
          { call: 'union', args: [0, 1] },
          { call: 'union', args: [1, 2] },
          { call: 'union', args: [4, 5] },
          { call: 'union', args: [5, 6] },
          { call: 'connected', args: [0, 2], expect: true },
          { call: 'connected', args: [4, 6], expect: true },
          { call: 'connected', args: [2, 4], expect: false },
          { call: 'count', expect: 3 },
          { call: 'union', args: [2, 4] },
          { call: 'connected', args: [0, 6], expect: true },
          { call: 'count', expect: 2 },
        ],
      },
    ],
  },
];

export default implementations;
