import type { Implementation } from '@/lib/types';

const implementations: Implementation[] = [
  {
    id: 'impl-queue',
    title: 'Build a Queue (ring buffer)',
    statement: `A **queue** is **first in, first out (FIFO)**: enqueue at the back, dequeue from the front.

If you back a queue with a plain array and \`pop(0)\` from the front, every dequeue shifts all remaining elements — O(n). A **ring buffer** fixes this: keep a fixed array plus a \`head\` index and a \`size\`. The front is at \`head\`; the back is at \`(head + size) % capacity\`. Indices wrap around the end of the array, so both ends are O(1). When the buffer fills up, grow to a bigger array.

Build a \`Queue\`:

- \`enqueue(x)\` — add to the back.
- \`dequeue()\` — remove and return the front; \`None\`/\`null\` if empty.
- \`peek()\` — front without removing; \`None\`/\`null\` if empty.
- \`size()\` — number of items.
- \`is_empty()\` / \`isEmpty()\` — \`True\`/\`true\` when empty.`,
    methods: [
      { name: 'enqueue', sig: 'enqueue(x)', doc: 'Add x to the back.' },
      { name: 'dequeue', sig: 'dequeue() -> item', doc: 'Remove + return the front (None/null if empty).' },
      { name: 'peek', sig: 'peek() -> item', doc: 'Front without removing (None/null if empty).' },
      { name: 'size', sig: 'size() -> int', doc: 'Number of items.' },
      { name: 'isEmpty', sig: 'is_empty() -> bool', doc: 'True when empty.' },
    ],
    className: { py: 'Queue', js: 'Queue' },
    methodAliases: { py: { isEmpty: 'is_empty' } },
    complexity: { time: 'O(1) amortized per operation', space: 'O(n)' },
    hints: [
      'Keep a fixed-size array, a head index, and a size count.',
      'enqueue writes at (head + size) % capacity; dequeue reads at head then advances head = (head + 1) % capacity.',
      'When size == capacity, allocate a new array (2x) and copy items in logical order, resetting head to 0.',
    ],
    starter: {
      py: `class Queue:
    def __init__(self):
        # TODO: fixed array, head index, size
        pass

    def enqueue(self, x):
        # TODO: grow if full, then write at the back
        pass

    def dequeue(self):
        # TODO: read at head, advance head (None if empty)
        pass

    def peek(self):
        # TODO: front item (None if empty)
        pass

    def size(self):
        pass

    def is_empty(self):
        pass
`,
      js: `class Queue {
  constructor() {
    // TODO: fixed array, head index, size
  }

  enqueue(x) {
    // TODO: grow if full, then write at the back
  }

  dequeue() {
    // TODO: read at head, advance head (null if empty)
  }

  peek() {
    // TODO: front item (null if empty)
  }

  size() {}

  isEmpty() {}
}
`,
    },
    reference: {
      py: `class Queue:
    def __init__(self):
        self._cap = 4
        self._data = [None] * self._cap
        self._head = 0
        self._size = 0

    def _grow(self):
        new = [None] * (self._cap * 2)
        for i in range(self._size):
            new[i] = self._data[(self._head + i) % self._cap]
        self._data = new
        self._head = 0
        self._cap *= 2

    def enqueue(self, x):
        if self._size == self._cap:
            self._grow()
        self._data[(self._head + self._size) % self._cap] = x
        self._size += 1

    def dequeue(self):
        if self._size == 0:
            return None
        x = self._data[self._head]
        self._data[self._head] = None
        self._head = (self._head + 1) % self._cap
        self._size -= 1
        return x

    def peek(self):
        return None if self._size == 0 else self._data[self._head]

    def size(self):
        return self._size

    def is_empty(self):
        return self._size == 0
`,
      js: `class Queue {
  constructor() {
    this._cap = 4;
    this._data = new Array(this._cap).fill(null);
    this._head = 0;
    this._size = 0;
  }

  _grow() {
    const next = new Array(this._cap * 2).fill(null);
    for (let i = 0; i < this._size; i++) next[i] = this._data[(this._head + i) % this._cap];
    this._data = next;
    this._head = 0;
    this._cap *= 2;
  }

  enqueue(x) {
    if (this._size === this._cap) this._grow();
    this._data[(this._head + this._size) % this._cap] = x;
    this._size++;
  }

  dequeue() {
    if (this._size === 0) return null;
    const x = this._data[this._head];
    this._data[this._head] = null;
    this._head = (this._head + 1) % this._cap;
    this._size--;
    return x;
  }

  peek() {
    return this._size === 0 ? null : this._data[this._head];
  }

  size() {
    return this._size;
  }

  isEmpty() {
    return this._size === 0;
  }
}
`,
    },
    tests: [
      {
        name: 'FIFO with growth past capacity',
        ops: [
          { call: 'enqueue', args: [1] },
          { call: 'enqueue', args: [2] },
          { call: 'enqueue', args: [3] },
          { call: 'enqueue', args: [4] },
          { call: 'enqueue', args: [5] },
          { call: 'enqueue', args: [6] },
          { call: 'size', expect: 6 },
          { call: 'dequeue', expect: 1 },
          { call: 'dequeue', expect: 2 },
          { call: 'peek', expect: 3 },
          { call: 'size', expect: 4 },
        ],
      },
      {
        name: 'empty behavior',
        ops: [
          { call: 'isEmpty', expect: true },
          { call: 'dequeue', expect: null },
          { call: 'peek', expect: null },
          { call: 'size', expect: 0 },
        ],
      },
      {
        name: 'wraparound',
        ops: [
          { call: 'enqueue', args: [1] },
          { call: 'enqueue', args: [2] },
          { call: 'enqueue', args: [3] },
          { call: 'dequeue', expect: 1 },
          { call: 'dequeue', expect: 2 },
          { call: 'enqueue', args: [4] },
          { call: 'enqueue', args: [5] },
          { call: 'dequeue', expect: 3 },
          { call: 'dequeue', expect: 4 },
          { call: 'dequeue', expect: 5 },
          { call: 'isEmpty', expect: true },
        ],
      },
    ],
  },
  {
    id: 'impl-deque',
    title: 'Build a Deque',
    statement: `A **deque** ("deck") is a double-ended queue: push and pop at **both** ends in O(1). A stack uses one end; a queue uses both ends in one direction; a deque uses both ends freely.

Generalize the ring buffer: \`push_front\` moves \`head\` backward (with wraparound); \`push_back\` writes after the last item. With a \`head\` index and a \`size\`, every end operation is O(1).

Build a \`Deque\`:

- \`push_front(x)\` / \`push_back(x)\`
- \`pop_front()\` / \`pop_back()\` — return the item, \`None\`/\`null\` if empty.
- \`peek_front()\` / \`peek_back()\`
- \`size()\`, \`is_empty()\` / \`isEmpty()\``,
    methods: [
      { name: 'pushFront', sig: 'push_front(x)', doc: 'Add x to the front.' },
      { name: 'pushBack', sig: 'push_back(x)', doc: 'Add x to the back.' },
      { name: 'popFront', sig: 'pop_front() -> item', doc: 'Remove + return front (None/null if empty).' },
      { name: 'popBack', sig: 'pop_back() -> item', doc: 'Remove + return back (None/null if empty).' },
      { name: 'peekFront', sig: 'peek_front() -> item', doc: 'Front without removing.' },
      { name: 'peekBack', sig: 'peek_back() -> item', doc: 'Back without removing.' },
      { name: 'size', sig: 'size() -> int', doc: 'Number of items.' },
      { name: 'isEmpty', sig: 'is_empty() -> bool', doc: 'True when empty.' },
    ],
    className: { py: 'Deque', js: 'Deque' },
    methodAliases: {
      py: {
        pushFront: 'push_front',
        pushBack: 'push_back',
        popFront: 'pop_front',
        popBack: 'pop_back',
        peekFront: 'peek_front',
        peekBack: 'peek_back',
        isEmpty: 'is_empty',
      },
    },
    complexity: { time: 'O(1) amortized per operation', space: 'O(n)' },
    hints: [
      'Same ring buffer as the queue: fixed array, head index, size.',
      'push_back writes at (head + size) % cap. push_front sets head = (head - 1 + cap) % cap then writes there.',
      'pop_back just decrements size; pop_front reads head then advances it. Grow when size == cap.',
    ],
    starter: {
      py: `class Deque:
    def __init__(self):
        # TODO: fixed array, head index, size
        pass

    def push_front(self, x):
        pass

    def push_back(self, x):
        pass

    def pop_front(self):
        pass

    def pop_back(self):
        pass

    def peek_front(self):
        pass

    def peek_back(self):
        pass

    def size(self):
        pass

    def is_empty(self):
        pass
`,
      js: `class Deque {
  constructor() {
    // TODO: fixed array, head index, size
  }

  pushFront(x) {}
  pushBack(x) {}
  popFront() {}
  popBack() {}
  peekFront() {}
  peekBack() {}
  size() {}
  isEmpty() {}
}
`,
    },
    reference: {
      py: `class Deque:
    def __init__(self):
        self._cap = 4
        self._data = [None] * self._cap
        self._head = 0
        self._size = 0

    def _grow(self):
        new = [None] * (self._cap * 2)
        for i in range(self._size):
            new[i] = self._data[(self._head + i) % self._cap]
        self._data = new
        self._head = 0
        self._cap *= 2

    def push_back(self, x):
        if self._size == self._cap:
            self._grow()
        self._data[(self._head + self._size) % self._cap] = x
        self._size += 1

    def push_front(self, x):
        if self._size == self._cap:
            self._grow()
        self._head = (self._head - 1) % self._cap
        self._data[self._head] = x
        self._size += 1

    def pop_front(self):
        if self._size == 0:
            return None
        x = self._data[self._head]
        self._head = (self._head + 1) % self._cap
        self._size -= 1
        return x

    def pop_back(self):
        if self._size == 0:
            return None
        i = (self._head + self._size - 1) % self._cap
        self._size -= 1
        return self._data[i]

    def peek_front(self):
        return None if self._size == 0 else self._data[self._head]

    def peek_back(self):
        return None if self._size == 0 else self._data[(self._head + self._size - 1) % self._cap]

    def size(self):
        return self._size

    def is_empty(self):
        return self._size == 0
`,
      js: `class Deque {
  constructor() {
    this._cap = 4;
    this._data = new Array(this._cap).fill(null);
    this._head = 0;
    this._size = 0;
  }

  _grow() {
    const next = new Array(this._cap * 2).fill(null);
    for (let i = 0; i < this._size; i++) next[i] = this._data[(this._head + i) % this._cap];
    this._data = next;
    this._head = 0;
    this._cap *= 2;
  }

  pushBack(x) {
    if (this._size === this._cap) this._grow();
    this._data[(this._head + this._size) % this._cap] = x;
    this._size++;
  }

  pushFront(x) {
    if (this._size === this._cap) this._grow();
    this._head = (this._head - 1 + this._cap) % this._cap;
    this._data[this._head] = x;
    this._size++;
  }

  popFront() {
    if (this._size === 0) return null;
    const x = this._data[this._head];
    this._head = (this._head + 1) % this._cap;
    this._size--;
    return x;
  }

  popBack() {
    if (this._size === 0) return null;
    const i = (this._head + this._size - 1) % this._cap;
    this._size--;
    return this._data[i];
  }

  peekFront() {
    return this._size === 0 ? null : this._data[this._head];
  }

  peekBack() {
    return this._size === 0 ? null : this._data[(this._head + this._size - 1) % this._cap];
  }

  size() {
    return this._size;
  }

  isEmpty() {
    return this._size === 0;
  }
}
`,
    },
    tests: [
      {
        name: 'both ends',
        ops: [
          { call: 'pushBack', args: [1] },
          { call: 'pushBack', args: [2] },
          { call: 'pushFront', args: [0] },
          { call: 'peekFront', expect: 0 },
          { call: 'peekBack', expect: 2 },
          { call: 'size', expect: 3 },
          { call: 'popFront', expect: 0 },
          { call: 'popBack', expect: 2 },
          { call: 'popFront', expect: 1 },
          { call: 'isEmpty', expect: true },
        ],
      },
      {
        name: 'empty behavior',
        ops: [
          { call: 'popFront', expect: null },
          { call: 'popBack', expect: null },
          { call: 'peekFront', expect: null },
          { call: 'peekBack', expect: null },
          { call: 'size', expect: 0 },
        ],
      },
      {
        name: 'front-heavy growth',
        ops: [
          { call: 'pushFront', args: [1] },
          { call: 'pushFront', args: [2] },
          { call: 'pushFront', args: [3] },
          { call: 'pushFront', args: [4] },
          { call: 'pushFront', args: [5] },
          { call: 'size', expect: 5 },
          { call: 'peekFront', expect: 5 },
          { call: 'peekBack', expect: 1 },
          { call: 'popBack', expect: 1 },
          { call: 'popFront', expect: 5 },
          { call: 'size', expect: 3 },
        ],
      },
    ],
  },
];

export default implementations;
