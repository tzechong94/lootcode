import type { Topic } from '@/lib/types';

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

const topic: Topic = {
  slug: 'linked-lists',
  title: 'Linked Lists',
  order: 7,
  blurb: 'Pointer manipulation: dummy heads, in-place reversal, and fast/slow two-pointer tricks.',
  tutorial,
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
  ],
};

export default topic;
