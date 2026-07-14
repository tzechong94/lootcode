import type { Topic } from '@/lib/types';

const tutorial = `
## Dynamic programming

Dynamic programming (DP) solves a problem by solving **overlapping subproblems** once and reusing the
answers. Two signs a problem is DP: it asks for an **optimum** (max/min/fewest/count), and a solution
is built from solutions to smaller versions of the *same* problem.

The recipe:

1. **Define the state** — what does \`dp[i]\` (or \`dp[i][j]\`) *mean*? e.g. "the best you can do
   considering the first \`i\` houses."
2. **Write the recurrence** — how does the answer for a state combine answers of smaller states? For
   house robber: \`dp[i] = max(dp[i-1], dp[i-2] + nums[i])\` — skip this house or take it.
3. **Order the computation** so every state's dependencies are ready before it (bottom-up), or memoize
   a top-down recursion.

Grid path sums and edit distance are 2-D: the state is a cell \`(i, j)\` and the recurrence looks at the
neighbours you could have come from.

### Key points to remember

- DP = optimum + overlapping subproblems. Name the state in one sentence before writing code.
- Each cell is "take vs skip" or "min over the moves that could reach me."
- 1-D problems often collapse to O(1) space (a couple of rolling variables); 2-D to one row.
- If you can write the recurrence, the loop order and base cases follow.
`;

