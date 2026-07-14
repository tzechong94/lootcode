import type { Topic, TutorialBlock } from '@/lib/types';

const tutorial = `
## 2-D Dynamic Programming — first principles

When a subproblem needs **two indices** to describe it, the DP table becomes a grid: \`dp[i][j]\`. This
covers the two great families of string/grid DP:

- **Grid paths** — \`dp[i][j]\` depends on the cell above and to the left (you can only move down/right).
- **Two-sequence problems** — \`dp[i][j]\` = the answer for the first \`i\` characters of one string and the
  first \`j\` of another (longest common subsequence, edit distance, string matching).

### The recipe is the same, with a 2-D state

1. **State:** \`dp[i][j]\` = answer to the subproblem indexed by \`(i, j)\`.
2. **Recurrence:** express \`dp[i][j]\` from neighbors — typically \`dp[i-1][j]\`, \`dp[i][j-1]\`, and the
   diagonal \`dp[i-1][j-1]\`.
3. **Base cases:** the first row/column (empty prefix of a string, or the grid's edge).
4. **Order:** fill row by row so every dependency is ready.

### The diagonal is the key move for two-sequence DP

When comparing two strings, the question at \`dp[i][j]\` is always *"do the current two characters
match?"* If they match, you extend the diagonal answer \`dp[i-1][j-1]\`; if not, you take the best of
"skip a char from one string" (\`dp[i-1][j]\` / \`dp[i][j-1]\`). Longest common subsequence and edit
distance are the same skeleton with different combine rules:

\`\`\`text
if a[i-1] == b[j-1]:
    dp[i][j] = dp[i-1][j-1] (+1 for LCS)
else:
    dp[i][j] = best of dp[i-1][j], dp[i][j-1]  (and dp[i-1][j-1] for edit distance)
\`\`\`

### Space optimization

Because \`dp[i][j]\` only depends on the current and previous row, you can usually compress the table
to **one or two rows** — O(n) space instead of O(m·n).

### Key points to remember

- Two indices in the subproblem ⇒ a 2-D table; the recurrence reads from up, left, and the diagonal.
- Grid-path DP: only down/right moves ⇒ \`dp[i][j]\` from \`dp[i-1][j]\` and \`dp[i][j-1]\`.
- Two-string DP: the diagonal handles "characters match"; off-diagonal handles insert/delete/skip.
- Set the first row/column (empty-prefix) base cases carefully — most bugs live there.
- Only the previous row is needed ⇒ collapse to O(n) space once the recurrence is correct.
`;

