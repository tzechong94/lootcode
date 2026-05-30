import type { Topic, TutorialBlock } from '@/lib/types';

const tutorial = `
## Queues & Deques — first principles

A queue is a **first-in, first-out (FIFO)** collection: you add at the back (\`enqueue\`) and remove
from the front (\`dequeue\`). Where a stack models "most recent first", a queue models **fair, in-order
processing** — the thing that arrived earliest is handled first. This is the natural structure for
**breadth-first search**, level-order traversal, scheduling, and any "process in arrival order" task.

### Implementing a queue efficiently

The catch: removing from the front of a plain array is O(n) because everything shifts. Two fixes:

- **Python:** use \`collections.deque\` — \`append\` / \`popleft\` are both O(1).
- **JavaScript:** there's no built-in deque. Either use a real linked structure, or keep an array
  with a moving \`head\` index and only advance it (never \`shift()\`), so each element is enqueued and
  dequeued in O(1) amortized.

### The deque: a queue open at both ends

A **double-ended queue (deque)** lets you push and pop at *both* ends in O(1). That extra freedom
powers the most important pattern in this topic:

### Monotonic deque — sliding window extremes

To track the maximum of every window of size \`k\` in O(n), keep a deque of **indices** whose values
are decreasing. Before adding a new index, pop smaller values off the back (they can never be the
max while the new, larger, more-recent value is around). Drop the front when it slides out of the
window. The front is always the current window's maximum.

\`\`\`text
for i, x in enumerate(nums):
    while dq and nums[dq[-1]] < x: dq.pop()      # back: remove dominated values
    dq.append(i)
    if dq[0] <= i - k: dq.popleft()              # front: drop out-of-window index
    if i >= k - 1: record nums[dq[0]]            # front is the window max
\`\`\`

Each index enters and leaves the deque once ⇒ **O(n)** total, versus O(n·k) for the naive rescan.

### Key points to remember

- Queue = FIFO; the go-to structure for BFS and level-by-level processing.
- Never \`shift()\` a JS array in a hot loop (O(n)); use a head index or a deque. In Python use \`collections.deque\`.
- A deque adds/removes at both ends in O(1) — superset of both stack and queue.
- A **monotonic deque** gives O(n) sliding-window min/max by storing indices in monotonic order.
- Fixed-size windows (moving averages, recent-call counts) are a queue that you trim from the front by an age/size rule.
`;

const blocks: TutorialBlock[] = [
  {
    kind: 'md',
    md: `## Queues & Deques — from first principles

A queue flips the stack's rule: you add at the **back** and remove from the **front** — first in,
first out (**FIFO**). Where a stack models "handle the most recent thing," a queue models **fair,
in-order processing**: whatever arrived earliest is served first. That's the natural structure for
**breadth-first search**, level-order traversal, and any "process in arrival order" task.`,
  },
  {
    kind: 'viz',
    spec: {
      type: 'queue',
      title: 'A queue: enqueue at the back, dequeue from the front (FIFO)',
      frames: [
        { caption: 'An empty queue. Add at the back, remove from the front.', items: [] },
        { caption: 'enqueue(A).', items: ['A'], highlight: [0] },
        { caption: 'enqueue(B) — joins the back of the line.', items: ['A', 'B'], highlight: [1] },
        { caption: 'enqueue(C).', items: ['A', 'B', 'C'], highlight: [2] },
        { caption: 'dequeue() removes the front — A, the one that waited longest. FIFO.', items: ['B', 'C'] },
        { caption: 'dequeue() → B. The opposite order from a stack.', items: ['C'] },
      ],
    },
  },
  {
    kind: 'md',
    md: `### Implement it efficiently

Removing from the front of a plain array is O(n) (everything shifts). Use Python's
\`collections.deque\` (\`append\`/\`popleft\` are O(1)); in JS, keep an array with a moving \`head\` index and
only advance it — never \`shift()\` in a hot loop.

### The deque and the monotonic-deque trick

A **double-ended queue** allows O(1) push/pop at *both* ends. Its killer application is the
**monotonic deque**: to track the maximum of every length-\`k\` window in O(n), keep a deque of indices
whose values are decreasing — pop smaller values off the back before adding a new one (they can never
be the max again), and drop the front when it slides out of the window. The front is always the
current window's maximum, and each index enters and leaves once.

### Key points to remember

- Queue = FIFO; the backbone of BFS and level-by-level processing.
- Never \`shift()\` a JS array in a loop (O(n)); use a head index or a deque. Python: \`collections.deque\`.
- A deque adds/removes at both ends in O(1) — a superset of both stack and queue.
- A **monotonic deque** gives O(n) sliding-window min/max.
- Fixed-size windows (recent counts, moving averages) are a queue you trim from the front by an age/size rule.`,
  },
];

