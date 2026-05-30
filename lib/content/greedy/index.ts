import type { Topic, TutorialBlock } from '@/lib/types';

const tutorial = `
## Greedy — first principles

A greedy algorithm builds a solution by **always taking the choice that looks best right now**, never
reconsidering. It's the opposite of DP's "try all options": greedy commits immediately. When it
works, it's faster and simpler — but it only works when a **local optimum is provably a global
optimum**. The whole skill is recognizing (and justifying) when that holds.

### Why greedy is dangerous — and when it's safe

For making change with arbitrary coins, "take the biggest coin that fits" can fail (that's why Coin
Change needed DP). Greedy is correct only when the problem has the **greedy-choice property**: an
optimal solution can always be reached by making the locally optimal choice. You should be able to
argue an **exchange argument** — swapping in the greedy choice never makes any optimal solution
worse.

### Patterns that are reliably greedy

- **Running best / Kadane's** — Maximum Subarray: extend the current run or restart at the current
  element, whichever is larger. The local decision ("is the running sum helping me?") is globally
  optimal.
- **Furthest reach** — Jump Game: track the furthest index reachable so far; if you ever stand
  beyond it, you're stuck.
- **Largest-denomination-first** when denominations are designed for it — Integer→Roman: repeatedly
  subtract the largest symbol value that fits. (Works because Roman values are constructed for it.)
- **Sort, then sweep** — interval scheduling, assigning tasks: sort by the right key (end time,
  deadline, ratio) and take greedily in that order.

### How to approach a greedy problem

1. Guess the greedy rule ("always pick the one with the earliest finish / biggest value / …").
2. **Sanity-check it against small cases and adversarial inputs.** If you find a counterexample, it's
   probably a DP problem instead.
3. If it survives, justify it with an exchange argument.

### Key points to remember

- Greedy makes an irrevocable locally-optimal choice at each step — fast, but only correct with the greedy-choice property.
- Always look for a counterexample first; a single failing case means reach for DP.
- "Sort by the right key, then sweep" is the most common greedy shape.
- Kadane's (running best) and furthest-reach are canonical safe greedies.
- Be ready to justify correctness — interviewers push on *why* the greedy choice is safe.
`;

const blocks: TutorialBlock[] = [
  {
    kind: 'md',
    md: `## Greedy — from first principles

A greedy algorithm builds an answer by always taking the choice that looks best **right now**, and
never reconsidering. It's the opposite of DP's "try all options" — greedy commits immediately, which
makes it fast and simple. The catch: it's only **correct when a local optimum is provably a global
optimum** (the *greedy-choice property*). The entire skill is recognizing when that holds — and
finding a counterexample when it doesn't.

Here's a clean safe greedy — Jump Game's "track the furthest index reachable." At each position you
just extend your reach as far as you can; you never plan exact jumps:`,
  },
  {
    kind: 'viz',
    spec: {
      type: 'array',
      title: 'Greedy furthest-reach: can we reach the last index?',
      frames: [
        { caption: 'nums[i] = max jump from i. Track the furthest index reachable so far. Start at 0: reach = 0 + 2 = 2.', cells: [{ value: 2, state: 'active' }, { value: 3, state: 'window' }, { value: 1, state: 'window' }, { value: 1 }, { value: 4 }], pointers: [{ name: 'i', index: 0 }, { name: 'reach', index: 2 }] },
        { caption: 'Index 1 is within reach. Jump 3 → extend reach to max(2, 1+3) = 4.', cells: [{ value: 2, state: 'done' }, { value: 3, state: 'active' }, { value: 1, state: 'window' }, { value: 1, state: 'window' }, { value: 4, state: 'window' }], pointers: [{ name: 'i', index: 1 }, { name: 'reach', index: 4 }] },
        { caption: 'Index 2: 2+1 = 3 < 4, no improvement. reach stays 4.', cells: [{ value: 2, state: 'done' }, { value: 3, state: 'done' }, { value: 1, state: 'active' }, { value: 1, state: 'window' }, { value: 4, state: 'window' }], pointers: [{ name: 'i', index: 2 }, { name: 'reach', index: 4 }] },
        { caption: 'Index 3: still within reach; reach stays 4.', cells: [{ value: 2, state: 'done' }, { value: 3, state: 'done' }, { value: 1, state: 'done' }, { value: 1, state: 'active' }, { value: 4, state: 'window' }], pointers: [{ name: 'i', index: 3 }, { name: 'reach', index: 4 }] },
        { caption: 'Index 4 is the last and was reachable → true. Greedily extending reach never required planning exact jumps.', cells: [{ value: 2, state: 'done' }, { value: 3, state: 'done' }, { value: 1, state: 'done' }, { value: 1, state: 'done' }, { value: 4, state: 'match' }], pointers: [{ name: 'i', index: 4 }] },
      ],
    },
  },
  {
    kind: 'md',
    md: `The danger: greedy can be plain wrong. "Make change with the biggest coin first" fails for coin sets
like {1, 3, 4} making 6 (greedy picks 4+1+1 = 3 coins; optimal is 3+3 = 2) — which is exactly why Coin
Change needed DP. So the workflow is: guess a greedy rule, **try hard to break it on small/adversarial
cases**, and only if it survives, justify it with an **exchange argument** (swapping in the greedy
choice never makes an optimal solution worse).

Reliable greedy shapes: **running best / Kadane's** (extend or restart), **furthest reach** (above),
**largest-first** when denominations are built for it (Integer→Roman), and **sort-then-sweep**
(interval scheduling by earliest finish).

### Key points to remember

- Greedy commits to a locally-optimal choice and never backtracks — fast, but only correct with the greedy-choice property.
- **Always hunt for a counterexample first**; if you find one, it's a DP problem.
- "Sort by the right key, then sweep" is the most common greedy shape.
- Kadane's (running best) and furthest-reach are canonical safe greedies.
- Be ready to justify *why* the local choice is globally safe — interviewers push on this.`,
  },
];

