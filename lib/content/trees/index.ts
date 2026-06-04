import type { Topic, TutorialBlock } from '@/lib/types';

const PREAMBLE_PY = `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(arr):
    if not arr or arr[0] is None:
        return None
    from collections import deque
    root = TreeNode(arr[0])
    q = deque([root])
    i = 1
    while q and i < len(arr):
        node = q.popleft()
        if i < len(arr):
            if arr[i] is not None:
                node.left = TreeNode(arr[i])
                q.append(node.left)
            i += 1
        if i < len(arr):
            if arr[i] is not None:
                node.right = TreeNode(arr[i])
                q.append(node.right)
            i += 1
    return root

def to_level_order(root):
    from collections import deque
    if not root:
        return []
    out = []
    q = deque([root])
    while q:
        node = q.popleft()
        if node:
            out.append(node.val)
            q.append(node.left)
            q.append(node.right)
        else:
            out.append(None)
    while out and out[-1] is None:
        out.pop()
    return out
`;

const PREAMBLE_JS = `class TreeNode {
  constructor(val = 0, left = null, right = null) { this.val = val; this.left = left; this.right = right; }
}
function buildTree(arr) {
  if (!arr.length || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const q = [root];
  let head = 0;
  let i = 1;
  while (head < q.length && i < arr.length) {
    const node = q[head++];
    if (i < arr.length) { if (arr[i] !== null) { node.left = new TreeNode(arr[i]); q.push(node.left); } i++; }
    if (i < arr.length) { if (arr[i] !== null) { node.right = new TreeNode(arr[i]); q.push(node.right); } i++; }
  }
  return root;
}
function toLevelOrder(root) {
  if (!root) return [];
  const out = [];
  const q = [root];
  let head = 0;
  while (head < q.length) {
    const node = q[head++];
    if (node) { out.push(node.val); q.push(node.left); q.push(node.right); }
    else out.push(null);
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}
`;

const tutorial = `
## Trees — first principles

A tree is a set of **nodes** connected so there's exactly one path between any two of them: no
cycles, one root, and every node has a single parent (except the root). A **binary tree** limits
each node to a \`left\` and \`right\` child. Trees model hierarchy — file systems, expression trees,
decision processes — and their recursive shape is the whole point: *a tree is a root plus a left
subtree and a right subtree, each of which is itself a tree.*

That self-similarity means most tree algorithms are **three lines of recursion**: handle the empty
case, recurse on the children, combine. Master that shape and a huge class of problems collapses.

> Here trees are passed as a **level-order array** (\`null\` marks a missing child) and rebuilt into
> real \`TreeNode\`s for you (\`build_tree\` / \`buildTree\`). Return your answer as a value or, when it's
> a tree, via \`to_level_order\` / \`toLevelOrder\`.

### Depth-first traversal (the recursion)

DFS visits a whole subtree before moving on. The three orders differ only in *when you touch the
node* relative to its children:

- **Preorder** (node, left, right) — copy/serialize a tree.
- **Inorder** (left, node, right) — yields a **BST in sorted order**.
- **Postorder** (left, right, node) — compute something about children first (height, delete).

\`\`\`text
def depth(node):
    if not node: return 0          # base case
    return 1 + max(depth(node.left), depth(node.right))   # combine children
\`\`\`

### Breadth-first traversal (level by level)

BFS uses a **queue** to visit nodes one level at a time — the natural tool for "level order",
"shortest path in an unweighted tree", or anything where distance-from-root matters. Process the
queue one level's worth at a time by snapshotting its length before the inner loop.

### Key points to remember

- A tree is recursive by definition; the default tool is recursion with a clean base case (\`None\`/empty).
- DFS = recursion/stack (preorder, inorder, postorder); BFS = queue (level order).
- **Inorder traversal of a BST is sorted** — a frequent building block.
- Postorder is for "answer about a node depends on its children" (height, balance, subtree sums).
- Most bugs are a missing base case or combining children incorrectly — write the base case first.
`;