const topic: Topic = {
  slug: 'queues-deques',
  title: 'Queues & Deques',
  order: 6,
  blurb: 'FIFO processing for BFS, plus the monotonic deque for O(n) sliding-window extremes.',
  tutorial,
  blocks,
  problems: [
    {
      id: 'implement-queue-using-stacks',
      title: 'Implement Queue using Stacks',
      difficulty: 'Easy',
      topicSlug: 'queues-deques',
      statement: `Implement a FIFO queue using only two stacks. Support \`push(x)\`, \`pop()\` (remove & return front), \`peek()\` (return front), and \`empty()\`.

You are given operations, each one of \`["push", x]\`, \`["pop"]\`, \`["peek"]\`, \`["empty"]\`. Return a list with each operation's result: \`null\` for \`push\`, the value for \`pop\`/\`peek\`, and a boolean for \`empty\`.`,
      constraints: ['All pop/peek calls are on a non-empty queue.', '1 ≤ number of operations ≤ 100'],
      examples: [
        {
          input: 'ops = [["push",1],["push",2],["peek"],["pop"],["empty"]]',
          output: '[null,null,1,1,false]',
        },
      ],
      functionName: { py: 'queue_ops', js: 'queueOps' },
      starter: {
        py: 'def queue_ops(ops):\n    out = []\n    # use two stacks (lists) to achieve FIFO order\n    for op in ops:\n        name = op[0]\n        # your code here\n        pass\n    return out\n',
        js: 'function queueOps(ops) {\n  const out = [];\n  // use two stacks (arrays) to achieve FIFO order\n  for (const op of ops) {\n    const name = op[0];\n    // your code here\n  }\n  return out;\n}\n',
      },
      reference: {
        py: "def queue_ops(ops):\n    in_stack = []\n    out_stack = []\n    out = []\n    def shift():\n        if not out_stack:\n            while in_stack:\n                out_stack.append(in_stack.pop())\n    for op in ops:\n        name = op[0]\n        if name == 'push':\n            in_stack.append(op[1])\n            out.append(None)\n        elif name == 'pop':\n            shift()\n            out.append(out_stack.pop())\n        elif name == 'peek':\n            shift()\n            out.append(out_stack[-1])\n        elif name == 'empty':\n            out.append(len(in_stack) == 0 and len(out_stack) == 0)\n    return out\n",
        js: "function queueOps(ops) {\n  const inStack = [];\n  const outStack = [];\n  const out = [];\n  const shift = () => {\n    if (outStack.length === 0) {\n      while (inStack.length) outStack.push(inStack.pop());\n    }\n  };\n  for (const op of ops) {\n    const name = op[0];\n    if (name === 'push') {\n      inStack.push(op[1]);\n      out.push(null);\n    } else if (name === 'pop') {\n      shift();\n      out.push(outStack.pop());\n    } else if (name === 'peek') {\n      shift();\n      out.push(outStack[outStack.length - 1]);\n    } else if (name === 'empty') {\n      out.push(inStack.length === 0 && outStack.length === 0);\n    }\n  }\n  return out;\n}\n",
      },
      tests: [
        {
          input: [[['push', 1], ['push', 2], ['peek'], ['pop'], ['empty']]],
          expected: [null, null, 1, 1, false],
        },
        {
          input: [[['push', 1], ['pop'], ['empty']]],
          expected: [null, 1, true],
        },
        {
          input: [[['push', 4], ['push', 5], ['pop'], ['push', 6], ['peek'], ['pop'], ['pop'], ['empty']]],
          expected: [null, null, 4, null, 5, 5, 6, true],
        },
      ],
      hints: [
        'One stack receives new elements; the other serves them in FIFO order.',
        'Only move elements from the in-stack to the out-stack when the out-stack is empty.',
        'Reversing once via a stack flips LIFO into FIFO; the transfer is amortized O(1) per element.',
      ],
      complexity: { time: 'O(1) amortized per op', space: 'O(n)' },
    },
    {
      id: 'number-of-recent-calls',
      title: 'Number of Recent Calls',
      difficulty: 'Easy',
      topicSlug: 'queues-deques',
      statement: `Implement a counter of recent requests. Each \`ping(t)\` happens at a strictly increasing time \`t\` (ms) and returns the number of pings that occurred in the inclusive window \`[t - 3000, t]\`.

You are given operations \`["ping", t]\`. Return the list of values returned by each ping.`,
      constraints: ['1 ≤ t ≤ 10⁹', 'Each ping uses a strictly larger t than the previous.', '1 ≤ number of calls ≤ 10⁴'],
      examples: [
        {
          input: 'ops = [["ping",1],["ping",100],["ping",3001],["ping",3002]]',
          output: '[1,2,3,3]',
        },
      ],
      functionName: { py: 'recent_calls', js: 'recentCalls' },
      starter: {
        py: 'def recent_calls(ops):\n    out = []\n    # keep a queue of recent timestamps and trim the old ones\n    for op in ops:\n        t = op[1]\n        # your code here\n        pass\n    return out\n',
        js: 'function recentCalls(ops) {\n  const out = [];\n  // keep a queue of recent timestamps and trim the old ones\n  for (const op of ops) {\n    const t = op[1];\n    // your code here\n  }\n  return out;\n}\n',
      },
      reference: {
        py: 'def recent_calls(ops):\n    from collections import deque\n    q = deque()\n    out = []\n    for op in ops:\n        t = op[1]\n        q.append(t)\n        while q[0] < t - 3000:\n            q.popleft()\n        out.append(len(q))\n    return out\n',
        js: 'function recentCalls(ops) {\n  const q = [];\n  let head = 0;\n  const out = [];\n  for (const op of ops) {\n    const t = op[1];\n    q.push(t);\n    while (q[head] < t - 3000) head++;\n    out.push(q.length - head);\n  }\n  return out;\n}\n',
      },
      tests: [
        { input: [[['ping', 1], ['ping', 100], ['ping', 3001], ['ping', 3002]]], expected: [1, 2, 3, 3] },
        { input: [[['ping', 1], ['ping', 2], ['ping', 3]]], expected: [1, 2, 3] },
        { input: [[['ping', 1], ['ping', 3002], ['ping', 6003]]], expected: [1, 1, 1] },
      ],
      hints: [
        'Keep timestamps in a queue in the order they arrive.',
        'After adding t, remove from the front every timestamp older than t − 3000.',
        'The answer is simply the queue size after trimming.',
      ],
      complexity: { time: 'O(1) amortized per ping', space: 'O(window)' },
    },
    {
      id: 'sliding-window-maximum',
      title: 'Sliding Window Maximum',
      difficulty: 'Hard',
      topicSlug: 'queues-deques',
      statement: `Given an array \`nums\` and a window size \`k\`, return an array of the maximum value in each contiguous window of size \`k\` as the window slides from left to right.`,
      constraints: ['1 ≤ nums.length ≤ 10⁵', '1 ≤ k ≤ nums.length'],
      examples: [
        { input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3', output: '[3,3,5,5,6,7]' },
      ],
      functionName: { py: 'max_sliding_window', js: 'maxSlidingWindow' },
      starter: {
        py: 'def max_sliding_window(nums, k):\n    # your code here\n    pass\n',
        js: 'function maxSlidingWindow(nums, k) {\n  // your code here\n}\n',
      },
      reference: {
        py: 'def max_sliding_window(nums, k):\n    from collections import deque\n    dq = deque()  # indices, values decreasing\n    res = []\n    for i, x in enumerate(nums):\n        while dq and nums[dq[-1]] < x:\n            dq.pop()\n        dq.append(i)\n        if dq[0] <= i - k:\n            dq.popleft()\n        if i >= k - 1:\n            res.append(nums[dq[0]])\n    return res\n',
        js: 'function maxSlidingWindow(nums, k) {\n  const dq = []; // indices, values decreasing\n  let head = 0;\n  const res = [];\n  for (let i = 0; i < nums.length; i++) {\n    while (dq.length > head && nums[dq[dq.length - 1]] < nums[i]) dq.pop();\n    dq.push(i);\n    if (dq[head] <= i - k) head++;\n    if (i >= k - 1) res.push(nums[dq[head]]);\n  }\n  return res;\n}\n',
      },
      tests: [
        { input: [[1, 3, -1, -3, 5, 3, 6, 7], 3], expected: [3, 3, 5, 5, 6, 7] },
        { input: [[1], 1], expected: [1] },
        { input: [[1, -1], 1], expected: [1, -1] },
        { input: [[9, 11], 2], expected: [11] },
        { input: [[4, -2], 2], expected: [4] },
        { input: [[1, 3, 1, 2, 0, 5], 3], expected: [3, 3, 2, 5] },
      ],
      hints: [
        'A value can never be the window max once a larger value appears to its right and is still in the window.',
        'Maintain a deque of indices whose values are strictly decreasing.',
        'Pop smaller values off the back before pushing; drop the front when it falls out of the window; the front is the max.',
      ],
      complexity: { time: 'O(n)', space: 'O(k)' },
    },
  ],
};

export default topic;
