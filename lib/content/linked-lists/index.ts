import type { Topic, TutorialBlock } from '@/lib/types';
import implementations from './implement';

const PREAMBLE_PY = `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def build_list(arr):
    dummy = ListNode()
    cur = dummy
    for x in arr:
        cur.next = ListNode(x)
        cur = cur.next
    return dummy.next

def to_array(node):
    out = []
    while node:
        out.append(node.val)
        node = node.next
    return out
`;

const PREAMBLE_JS = `class ListNode {
  constructor(val = 0, next = null) { this.val = val; this.next = next; }
}
function buildList(arr) {
  const dummy = new ListNode();
  let cur = dummy;
  for (const x of arr) { cur.next = new ListNode(x); cur = cur.next; }
  return dummy.next;
}
function toArray(node) {
  const out = [];
  while (node) { out.push(node.val); node = node.next; }
  return out;
}
`;

const tutorial = `
## Linked Lists — first principles

A linked list stores each value in its own **node**, and each node holds a pointer to the next one.
Unlike an array, the elements aren't contiguous in memory — you reach element \`k\` only by walking
the \`next\` pointers from the head. That trade-off defines everything:

| | Array | Linked list |
|---|---|---|
| Access by index | O(1) | O(n) |
| Insert/delete at a known node | O(n) (shift) | **O(1)** (relink pointers) |
| Memory | contiguous | scattered + pointer overhead |

So linked lists win when you're constantly **splicing** nodes in and out and don't need random
access — and interviewers love them because they force you to reason carefully about pointers.

> In these problems the I/O is an array for convenience, but a real \`ListNode\` is built for you
> (\`build_list\` / \`buildList\`) and you return one via \`to_array\` / \`toArray\`. Write genuine
> pointer logic in between.

### The three techniques that cover most problems

**1. The dummy (sentinel) head.** Allocate a fake node before the real head and build your result
off it. This removes the special case of "what if I'm modifying the first node?" — the dummy is
never first. Return \`dummy.next\`.

**2. Iterative pointer reversal.** Walk the list carrying \`prev\`, and at each node save \`next\`,
point \`cur.next\` back to \`prev\`, then advance. This reverses links in O(n) time, O(1) space:

\`\`\`text
prev = None
while cur:
    nxt = cur.next     # save before you overwrite it
    cur.next = prev    # reverse the link
    prev = cur         # advance prev and cur
    cur = nxt
# prev is the new head
\`\`\`

**3. Fast & slow pointers (Floyd's).** Move one pointer one step and another two steps. They find
the **middle** in one pass, and detect a **cycle** (if \`fast\` ever meets \`slow\`, there's a loop).
A two-pointer gap of \`n\` also lets you find the \`n\`-th node from the end in a single pass.

### Key points to remember

- Random access is O(n); the payoff is O(1) insert/delete *once you hold the node*.
- Always save \`node.next\` **before** you overwrite it, or you'll lose the rest of the list.
- A dummy head eliminates head-modification edge cases — use it whenever the head might change.
- Fast/slow pointers find the middle and detect cycles in O(1) space.
- Draw the pointers. Most linked-list bugs are one mis-ordered assignment.
`;