const topic: Topic = {
  slug: 'csp-dynamic-programming',
  title: 'Dynamic Programming',
  order: 107,
  section: 'csprimer',
  blurb: 'Optimum + overlapping subproblems: define a state, write a recurrence.',
  tutorial,
  problems: [
    {
      id: 'house-robber',
      title: 'House Robber',
      difficulty: 'Medium',
      topicSlug: 'csp-dynamic-programming',
      statement: `Given \`nums\`, the amount of money in each house along a street, return the **maximum** you can rob without robbing two **adjacent** houses (that would trigger the alarm).

Equivalently: the maximum sum of a subset of the array with no two chosen elements adjacent. The recurrence is "skip this house, or take it plus the best up to two houses back."`,
      constraints: ['0 ≤ nums.length ≤ 10⁴', '0 ≤ nums[i] ≤ 10⁴'],
      examples: [
        { input: 'nums = [1,2,3,1]', output: '4', explanation: 'Rob houses 0 and 2 (1 + 3).' },
        { input: 'nums = [2,7,9,3,1]', output: '12', explanation: 'Rob houses 0, 2, 4 (2 + 9 + 1).' },
      ],
      functionName: { py: 'rob', js: 'rob' },
      starter: {
        py: 'def rob(nums):\n    # your code here\n    pass\n',
        js: 'function rob(nums) {\n  // your code here\n}\n',
      },
      reference: {
        py: `def rob(nums):
    take, skip = 0, 0
    for x in nums:
        take, skip = skip + x, max(skip, take)
    return max(take, skip)
`,
        js: `function rob(nums) {
  let take = 0, skip = 0;
  for (const x of nums) {
    [take, skip] = [skip + x, Math.max(skip, take)];
  }
  return Math.max(take, skip);
}
`,
      },
      tests: [
        { input: [[1, 2, 3, 1]], expected: 4 },
        { input: [[2, 7, 9, 3, 1]], expected: 12 },
        { input: [[]], expected: 0 },
        { input: [[5]], expected: 5 },
        { input: [[2, 1, 1, 2]], expected: 4 },
        { input: [[10, 5, 5, 10]], expected: 20 },
        { input: [[2, 1]], expected: 2 },
        // All zeros — distinguishes "0 because empty" from "0 because worthless".
        { input: [[0, 0, 0, 0]], expected: 0 },
        // Odd-length all-equal: taking both ends gives 10, taking the odd index gives 5.
        { input: [[5, 5, 5]], expected: 10 },
        { input: [[10000, 10000]], expected: 10000 },
      ],
      hints: [
        'For each house you either skip it (keep the best so far) or rob it (best up to two houses back, plus this house).',
        'Track two running values: best if you take the current house, best if you skip it.',
        'The answer is the max of the two after processing every house.',
      ],
      complexity: { time: 'O(n)', space: 'O(1)' },
    },
    {
      id: 'perfect-squares',
      title: 'Perfect Squares',
      difficulty: 'Medium',
      topicSlug: 'csp-dynamic-programming',
      statement: `Given a positive integer \`n\`, return the **fewest** number of perfect squares (1, 4, 9, 16, …) that sum to \`n\`.

For example \`12 = 4 + 4 + 4\` (three) and \`13 = 4 + 9\` (two). Let \`dp[k]\` be the fewest squares summing to \`k\`; then \`dp[k] = 1 + min(dp[k - s])\` over all squares \`s ≤ k\`.`,
      constraints: ['1 ≤ n ≤ 10⁴'],
      examples: [
        { input: 'n = 12', output: '3' },
        { input: 'n = 13', output: '2' },
      ],
      functionName: { py: 'num_squares', js: 'numSquares' },
      starter: {
        py: 'def num_squares(n):\n    # your code here\n    pass\n',
        js: 'function numSquares(n) {\n  // your code here\n}\n',
      },
      reference: {
        py: `def num_squares(n):
    dp = [0] + [float("inf")] * n
    for k in range(1, n + 1):
        j = 1
        while j * j <= k:
            dp[k] = min(dp[k], dp[k - j * j] + 1)
            j += 1
    return dp[n]
`,
        js: `function numSquares(n) {
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;
  for (let k = 1; k <= n; k++) {
    for (let j = 1; j * j <= k; j++) {
      dp[k] = Math.min(dp[k], dp[k - j * j] + 1);
    }
  }
  return dp[n];
}
`,
      },
      tests: [
        { input: [1], expected: 1 },
        { input: [4], expected: 1 },
        { input: [6], expected: 3 },
        { input: [7], expected: 4 },
        { input: [12], expected: 3 },
        { input: [13], expected: 2 },
        { input: [43], expected: 3 },
        { input: [2], expected: 2 },
        { input: [3], expected: 3 },
        // 28 = 4·(8·0+7): needs four squares via Legendre's a≥1 form; the existing n=7 only
        // covers a=0.
        { input: [28], expected: 4 },
        { input: [9999], expected: 4 },
        // Upper bound, and a perfect square — answer 1.
        { input: [10000], expected: 1 },
      ],
      hints: [
        'Let dp[k] be the fewest squares summing to k, with dp[0] = 0.',
        'For each k, try subtracting every square j·j ≤ k and take 1 + the best of dp[k - j·j].',
        'Build dp from 1 up to n; the answer is dp[n].',
      ],
      complexity: { time: 'O(n√n)', space: 'O(n)' },
    },
    {
      id: 'minimal-grid-path',
      title: 'Minimal Grid Path',
      difficulty: 'Medium',
      topicSlug: 'csp-dynamic-programming',
      statement: `Given a \`grid\` of non-negative integers, find a path from the **top-left** to the **bottom-right** that minimizes the sum of the numbers along it. You may only move **right** or **down**.

Return that minimum sum. The state \`dp[i][j]\` is the cheapest way to reach cell \`(i, j)\`: \`grid[i][j] + min(dp[i-1][j], dp[i][j-1])\`.`,
      constraints: ['1 ≤ rows, cols ≤ 200', '0 ≤ grid[i][j] ≤ 100'],
      examples: [
        { input: 'grid = [[1,3,1],[1,5,1],[4,2,1]]', output: '7', explanation: '1→3→1→1→1.' },
        { input: 'grid = [[1,2,3],[4,5,6]]', output: '12', explanation: '1→2→3→6.' },
      ],
      functionName: { py: 'min_path_sum', js: 'minPathSum' },
      starter: {
        py: 'def min_path_sum(grid):\n    # your code here\n    pass\n',
        js: 'function minPathSum(grid) {\n  // your code here\n}\n',
      },
      reference: {
        py: `def min_path_sum(grid):
    rows = len(grid)
    cols = len(grid[0])
    dp = [row[:] for row in grid]
    for i in range(rows):
        for j in range(cols):
            if i == 0 and j == 0:
                continue
            elif i == 0:
                dp[i][j] += dp[i][j - 1]
            elif j == 0:
                dp[i][j] += dp[i - 1][j]
            else:
                dp[i][j] += min(dp[i - 1][j], dp[i][j - 1])
    return dp[rows - 1][cols - 1]
`,
        js: `function minPathSum(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const dp = grid.map((row) => row.slice());
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (i === 0 && j === 0) continue;
      else if (i === 0) dp[i][j] += dp[i][j - 1];
      else if (j === 0) dp[i][j] += dp[i - 1][j];
      else dp[i][j] += Math.min(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[rows - 1][cols - 1];
}
`,
      },
      tests: [
        { input: [[[1, 3, 1], [1, 5, 1], [4, 2, 1]]], expected: 7 },
        { input: [[[1, 2, 3], [4, 5, 6]]], expected: 12 },
        { input: [[[5]]], expected: 5 },
        { input: [[[1, 2], [1, 1]]], expected: 3 },
        { input: [[[1, 2, 5], [3, 2, 1]]], expected: 6 },
        // 1xN and Nx1 — no existing case is single-row or single-column, so the
        // "first row: only-right" and "first column: only-down" branches are never
        // exercised on their own.
        { input: [[[1, 2, 3, 4]]], expected: 10 },
        { input: [[[1], [2], [3]]], expected: 6 },
        { input: [[[0, 0], [0, 0]]], expected: 0 },
        // Greedy trap: always stepping to the cheaper neighbour scores 201; the optimum is 4.
        { input: [[[0, 1, 100], [2, 100, 100], [1, 1, 0]]], expected: 4 },
        { input: [[[100, 100], [100, 100]]], expected: 300 },
      ],
      hints: [
        'dp[i][j] = grid[i][j] + the cheaper of the cell above and the cell to the left.',
        'The first row can only be reached from the left; the first column only from above.',
        'Fill the table row by row; the answer is the bottom-right cell.',
      ],
      complexity: { time: 'O(rows · cols)', space: 'O(rows · cols)' },
    },
    {
      id: 'edit-distance',
      title: 'Edit Distance',
      difficulty: 'Hard',
      topicSlug: 'csp-dynamic-programming',
      statement: `Given two strings \`a\` and \`b\`, return the **minimum number of single-character edits** (insert, delete, or substitute) to turn \`a\` into \`b\`. This is the **Levenshtein distance**.

Let \`dp[i][j]\` be the distance between the first \`i\` characters of \`a\` and the first \`j\` of \`b\`. If the current characters match, carry \`dp[i-1][j-1]\`; otherwise it's \`1 + min\` of the delete, insert, and substitute options.`,
      constraints: ['0 ≤ a.length, b.length ≤ 300'],
      examples: [
        { input: 'a = "horse", b = "ros"', output: '3', explanation: 'horse → rorse → rose → ros.' },
        { input: 'a = "intention", b = "execution"', output: '5' },
      ],
      functionName: { py: 'edit_distance', js: 'editDistance' },
      starter: {
        py: 'def edit_distance(a, b):\n    # your code here\n    pass\n',
        js: 'function editDistance(a, b) {\n  // your code here\n}\n',
      },
      reference: {
        py: `def edit_distance(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    return dp[m][n]
`,
        js: `function editDistance(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}
`,
      },
      tests: [
        { input: ['horse', 'ros'], expected: 3 },
        { input: ['intention', 'execution'], expected: 5 },
        { input: ['', 'abc'], expected: 3 },
        { input: ['abc', 'abc'], expected: 0 },
        { input: ['sunday', 'saturday'], expected: 3 },
        { input: ['abc', ''], expected: 3 },
        // Both empty — the dp[0][0] base case; only the one-sided-empty cases were covered.
        { input: ['', ''], expected: 0 },
        // Pins this to Levenshtein: a transposition is two edits here, not one. A
        // Damerau-Levenshtein solution returns 1 and is caught only by this case.
        { input: ['ab', 'ba'], expected: 2 },
        { input: ['abc', 'def'], expected: 3 },
        { input: ['abc', 'xy'], expected: 3 },
        { input: ['aaa', 'aa'], expected: 1 },
      ],
      hints: [
        'dp[i][j] is the edit distance between the first i chars of a and first j of b.',
        'Base cases: turning a length-i prefix into "" costs i (all deletes), and vice versa.',
        'If the current characters match, inherit dp[i-1][j-1]; else 1 + min(delete, insert, substitute).',
      ],
      complexity: { time: 'O(m · n)', space: 'O(m · n)' },
    },
  ],
};

export default topic;