const blocks: TutorialBlock[] = [
  {
    kind: 'md',
    md: `## Trees — from first principles

A tree is a set of nodes with exactly one path between any two — one root, no cycles, each node
having a single parent. A **binary tree** caps each node at a \`left\` and \`right\` child. The defining
property is **self-similarity**: a tree is *a root plus a left subtree and a right subtree, each of
which is itself a tree*. That recursive shape is why most tree algorithms are three lines — handle the
empty case, recurse on the children, combine.

There are two ways to walk a tree, and the choice drives everything.

**Depth-first (DFS)** dives all the way down one branch before backing up — natural as recursion (or
an explicit stack). Watch a preorder DFS (visit node, then left subtree, then right):`,
  },
  {
    kind: 'viz',
    spec: {
      type: 'tree',
      title: 'Depth-first search (preorder): go deep before wide',
      nodes: [1, 2, 3, 4, 5, 6, 7],
      frames: [
        { caption: 'Preorder DFS: visit a node, then its whole left subtree, then its whole right. Start at the root.', active: [0] },
        { caption: 'Dive left to node 2…', visited: [0], active: [1] },
        { caption: '…and left again to node 4, a leaf. Can\'t go deeper — back up.', visited: [0, 1], active: [3] },
        { caption: 'Node 4\'s sibling: node 5. Left subtree of the root is now fully explored.', visited: [0, 1, 3], active: [4] },
        { caption: 'Only now do we cross to the right subtree: node 3.', visited: [0, 1, 3, 4], active: [2] },
        { caption: 'Node 6…', visited: [0, 1, 3, 4, 2], active: [5] },
        { caption: 'Node 7. Every node visited exactly once → O(n).', visited: [0, 1, 3, 4, 2, 5], active: [6] },
      ],
    },
  },
  {
    kind: 'md',
    md: `The order you *touch* the node relative to its children gives the three DFS flavors: **preorder**
(node, L, R — copy/serialize), **inorder** (L, node, R — yields a **BST in sorted order**), and
**postorder** (L, R, node — when a node's answer depends on its children: height, subtree sums).

**Breadth-first (BFS)** instead sweeps level by level using a **queue** — the right tool when distance
from the root matters (shortest path in an unweighted tree, level-order output):`,
  },
  {
    kind: 'viz',
    spec: {
      type: 'tree',
      title: 'Breadth-first search: level by level',
      nodes: [1, 2, 3, 4, 5, 6, 7],
      frames: [
        { caption: 'BFS uses a queue, visiting in rings of increasing depth. Level 0: just the root.', active: [0] },
        { caption: 'Level 1: nodes 2 and 3, left to right.', visited: [0], active: [1, 2] },
        { caption: 'Level 2: nodes 4, 5, 6, 7. BFS reaches nodes in order of distance from the root.', visited: [0, 1, 2], active: [3, 4, 5, 6] },
      ],
    },
  },
  {
    kind: 'md',
    md: `### Key points to remember

- A tree is recursive by definition; the default tool is recursion with a clean base case (\`None\`/empty).
- DFS = recursion/stack (pre/in/post-order); BFS = queue (level order).
- **Inorder traversal of a BST is sorted** — a frequent building block.
- Postorder is for "a node's answer depends on its children" (height, balance, subtree sums).
- Most bugs are a missing base case or a wrong combine step — write the base case first.`,
  },
];

