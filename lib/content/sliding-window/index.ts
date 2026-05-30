import type { Topic, TutorialBlock } from '@/lib/types';

const tutorial = `
## Sliding Window — first principles

A sliding window is two pointers (\`left\`, \`right\`) that bound a **contiguous** subarray or
substring. As \`right\` expands the window to include new elements and \`left\` contracts it to
restore some condition, you compute the answer **incrementally** instead of recomputing each
subarray from scratch. That's what turns an O(n²) or O(n·k) brute force into O(n).

The core idea: **maintain a running summary of the current window** (a sum, a count map, a max
frequency) and update it in O(1) as the window's edges move — never re-scan the inside.

### Fixed-size window

When the window has a known length \`k\`, slide it one step at a time: add the entering element,
remove the leaving element, update the answer. (Maximum average subarray, etc.)

\`\`\`text
add first k elements to window summary
for right in k .. n-1:
    add a[right], remove a[right-k]
    update answer
\`\`\`

### Variable-size window

When you want the longest/shortest window satisfying a condition, grow on the right and shrink on
the left only when the condition breaks:

\`\`\`text
left = 0
for right in 0 .. n-1:
    include a[right] in the window
    while (window violates the condition):
        remove a[left]; left += 1
    update answer with current window [left, right]
\`\`\`

Each index enters once and leaves at most once, so the total work is O(n) even though there's a
nested \`while\`.

### How to recognize it

The problem asks about a **contiguous** subarray/substring and a property that changes
**monotonically** as the window grows (a longer window can only have a bigger sum / more distinct
chars / higher frequency). If reordering or non-contiguous picks are allowed, it's *not* a window.

### Key points to remember

- The window is always a contiguous range \`[left, right]\`; both pointers only move forward → O(n).
- Keep an O(1)-updatable summary of the window (sum, frequency map, distinct count) — never recompute over the window.
- "Longest/shortest subarray such that …" with a monotonic condition ⇒ variable-size window.
- Grow with \`right\`; shrink with \`left\` exactly while the condition is violated.
- Contiguity is the prerequisite — without it, reach for sorting/hashing instead.
`;

const blocks: TutorialBlock[] = [
  {
    kind: 'md',
    md: `## Sliding Window — from first principles

Suppose you want the best **contiguous** stretch of an array — the longest substring with no repeats,
the smallest subarray summing to at least K. The brute force tries every start/end pair and
recomputes each stretch from scratch: O(n²) or worse. But notice the waste: when you slide from one
window to the next, almost all the elements are the *same*. Why recompute them?

A **sliding window** keeps two indices, \`left\` and \`right\`, bounding the current stretch, plus a
small **running summary** of what's inside (a count, a sum, a set). As \`right\` moves to include a new
element you update the summary in O(1); when the window breaks a rule, you advance \`left\` to drop
elements — also O(1) each. Because both pointers only move *forward*, every element is added once and
removed once: the whole scan is **O(n)**.

Here's the variable-size window in action, finding the longest stretch with no repeated character —
grow on the right, and shrink from the left the moment a duplicate appears:`,
  },
  {
    kind: 'viz',
    spec: {
      type: 'array',
      title: 'A window that grows right and shrinks left to keep "no repeats"',
      frames: [
        { caption: 'right expands the window to include a; window = "a".', cells: [{ value: 'a', state: 'window' }, { value: 'b' }, { value: 'c' }, { value: 'a' }, { value: 'b' }, { value: 'b' }], pointers: [{ name: 'L', index: 0 }, { name: 'R', index: 0 }] },
        { caption: 'Include b — still all distinct. window = "ab".', cells: [{ value: 'a', state: 'window' }, { value: 'b', state: 'window' }, { value: 'c' }, { value: 'a' }, { value: 'b' }, { value: 'b' }], pointers: [{ name: 'L', index: 0 }, { name: 'R', index: 1 }] },
        { caption: 'Include c. window = "abc", length 3 — our best so far.', cells: [{ value: 'a', state: 'window' }, { value: 'b', state: 'window' }, { value: 'c', state: 'window' }, { value: 'a' }, { value: 'b' }, { value: 'b' }], pointers: [{ name: 'L', index: 0 }, { name: 'R', index: 2 }] },
        { caption: 'right hits a — but a is already in the window. Shrink from the left until the duplicate is gone.', cells: [{ value: 'a', state: 'eliminated' }, { value: 'b', state: 'window' }, { value: 'c', state: 'window' }, { value: 'a', state: 'compare' }, { value: 'b' }, { value: 'b' }], pointers: [{ name: 'L', index: 1 }, { name: 'R', index: 3 }] },
        { caption: 'Now window = "bca", valid again. Include the next b → duplicate, shrink left past the old b.', cells: [{ value: 'a', state: 'eliminated' }, { value: 'b', state: 'eliminated' }, { value: 'c', state: 'window' }, { value: 'a', state: 'window' }, { value: 'b', state: 'compare' }, { value: 'b' }], pointers: [{ name: 'L', index: 2 }, { name: 'R', index: 4 }] },
        { caption: 'Last b repeats again → shrink to just "b". Each index entered and left once → O(n) total.', cells: [{ value: 'a', state: 'eliminated' }, { value: 'b', state: 'eliminated' }, { value: 'c', state: 'eliminated' }, { value: 'a', state: 'eliminated' }, { value: 'b', state: 'eliminated' }, { value: 'b', state: 'window' }], pointers: [{ name: 'L', index: 5 }, { name: 'R', index: 5 }] },
      ],
    },
  },
  {
    kind: 'md',
    md: `The same shape with a **fixed** size just slides a constant-width window one step at a time, adding
the entering element and removing the leaving one. The art is choosing an O(1)-updatable summary —
a sum, a frequency map, a count of distinct values — so you never re-scan the window's interior.

### Key points to remember

- The window is always a contiguous range \`[left, right]\`; both pointers only move forward → O(n).
- Keep an **O(1)-updatable summary** of the window — never recompute over its contents.
- "Longest/shortest contiguous … such that <condition>" with a monotonic condition ⇒ variable window.
- Grow with \`right\`; shrink with \`left\` exactly while the condition is violated.
- Contiguity is the prerequisite — if reordering or gaps are allowed, it isn't a window problem.`,
  },
];

