import type { Implementation } from '@/lib/types';

const implementations: Implementation[] = [
  {
    id: 'impl-bst',
    title: 'Build a Binary Search Tree',
    statement: `A **binary search tree** keeps values ordered by an invariant: for every node, everything in its **left** subtree is smaller and everything in its **right** subtree is larger. That invariant turns search into repeated halving — like binary search, but over a branching structure you can also insert into cheaply.

Build a \`BST\` (ignore duplicates):

- \`insert(x)\` — walk left/right by comparison until you find an empty spot, then attach a new node.
- \`contains(x)\` — \`True\`/\`true\` if \`x\` is in the tree.
- \`inorder()\` — values in sorted order (left, node, right).
- \`min()\` / \`max()\` — smallest / largest value, or \`None\`/\`null\` if empty.
- \`size()\` — number of distinct values.

On a balanced tree these are O(log n); the sorted output of \`inorder\` is what makes a BST more than a set.`,
    methods: [
      { name: 'insert', sig: 'insert(x)', doc: 'Add x (ignore if already present).' },
      { name: 'contains', sig: 'contains(x) -> bool', doc: 'True if x is in the tree.' },
      { name: 'inorder', sig: 'inorder() -> list', doc: 'Values in sorted order.' },
      { name: 'min', sig: 'min() -> value', doc: 'Smallest value (None/null if empty).' },
      { name: 'max', sig: 'max() -> value', doc: 'Largest value (None/null if empty).' },
      { name: 'size', sig: 'size() -> int', doc: 'Number of distinct values.' },
    ],
    className: { py: 'BST', js: 'BST' },
    complexity: { time: 'O(h) per op (O(log n) balanced)', space: 'O(n)' },
    hints: [
      'A node has a value, a left child, and a right child. The tree keeps a root (None/null when empty).',
      'insert: from the root, go left if x < node.val else right, until the child is empty — attach there. Stop if x == node.val.',
      'min walks left as far as possible; max walks right. inorder is left-subtree, then node, then right-subtree.',
    ],
    starter: {
      py: `class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None


class BST:
    def __init__(self):
        # TODO: root, size
        pass

    def insert(self, x):
        pass

    def contains(self, x):
        pass

    def inorder(self):
        pass

    def min(self):
        pass

    def max(self):
        pass

    def size(self):
        pass
`,
      js: `class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() {
    // TODO: root, size
  }

  insert(x) {}
  contains(x) {}
  inorder() {}
  min() {}
  max() {}
  size() {}
}
`,
    },
    reference: {
      py: `class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None


class BST:
    def __init__(self):
        self.root = None
        self._size = 0

    def insert(self, x):
        if self.root is None:
            self.root = TreeNode(x)
            self._size += 1
            return
        cur = self.root
        while True:
            if x == cur.val:
                return
            if x < cur.val:
                if cur.left is None:
                    cur.left = TreeNode(x)
                    self._size += 1
                    return
                cur = cur.left
            else:
                if cur.right is None:
                    cur.right = TreeNode(x)
                    self._size += 1
                    return
                cur = cur.right

    def contains(self, x):
        cur = self.root
        while cur is not None:
            if x == cur.val:
                return True
            cur = cur.left if x < cur.val else cur.right
        return False

    def inorder(self):
        out = []
        stack = []
        cur = self.root
        while stack or cur is not None:
            while cur is not None:
                stack.append(cur)
                cur = cur.left
            cur = stack.pop()
            out.append(cur.val)
            cur = cur.right
        return out

    def min(self):
        if self.root is None:
            return None
        cur = self.root
        while cur.left is not None:
            cur = cur.left
        return cur.val

    def max(self):
        if self.root is None:
            return None
        cur = self.root
        while cur.right is not None:
            cur = cur.right
        return cur.val

    def size(self):
        return self._size
`,
      js: `class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() {
    this.root = null;
    this._size = 0;
  }

  insert(x) {
    if (this.root === null) {
      this.root = new TreeNode(x);
      this._size++;
      return;
    }
    let cur = this.root;
    for (;;) {
      if (x === cur.val) return;
      if (x < cur.val) {
        if (cur.left === null) { cur.left = new TreeNode(x); this._size++; return; }
        cur = cur.left;
      } else {
        if (cur.right === null) { cur.right = new TreeNode(x); this._size++; return; }
        cur = cur.right;
      }
    }
  }

  contains(x) {
    let cur = this.root;
    while (cur !== null) {
      if (x === cur.val) return true;
      cur = x < cur.val ? cur.left : cur.right;
    }
    return false;
  }

  inorder() {
    const out = [];
    const stack = [];
    let cur = this.root;
    while (stack.length || cur !== null) {
      while (cur !== null) { stack.push(cur); cur = cur.left; }
      cur = stack.pop();
      out.push(cur.val);
      cur = cur.right;
    }
    return out;
  }

  min() {
    if (this.root === null) return null;
    let cur = this.root;
    while (cur.left !== null) cur = cur.left;
    return cur.val;
  }

  max() {
    if (this.root === null) return null;
    let cur = this.root;
    while (cur.right !== null) cur = cur.right;
    return cur.val;
  }

  size() {
    return this._size;
  }
}
`,
    },
    tests: [
      {
        name: 'insert keeps sorted order',
        ops: [
          { call: 'insert', args: [5] },
          { call: 'insert', args: [3] },
          { call: 'insert', args: [8] },
          { call: 'insert', args: [1] },
          { call: 'insert', args: [4] },
          { call: 'insert', args: [7] },
          { call: 'insert', args: [9] },
          { call: 'inorder', expect: [1, 3, 4, 5, 7, 8, 9] },
          { call: 'min', expect: 1 },
          { call: 'max', expect: 9 },
          { call: 'size', expect: 7 },
        ],
      },
      {
        name: 'duplicates ignored',
        ops: [
          { call: 'insert', args: [5] },
          { call: 'insert', args: [5] },
          { call: 'insert', args: [5] },
          { call: 'inorder', expect: [5] },
          { call: 'size', expect: 1 },
        ],
      },
      {
        name: 'contains and empty',
        ops: [
          { call: 'contains', args: [1], expect: false },
          { call: 'min', expect: null },
          { call: 'max', expect: null },
          { call: 'insert', args: [10] },
          { call: 'insert', args: [6] },
          { call: 'contains', args: [6], expect: true },
          { call: 'contains', args: [7], expect: false },
        ],
      },
    ],
  },
];

export default implementations;