const blocks: TutorialBlock[] = [
  {
    kind: 'md',
    md: `## Linked Lists — from first principles

To really get linked lists, compare them to arrays at the level of **memory**.

An **array** is one **contiguous** block. Because the elements are packed side by side at a fixed
size, the address of element \`i\` is just \`base + i × size\` — the machine computes it and jumps. That's
why \`a[i]\` is **O(1)**. The price: to insert or delete in the middle, every later element must shift
over to keep the block contiguous — **O(n)**.`,
  },
  {
    kind: 'viz',
    spec: {
      type: 'array',
      title: 'Array: contiguous memory — O(1) index, O(n) middle-insert',
      frames: [
        { caption: 'An array is one contiguous block. Element i lives at address base + i × size.', cells: [{ value: 10 }, { value: 20 }, { value: 30 }, { value: 40 }] },
        { caption: 'Random access by index is O(1): compute the address and jump straight to it.', cells: [{ value: 10 }, { value: 20 }, { value: 30, state: 'active' }, { value: 40 }] },
        { caption: 'But insert in the middle and every later element must shift right to stay contiguous → O(n).', cells: [{ value: 10 }, { value: 99, state: 'match' }, { value: 20, state: 'compare' }, { value: 30, state: 'compare' }, { value: 40, state: 'compare' }] },
      ],
    },
  },
  {
    kind: 'md',
    md: `A **linked list** makes the opposite trade. Each value lives in its own **node** that also stores a
**pointer** to the next node. Nodes can sit *anywhere* in memory — they're stitched together by
pointers, not by adjacency. So there's no address arithmetic: to reach the k-th node you must **walk**
the pointers from the head (**O(n)** access). But inserting or deleting, once you're holding the spot,
is just relinking a couple of pointers — **O(1)**, nothing shifts.`,
  },
  {
    kind: 'viz',
    spec: {
      type: 'list',
      title: 'Linked list: scattered nodes + pointers — O(n) access, O(1) splice',
      frames: [
        { caption: 'Each node holds a value and a pointer to the next. Nodes need not be contiguous in memory.', nodes: [{ value: 10 }, { value: 20 }, { value: 30 }, { value: 40 }], pointers: [{ name: 'head', index: 0 }] },
        { caption: 'No addresses to compute — to reach the k-th node you walk the pointers → O(n) access.', nodes: [{ value: 10, state: 'dim' }, { value: 20, state: 'dim' }, { value: 30, state: 'active' }, { value: 40 }], pointers: [{ name: 'cur', index: 2 }] },
        { caption: 'Insert once you hold the spot: make a node and relink two pointers. O(1) — nothing shifts.', nodes: [{ value: 10 }, { value: 20 }, { value: 99, state: 'match' }, { value: 30 }, { value: 40 }], pointers: [] },
      ],
    },
  },
  {
    kind: 'md',
    md: `So: arrays win on random access and cache-friendliness; linked lists win when you're constantly
splicing nodes in and out and don't need indexing. Interviewers love them because they force precise
pointer reasoning.

> In these problems the I/O is an array for convenience, but a real \`ListNode\` is built for you
> (\`build_list\` / \`buildList\`) and you return one via \`to_array\` / \`toArray\`. Write genuine pointer
> logic in between.

### The three techniques that cover most problems

**1. Dummy (sentinel) head** — a fake node before the real head, so "modifying the first node" stops
being a special case. Build your result off the dummy and return \`dummy.next\`.

**2. Iterative reversal** — carry \`prev\`; at each node save \`next\`, point \`cur.next\` back at \`prev\`,
then advance. O(n) time, O(1) space. Step through it:`,
  },
  {
    kind: 'viz',
    spec: {
      type: 'list',
      title: 'Reversing a list in one pass (prev / cur)',
      frames: [
        { caption: 'Goal: flip every pointer to face backward. Start with prev = null, cur = node 1.', nodes: [{ value: 1 }, { value: 2 }, { value: 3 }], pointers: [{ name: 'prev', index: null }, { name: 'cur', index: 0 }] },
        { caption: "Point node 1's next at prev (null) — it becomes the new tail. Advance: prev = 1, cur = 2.", nodes: [{ value: 1, state: 'done' }, { value: 2 }, { value: 3 }], pointers: [{ name: 'prev', index: 0 }, { name: 'cur', index: 1 }] },
        { caption: 'Point node 2 back at node 1. prev = 2, cur = 3.', nodes: [{ value: 1, state: 'done' }, { value: 2, state: 'done' }, { value: 3 }], pointers: [{ name: 'prev', index: 1 }, { name: 'cur', index: 2 }] },
        { caption: 'Point node 3 back at node 2. cur falls off the end — done. The new head is prev = node 3.', nodes: [{ value: 1, state: 'done' }, { value: 2, state: 'done' }, { value: 3, state: 'done' }], pointers: [{ name: 'prev', index: 2 }, { name: 'cur', index: null }] },
      ],
    },
  },
  {
    kind: 'md',
    md: `**3. Fast & slow pointers (Floyd's)** — one pointer steps once, another twice. They find the
**middle** in a single pass, and detect a **cycle** (if fast ever meets slow). A fixed *gap* of \`n\`
between two pointers also finds the n-th node from the end in one pass.

### Key points to remember

- Array = contiguous memory: O(1) index, O(n) middle-insert. Linked list = scattered nodes + pointers: O(n) access, O(1) splice.
- Always save \`node.next\` **before** overwriting it, or you lose the rest of the list.
- A **dummy head** removes head-modification edge cases — use it whenever the head might change.
- **Fast/slow** pointers find the middle and detect cycles in O(1) space.
- Draw the pointers — most linked-list bugs are one mis-ordered assignment.`,
  },
];