const blocks: TutorialBlock[] = [
  {
    kind: 'md',
    md: `## 2-D Dynamic Programming — from first principles

When a subproblem needs **two indices** to describe it, the dp table becomes a grid: \`dp[i][j]\`. This
covers the two big families — **grid paths** (\`dp[i][j]\` depends on the cell above and to the left) and
**two-sequence** problems (\`dp[i][j]\` = the answer for the first \`i\` of one string and first \`j\` of
another: longest common subsequence, edit distance).

The recipe is identical to 1-D, just with a 2-D state: define \`dp[i][j]\`, write the recurrence from
neighbors (typically up, left, and the diagonal), set the first row/column as base cases, and fill so
every dependency is ready. Here's "count paths to each cell, moving only right or down" — every cell
is just the cell above **plus** the cell to its left:`,
  },
  {
    kind: 'viz',
    spec: {
      type: 'grid',
      title: 'Grid-path DP: dp[i][j] = dp[i-1][j] + dp[i][j-1]',
      frames: [
        { caption: 'Edges first: the top row and left column each have exactly one path (straight line).', grid: [[{ value: 1, state: 'visited' }, { value: 1, state: 'visited' }, { value: 1, state: 'visited' }], [{ value: 1, state: 'visited' }, { value: '·', state: 'dim' }, { value: '·', state: 'dim' }], [{ value: 1, state: 'visited' }, { value: '·', state: 'dim' }, { value: '·', state: 'dim' }]] },
        { caption: 'dp[1][1] = above (1) + left (1) = 2.', grid: [[{ value: 1, state: 'visited' }, { value: 1, state: 'frontier' }, { value: 1, state: 'visited' }], [{ value: 1, state: 'frontier' }, { value: 2, state: 'active' }, { value: '·', state: 'dim' }], [{ value: 1, state: 'visited' }, { value: '·', state: 'dim' }, { value: '·', state: 'dim' }]] },
        { caption: 'dp[1][2] = above (1) + left (2) = 3.', grid: [[{ value: 1, state: 'visited' }, { value: 1, state: 'visited' }, { value: 1, state: 'frontier' }], [{ value: 1, state: 'visited' }, { value: 2, state: 'frontier' }, { value: 3, state: 'active' }], [{ value: 1, state: 'visited' }, { value: '·', state: 'dim' }, { value: '·', state: 'dim' }]] },
        { caption: 'dp[2][1] = above (2) + left (1) = 3.', grid: [[{ value: 1, state: 'visited' }, { value: 1, state: 'visited' }, { value: 1, state: 'visited' }], [{ value: 1, state: 'visited' }, { value: 2, state: 'frontier' }, { value: 3, state: 'visited' }], [{ value: 1, state: 'frontier' }, { value: 3, state: 'active' }, { value: '·', state: 'dim' }]] },
        { caption: 'dp[2][2] = above (3) + left (3) = 6. The corner is the answer: 6 paths.', grid: [[{ value: 1, state: 'visited' }, { value: 1, state: 'visited' }, { value: 1, state: 'visited' }], [{ value: 1, state: 'visited' }, { value: 2, state: 'visited' }, { value: 3, state: 'frontier' }], [{ value: 1, state: 'visited' }, { value: 3, state: 'frontier' }, { value: 6, state: 'active' }]] },
      ],
    },
  },
  {
    kind: 'md',
    md: `For **two-string** DP the move that matters is the **diagonal**: the question at \`dp[i][j]\` is always
"do the current two characters match?" If yes, extend the diagonal \`dp[i-1][j-1]\`; if no, take the
best of the off-diagonal neighbors (skip a char from one side). Longest common subsequence and edit
distance are the *same* skeleton with different combine rules. And since each cell only needs the
current and previous row, you can usually compress the table to **O(n) space**.

### Key points to remember

- Two indices in the subproblem ⇒ a 2-D table; the recurrence reads from up, left, and the diagonal.
- Grid-path DP: only down/right moves ⇒ \`dp[i][j]\` from \`dp[i-1][j]\` + \`dp[i][j-1]\`.
- Two-string DP: the **diagonal** handles "characters match"; off-diagonal handles insert/delete/skip.
- Set the first row/column (empty-prefix) base cases carefully — most bugs live there.
- Only the previous row is needed ⇒ collapse to O(n) space once the recurrence is right.`,
  },
];

