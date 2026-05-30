import type { Topic } from '@/lib/types';

const tutorial = `
## 1-D Dynamic Programming — first principles

Dynamic programming solves a problem by combining answers to **overlapping subproblems**. It applies
when a problem has:

1. **Optimal substructure** — the answer is built from answers to smaller versions of itself, and
2. **Overlapping subproblems** — the same smaller versions get solved again and again.

Plain recursion re-derives those repeated subproblems exponentially. DP computes each subproblem
**once** and reuses it — turning exponential into linear (or polynomial).

### The recipe

1. **Define the state.** \`dp[i]\` = the answer to the subproblem ending at / using \`i\`. Getting this
   definition crisp is 80% of the work.
2. **Write the recurrence.** Express \`dp[i]\` in terms of smaller indices. This is just "what's the
   last choice, and what subproblem remains after it?"
3. **Base cases.** The smallest states you can fill in directly.
4. **Order.** Fill states so every value you depend on is already computed (usually \`i\` increasing).

For \`House Robber\`, the choice at house \`i\` is *rob it* (\`dp[i-2] + nums[i]\`) or *skip it* (\`dp[i-1]\`):
\`dp[i] = max(dp[i-1], dp[i-2] + nums[i])\`. For \`Coin Change\`, \`dp[a] = 1 + min(dp[a - c])\` over coins \`c\`.

### Top-down vs bottom-up

- **Top-down (memoized recursion):** write the natural recursion, cache results by state. Easiest to
  derive from a brute-force solution.
- **Bottom-up (tabulation):** fill an array from base cases upward. Often lets you drop the array to a
  couple of variables — many 1-D DPs only look back 1–2 steps, giving **O(1) space**.

### Key points to remember

- DP = recursion + memoization: solve each subproblem once, reuse it.
- Nail the **state definition** first; the recurrence usually falls out of "what was the last choice?".
- Climbing-stairs / Fibonacci-style relations only need the last one or two values → O(1) space.
- "Min/max/number of ways to reach a target amount/length" is the classic 1-D DP smell.
- If you can write the brute-force recursion, you can memoize it — that's already a correct DP.
`;

