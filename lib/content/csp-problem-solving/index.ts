import type { Topic } from '@/lib/types';

const tutorial = `
## Problem solving — techniques that make hard problems tractable

Some problems you can't just stare at and solve. CS Primer's problem-solving toolkit:

- **Solve a smaller case first.** How many ways to climb 1 stair? 2? A pattern emerges (it's
  Fibonacci) and the recurrence writes itself.
- **Plan before coding.** Converting to Roman numerals looks fiddly until you notice it's just
  *greedy subtraction* over a fixed value table — plan that and the code is tiny.
- **Use a loop invariant.** Binary search is deceptively buggy. State the invariant — "the target,
  if present, is always within \`[lo, hi]\`" — and every boundary decision follows from keeping it true.

### Key points to remember

- Shrink the problem: base cases + how the answer for \`n\` relates to smaller \`n\`.
- A greedy table (largest value that fits, repeatedly) solves many "encode this number" tasks.
- Name your invariant and defend it; that's how you kill off-by-one bugs in search.
`;

const topic: Topic = {
  slug: 'csp-problem-solving',
  title: 'Problem Solving',
  order: 102,
  section: 'csprimer',
  blurb: 'Shrink the problem, plan before coding, defend a loop invariant.',
  tutorial,
  problems: [
    {
      id: 'staircase',
      title: 'Staircase Ascent',
      difficulty: 'Easy',
      topicSlug: 'csp-problem-solving',
      statement: `You are climbing a staircase of \`n\` steps. Each move you may climb **1 or 2** steps. Return the number of distinct ways to reach the top.

Try tiny cases first: \`n = 1\` has 1 way, \`n = 2\` has 2 (1+1 or 2), \`n = 3\` has 3. The count for \`n\` is the count for \`n-1\` plus the count for \`n-2\` — it's the Fibonacci sequence.`,
      constraints: ['0 ≤ n ≤ 40', 'Define n = 0 as having 1 way (the empty climb).'],
      examples: [
        { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, 2+1.' },
        { input: 'n = 5', output: '8' },
      ],
      functionName: { py: 'count_ways', js: 'countWays' },
      starter: {
        py: 'def count_ways(n):\n    # your code here\n    pass\n',
        js: 'function countWays(n) {\n  // your code here\n}\n',
      },
      reference: {
        py: `def count_ways(n):
    a, b = 1, 1
    for _ in range(n):
        a, b = b, a + b
    return a
`,
        js: `function countWays(n) {
  let a = 1, b = 1;
  for (let i = 0; i < n; i++) {
    [a, b] = [b, a + b];
  }
  return a;
}
`,
      },
      referenceLabel: 'Iterative',
      alternates: [
        {
          label: 'Recursive (memoized)',
          code: {
            py: `def count_ways(n, memo=None):
    if memo is None:
        memo = {}
    if n <= 1:
        return 1
    if n in memo:
        return memo[n]
    # Reach step n from n-1 (one step) or n-2 (two steps).
    memo[n] = count_ways(n - 1, memo) + count_ways(n - 2, memo)
    return memo[n]
`,
            js: `function countWays(n, memo = new Map()) {
  if (n <= 1) return 1;
  if (memo.has(n)) return memo.get(n);
  // Reach step n from n-1 (one step) or n-2 (two steps).
  memo.set(n, countWays(n - 1, memo) + countWays(n - 2, memo));
  return memo.get(n);
}
`,
          },
        },
      ],
      tests: [
        { input: [0], expected: 1 },
        { input: [1], expected: 1 },
        { input: [2], expected: 2 },
        { input: [3], expected: 3 },
        { input: [4], expected: 5 },
        { input: [5], expected: 8 },
        { input: [10], expected: 89 },
        { input: [20], expected: 10946 },
        // One below the top bound: catches an off-by-one in the loop's upper limit.
        { input: [39], expected: 102334155 },
        // Upper constraint boundary (n ≤ 40): the largest legal answer.
        { input: [40], expected: 165580141 },
      ],
      hints: [
        'Work out n = 1, 2, 3 by hand and look for a pattern.',
        'ways(n) = ways(n-1) + ways(n-2): the last move was either a 1-step or a 2-step.',
        'Iterate with two rolling variables to avoid recomputation — this is Fibonacci.',
      ],
      complexity: { time: 'O(n)', space: 'O(1)' },
    },
    {
      id: 'roman-numerals',
      title: 'Convert to Roman',
      difficulty: 'Easy',
      topicSlug: 'csp-problem-solving',
      statement: `Convert a positive integer \`n\` to its Roman numeral string.

The trick is to plan first: list the values (including the subtractive forms like 4 = IV, 9 = IX, 40 = XL, 90 = XC, 400 = CD, 900 = CM) from largest to smallest, then **greedily** subtract the largest value that fits, appending its symbol, until \`n\` reaches 0.`,
      constraints: ['1 ≤ n ≤ 3999'],
      examples: [
        { input: 'n = 4', output: '"IV"' },
        { input: 'n = 1994', output: '"MCMXCIV"', explanation: 'M=1000, CM=900, XC=90, IV=4.' },
      ],
      functionName: { py: 'to_roman', js: 'toRoman' },
      starter: {
        py: 'def to_roman(n):\n    # your code here\n    pass\n',
        js: 'function toRoman(n) {\n  // your code here\n}\n',
      },
      reference: {
        py: `def to_roman(n):
    table = [
        (1000, "M"), (900, "CM"), (500, "D"), (400, "CD"),
        (100, "C"), (90, "XC"), (50, "L"), (40, "XL"),
        (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I"),
    ]
    out = []
    for value, symbol in table:
        while n >= value:
            out.append(symbol)
            n -= value
    return "".join(out)
`,
        js: `function toRoman(n) {
  const table = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ];
  let out = '';
  for (const [value, symbol] of table) {
    while (n >= value) {
      out += symbol;
      n -= value;
    }
  }
  return out;
}
`,
      },
      tests: [
        { input: [3], expected: 'III' },
        { input: [4], expected: 'IV' },
        { input: [9], expected: 'IX' },
        { input: [40], expected: 'XL' },
        { input: [58], expected: 'LVIII' },
        { input: [1994], expected: 'MCMXCIV' },
        { input: [2023], expected: 'MMXXIII' },
        { input: [3999], expected: 'MMMCMXCIX' },
        { input: [1], expected: 'I' },
        // CD and CM standalone: 1994 never uses CD, so a missing entry emits "CCCC".
        { input: [400], expected: 'CD' },
        { input: [900], expected: 'CM' },
        { input: [44], expected: 'XLIV' },
        // All seven symbols exactly once, descending.
        { input: [1666], expected: 'MDCLXVI' },
        { input: [3888], expected: 'MMMDCCCLXXXVIII' },
      ],
      hints: [
        'Do not special-case each digit — build one value→symbol table, largest first.',
        'Include the subtractive pairs (CM, CD, XC, XL, IX, IV) as entries in the table.',
        'Greedily subtract the largest value that still fits, appending its symbol, until n is 0.',
      ],
      complexity: { time: 'O(1)', space: 'O(1)' },
    },
    {
      id: 'binary-search',
      title: 'Correct Binary Search',
      difficulty: 'Easy',
      topicSlug: 'csp-problem-solving',
      statement: `Given a **sorted** ascending array \`nums\` and a \`target\`, return the index of \`target\`, or \`-1\` if it is not present.

The first bug-free binary search wasn't published until 16 years after the first binary search. The way to get it right is a **loop invariant**: keep the search range \`[lo, hi]\` such that if \`target\` exists, it is always inside it. Every boundary update must preserve that.`,
      constraints: ['0 ≤ nums.length ≤ 10⁴', 'nums is sorted ascending with distinct values.'],
      examples: [
        { input: 'nums = [1,2,3,4,5], target = 3', output: '2' },
        { input: 'nums = [1,2,3,4,5], target = 6', output: '-1' },
      ],
      functionName: { py: 'search', js: 'search' },
      starter: {
        py: 'def search(nums, target):\n    # your code here\n    pass\n',
        js: 'function search(nums, target) {\n  // your code here\n}\n',
      },
      reference: {
        py: `def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
`,
        js: `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
`,
      },
      referenceLabel: 'Iterative',
      alternates: [
        {
          label: 'Recursive',
          code: {
            py: `def search(nums, target, lo=0, hi=None):
    if hi is None:
        hi = len(nums) - 1
    # Same invariant as the loop: if target exists, it is inside [lo, hi].
    if lo > hi:
        return -1
    mid = (lo + hi) // 2
    if nums[mid] == target:
        return mid
    if nums[mid] < target:
        return search(nums, target, mid + 1, hi)
    return search(nums, target, lo, mid - 1)
`,
            js: `function search(nums, target, lo = 0, hi = nums.length - 1) {
  // Same invariant as the loop: if target exists, it is inside [lo, hi].
  if (lo > hi) return -1;
  const mid = Math.floor((lo + hi) / 2);
  if (nums[mid] === target) return mid;
  if (nums[mid] < target) return search(nums, target, mid + 1, hi);
  return search(nums, target, lo, mid - 1);
}
`,
          },
        },
      ],
      tests: [
        { input: [[1, 2, 3, 4, 5], 3], expected: 2 },
        { input: [[1, 2, 3, 4, 5], 6], expected: -1 },
        { input: [[], 1], expected: -1 },
        { input: [[5], 5], expected: 0 },
        { input: [[1, 3, 5, 7, 9], 9], expected: 4 },
        { input: [[1, 3, 5, 7, 9], 1], expected: 0 },
        { input: [[2, 4, 6, 8], 5], expected: -1 },
        { input: [[5], 3], expected: -1 },
        // Two elements, target at the top: mid always lands on lo, the classic non-termination trap.
        { input: [[1, 2], 2], expected: 1 },
        // Target below the minimum: the miss direction no other case covers.
        { input: [[2, 4, 6, 8], 1], expected: -1 },
        { input: [[1, 2, 3, 4], 4], expected: 3 },
        { input: [[-10, -3, 0, 7], -10], expected: 0 },
        { input: [[-5, -4, -3], -4], expected: 1 },
      ],
      hints: [
        'Use an inclusive range [lo, hi]; loop while lo <= hi.',
        'Compare nums[mid] to target and move the boundary you just ruled out (mid ± 1).',
        'Return -1 when the range becomes empty — the target was never inside the invariant range.',
      ],
      complexity: { time: 'O(log n)', space: 'O(1)' },
    },
  ],
};

export default topic;