const topic: Topic = {
  slug: 'dp-2d',
  title: '2-D Dynamic Programming',
  order: 15,
  section: 'algorithm',
  family: 'Dynamic Programming',
  blurb: 'Two-index states: grid-path DP and two-sequence DP (LCS, edit distance) via the diagonal.',
  tutorial,
  blocks,
  problems: [
    {
      id: 'unique-paths',
      title: 'Unique Paths',
      difficulty: 'Medium',
      topicSlug: 'dp-2d',
      statement: `A robot on an \`m x n\` grid starts top-left and can only move **right** or **down**. How many distinct paths reach the bottom-right corner?`,
      constraints: ['1 ≤ m, n ≤ 100'],
      examples: [
        { input: 'm = 3, n = 7', output: '28' },
        { input: 'm = 3, n = 2', output: '3' },
      ],
      functionName: { py: 'unique_paths', js: 'uniquePaths' },
      starter: {
        py: 'def unique_paths(m, n):\n    # paths to a cell = paths from above + paths from the left\n    # your code here\n    pass\n',
        js: 'function uniquePaths(m, n) {\n  // paths to a cell = paths from above + paths from the left\n  // your code here\n}\n',
      },
      reference: {
        py: 'def unique_paths(m, n):\n    dp = [1] * n\n    for _ in range(1, m):\n        for j in range(1, n):\n            dp[j] += dp[j - 1]\n    return dp[-1]\n',
        js: 'function uniquePaths(m, n) {\n  const dp = new Array(n).fill(1);\n  for (let i = 1; i < m; i++) {\n    for (let j = 1; j < n; j++) {\n      dp[j] += dp[j - 1];\n    }\n  }\n  return dp[n - 1];\n}\n',
      },
      referenceLabel: 'Iterative (bottom-up)',
      alternates: [
        {
          label: 'Recursive (memoized)',
          code: {
            py: `def unique_paths(m, n, memo=None):
    if memo is None:
        memo = {}
    if m == 1 or n == 1:
        return 1
    if (m, n) in memo:
        return memo[(m, n)]
    # Reach the corner from the cell above (one fewer row) or the left (one fewer column).
    memo[(m, n)] = unique_paths(m - 1, n, memo) + unique_paths(m, n - 1, memo)
    return memo[(m, n)]
`,
            js: `function uniquePaths(m, n, memo = new Map()) {
  if (m === 1 || n === 1) return 1;
  const key = m + ',' + n;
  if (memo.has(key)) return memo.get(key);
  // Reach the corner from the cell above (one fewer row) or the left (one fewer column).
  memo.set(key, uniquePaths(m - 1, n, memo) + uniquePaths(m, n - 1, memo));
  return memo.get(key);
}
`,
          },
        },
      ],
      tests: [
        { input: [3, 7], expected: 28 },
        { input: [3, 2], expected: 3 },
        { input: [1, 1], expected: 1 },
        { input: [3, 3], expected: 6 },
        { input: [10, 10], expected: 48620 },
      ],
      hints: [
        'The paths reaching a cell equal the paths reaching the cell above plus the cell to the left.',
        'The first row and first column each have exactly one path.',
        'A single rolling row suffices: dp[j] += dp[j-1].',
      ],
      complexity: { time: 'O(m·n)', space: 'O(n)' },
    },
    {
      id: 'minimum-path-sum',
      title: 'Minimum Path Sum',
      difficulty: 'Medium',
      topicSlug: 'dp-2d',
      statement: `Given an \`m x n\` grid of non-negative numbers, find a path from top-left to bottom-right (moving only **right** or **down**) that minimizes the sum of numbers along it. Return that minimum sum. (CSPrimer's "Minimal grid path".)`,
      constraints: ['1 ≤ m, n ≤ 200', '0 ≤ grid[i][j] ≤ 200'],
      examples: [
        { input: 'grid = [[1,3,1],[1,5,1],[4,2,1]]', output: '7', explanation: 'Path 1→3→1→1→1.' },
        { input: 'grid = [[1,2,3],[4,5,6]]', output: '12' },
      ],
      functionName: { py: 'min_path_sum', js: 'minPathSum' },
      starter: {
        py: 'def min_path_sum(grid):\n    # best to reach a cell = its value + min(best above, best left)\n    # your code here\n    pass\n',
        js: 'function minPathSum(grid) {\n  // best to reach a cell = its value + min(best above, best left)\n  // your code here\n}\n',
      },
      reference: {
        py: 'def min_path_sum(grid):\n    rows, cols = len(grid), len(grid[0])\n    dp = [0] * cols\n    dp[0] = grid[0][0]\n    for j in range(1, cols):\n        dp[j] = dp[j - 1] + grid[0][j]\n    for i in range(1, rows):\n        dp[0] += grid[i][0]\n        for j in range(1, cols):\n            dp[j] = min(dp[j], dp[j - 1]) + grid[i][j]\n    return dp[-1]\n',
        js: 'function minPathSum(grid) {\n  const rows = grid.length, cols = grid[0].length;\n  const dp = new Array(cols).fill(0);\n  dp[0] = grid[0][0];\n  for (let j = 1; j < cols; j++) dp[j] = dp[j - 1] + grid[0][j];\n  for (let i = 1; i < rows; i++) {\n    dp[0] += grid[i][0];\n    for (let j = 1; j < cols; j++) {\n      dp[j] = Math.min(dp[j], dp[j - 1]) + grid[i][j];\n    }\n  }\n  return dp[cols - 1];\n}\n',
      },
      referenceLabel: 'Iterative (bottom-up)',
      alternates: [
        {
          label: 'Recursive (memoized)',
          code: {
            py: `def min_path_sum(grid):
    memo = {}

    def best(i, j):
        if i == 0 and j == 0:
            return grid[0][0]
        if (i, j) in memo:
            return memo[(i, j)]
        # The cheapest way in comes from above (i-1) or from the left (j-1).
        if i == 0:
            cheapest = best(i, j - 1)
        elif j == 0:
            cheapest = best(i - 1, j)
        else:
            cheapest = min(best(i - 1, j), best(i, j - 1))
        memo[(i, j)] = cheapest + grid[i][j]
        return memo[(i, j)]

    return best(len(grid) - 1, len(grid[0]) - 1)
`,
            js: `function minPathSum(grid) {
  const memo = new Map();

  function best(i, j) {
    if (i === 0 && j === 0) return grid[0][0];
    const key = i + ',' + j;
    if (memo.has(key)) return memo.get(key);
    // The cheapest way in comes from above (i-1) or from the left (j-1).
    let cheapest;
    if (i === 0) cheapest = best(i, j - 1);
    else if (j === 0) cheapest = best(i - 1, j);
    else cheapest = Math.min(best(i - 1, j), best(i, j - 1));
    memo.set(key, cheapest + grid[i][j]);
    return memo.get(key);
  }

  return best(grid.length - 1, grid[0].length - 1);
}
`,
          },
        },
      ],
      tests: [
        { input: [[[1, 3, 1], [1, 5, 1], [4, 2, 1]]], expected: 7 },
        { input: [[[1, 2, 3], [4, 5, 6]]], expected: 12 },
        { input: [[[5]]], expected: 5 },
        { input: [[[1, 2], [1, 1]]], expected: 3 },
        { input: [[[1, 2, 5], [3, 2, 1]]], expected: 6 },
      ],
      hints: [
        'The cheapest way into a cell is its own value plus the cheaper of the cells above and to its left.',
        'The first row/column accumulate in one direction only.',
        'A single rolling row works: dp[j] = min(dp[j] /*above*/, dp[j-1] /*left*/) + grid[i][j].',
      ],
      complexity: { time: 'O(m·n)', space: 'O(n)' },
    },
    {
      id: 'longest-common-subsequence',
      title: 'Longest Common Subsequence',
      difficulty: 'Medium',
      topicSlug: 'dp-2d',
      statement: `Given two strings \`a\` and \`b\`, return the length of their longest common subsequence — a sequence appearing in both in the same relative order (not necessarily contiguous).`,
      constraints: ['1 ≤ a.length, b.length ≤ 1000', 'Lowercase English letters.'],
      examples: [
        { input: 'a = "abcde", b = "ace"', output: '3', explanation: '"ace".' },
        { input: 'a = "abc", b = "def"', output: '0' },
      ],
      functionName: { py: 'longest_common_subsequence', js: 'longestCommonSubsequence' },
      starter: {
        py: 'def longest_common_subsequence(a, b):\n    # dp[i][j] = LCS of a[:i] and b[:j]\n    # your code here\n    pass\n',
        js: 'function longestCommonSubsequence(a, b) {\n  // dp[i][j] = LCS of a[:i] and b[:j]\n  // your code here\n}\n',
      },
      reference: {
        py: 'def longest_common_subsequence(a, b):\n    m, n = len(a), len(b)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if a[i - 1] == b[j - 1]:\n                dp[i][j] = dp[i - 1][j - 1] + 1\n            else:\n                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])\n    return dp[m][n]\n',
        js: 'function longestCommonSubsequence(a, b) {\n  const m = a.length, n = b.length;\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;\n      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n    }\n  }\n  return dp[m][n];\n}\n',
      },
      referenceLabel: 'Iterative (bottom-up)',
      alternates: [
        {
          label: 'Recursive (memoized)',
          code: {
            py: `def longest_common_subsequence(a, b):
    memo = {}

    def lcs(i, j):
        if i == 0 or j == 0:
            return 0
        if (i, j) in memo:
            return memo[(i, j)]
        # Matching characters extend the diagonal; otherwise drop one char from either side.
        if a[i - 1] == b[j - 1]:
            memo[(i, j)] = lcs(i - 1, j - 1) + 1
        else:
            memo[(i, j)] = max(lcs(i - 1, j), lcs(i, j - 1))
        return memo[(i, j)]

    return lcs(len(a), len(b))
`,
            js: `function longestCommonSubsequence(a, b) {
  const memo = new Map();

  function lcs(i, j) {
    if (i === 0 || j === 0) return 0;
    const key = i + ',' + j;
    if (memo.has(key)) return memo.get(key);
    // Matching characters extend the diagonal; otherwise drop one char from either side.
    if (a[i - 1] === b[j - 1]) memo.set(key, lcs(i - 1, j - 1) + 1);
    else memo.set(key, Math.max(lcs(i - 1, j), lcs(i, j - 1)));
    return memo.get(key);
  }

  return lcs(a.length, b.length);
}
`,
          },
        },
      ],
      tests: [
        { input: ['abcde', 'ace'], expected: 3 },
        { input: ['abc', 'abc'], expected: 3 },
        { input: ['abc', 'def'], expected: 0 },
        { input: ['bl', 'yby'], expected: 1 },
        { input: ['bsbininm', 'jmjkbkjkv'], expected: 1 },
      ],
      hints: [
        'dp[i][j] is the LCS length of the first i chars of a and first j chars of b.',
        'If the current characters match, extend the diagonal: dp[i-1][j-1] + 1.',
        'Otherwise take the better of dropping a character from either string.',
      ],
      complexity: { time: 'O(m·n)', space: 'O(m·n)' },
    },
    {
      id: 'edit-distance',
      title: 'Edit Distance',
      difficulty: 'Hard',
      topicSlug: 'dp-2d',
      statement: `Given two strings \`word1\` and \`word2\`, return the minimum number of operations (insert, delete, or replace a single character) to convert \`word1\` into \`word2\`. (CSPrimer's "Edit distance".)`,
      constraints: ['0 ≤ word1.length, word2.length ≤ 500', 'Lowercase English letters.'],
      examples: [
        { input: 'word1 = "horse", word2 = "ros"', output: '3', explanation: 'horse→rorse→rose→ros.' },
        { input: 'word1 = "intention", word2 = "execution"', output: '5' },
      ],
      functionName: { py: 'min_distance', js: 'minDistance' },
      starter: {
        py: 'def min_distance(word1, word2):\n    # dp[i][j] = edits to turn word1[:i] into word2[:j]\n    # your code here\n    pass\n',
        js: 'function minDistance(word1, word2) {\n  // dp[i][j] = edits to turn word1[:i] into word2[:j]\n  // your code here\n}\n',
      },
      reference: {
        py: 'def min_distance(word1, word2):\n    m, n = len(word1), len(word2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(m + 1):\n        dp[i][0] = i\n    for j in range(n + 1):\n        dp[0][j] = j\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if word1[i - 1] == word2[j - 1]:\n                dp[i][j] = dp[i - 1][j - 1]\n            else:\n                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])\n    return dp[m][n]\n',
        js: 'function minDistance(word1, word2) {\n  const m = word1.length, n = word2.length;\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n  for (let i = 0; i <= m; i++) dp[i][0] = i;\n  for (let j = 0; j <= n; j++) dp[0][j] = j;\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (word1[i - 1] === word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];\n      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);\n    }\n  }\n  return dp[m][n];\n}\n',
      },
      referenceLabel: 'Iterative (bottom-up)',
      alternates: [
        {
          label: 'Recursive (memoized)',
          code: {
            py: `def min_distance(word1, word2):
    memo = {}

    def edits(i, j):
        # An empty prefix on either side costs one insert/delete per remaining char.
        if i == 0:
            return j
        if j == 0:
            return i
        if (i, j) in memo:
            return memo[(i, j)]
        if word1[i - 1] == word2[j - 1]:
            memo[(i, j)] = edits(i - 1, j - 1)
        else:
            memo[(i, j)] = 1 + min(edits(i - 1, j), edits(i, j - 1), edits(i - 1, j - 1))
        return memo[(i, j)]

    return edits(len(word1), len(word2))
`,
            js: `function minDistance(word1, word2) {
  const memo = new Map();

  function edits(i, j) {
    // An empty prefix on either side costs one insert/delete per remaining char.
    if (i === 0) return j;
    if (j === 0) return i;
    const key = i + ',' + j;
    if (memo.has(key)) return memo.get(key);
    if (word1[i - 1] === word2[j - 1]) memo.set(key, edits(i - 1, j - 1));
    else memo.set(key, 1 + Math.min(edits(i - 1, j), edits(i, j - 1), edits(i - 1, j - 1)));
    return memo.get(key);
  }

  return edits(word1.length, word2.length);
}
`,
          },
        },
      ],
      tests: [
        { input: ['horse', 'ros'], expected: 3 },
        { input: ['intention', 'execution'], expected: 5 },
        { input: ['', 'abc'], expected: 3 },
        { input: ['abc', ''], expected: 3 },
        { input: ['abc', 'abc'], expected: 0 },
      ],
      hints: [
        'dp[i][j] = edits to convert the first i chars of word1 into the first j chars of word2.',
        'Base cases: converting to/from an empty string costs that string’s length (all inserts/deletes).',
        'If chars match, carry the diagonal; else 1 + min(delete, insert, replace).',
      ],
      complexity: { time: 'O(m·n)', space: 'O(m·n)' },
    },
  ],
};

export default topic;