const topic: Topic = {
  slug: 'sliding-window',
  title: 'Sliding Window',
  order: 3,
  blurb: 'Maintain a moving contiguous range with an O(1)-updatable summary to get O(n) subarray answers.',
  tutorial,
  blocks,
  problems: [
    {
      id: 'best-time-to-buy-sell-stock',
      title: 'Best Time to Buy and Sell Stock',
      difficulty: 'Easy',
      topicSlug: 'sliding-window',
      statement: `You are given an array \`prices\` where \`prices[i]\` is the price of a stock on day \`i\`. Buy on one day and sell on a later day. Return the maximum profit; if no profit is possible, return \`0\`.`,
      constraints: ['1 ≤ prices.length ≤ 10⁵', '0 ≤ prices[i] ≤ 10⁴'],
      examples: [
        { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy at 1, sell at 6.' },
        { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'Prices only fall.' },
      ],
      functionName: { py: 'max_profit', js: 'maxProfit' },
      starter: {
        py: 'def max_profit(prices):\n    # your code here\n    pass\n',
        js: 'function maxProfit(prices) {\n  // your code here\n}\n',
      },
      reference: {
        py: "def max_profit(prices):\n    min_price = float('inf')\n    best = 0\n    for p in prices:\n        if p < min_price:\n            min_price = p\n        elif p - min_price > best:\n            best = p - min_price\n    return best\n",
        js: 'function maxProfit(prices) {\n  let minPrice = Infinity;\n  let best = 0;\n  for (const p of prices) {\n    if (p < minPrice) minPrice = p;\n    else if (p - minPrice > best) best = p - minPrice;\n  }\n  return best;\n}\n',
      },
      tests: [
        { input: [[7, 1, 5, 3, 6, 4]], expected: 5 },
        { input: [[7, 6, 4, 3, 1]], expected: 0 },
        { input: [[1]], expected: 0 },
        { input: [[2, 4, 1]], expected: 2 },
        { input: [[3, 2, 6, 5, 0, 3]], expected: 4 },
      ],
      hints: [
        'You want the largest gap where the buy day comes before the sell day.',
        'Track the lowest price seen so far as you scan left to right.',
        'At each day, the best profit ending today is price − (min price so far).',
      ],
      complexity: { time: 'O(n)', space: 'O(1)' },
    },
    {
      id: 'longest-substring-without-repeating',
      title: 'Longest Substring Without Repeating Characters',
      difficulty: 'Medium',
      topicSlug: 'sliding-window',
      statement: `Given a string \`s\`, return the length of the longest substring without repeating characters.`,
      constraints: ['0 ≤ s.length ≤ 5·10⁴', 's consists of English letters, digits, symbols and spaces.'],
      examples: [
        { input: 's = "abcabcbb"', output: '3', explanation: '"abc".' },
        { input: 's = "pwwkew"', output: '3', explanation: '"wke".' },
      ],
      functionName: { py: 'length_of_longest_substring', js: 'lengthOfLongestSubstring' },
      starter: {
        py: 'def length_of_longest_substring(s):\n    # your code here\n    pass\n',
        js: 'function lengthOfLongestSubstring(s) {\n  // your code here\n}\n',
      },
      reference: {
        py: 'def length_of_longest_substring(s):\n    seen = {}\n    left = 0\n    best = 0\n    for right, c in enumerate(s):\n        if c in seen and seen[c] >= left:\n            left = seen[c] + 1\n        seen[c] = right\n        best = max(best, right - left + 1)\n    return best\n',
        js: 'function lengthOfLongestSubstring(s) {\n  const seen = new Map();\n  let left = 0;\n  let best = 0;\n  for (let right = 0; right < s.length; right++) {\n    const c = s[right];\n    if (seen.has(c) && seen.get(c) >= left) left = seen.get(c) + 1;\n    seen.set(c, right);\n    best = Math.max(best, right - left + 1);\n  }\n  return best;\n}\n',
      },
      tests: [
        { input: ['abcabcbb'], expected: 3 },
        { input: ['bbbbb'], expected: 1 },
        { input: ['pwwkew'], expected: 3 },
        { input: [''], expected: 0 },
        { input: ['au'], expected: 2 },
        { input: ['dvdf'], expected: 3 },
      ],
      hints: [
        'Keep a window that contains no repeats. When you hit a repeat, shrink from the left.',
        'Store the last index where each character was seen.',
        'When the current char was seen at or after `left`, jump `left` to one past that index.',
      ],
      complexity: { time: 'O(n)', space: 'O(min(n, alphabet))' },
    },
    {
      id: 'longest-repeating-character-replacement',
      title: 'Longest Repeating Character Replacement',
      difficulty: 'Medium',
      topicSlug: 'sliding-window',
      statement: `You are given a string \`s\` and an integer \`k\`. You may replace at most \`k\` characters with any uppercase English letter. Return the length of the longest substring containing the same letter you can obtain after at most \`k\` replacements.`,
      constraints: ['1 ≤ s.length ≤ 10⁵', 's consists of uppercase English letters.', '0 ≤ k ≤ s.length'],
      examples: [
        { input: 's = "ABAB", k = 2', output: '4' },
        { input: 's = "AABABBA", k = 1', output: '4' },
      ],
      functionName: { py: 'character_replacement', js: 'characterReplacement' },
      starter: {
        py: 'def character_replacement(s, k):\n    # your code here\n    pass\n',
        js: 'function characterReplacement(s, k) {\n  // your code here\n}\n',
      },
      reference: {
        py: 'def character_replacement(s, k):\n    count = {}\n    left = 0\n    max_freq = 0\n    best = 0\n    for right in range(len(s)):\n        count[s[right]] = count.get(s[right], 0) + 1\n        max_freq = max(max_freq, count[s[right]])\n        while (right - left + 1) - max_freq > k:\n            count[s[left]] -= 1\n            left += 1\n        best = max(best, right - left + 1)\n    return best\n',
        js: 'function characterReplacement(s, k) {\n  const count = {};\n  let left = 0;\n  let maxFreq = 0;\n  let best = 0;\n  for (let right = 0; right < s.length; right++) {\n    count[s[right]] = (count[s[right]] || 0) + 1;\n    maxFreq = Math.max(maxFreq, count[s[right]]);\n    while (right - left + 1 - maxFreq > k) {\n      count[s[left]]--;\n      left++;\n    }\n    best = Math.max(best, right - left + 1);\n  }\n  return best;\n}\n',
      },
      tests: [
        { input: ['ABAB', 2], expected: 4 },
        { input: ['AABABBA', 1], expected: 4 },
        { input: ['A', 0], expected: 1 },
        { input: ['AAAA', 0], expected: 4 },
        { input: ['ABBB', 2], expected: 4 },
      ],
      hints: [
        'A window is valid if you can make every character equal by replacing at most k of them.',
        'For a window, the replacements needed = window length − count of its most frequent character.',
        'Grow the window; while (length − maxFrequency) > k, shrink from the left.',
      ],
      complexity: { time: 'O(n)', space: 'O(1) (26 letters)' },
    },
  ],
};

export default topic;