const topic: Topic = {
  slug: 'dp-1d',
  title: '1-D Dynamic Programming',
  order: 14,
  blurb: 'Solve overlapping subproblems once: linear-state recurrences for counts, min/max, and reachability.',
  tutorial,
  problems: [
    {
      id: 'climbing-stairs',
      title: 'Climbing Stairs',
      difficulty: 'Easy',
      topicSlug: 'dp-1d',
      statement: `You are climbing a staircase with \`n\` steps. Each move you can climb 1 or 2 steps. In how many distinct ways can you reach the top? (CSPrimer's "Staircase ascent".)`,
      constraints: ['1 ≤ n ≤ 45'],
      examples: [
        { input: 'n = 2', output: '2', explanation: '1+1 or 2.' },
        { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, 2+1.' },
      ],
      functionName: { py: 'climb_stairs', js: 'climbStairs' },
      starter: {
        py: 'def climb_stairs(n):\n    # ways(n) = ways(n-1) + ways(n-2)\n    # your code here\n    pass\n',
        js: 'function climbStairs(n) {\n  // ways(n) = ways(n-1) + ways(n-2)\n  // your code here\n}\n',
      },
      reference: {
        py: 'def climb_stairs(n):\n    if n <= 2:\n        return n\n    prev, cur = 1, 2\n    for _ in range(3, n + 1):\n        prev, cur = cur, prev + cur\n    return cur\n',
        js: 'function climbStairs(n) {\n  if (n <= 2) return n;\n  let prev = 1, cur = 2;\n  for (let i = 3; i <= n; i++) {\n    const next = prev + cur;\n    prev = cur;\n    cur = next;\n  }\n  return cur;\n}\n',
      },
      tests: [
        { input: [2], expected: 2 },
        { input: [3], expected: 3 },
        { input: [1], expected: 1 },
        { input: [5], expected: 8 },
        { input: [45], expected: 1836311903 },
      ],
      hints: [
        'To reach step n you came from step n-1 (a 1-step) or n-2 (a 2-step).',
        'So ways(n) = ways(n-1) + ways(n-2) — Fibonacci.',
        'You only need the last two values; track them in two variables.',
      ],
      complexity: { time: 'O(n)', space: 'O(1)' },
    },
    {
      id: 'house-robber',
      title: 'House Robber',
      difficulty: 'Medium',
      topicSlug: 'dp-1d',
      statement: `Houses in a row each hold some money (\`nums[i]\`). You cannot rob two **adjacent** houses. Return the maximum amount you can rob.`,
      constraints: ['1 ≤ nums.length ≤ 100', '0 ≤ nums[i] ≤ 400'],
      examples: [
        { input: 'nums = [1,2,3,1]', output: '4', explanation: 'Rob house 0 and 2 → 1 + 3.' },
        { input: 'nums = [2,7,9,3,1]', output: '12', explanation: 'Rob houses 0, 2, 4 → 2 + 9 + 1.' },
      ],
      functionName: { py: 'rob', js: 'rob' },
      starter: {
        py: 'def rob(nums):\n    # at each house: skip it, or rob it + best up to two houses back\n    # your code here\n    pass\n',
        js: 'function rob(nums) {\n  // at each house: skip it, or rob it + best up to two houses back\n  // your code here\n}\n',
      },
      reference: {
        py: 'def rob(nums):\n    prev, cur = 0, 0\n    for x in nums:\n        prev, cur = cur, max(cur, prev + x)\n    return cur\n',
        js: 'function rob(nums) {\n  let prev = 0, cur = 0;\n  for (const x of nums) {\n    const next = Math.max(cur, prev + x);\n    prev = cur;\n    cur = next;\n  }\n  return cur;\n}\n',
      },
      tests: [
        { input: [[1, 2, 3, 1]], expected: 4 },
        { input: [[2, 7, 9, 3, 1]], expected: 12 },
        { input: [[2, 1, 1, 2]], expected: 4 },
        { input: [[5]], expected: 5 },
        { input: [[2, 100, 9, 3, 100]], expected: 200 },
      ],
      hints: [
        'For each house, either skip it (keep the best so far) or rob it plus the best from two houses back.',
        'dp[i] = max(dp[i-1], dp[i-2] + nums[i]).',
        'Only the previous two results matter — track them as two variables.',
      ],
      complexity: { time: 'O(n)', space: 'O(1)' },
    },
    {
      id: 'coin-change',
      title: 'Coin Change',
      difficulty: 'Medium',
      topicSlug: 'dp-1d',
      statement: `Given coin denominations \`coins\` (unlimited supply of each) and an \`amount\`, return the fewest coins that sum to \`amount\`, or \`-1\` if it cannot be made.`,
      constraints: ['1 ≤ coins.length ≤ 12', '0 ≤ amount ≤ 10⁴'],
      examples: [
        { input: 'coins = [1,2,5], amount = 11', output: '3', explanation: '5 + 5 + 1.' },
        { input: 'coins = [2], amount = 3', output: '-1' },
      ],
      functionName: { py: 'coin_change', js: 'coinChange' },
      starter: {
        py: 'def coin_change(coins, amount):\n    # dp[a] = fewest coins to make amount a\n    # your code here\n    pass\n',
        js: 'function coinChange(coins, amount) {\n  // dp[a] = fewest coins to make amount a\n  // your code here\n}\n',
      },
      reference: {
        py: 'def coin_change(coins, amount):\n    INF = amount + 1\n    dp = [0] + [INF] * amount\n    for a in range(1, amount + 1):\n        for c in coins:\n            if c <= a:\n                dp[a] = min(dp[a], dp[a - c] + 1)\n    return dp[amount] if dp[amount] != INF else -1\n',
        js: 'function coinChange(coins, amount) {\n  const INF = amount + 1;\n  const dp = new Array(amount + 1).fill(INF);\n  dp[0] = 0;\n  for (let a = 1; a <= amount; a++) {\n    for (const c of coins) {\n      if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);\n    }\n  }\n  return dp[amount] === INF ? -1 : dp[amount];\n}\n',
      },
      tests: [
        { input: [[1, 2, 5], 11], expected: 3 },
        { input: [[2], 3], expected: -1 },
        { input: [[1], 0], expected: 0 },
        { input: [[1, 2, 5], 100], expected: 20 },
        { input: [[2, 5, 10, 1], 27], expected: 4 },
      ],
      hints: [
        'Let dp[a] be the fewest coins to make amount a; dp[0] = 0.',
        'For each amount a, try every coin c ≤ a: dp[a] = min(dp[a], dp[a - c] + 1).',
        'If dp[amount] was never improved past the “impossible” sentinel, return -1.',
      ],
      complexity: { time: 'O(amount · coins)', space: 'O(amount)' },
    },
    {
      id: 'perfect-squares',
      title: 'Perfect Squares',
      difficulty: 'Medium',
      topicSlug: 'dp-1d',
      statement: `Given an integer \`n\`, return the least number of perfect-square numbers (1, 4, 9, 16, …) that sum to \`n\`. (CSPrimer's "Perfect squares".)`,
      constraints: ['1 ≤ n ≤ 10⁴'],
      examples: [
        { input: 'n = 12', output: '3', explanation: '4 + 4 + 4.' },
        { input: 'n = 13', output: '2', explanation: '4 + 9.' },
      ],
      functionName: { py: 'num_squares', js: 'numSquares' },
      starter: {
        py: 'def num_squares(n):\n    # dp[i] = fewest squares summing to i\n    # your code here\n    pass\n',
        js: 'function numSquares(n) {\n  // dp[i] = fewest squares summing to i\n  // your code here\n}\n',
      },
      reference: {
        py: "def num_squares(n):\n    dp = [0] + [float('inf')] * n\n    for i in range(1, n + 1):\n        j = 1\n        while j * j <= i:\n            dp[i] = min(dp[i], dp[i - j * j] + 1)\n            j += 1\n    return dp[n]\n",
        js: 'function numSquares(n) {\n  const dp = new Array(n + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= n; i++) {\n    for (let j = 1; j * j <= i; j++) {\n      dp[i] = Math.min(dp[i], dp[i - j * j] + 1);\n    }\n  }\n  return dp[n];\n}\n',
      },
      tests: [
        { input: [12], expected: 3 },
        { input: [13], expected: 2 },
        { input: [1], expected: 1 },
        { input: [4], expected: 1 },
        { input: [7], expected: 4 },
      ],
      hints: [
        'This is Coin Change where the “coins” are the perfect squares ≤ n.',
        'dp[i] = 1 + min over squares j·j ≤ i of dp[i - j·j].',
        'Every i is reachable (1 is a perfect square), so no -1 case here.',
      ],
      complexity: { time: 'O(n·√n)', space: 'O(n)' },
    },
  ],
};

export default topic;
