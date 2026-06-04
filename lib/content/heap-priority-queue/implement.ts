import type { Implementation } from '@/lib/types';

const implementations: Implementation[] = [
  {
    id: 'impl-min-heap',
    title: 'Build a Min-Heap',
    statement: `A **binary heap** is a complete binary tree flattened into an array: the children of index \`i\` live at \`2i+1\` and \`2i+2\`. A **min-heap** maintains one invariant — every parent is ≤ its children — so the minimum is always at index 0.

You keep the invariant with two O(log n) moves:
- **sift up** after a \`push\`: the new value bubbles up while it's smaller than its parent.
- **sift down** after a \`pop\`: move the last element to the root, then sink it while it's larger than its smallest child.

Build a \`MinHeap\` over an array:

- \`push(x)\` — add \`x\`, then sift up.
- \`pop()\` — remove + return the minimum, then restore the heap; \`None\`/\`null\` if empty.
- \`peek()\` — the minimum without removing it; \`None\`/\`null\` if empty.
- \`size()\` — number of items.`,
    methods: [
      { name: 'push', sig: 'push(x)', doc: 'Add x and sift up.' },
      { name: 'pop', sig: 'pop() -> value', doc: 'Remove + return the min (None/null if empty).' },
      { name: 'peek', sig: 'peek() -> value', doc: 'Minimum without removing (None/null if empty).' },
      { name: 'size', sig: 'size() -> int', doc: 'Number of items.' },
    ],
    className: { py: 'MinHeap', js: 'MinHeap' },
    complexity: { time: 'O(log n) push/pop, O(1) peek', space: 'O(n)' },
    hints: [
      'Store the heap in a plain array. Parent of i is (i-1)//2; children are 2i+1 and 2i+2.',
      'push: append, then while the node is smaller than its parent, swap upward.',
      'pop: swap root with the last element, remove the last, then sink the root down past its smaller child until the invariant holds.',
    ],
    starter: {
      py: `class MinHeap:
    def __init__(self):
        # TODO: an array to hold the heap
        pass

    def push(self, x):
        pass

    def pop(self):
        pass

    def peek(self):
        pass

    def size(self):
        pass
`,
      js: `class MinHeap {
  constructor() {
    // TODO: an array to hold the heap
  }

  push(x) {}
  pop() {}
  peek() {}
  size() {}
}
`,
    },
    reference: {
      py: `class MinHeap:
    def __init__(self):
        self._h = []

    def push(self, x):
        h = self._h
        h.append(x)
        i = len(h) - 1
        while i > 0:
            parent = (i - 1) // 2
            if h[parent] <= h[i]:
                break
            h[parent], h[i] = h[i], h[parent]
            i = parent

    def pop(self):
        h = self._h
        if not h:
            return None
        top = h[0]
        last = h.pop()
        if h:
            h[0] = last
            i = 0
            n = len(h)
            while True:
                smallest = i
                left = 2 * i + 1
                right = 2 * i + 2
                if left < n and h[left] < h[smallest]:
                    smallest = left
                if right < n and h[right] < h[smallest]:
                    smallest = right
                if smallest == i:
                    break
                h[i], h[smallest] = h[smallest], h[i]
                i = smallest
        return top

    def peek(self):
        return self._h[0] if self._h else None

    def size(self):
        return len(self._h)
`,
      js: `class MinHeap {
  constructor() {
    this._h = [];
  }

  push(x) {
    const h = this._h;
    h.push(x);
    let i = h.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (h[parent] <= h[i]) break;
      [h[parent], h[i]] = [h[i], h[parent]];
      i = parent;
    }
  }

  pop() {
    const h = this._h;
    if (h.length === 0) return null;
    const top = h[0];
    const last = h.pop();
    if (h.length) {
      h[0] = last;
      let i = 0;
      const n = h.length;
      for (;;) {
        let smallest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        if (left < n && h[left] < h[smallest]) smallest = left;
        if (right < n && h[right] < h[smallest]) smallest = right;
        if (smallest === i) break;
        [h[i], h[smallest]] = [h[smallest], h[i]];
        i = smallest;
      }
    }
    return top;
  }

  peek() {
    return this._h.length ? this._h[0] : null;
  }

  size() {
    return this._h.length;
  }
}
`,
    },
    tests: [
      {
        name: 'pops in ascending order',
        ops: [
          { call: 'push', args: [5] },
          { call: 'push', args: [3] },
          { call: 'push', args: [8] },
          { call: 'push', args: [1] },
          { call: 'push', args: [9] },
          { call: 'push', args: [2] },
          { call: 'peek', expect: 1 },
          { call: 'pop', expect: 1 },
          { call: 'pop', expect: 2 },
          { call: 'pop', expect: 3 },
          { call: 'size', expect: 3 },
        ],
      },
      {
        name: 'empty behavior',
        ops: [
          { call: 'peek', expect: null },
          { call: 'pop', expect: null },
          { call: 'size', expect: 0 },
        ],
      },
      {
        name: 'interleaved push/pop',
        ops: [
          { call: 'push', args: [4] },
          { call: 'push', args: [6] },
          { call: 'pop', expect: 4 },
          { call: 'push', args: [2] },
          { call: 'push', args: [7] },
          { call: 'pop', expect: 2 },
          { call: 'pop', expect: 6 },
          { call: 'pop', expect: 7 },
          { call: 'pop', expect: null },
        ],
      },
    ],
  },
];

export default implementations;