const topic: Topic = {
  slug: 'linked-lists',
  title: 'Linked Lists',
  order: 7,
  section: 'data-structure',
  blurb: 'Pointer manipulation: dummy heads, in-place reversal, and fast/slow two-pointer tricks.',
  tutorial,
  blocks,
  implementations,
  problems: [
    {
      id: 'reverse-linked-list',
      title: 'Reverse Linked List',
      difficulty: 'Easy',
      topicSlug: 'linked-lists',
      statement: `Reverse a singly linked list and return the reversed list.

\`values\` is the list as an array; a \`ListNode\` head is built for you. Return the reversed list as an array (use \`to_array\` / \`toArray\`).`,
      constraints: ['0 ≤ length ≤ 5000', '-5000 ≤ Node.val ≤ 5000'],
      examples: [
        { input: 'values = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
        { input: 'values = []', output: '[]' },
      ],
      functionName: { py: 'reverse_list', js: 'reverseList' },
      preamble: { py: PREAMBLE_PY, js: PREAMBLE_JS },
      starter: {
        py: 'def reverse_list(values):\n    head = build_list(values)  # a ListNode (or None)\n    # TODO: reverse the list, then return to_array(new_head)\n    pass\n',
        js: 'function reverseList(values) {\n  const head = buildList(values); // a ListNode (or null)\n  // TODO: reverse the list, then return toArray(newHead)\n}\n',
      },
      reference: {
        py: 'def reverse_list(values):\n    head = build_list(values)\n    prev = None\n    cur = head\n    while cur:\n        nxt = cur.next\n        cur.next = prev\n        prev = cur\n        cur = nxt\n    return to_array(prev)\n',
        js: 'function reverseList(values) {\n  const head = buildList(values);\n  let prev = null;\n  let cur = head;\n  while (cur) {\n    const nxt = cur.next;\n    cur.next = prev;\n    prev = cur;\n    cur = nxt;\n  }\n  return toArray(prev);\n}\n',
      },
      tests: [
        { input: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
        { input: [[1, 2]], expected: [2, 1] },
        { input: [[]], expected: [] },
        { input: [[7]], expected: [7] },
      ],
      hints: [
        'Walk the list once, flipping each node’s next pointer to point backward.',
        'Track the previous node; the reversed head is the last node you visit.',
        'Save the next pointer before overwriting it.',
      ],
      complexity: { time: 'O(n)', space: 'O(1)' },
    },
    {
      id: 'merge-two-sorted-lists',
      title: 'Merge Two Sorted Lists',
      difficulty: 'Easy',
      topicSlug: 'linked-lists',
      statement: `Merge two sorted linked lists into one sorted list by splicing their nodes together.

\`a\` and \`b\` are the two lists as arrays; both \`ListNode\` heads are built for you. Return the merged list as an array.`,
      constraints: ['0 ≤ each length ≤ 50', '-100 ≤ Node.val ≤ 100', 'Both lists are sorted ascending.'],
      examples: [
        { input: 'a = [1,2,4], b = [1,3,4]', output: '[1,1,2,3,4,4]' },
        { input: 'a = [], b = [0]', output: '[0]' },
      ],
      functionName: { py: 'merge_two_lists', js: 'mergeTwoLists' },
      preamble: { py: PREAMBLE_PY, js: PREAMBLE_JS },
      starter: {
        py: 'def merge_two_lists(a, b):\n    l1 = build_list(a)\n    l2 = build_list(b)\n    # TODO: merge l1 and l2, then return to_array(merged_head)\n    pass\n',
        js: 'function mergeTwoLists(a, b) {\n  const l1 = buildList(a);\n  const l2 = buildList(b);\n  // TODO: merge l1 and l2, then return toArray(mergedHead)\n}\n',
      },
      reference: {
        py: 'def merge_two_lists(a, b):\n    l1 = build_list(a)\n    l2 = build_list(b)\n    dummy = ListNode()\n    tail = dummy\n    while l1 and l2:\n        if l1.val <= l2.val:\n            tail.next = l1\n            l1 = l1.next\n        else:\n            tail.next = l2\n            l2 = l2.next\n        tail = tail.next\n    tail.next = l1 if l1 else l2\n    return to_array(dummy.next)\n',
        js: 'function mergeTwoLists(a, b) {\n  let l1 = buildList(a);\n  let l2 = buildList(b);\n  const dummy = new ListNode();\n  let tail = dummy;\n  while (l1 && l2) {\n    if (l1.val <= l2.val) {\n      tail.next = l1;\n      l1 = l1.next;\n    } else {\n      tail.next = l2;\n      l2 = l2.next;\n    }\n    tail = tail.next;\n  }\n  tail.next = l1 ? l1 : l2;\n  return toArray(dummy.next);\n}\n',
      },
      referenceLabel: 'Iterative (dummy head)',
      alternates: [
        {
          label: 'Recursive',
          code: {
            py: 'def merge_two_lists(a, b):\n    l1 = build_list(a)\n    l2 = build_list(b)\n    def merge(p, q):\n        # An empty list contributes nothing: the other list is the answer.\n        if not p:\n            return q\n        if not q:\n            return p\n        if p.val <= q.val:\n            p.next = merge(p.next, q)\n            return p\n        q.next = merge(p, q.next)\n        return q\n    return to_array(merge(l1, l2))\n',
            js: 'function mergeTwoLists(a, b) {\n  const l1 = buildList(a);\n  const l2 = buildList(b);\n  function merge(p, q) {\n    // An empty list contributes nothing: the other list is the answer.\n    if (!p) return q;\n    if (!q) return p;\n    if (p.val <= q.val) {\n      p.next = merge(p.next, q);\n      return p;\n    }\n    q.next = merge(p, q.next);\n    return q;\n  }\n  return toArray(merge(l1, l2));\n}\n',
          },
        },
      ],
      tests: [
        { input: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4] },
        { input: [[], []], expected: [] },
        { input: [[], [0]], expected: [0] },
        { input: [[2], [1]], expected: [1, 2] },
        { input: [[1, 2, 3], [4, 5, 6]], expected: [1, 2, 3, 4, 5, 6] },
      ],
      hints: [
        'Use a dummy head so you never special-case the first node of the result.',
        'Repeatedly attach the smaller of the two front nodes and advance that list.',
        'When one list runs out, attach the entire remainder of the other.',
      ],
      complexity: { time: 'O(n + m)', space: 'O(1)' },
    },
    {
      id: 'remove-nth-from-end',
      title: 'Remove Nth Node From End of List',
      difficulty: 'Medium',
      topicSlug: 'linked-lists',
      statement: `Remove the \`n\`-th node from the **end** of the list and return the resulting list.

\`values\` is the list as an array; a \`ListNode\` head is built for you. Return the result as an array.`,
      constraints: ['1 ≤ length ≤ 30', '1 ≤ n ≤ length'],
      examples: [
        { input: 'values = [1,2,3,4,5], n = 2', output: '[1,2,3,5]' },
        { input: 'values = [1], n = 1', output: '[]' },
      ],
      functionName: { py: 'remove_nth_from_end', js: 'removeNthFromEnd' },
      preamble: { py: PREAMBLE_PY, js: PREAMBLE_JS },
      starter: {
        py: 'def remove_nth_from_end(values, n):\n    head = build_list(values)\n    # TODO: remove the n-th node from the end, return to_array(head)\n    pass\n',
        js: 'function removeNthFromEnd(values, n) {\n  const head = buildList(values);\n  // TODO: remove the n-th node from the end, return toArray(head)\n}\n',
      },
      reference: {
        py: 'def remove_nth_from_end(values, n):\n    head = build_list(values)\n    dummy = ListNode(0, head)\n    fast = slow = dummy\n    for _ in range(n):\n        fast = fast.next\n    while fast.next:\n        fast = fast.next\n        slow = slow.next\n    slow.next = slow.next.next\n    return to_array(dummy.next)\n',
        js: 'function removeNthFromEnd(values, n) {\n  const head = buildList(values);\n  const dummy = new ListNode(0, head);\n  let fast = dummy;\n  let slow = dummy;\n  for (let i = 0; i < n; i++) fast = fast.next;\n  while (fast.next) {\n    fast = fast.next;\n    slow = slow.next;\n  }\n  slow.next = slow.next.next;\n  return toArray(dummy.next);\n}\n',
      },
      tests: [
        { input: [[1, 2, 3, 4, 5], 2], expected: [1, 2, 3, 5] },
        { input: [[1], 1], expected: [] },
        { input: [[1, 2], 1], expected: [1] },
        { input: [[1, 2], 2], expected: [2] },
        { input: [[1, 2, 3, 4, 5], 5], expected: [2, 3, 4, 5] },
      ],
      hints: [
        'A dummy head makes removing the first node uniform with the rest.',
        'Advance a fast pointer n steps ahead, then move both until fast reaches the last node.',
        'Now slow sits just before the target — relink slow.next to skip it.',
      ],
      complexity: { time: 'O(n)', space: 'O(1)' },
    },
    {
      id: 'design-doubly-linked-list',
      title: 'Design a Doubly Linked List',
      difficulty: 'Medium',
      topicSlug: 'linked-lists',
      statement: `Implement a doubly linked list with sentinel head/tail. Support \`addAtHead(v)\`, \`addAtTail(v)\`, \`addAtIndex(i, v)\` (insert before index \`i\`; if \`i\` equals the length, append; if \`i > length\`, do nothing), \`get(i)\` (value at index \`i\`, or \`-1\`), and \`deleteAtIndex(i)\`. (CSPrimer's "Doubly linked list".)

You are given operations like \`["addAtHead", 1]\`, \`["addAtIndex", 1, 2]\`, \`["get", 1]\`, \`["deleteAtIndex", 1]\`. Return a list with each operation's result: \`null\` for mutations, the value (or \`-1\`) for \`get\`.`,
      constraints: ['0 ≤ index, val ≤ 1000', '≤ 2000 operations'],
      examples: [
        {
          input: 'ops = [["addAtHead",1],["addAtTail",3],["addAtIndex",1,2],["get",1],["deleteAtIndex",1],["get",1]]',
          output: '[null,null,null,2,null,3]',
        },
      ],
      functionName: { py: 'linked_list_ops', js: 'linkedListOps' },
      starter: {
        py: 'def linked_list_ops(ops):\n    out = []\n    # build a doubly linked list with sentinel head/tail and a size counter\n    for op in ops:\n        name = op[0]\n        # your code here\n        pass\n    return out\n',
        js: 'function linkedListOps(ops) {\n  const out = [];\n  // build a doubly linked list with sentinel head/tail and a size counter\n  for (const op of ops) {\n    const name = op[0];\n    // your code here\n  }\n  return out;\n}\n',
      },
      reference: {
        py: "def linked_list_ops(ops):\n    class Node:\n        def __init__(self, val):\n            self.val = val\n            self.prev = None\n            self.next = None\n    head, tail = Node(0), Node(0)\n    head.next = tail\n    tail.prev = head\n    size = 0\n    out = []\n    def node_at(index):\n        cur = head.next\n        for _ in range(index):\n            cur = cur.next\n        return cur\n    for op in ops:\n        name = op[0]\n        if name == 'get':\n            i = op[1]\n            out.append(node_at(i).val if 0 <= i < size else -1)\n        elif name == 'addAtHead':\n            nxt = head.next\n            node = Node(op[1])\n            head.next = node; node.prev = head; node.next = nxt; nxt.prev = node\n            size += 1\n            out.append(None)\n        elif name == 'addAtTail':\n            prev = tail.prev\n            node = Node(op[1])\n            prev.next = node; node.prev = prev; node.next = tail; tail.prev = node\n            size += 1\n            out.append(None)\n        elif name == 'addAtIndex':\n            i, val = op[1], op[2]\n            if i > size:\n                out.append(None)\n                continue\n            if i < 0:\n                i = 0\n            nxt = node_at(i) if i < size else tail\n            prev = nxt.prev\n            node = Node(val)\n            prev.next = node; node.prev = prev; node.next = nxt; nxt.prev = node\n            size += 1\n            out.append(None)\n        elif name == 'deleteAtIndex':\n            i = op[1]\n            if 0 <= i < size:\n                node = node_at(i)\n                node.prev.next = node.next\n                node.next.prev = node.prev\n                size -= 1\n            out.append(None)\n    return out\n",
        js: "function linkedListOps(ops) {\n  const make = (val) => ({ val, prev: null, next: null });\n  const head = make(0), tail = make(0);\n  head.next = tail;\n  tail.prev = head;\n  let size = 0;\n  const out = [];\n  const nodeAt = (index) => {\n    let cur = head.next;\n    for (let k = 0; k < index; k++) cur = cur.next;\n    return cur;\n  };\n  for (const op of ops) {\n    const name = op[0];\n    if (name === 'get') {\n      const i = op[1];\n      out.push(i >= 0 && i < size ? nodeAt(i).val : -1);\n    } else if (name === 'addAtHead') {\n      const nxt = head.next;\n      const node = make(op[1]);\n      head.next = node; node.prev = head; node.next = nxt; nxt.prev = node;\n      size++;\n      out.push(null);\n    } else if (name === 'addAtTail') {\n      const prev = tail.prev;\n      const node = make(op[1]);\n      prev.next = node; node.prev = prev; node.next = tail; tail.prev = node;\n      size++;\n      out.push(null);\n    } else if (name === 'addAtIndex') {\n      let i = op[1];\n      const val = op[2];\n      if (i > size) { out.push(null); continue; }\n      if (i < 0) i = 0;\n      const nxt = i < size ? nodeAt(i) : tail;\n      const prev = nxt.prev;\n      const node = make(val);\n      prev.next = node; node.prev = prev; node.next = nxt; nxt.prev = node;\n      size++;\n      out.push(null);\n    } else if (name === 'deleteAtIndex') {\n      const i = op[1];\n      if (i >= 0 && i < size) {\n        const node = nodeAt(i);\n        node.prev.next = node.next;\n        node.next.prev = node.prev;\n        size--;\n      }\n      out.push(null);\n    }\n  }\n  return out;\n}\n",
      },
      tests: [
        {
          input: [[['addAtHead', 1], ['addAtTail', 3], ['addAtIndex', 1, 2], ['get', 1], ['deleteAtIndex', 1], ['get', 1]]],
          expected: [null, null, null, 2, null, 3],
        },
        {
          input: [[['addAtHead', 7], ['addAtHead', 2], ['addAtHead', 1], ['addAtIndex', 3, 0], ['deleteAtIndex', 2], ['addAtHead', 6], ['get', 3]]],
          expected: [null, null, null, null, null, null, 0],
        },
        {
          input: [[['get', 0], ['addAtTail', 5], ['get', 0], ['get', 1]]],
          expected: [-1, null, 5, -1],
        },
      ],
      hints: [
        'Sentinel head and tail nodes remove edge cases — every real node has a prev and next.',
        'Inserting a node between prev and nxt is four pointer assignments; keep a size counter.',
        'addAtIndex with index == size appends; index > size is a no-op.',
      ],
      complexity: { time: 'O(index) per op', space: 'O(n)' },
    },
  ],
};

export default topic;