const topic: Topic = {
  slug: 'greedy',
  title: 'Greedy',
  order: 16,
  blurb: 'Commit to the locally-optimal choice — when a local optimum is provably global.',
  tutorial,
  blocks,
  problems: [
    {
      id: 'maximum-subarray',
      title: 'Maximum Subarray',
      difficulty: 'Medium',
      topicSlug: 'greedy',
      statement: `Given an integer array \`nums\`, find the contiguous subarray with the largest sum and return that sum.`,
      constraints: ['1 ≤ nums.length ≤ 10⁵', '-10⁴ ≤ nums[i] ≤ 10⁴'],
      examples: [
        { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: '[4,-1,2,1] sums to 6.' },
        { input: 'nums = [5,4,-1,7,8]', output: '23' },
      ],
      functionName: { py: 'max_sub_array', js: 'maxSubArray' },
      starter: {
        py: 'def max_sub_array(nums):\n    # extend the running sum or restart at the current element\n    # your code here\n    pass\n',
        js: 'function maxSubArray(nums) {\n  // extend the running sum or restart at the current element\n  // your code here\n}\n',
      },
      reference: {
        py: 'def max_sub_array(nums):\n    best = cur = nums[0]\n    for x in nums[1:]:\n        cur = max(x, cur + x)\n        best = max(best, cur)\n    return best\n',
        js: 'function maxSubArray(nums) {\n  let best = nums[0], cur = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    cur = Math.max(nums[i], cur + nums[i]);\n    best = Math.max(best, cur);\n  }\n  return best;\n}\n',
      },
      tests: [
        { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
        { input: [[5, 4, -1, 7, 8]], expected: 23 },
        { input: [[1]], expected: 1 },
        { input: [[-1]], expected: -1 },
        { input: [[-2, -1]], expected: -1 },
      ],
      hints: [
        'If the running sum ever goes negative, it can only hurt what follows — drop it.',
        'At each element, the best subarray ending here is max(element, runningSum + element).',
        'Track the best ending-here sum and the best overall.',
      ],
      complexity: { time: 'O(n)', space: 'O(1)' },
    },
    {
      id: 'jump-game',
      title: 'Jump Game',
      difficulty: 'Medium',
      topicSlug: 'greedy',
      statement: `Given an array \`nums\` where \`nums[i]\` is the maximum jump length from index \`i\`, starting at index 0, return \`true\` if you can reach the last index.`,
      constraints: ['1 ≤ nums.length ≤ 10⁴', '0 ≤ nums[i] ≤ 10⁵'],
      examples: [
        { input: 'nums = [2,3,1,1,4]', output: 'true' },
        { input: 'nums = [3,2,1,0,4]', output: 'false', explanation: 'Always land on index 3 (value 0) and stall.' },
      ],
      functionName: { py: 'can_jump', js: 'canJump' },
      starter: {
        py: 'def can_jump(nums):\n    # track the furthest index reachable so far\n    # your code here\n    pass\n',
        js: 'function canJump(nums) {\n  // track the furthest index reachable so far\n  // your code here\n}\n',
      },
      reference: {
        py: 'def can_jump(nums):\n    reach = 0\n    for i, x in enumerate(nums):\n        if i > reach:\n            return False\n        reach = max(reach, i + x)\n    return True\n',
        js: 'function canJump(nums) {\n  let reach = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (i > reach) return false;\n    reach = Math.max(reach, i + nums[i]);\n  }\n  return true;\n}\n',
      },
      tests: [
        { input: [[2, 3, 1, 1, 4]], expected: true },
        { input: [[3, 2, 1, 0, 4]], expected: false },
        { input: [[0]], expected: true },
        { input: [[2, 0, 0]], expected: true },
        { input: [[1, 0, 1]], expected: false },
      ],
      hints: [
        'Track the furthest index you could reach as you scan left to right.',
        'If your current index ever exceeds that furthest reach, you are stuck.',
        'Otherwise update reach = max(reach, i + nums[i]).',
      ],
      complexity: { time: 'O(n)', space: 'O(1)' },
    },
    {
      id: 'integer-to-roman',
      title: 'Integer to Roman',
      difficulty: 'Medium',
      topicSlug: 'greedy',
      statement: `Convert an integer to a Roman numeral. Symbols: I=1, V=5, X=10, L=50, C=100, D=500, M=1000, plus subtractive forms IV(4), IX(9), XL(40), XC(90), CD(400), CM(900). (CSPrimer's "Convert to Roman".)`,
      constraints: ['1 ≤ num ≤ 3999'],
      examples: [
        { input: 'num = 58', output: '"LVIII"', explanation: 'L=50, V=5, III=3.' },
        { input: 'num = 1994', output: '"MCMXCIV"', explanation: 'M=1000, CM=900, XC=90, IV=4.' },
      ],
      functionName: { py: 'int_to_roman', js: 'intToRoman' },
      starter: {
        py: 'def int_to_roman(num):\n    # repeatedly subtract the largest value whose symbol fits\n    # your code here\n    pass\n',
        js: 'function intToRoman(num) {\n  // repeatedly subtract the largest value whose symbol fits\n  // your code here\n}\n',
      },
      reference: {
        py: "def int_to_roman(num):\n    vals = [(1000, 'M'), (900, 'CM'), (500, 'D'), (400, 'CD'), (100, 'C'), (90, 'XC'), (50, 'L'), (40, 'XL'), (10, 'X'), (9, 'IX'), (5, 'V'), (4, 'IV'), (1, 'I')]\n    res = []\n    for v, sym in vals:\n        while num >= v:\n            res.append(sym)\n            num -= v\n    return ''.join(res)\n",
        js: "function intToRoman(num) {\n  const vals = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];\n  let res = '';\n  for (const [v, sym] of vals) {\n    while (num >= v) {\n      res += sym;\n      num -= v;\n    }\n  }\n  return res;\n}\n",
      },
      tests: [
        { input: [3], expected: 'III' },
        { input: [4], expected: 'IV' },
        { input: [9], expected: 'IX' },
        { input: [58], expected: 'LVIII' },
        { input: [1994], expected: 'MCMXCIV' },
        { input: [2023], expected: 'MMXXIII' },
      ],
      hints: [
        'List symbol values from largest to smallest, including the subtractive pairs (CM, CD, XC, …).',
        'Repeatedly append the largest symbol that does not exceed the remaining number.',
        'This greedy works because the value list is ordered and self-contained.',
      ],
      complexity: { time: 'O(1) (≤ 3999)', space: 'O(1)' },
    },
  ],
};

export default topic;
