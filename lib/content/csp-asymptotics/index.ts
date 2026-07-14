import type { Topic } from '@/lib/types';

const tutorial = `
## Asymptotic analysis — reasoning about how algorithms scale

Big-O describes how work grows with input size, independent of the machine. The practical payoff:
**knowing the complexity classes tells you what a better solution would have to look like.**

If you have an obvious O(n) solution and someone hints you can do better, the target is something
like O(log n), O(√n), or O(1) — and that usually means finding a *mathematical shortcut* instead of
iterating. Fizzbuzz-sum is exactly this: the O(n) loop becomes an O(1) closed form once you recall
that the multiples of k below n form an arithmetic series.

The flip side: **don't over-engineer.** A hash set turns "any duplicates?" from O(n²) into O(n),
but if n is tiny, even the O(n²) scan is instant. Match the effort to the input size.

### Key points to remember

- Repeated membership checks ⇒ reach for a hash set (O(1) average) to avoid O(n²) scans.
- "Can you do better than O(n)?" is a hint to look for a formula, not a cleverer loop.
- Sum of \`1..m\` is \`m(m+1)/2\`; sums of multiples reduce to that in O(1).
`;

const topic: Topic = {
  slug: 'csp-asymptotics',
  title: 'Asymptotic Analysis',
  order: 103,
  section: 'csprimer',
  blurb: 'Let complexity classes guide you — from O(n²) to O(n) to a closed-form O(1).',
  tutorial,
  problems: [
    {
      id: 'has-dupe',
      title: 'Finding Duplicates',
      difficulty: 'Easy',
      topicSlug: 'csp-asymptotics',
      statement: `Given an integer array \`nums\`, return \`true\` if any value appears more than once, and \`false\` if all values are distinct.

Think about the trade-offs: a nested-loop scan is O(n²) time / O(1) space; sorting is O(n log n); a hash set is O(n) time / O(n) space. The hash-set version is the one to reach for by default.`,
      constraints: ['0 ≤ nums.length ≤ 10⁵'],
      examples: [
        { input: 'nums = [1,2,3,1]', output: 'true' },
        { input: 'nums = [1,2,3,4]', output: 'false' },
      ],
      functionName: { py: 'has_duplicate', js: 'hasDuplicate' },
      starter: {
        py: 'def has_duplicate(nums):\n    # your code here\n    pass\n',
        js: 'function hasDuplicate(nums) {\n  // your code here\n}\n',
      },
      reference: {
        py: `def has_duplicate(nums):
    seen = set()
    for x in nums:
        if x in seen:
            return True
        seen.add(x)
    return False
`,
        js: `function hasDuplicate(nums) {
  const seen = new Set();
  for (const x of nums) {
    if (seen.has(x)) return true;
    seen.add(x);
  }
  return false;
}
`,
      },
      tests: [
        { input: [[1, 2, 3, 1]], expected: true },
        { input: [[1, 2, 3, 4]], expected: false },
        { input: [[]], expected: false },
        { input: [[7, 7]], expected: true },
        { input: [[10, 20, 30, 40, 50, 10]], expected: true },
        { input: [[-1, -2, -3]], expected: false },
        { input: [[5]], expected: false },
        // Duplicate zeros: a membership test written as `if (seen[x])` would miss these.
        { input: [[0, 0]], expected: true },
        { input: [[0, -1, 1]], expected: false },
      ],
      hints: [
        'A nested loop comparing every pair is O(n²) — what makes membership checks O(1)?',
        'Walk once, remembering values you have already seen in a hash set.',
        'If the current value is already in the set, you found a duplicate; otherwise add it.',
      ],
      complexity: { time: 'O(n)', space: 'O(n)' },
    },
    {
      id: 'fizzbuzz-sum',
      title: 'Fizzbuzz Sum',
      difficulty: 'Medium',
      topicSlug: 'csp-asymptotics',
      statement: `Return the sum of all positive multiples of **3 or 5** that are strictly below \`n\`.

The O(n) solution is a simple loop. But the hint "you can do better" points at O(1): the multiples of \`k\` below \`n\` are \`k, 2k, …, mk\` where \`m = (n-1)//k\`, and their sum is \`k · m(m+1)/2\`. Add the series for 3 and 5, then subtract the series for 15 (counted twice).`,
      constraints: ['0 ≤ n ≤ 10⁹'],
      examples: [
        { input: 'n = 10', output: '23', explanation: '3 + 5 + 6 + 9 = 23.' },
        { input: 'n = 1000', output: '233168' },
      ],
      functionName: { py: 'fizzbuzz_sum', js: 'fizzbuzzSum' },
      starter: {
        py: 'def fizzbuzz_sum(n):\n    # your code here\n    pass\n',
        js: 'function fizzbuzzSum(n) {\n  // your code here\n}\n',
      },
      reference: {
        py: `def fizzbuzz_sum(n):
    def series(k):
        m = (n - 1) // k
        return k * m * (m + 1) // 2
    return series(3) + series(5) - series(15)
`,
        js: `function fizzbuzzSum(n) {
  const series = (k) => {
    const m = Math.floor((n - 1) / k);
    return (k * m * (m + 1)) / 2;
  };
  return series(3) + series(5) - series(15);
}
`,
      },
      tests: [
        { input: [10], expected: 23 },
        { input: [16], expected: 60 },
        { input: [3], expected: 0 },
        { input: [6], expected: 8 },
        { input: [1], expected: 0 },
        { input: [1000], expected: 233168 },
        // n = 0: (n-1)//k goes negative — the series must still come out at 0, not negative.
        { input: [0], expected: 0 },
        { input: [5], expected: 3 },
        // 15 itself is excluded ("strictly below"), but 3/5/6/9/10/12 count.
        { input: [15], expected: 45 },
        // Large n: an O(n) loop won't finish, and this is the biggest value JS keeps exact.
        { input: [100000000], expected: 2333333316666668 },
      ],
      hints: [
        'The naive answer loops 0..n-1 and sums multiples of 3 or 5 — that is O(n).',
        'Multiples of k below n form an arithmetic series; its sum is k · m(m+1)/2 with m = (n-1)//k.',
        'Add the 3-series and 5-series, then subtract the 15-series (those were counted twice).',
      ],
      complexity: { time: 'O(1)', space: 'O(1)' },
    },
  ],
};

export default topic;