const topic: Topic = {
  slug: 'trees',
  title: 'Trees',
  order: 8,
  section: 'data-structure',
  blurb: 'Recursion over hierarchy: DFS (pre/in/post-order) and BFS level-order traversal.',
  tutorial,
  blocks,
  problems: [
    {
      id: 'invert-binary-tree',
      title: 'Invert Binary Tree',
      difficulty: 'Easy',
      topicSlug: 'trees',
      statement: `Invert a binary tree: swap every node's left and right child. Return the inverted tree.

\`values\` is the tree in level-order (\`null\` = missing child); a \`TreeNode\` root is built for you. Return the result via \`to_level_order\` / \`toLevelOrder\`.`,
      constraints: ['0 ≤ number of nodes ≤ 100', '-100 ≤ Node.val ≤ 100'],
      examples: [
        { input: 'values = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]' },
        { input: 'values = []', output: '[]' },
      ],
      functionName: { py: 'invert_tree', js: 'invertTree' },
      preamble: { py: PREAMBLE_PY, js: PREAMBLE_JS },
      starter: {
        py: 'def invert_tree(values):\n    root = build_tree(values)\n    # TODO: swap children throughout, then return to_level_order(root)\n    pass\n',
        js: 'function invertTree(values) {\n  const root = buildTree(values);\n  // TODO: swap children throughout, then return toLevelOrder(root)\n}\n',
      },
      reference: {
        py: 'def invert_tree(values):\n    root = build_tree(values)\n    def dfs(node):\n        if not node:\n            return\n        node.left, node.right = node.right, node.left\n        dfs(node.left)\n        dfs(node.right)\n    dfs(root)\n    return to_level_order(root)\n',
        js: 'function invertTree(values) {\n  const root = buildTree(values);\n  function dfs(node) {\n    if (!node) return;\n    const tmp = node.left;\n    node.left = node.right;\n    node.right = tmp;\n    dfs(node.left);\n    dfs(node.right);\n  }\n  dfs(root);\n  return toLevelOrder(root);\n}\n',
      },
      tests: [
        { input: [[4, 2, 7, 1, 3, 6, 9]], expected: [4, 7, 2, 9, 6, 3, 1] },
        { input: [[2, 1, 3]], expected: [2, 3, 1] },
        { input: [[]], expected: [] },
        { input: [[1]], expected: [1] },
      ],
      hints: [
        'At each node, swap its two children.',
        'Then recurse into both subtrees (now swapped).',
        'The base case is an empty (null) node.',
      ],
      complexity: { time: 'O(n)', space: 'O(h)' },
    },
    {
      id: 'maximum-depth-binary-tree',
      title: 'Maximum Depth of Binary Tree',
      difficulty: 'Easy',
      topicSlug: 'trees',
      statement: `Return the maximum depth of a binary tree — the number of nodes along the longest path from the root down to a leaf.

\`values\` is the tree in level-order; a \`TreeNode\` root is built for you.`,
      constraints: ['0 ≤ number of nodes ≤ 10⁴', '-100 ≤ Node.val ≤ 100'],
      examples: [
        { input: 'values = [3,9,20,null,null,15,7]', output: '3' },
        { input: 'values = []', output: '0' },
      ],
      functionName: { py: 'max_depth', js: 'maxDepth' },
      preamble: { py: PREAMBLE_PY, js: PREAMBLE_JS },
      starter: {
        py: 'def max_depth(values):\n    root = build_tree(values)\n    # TODO: return the max depth\n    pass\n',
        js: 'function maxDepth(values) {\n  const root = buildTree(values);\n  // TODO: return the max depth\n}\n',
      },
      reference: {
        py: 'def max_depth(values):\n    root = build_tree(values)\n    def depth(node):\n        if not node:\n            return 0\n        return 1 + max(depth(node.left), depth(node.right))\n    return depth(root)\n',
        js: 'function maxDepth(values) {\n  const root = buildTree(values);\n  function depth(node) {\n    if (!node) return 0;\n    return 1 + Math.max(depth(node.left), depth(node.right));\n  }\n  return depth(root);\n}\n',
      },
      tests: [
        { input: [[3, 9, 20, null, null, 15, 7]], expected: 3 },
        { input: [[]], expected: 0 },
        { input: [[1, null, 2]], expected: 2 },
        { input: [[0]], expected: 1 },
      ],
      hints: [
        'The depth of an empty tree is 0.',
        'The depth of a node is 1 + the deeper of its two subtrees.',
        'This is a postorder computation: children first, then combine.',
      ],
      complexity: { time: 'O(n)', space: 'O(h)' },
    },
    {
      id: 'binary-tree-level-order',
      title: 'Binary Tree Level Order Traversal',
      difficulty: 'Medium',
      topicSlug: 'trees',
      statement: `Return the level-order traversal of a binary tree's values: a list of levels, each a left-to-right list of that level's node values. (CSPrimer's "Process tree".)

\`values\` is the tree in level-order; a \`TreeNode\` root is built for you.`,
      constraints: ['0 ≤ number of nodes ≤ 2000'],
      examples: [
        { input: 'values = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' },
        { input: 'values = []', output: '[]' },
      ],
      functionName: { py: 'level_order', js: 'levelOrder' },
      preamble: { py: PREAMBLE_PY, js: PREAMBLE_JS },
      starter: {
        py: 'def level_order(values):\n    root = build_tree(values)\n    # TODO: BFS, grouping node values by level\n    pass\n',
        js: 'function levelOrder(values) {\n  const root = buildTree(values);\n  // TODO: BFS, grouping node values by level\n}\n',
      },
      reference: {
        py: 'def level_order(values):\n    root = build_tree(values)\n    if not root:\n        return []\n    from collections import deque\n    res = []\n    q = deque([root])\n    while q:\n        level = []\n        for _ in range(len(q)):\n            node = q.popleft()\n            level.append(node.val)\n            if node.left:\n                q.append(node.left)\n            if node.right:\n                q.append(node.right)\n        res.append(level)\n    return res\n',
        js: 'function levelOrder(values) {\n  const root = buildTree(values);\n  if (!root) return [];\n  const res = [];\n  let level = [root];\n  while (level.length) {\n    res.push(level.map((n) => n.val));\n    const next = [];\n    for (const n of level) {\n      if (n.left) next.push(n.left);\n      if (n.right) next.push(n.right);\n    }\n    level = next;\n  }\n  return res;\n}\n',
      },
      tests: [
        { input: [[3, 9, 20, null, null, 15, 7]], expected: [[3], [9, 20], [15, 7]] },
        { input: [[]], expected: [] },
        { input: [[1]], expected: [[1]] },
        { input: [[1, 2, 3, 4, null, null, 5]], expected: [[1], [2, 3], [4, 5]] },
      ],
      hints: [
        'Use a queue (BFS) so nodes come out top-to-bottom, left-to-right.',
        "Process exactly one level at a time: snapshot the queue's size before the inner loop.",
        'Collect that level into its own list, enqueueing children for the next level.',
      ],
      complexity: { time: 'O(n)', space: 'O(n)' },
    },
  ],
};

export default topic;
