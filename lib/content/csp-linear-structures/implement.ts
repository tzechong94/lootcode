import type { Implementation } from '@/lib/types';

const implementations: Implementation[] = [
  {
    id: 'dll-deque',
    title: 'Build a Deque (doubly linked list)',
    statement: `A **deque** ("deck") is a double-ended queue: push and pop at **both** ends in O(1). CS Primer builds it on a **doubly linked list** — each node points to both its previous and next neighbour — so you get O(1) at both ends with **no periodic resize** (unlike an array-backed version).

Keep a \`head\` and a \`tail\` pointer. Pushing links a new node at one end; popping unlinks a node from an end and fixes the neighbour's pointer. The one thing to get right is the **empty/one-element** transitions, where head and tail meet.

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
    complexity: { time: 'O(1) per operation', space: 'O(n)' },
    hints: [
      'Each node holds a value plus prev and next pointers. Track head and tail.',
      'push_front on an empty deque sets head = tail = new node; otherwise link the new node before head.',
      'When popping the last element, reset both head and tail to null — that is the case people forget.',
    ],
    starter: {
      py: `class Deque:
    def __init__(self):
        # TODO: head, tail, size
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
    // TODO: head, tail, size
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
      py: `class _Node:
    def __init__(self, value):
        self.value = value
        self.prev = None
        self.next = None


class Deque:
    def __init__(self):
        self._head = None
        self._tail = None
        self._size = 0

    def push_front(self, x):
        node = _Node(x)
        if self._head is None:
            self._head = self._tail = node
        else:
            node.next = self._head
            self._head.prev = node
            self._head = node
        self._size += 1

    def push_back(self, x):
        node = _Node(x)
        if self._tail is None:
            self._head = self._tail = node
        else:
            node.prev = self._tail
            self._tail.next = node
            self._tail = node
        self._size += 1

    def pop_front(self):
        if self._head is None:
            return None
        node = self._head
        self._head = node.next
        if self._head is None:
            self._tail = None
        else:
            self._head.prev = None
        self._size -= 1
        return node.value

    def pop_back(self):
        if self._tail is None:
            return None
        node = self._tail
        self._tail = node.prev
        if self._tail is None:
            self._head = None
        else:
            self._tail.next = None
        self._size -= 1
        return node.value

    def peek_front(self):
        return None if self._head is None else self._head.value

    def peek_back(self):
        return None if self._tail is None else self._tail.value

    def size(self):
        return self._size

    def is_empty(self):
        return self._size == 0
`,
      js: `class _Node {
  constructor(value) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class Deque {
  constructor() {
    this._head = null;
    this._tail = null;
    this._size = 0;
  }

  pushFront(x) {
    const node = new _Node(x);
    if (this._head === null) {
      this._head = this._tail = node;
    } else {
      node.next = this._head;
      this._head.prev = node;
      this._head = node;
    }
    this._size++;
  }

  pushBack(x) {
    const node = new _Node(x);
    if (this._tail === null) {
      this._head = this._tail = node;
    } else {
      node.prev = this._tail;
      this._tail.next = node;
      this._tail = node;
    }
    this._size++;
  }

  popFront() {
    if (this._head === null) return null;
    const node = this._head;
    this._head = node.next;
    if (this._head === null) this._tail = null;
    else this._head.prev = null;
    this._size--;
    return node.value;
  }

  popBack() {
    if (this._tail === null) return null;
    const node = this._tail;
    this._tail = node.prev;
    if (this._tail === null) this._head = null;
    else this._tail.next = null;
    this._size--;
    return node.value;
  }

  peekFront() {
    return this._head === null ? null : this._head.value;
  }

  peekBack() {
    return this._tail === null ? null : this._tail.value;
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
        name: 'drain then refill (head/tail transitions)',
        ops: [
          { call: 'pushBack', args: [1] },
          { call: 'popBack', expect: 1 },
          { call: 'isEmpty', expect: true },
          { call: 'pushFront', args: [9] },
          { call: 'peekBack', expect: 9 },
          { call: 'peekFront', expect: 9 },
          { call: 'popFront', expect: 9 },
          { call: 'size', expect: 0 },
        ],
      },
      {
        // Mirror of 'drain then refill', which only ever empties via popBack, so a
        // popFront that forgets to clear tail goes unnoticed.
        name: 'drain from the front, then refill',
        ops: [
          { call: 'pushBack', args: [1] },
          { call: 'popFront', expect: 1 },
          { call: 'isEmpty', expect: true },
          { call: 'size', expect: 0 },
          { call: 'pushBack', args: [2] },
          { call: 'peekFront', expect: 2 },
          { call: 'peekBack', expect: 2 },
          { call: 'size', expect: 1 },
          { call: 'popFront', expect: 2 },
          { call: 'isEmpty', expect: true },
        ],
      },
      {
        // Nothing else pushes to the front twice in a row, so head.prev never has to be right.
        name: 'repeated pushFront, drained from the back',
        ops: [
          { call: 'pushFront', args: [3] },
          { call: 'pushFront', args: [2] },
          { call: 'pushFront', args: [1] },
          { call: 'size', expect: 3 },
          { call: 'popBack', expect: 3 },
          { call: 'popBack', expect: 2 },
          { call: 'popBack', expect: 1 },
          { call: 'isEmpty', expect: true },
          { call: 'popBack', expect: null },
        ],
      },
      {
        // Builds [1,2,3,4] from both ends, then drains one way: catches a pushBack
        // that never links tail.next.
        name: 'interleaved build, drained from the front',
        ops: [
          { call: 'pushFront', args: [2] },
          { call: 'pushFront', args: [1] },
          { call: 'pushBack', args: [3] },
          { call: 'pushBack', args: [4] },
          { call: 'size', expect: 4 },
          { call: 'popFront', expect: 1 },
          { call: 'popFront', expect: 2 },
          { call: 'popFront', expect: 3 },
          { call: 'popFront', expect: 4 },
          { call: 'size', expect: 0 },
        ],
      },
      {
        name: 'peeks do not mutate, and go null once drained',
        ops: [
          { call: 'pushBack', args: [7] },
          { call: 'peekFront', expect: 7 },
          { call: 'peekFront', expect: 7 },
          { call: 'peekBack', expect: 7 },
          { call: 'size', expect: 1 },
          { call: 'popBack', expect: 7 },
          { call: 'peekFront', expect: null },
          { call: 'peekBack', expect: null },
          { call: 'size', expect: 0 },
          { call: 'popFront', expect: null },
        ],
      },
      {
        // A stored 0 is a real item: rules out isEmpty written as `not self.peek_front()`.
        name: 'a stored 0 is not emptiness',
        ops: [
          { call: 'pushFront', args: [0] },
          { call: 'isEmpty', expect: false },
          { call: 'size', expect: 1 },
          { call: 'peekFront', expect: 0 },
          { call: 'peekBack', expect: 0 },
          { call: 'popBack', expect: 0 },
          { call: 'isEmpty', expect: true },
        ],
      },
    ],
  },
];

export default implementations;
