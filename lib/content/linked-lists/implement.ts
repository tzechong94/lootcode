import type { Implementation } from '@/lib/types';

const implementations: Implementation[] = [
  {
    id: 'impl-linked-list',
    title: 'Build a Linked List',
    statement: `An array stores elements in one contiguous block, so indexing is O(1) but inserting in the middle shifts everything. A **linked list** trades that: each element is a **node** holding a value and a pointer to the \`next\` node. There's no contiguous block, so indexing is O(n) — but splicing a node in or out is O(1) once you're there.

Build a singly linked \`LinkedList\` (keep a \`head\`, a \`tail\`, and a \`size\`):

- \`push_front(x)\` / \`push_back(x)\` — add a node at either end (O(1)).
- \`pop_front()\` — remove + return the front value; \`None\`/\`null\` if empty.
- \`get(i)\` — value at index \`i\` (0-based), or \`None\`/\`null\` if out of range.
- \`insert(i, x)\` — insert \`x\` so it ends up at index \`i\`.
- \`remove(i)\` — remove the node at index \`i\`.
- \`size()\` and \`to_list()\` / \`toList()\` — return the values as an array (front → back).`,
    methods: [
      { name: 'pushFront', sig: 'push_front(x)', doc: 'Add a node at the front.' },
      { name: 'pushBack', sig: 'push_back(x)', doc: 'Add a node at the back.' },
      { name: 'popFront', sig: 'pop_front() -> value', doc: 'Remove + return the front (None/null if empty).' },
      { name: 'get', sig: 'get(i) -> value', doc: 'Value at index i, or None/null if out of range.' },
      { name: 'insert', sig: 'insert(i, x)', doc: 'Insert x at index i.' },
      { name: 'remove', sig: 'remove(i)', doc: 'Remove the node at index i.' },
      { name: 'size', sig: 'size() -> int', doc: 'Number of nodes.' },
      { name: 'toList', sig: 'to_list() -> list', doc: 'Values front → back.' },
    ],
    className: { py: 'LinkedList', js: 'LinkedList' },
    methodAliases: {
      py: { pushFront: 'push_front', pushBack: 'push_back', popFront: 'pop_front', toList: 'to_list' },
    },
    complexity: { time: 'O(1) at the ends, O(n) by index', space: 'O(n)' },
    hints: [
      'A node holds a value and a next pointer. Keep head, tail, and a size counter on the list.',
      'push_back links the old tail to the new node, then moves tail. Watch the empty-list case (head and tail both become the new node).',
      'To insert/remove at index i, walk to the node just before i, then relink pointers. Update tail when you touch the last node.',
    ],
    starter: {
      py: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None


class LinkedList:
    def __init__(self):
        # TODO: head, tail, size
        pass

    def push_front(self, x):
        pass

    def push_back(self, x):
        pass

    def pop_front(self):
        pass

    def get(self, i):
        pass

    def insert(self, i, x):
        pass

    def remove(self, i):
        pass

    def size(self):
        pass

    def to_list(self):
        pass
`,
      js: `class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    // TODO: head, tail, size
  }

  pushFront(x) {}
  pushBack(x) {}
  popFront() {}
  get(i) {}
  insert(i, x) {}
  remove(i) {}
  size() {}
  toList() {}
}
`,
    },
    reference: {
      py: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None


class LinkedList:
    def __init__(self):
        self.head = None
        self.tail = None
        self._size = 0

    def push_front(self, x):
        node = Node(x)
        node.next = self.head
        self.head = node
        if self.tail is None:
            self.tail = node
        self._size += 1

    def push_back(self, x):
        node = Node(x)
        if self.tail is not None:
            self.tail.next = node
        else:
            self.head = node
        self.tail = node
        self._size += 1

    def pop_front(self):
        if self.head is None:
            return None
        node = self.head
        self.head = node.next
        if self.head is None:
            self.tail = None
        self._size -= 1
        return node.val

    def get(self, i):
        if i < 0 or i >= self._size:
            return None
        cur = self.head
        for _ in range(i):
            cur = cur.next
        return cur.val

    def insert(self, i, x):
        if i <= 0:
            self.push_front(x)
            return
        if i >= self._size:
            self.push_back(x)
            return
        prev = self.head
        for _ in range(i - 1):
            prev = prev.next
        node = Node(x)
        node.next = prev.next
        prev.next = node
        self._size += 1

    def remove(self, i):
        if i < 0 or i >= self._size:
            return
        if i == 0:
            self.pop_front()
            return
        prev = self.head
        for _ in range(i - 1):
            prev = prev.next
        prev.next = prev.next.next
        if prev.next is None:
            self.tail = prev
        self._size -= 1

    def size(self):
        return self._size

    def to_list(self):
        out = []
        cur = self.head
        while cur is not None:
            out.append(cur.val)
            cur = cur.next
        return out
`,
      js: `class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this._size = 0;
  }

  pushFront(x) {
    const node = new Node(x);
    node.next = this.head;
    this.head = node;
    if (this.tail === null) this.tail = node;
    this._size++;
  }

  pushBack(x) {
    const node = new Node(x);
    if (this.tail !== null) this.tail.next = node;
    else this.head = node;
    this.tail = node;
    this._size++;
  }

  popFront() {
    if (this.head === null) return null;
    const node = this.head;
    this.head = node.next;
    if (this.head === null) this.tail = null;
    this._size--;
    return node.val;
  }

  get(i) {
    if (i < 0 || i >= this._size) return null;
    let cur = this.head;
    for (let k = 0; k < i; k++) cur = cur.next;
    return cur.val;
  }

  insert(i, x) {
    if (i <= 0) { this.pushFront(x); return; }
    if (i >= this._size) { this.pushBack(x); return; }
    let prev = this.head;
    for (let k = 0; k < i - 1; k++) prev = prev.next;
    const node = new Node(x);
    node.next = prev.next;
    prev.next = node;
    this._size++;
  }

  remove(i) {
    if (i < 0 || i >= this._size) return;
    if (i === 0) { this.popFront(); return; }
    let prev = this.head;
    for (let k = 0; k < i - 1; k++) prev = prev.next;
    prev.next = prev.next.next;
    if (prev.next === null) this.tail = prev;
    this._size--;
  }

  size() {
    return this._size;
  }

  toList() {
    const out = [];
    let cur = this.head;
    while (cur !== null) { out.push(cur.val); cur = cur.next; }
    return out;
  }
}
`,
    },
    tests: [
      {
        name: 'push both ends',
        ops: [
          { call: 'pushBack', args: [2] },
          { call: 'pushBack', args: [3] },
          { call: 'pushFront', args: [1] },
          { call: 'toList', expect: [1, 2, 3] },
          { call: 'size', expect: 3 },
          { call: 'get', args: [0], expect: 1 },
          { call: 'get', args: [2], expect: 3 },
          { call: 'get', args: [5], expect: null },
        ],
      },
      {
        name: 'insert and remove by index',
        ops: [
          { call: 'pushBack', args: [1] },
          { call: 'pushBack', args: [4] },
          { call: 'insert', args: [1, 2] },
          { call: 'insert', args: [2, 3] },
          { call: 'toList', expect: [1, 2, 3, 4] },
          { call: 'remove', args: [0] },
          { call: 'toList', expect: [2, 3, 4] },
          { call: 'remove', args: [2] },
          { call: 'toList', expect: [2, 3] },
          { call: 'size', expect: 2 },
        ],
      },
      {
        name: 'pop_front to empty',
        ops: [
          { call: 'popFront', expect: null },
          { call: 'pushBack', args: [9] },
          { call: 'popFront', expect: 9 },
          { call: 'popFront', expect: null },
          { call: 'toList', expect: [] },
          { call: 'size', expect: 0 },
        ],
      },
    ],
  },
];

export default implementations;
