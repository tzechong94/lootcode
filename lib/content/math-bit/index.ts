import type { Topic, TutorialBlock } from '@/lib/types';

const tutorial = `
## Math & Bit Manipulation — first principles

Numbers are stored in **binary**, and operating on those bits directly is often faster and more
elegant than arithmetic. Bit tricks turn "count/find/toggle" problems into a handful of O(1)
operations, and a few number-theory ideas (gcd, modular arithmetic, digit manipulation) round out
the toolkit interviewers reach for.

### The operators

| Op | Meaning | Use |
|----|---------|-----|
| \`&\` | AND | mask/check bits |
| \`\\|\` | OR | set bits |
| \`^\` | XOR | toggle/compare bits |
| \`~\` | NOT | flip all bits |
| \`<<\` \`>>\` | shift | multiply/divide by 2, move bits |

### XOR — the cancellation trick

XOR has two magic properties: \`x ^ x = 0\` and \`x ^ 0 = x\`. So XORing a list where every value appears
twice **cancels all the pairs**, leaving only the unique element. That's an O(n) time, O(1) space
solution to "find the single number" — no hash set needed.

### Counting and clearing bits

- \`n & (n - 1)\` clears the **lowest set bit**. Repeating it until \`n\` is 0 counts set bits in O(number
  of set bits) — **Brian Kernighan's** trick.
- \`n & 1\` reads the lowest bit; \`n >> 1\` drops it. Walking these processes a number bit by bit.
- For "count bits for every number 0..n", reuse earlier answers: \`bits[i] = bits[i >> 1] + (i & 1)\` —
  a one-line DP.

### Useful identities

- \`x & -x\` isolates the lowest set bit.
- Multiply/divide by powers of two with shifts.
- \`gcd(a, b) = gcd(b, a % b)\`; modular arithmetic keeps huge products in range (\`(a * b) % m\`).

### Key points to remember

- XOR cancels pairs (\`x ^ x = 0\`) — the trick behind "single number" and "missing number".
- \`n & (n - 1)\` removes the lowest set bit; loop it to count set bits.
- \`x & -x\` isolates the lowest set bit; shifts are fast ×/÷ by 2.
- Reuse subresults: \`bits[i] = bits[i >> 1] + (i & 1)\`.
- Watch language differences — JS bitwise ops are 32-bit; Python integers are arbitrary precision.
`;

const blocks: TutorialBlock[] = [
  {
    kind: 'md',
    md: `## Math & Bit Manipulation — from first principles

Numbers are stored in **binary**, and operating on those bits directly is often faster and cleaner
than arithmetic. The operators: \`&\` (AND — mask/check), \`|\` (OR — set), \`^\` (XOR — toggle/compare),
\`~\` (NOT — flip), and \`<<\` \`>>\` (shift — multiply/divide by 2). A few tricks recur constantly.

**XOR cancellation** is the headline: \`x ^ x = 0\` and \`x ^ 0 = x\`. So XORing a list where every value
appears twice **cancels all the pairs**, leaving only the unique one — an O(n) time, O(1) space "find
the single number" with no hash set.

**\`n & (n - 1)\` clears the lowest set bit.** Repeating it until \`n\` is 0 counts the set bits in exactly
(number of 1s) steps — Brian Kernighan's trick. Watch the lowest 1-bit vanish each step:`,
  },
  {
    kind: 'viz',
    spec: {
      type: 'bits',
      title: "Counting set bits: n & (n-1) clears the lowest 1 each step",
      frames: [
        { caption: 'n = 11 = 1011₂. Goal: count the 1 bits. Trick: n & (n-1) removes the lowest set bit.', bits: [1, 0, 1, 1], label: 'n = 11', highlight: [3] },
        { caption: '11 & 10 = 1010₂. The lowest 1 (the ones place) is gone. count = 1.', bits: [1, 0, 1, 0], label: 'n = 10', highlight: [1] },
        { caption: '10 & 9 = 1000₂. Lowest 1 cleared again. count = 2.', bits: [1, 0, 0, 0], label: 'n = 8', highlight: [0] },
        { caption: '8 & 7 = 0000₂. No bits left → stop. count = 3. We looped only once per set bit.', bits: [0, 0, 0, 0], label: 'n = 0' },
      ],
    },
  },
  {
    kind: 'md',
    md: `A few more useful identities: \`x & -x\` isolates the lowest set bit; shifts multiply/divide by powers
of two; \`gcd(a,b) = gcd(b, a%b)\`; and modular arithmetic (\`(a*b) % m\`) keeps huge products in range.
And subresults reuse: \`bits[i] = bits[i >> 1] + (i & 1)\` counts set bits for every number 0..n in O(n).

### Key points to remember

- XOR cancels pairs (\`x ^ x = 0\`) — the trick behind "single number" and "missing number".
- \`n & (n - 1)\` removes the lowest set bit; loop it to count set bits.
- \`x & -x\` isolates the lowest set bit; shifts are fast ×/÷ by 2.
- Reuse subresults: \`bits[i] = bits[i >> 1] + (i & 1)\`.
- Mind language differences — JS bitwise ops are 32-bit; Python ints are arbitrary precision.`,
  },
];

const topic: Topic = {
  slug: 'math-bit',
  title: 'Math & Bit Manipulation',
  order: 18,
  section: 'algorithm',
  family: 'Math & Bit',
  blurb: 'Operate on bits directly: XOR cancellation, set-bit counting, and number-theory staples.',
  tutorial,
  blocks,
  problems: [
    {
      id: 'single-number',
      title: 'Single Number',
      difficulty: 'Easy',
      topicSlug: 'math-bit',
      statement: `Given a non-empty array \`nums\` where every element appears **twice** except for one, find that single element. Use O(n) time and O(1) extra space.`,
      constraints: ['1 ≤ nums.length ≤ 3·10⁴', 'Exactly one element appears once; all others twice.'],
      examples: [
        { input: 'nums = [2,2,1]', output: '1' },
        { input: 'nums = [4,1,2,1,2]', output: '4' },
      ],
      functionName: { py: 'single_number', js: 'singleNumber' },
      starter: {
        py: 'def single_number(nums):\n    # XOR cancels every pair\n    # your code here\n    pass\n',
        js: 'function singleNumber(nums) {\n  // XOR cancels every pair\n  // your code here\n}\n',
      },
      reference: {
        py: 'def single_number(nums):\n    res = 0\n    for x in nums:\n        res ^= x\n    return res\n',
        js: 'function singleNumber(nums) {\n  let res = 0;\n  for (const x of nums) res ^= x;\n  return res;\n}\n',
      },
      tests: [
        { input: [[2, 2, 1]], expected: 1 },
        { input: [[4, 1, 2, 1, 2]], expected: 4 },
        { input: [[1]], expected: 1 },
        { input: [[7, 3, 7, 3, 9]], expected: 9 },
        { input: [[0, 0, -5]], expected: -5 },
      ],
      hints: [
        'A hash set works but uses O(n) space — can you do O(1)?',
        'XOR of a value with itself is 0, and XOR with 0 leaves it unchanged.',
        'XOR everything together; the pairs cancel and the unique value remains.',
      ],
      complexity: { time: 'O(n)', space: 'O(1)' },
    },
    {
      id: 'number-of-1-bits',
      title: 'Number of 1 Bits',
      difficulty: 'Easy',
      topicSlug: 'math-bit',
      statement: `Given a non-negative integer \`n\`, return the number of \`1\` bits in its binary representation (its Hamming weight).`,
      constraints: ['0 ≤ n ≤ 2³¹ − 1'],
      examples: [
        { input: 'n = 11', output: '3', explanation: '1011₂ has three 1 bits.' },
        { input: 'n = 128', output: '1', explanation: '10000000₂.' },
      ],
      functionName: { py: 'hamming_weight', js: 'hammingWeight' },
      starter: {
        py: 'def hamming_weight(n):\n    # clear the lowest set bit each step\n    # your code here\n    pass\n',
        js: 'function hammingWeight(n) {\n  // clear the lowest set bit each step\n  // your code here\n}\n',
      },
      reference: {
        py: 'def hamming_weight(n):\n    count = 0\n    while n:\n        n &= n - 1\n        count += 1\n    return count\n',
        js: 'function hammingWeight(n) {\n  let count = 0;\n  while (n) {\n    n &= n - 1;\n    count++;\n  }\n  return count;\n}\n',
      },
      tests: [
        { input: [11], expected: 3 },
        { input: [128], expected: 1 },
        { input: [255], expected: 8 },
        { input: [0], expected: 0 },
        { input: [2147483647], expected: 31 },
      ],
      hints: [
        'You could check each bit with n & 1 and shift right.',
        "Brian Kernighan's trick: n & (n - 1) removes the lowest set bit.",
        'Count how many times you can do that before n becomes 0.',
      ],
      complexity: { time: 'O(set bits)', space: 'O(1)' },
    },
    {
      id: 'counting-bits',
      title: 'Counting Bits',
      difficulty: 'Easy',
      topicSlug: 'math-bit',
      statement: `Given an integer \`n\`, return an array \`ans\` of length \`n + 1\` where \`ans[i]\` is the number of \`1\` bits in \`i\`, for every \`0 ≤ i ≤ n\`.`,
      constraints: ['0 ≤ n ≤ 10⁵'],
      examples: [
        { input: 'n = 2', output: '[0,1,1]' },
        { input: 'n = 5', output: '[0,1,1,2,1,2]' },
      ],
      functionName: { py: 'count_bits', js: 'countBits' },
      starter: {
        py: 'def count_bits(n):\n    # reuse the answer for i >> 1\n    # your code here\n    pass\n',
        js: 'function countBits(n) {\n  // reuse the answer for i >> 1\n  // your code here\n}\n',
      },
      reference: {
        py: 'def count_bits(n):\n    dp = [0] * (n + 1)\n    for i in range(1, n + 1):\n        dp[i] = dp[i >> 1] + (i & 1)\n    return dp\n',
        js: 'function countBits(n) {\n  const dp = new Array(n + 1).fill(0);\n  for (let i = 1; i <= n; i++) {\n    dp[i] = dp[i >> 1] + (i & 1);\n  }\n  return dp;\n}\n',
      },
      tests: [
        { input: [2], expected: [0, 1, 1] },
        { input: [5], expected: [0, 1, 1, 2, 1, 2] },
        { input: [0], expected: [0] },
        { input: [1], expected: [0, 1] },
        { input: [8], expected: [0, 1, 1, 2, 1, 2, 2, 3, 1] },
      ],
      hints: [
        'The bits in i are the bits in i>>1 plus the lowest bit of i.',
        'So ans[i] = ans[i >> 1] + (i & 1).',
        'Fill the array left to right reusing earlier results — an O(n) DP.',
      ],
      complexity: { time: 'O(n)', space: 'O(n)' },
    },
  ],
};

export default topic;
