import type { Topic, TutorialBlock } from '@/lib/types';

const tutorial = `
## Sorting & Divide and Conquer — first principles

**Divide and conquer** solves a problem by splitting it into smaller independent subproblems,
solving each recursively, and **combining** the results. Three steps: *divide, conquer, combine.*
The recursion's cost is captured by a recurrence (e.g. \`T(n) = 2T(n/2) + O(n)\` → O(n log n)). Sorting
is the canonical playground for the idea.

### Merge sort — combine is the work

Split the array in half, sort each half recursively, then **merge** the two sorted halves in linear
time by repeatedly taking the smaller front element. Always **O(n log n)**, stable, and the merge
step itself is a reusable subroutine (it powers "merge k lists" and inversion counting).

\`\`\`text
sort(a):
    if len(a) <= 1: return a
    mid = len/2
    return merge(sort(a[:mid]), sort(a[mid:]))
\`\`\`

### The merge step unlocks counting problems

Because merge sees the two sorted halves together, it can *count* things during the combine. Counting
**inversions** (pairs \`i < j\` with \`a[i] > a[j]\`) is the classic example: when an element from the
right half is placed before remaining left-half elements, every one of those left elements forms an
inversion with it — count them in the same O(n log n) pass.

### Fast exponentiation — halve the exponent

Divide and conquer isn't only for arrays. To compute \`baseᵉˣᵖ\`, note \`xⁿ = (xⁿ/²)²\` (times an extra
\`x\` when \`n\` is odd). Halving the exponent each step gives **O(log n)** multiplications instead of
\`n\`. Done under a modulus, it's the backbone of cryptography.

\`\`\`text
power(x, n):  result = 1
    while n > 0:
        if n is odd: result *= x
        x *= x; n //= 2
\`\`\`

### Key points to remember

- Divide & conquer = split → recurse → **combine**; the combine step is usually where the cleverness lives.
- Merge sort is O(n log n) and stable; its linear merge is a reusable building block.
- Counting inversions piggybacks on the merge step — O(n log n) instead of O(n²).
- Fast (binary) exponentiation halves the exponent for O(log n) — keep a running modulus to avoid overflow.
- Recognize \`T(n) = aT(n/b) + f(n)\`; that recurrence is what makes these algorithms efficient.
`;

const blocks: TutorialBlock[] = [
  {
    kind: 'md',
    md: `## Sorting & Divide and Conquer — from first principles

**Divide and conquer** solves a problem by splitting it into smaller *independent* subproblems,
solving each recursively, and **combining** the results. Three steps: *divide, conquer, combine.* The
efficiency comes from the recurrence — splitting in half and doing linear combine work gives
\`T(n) = 2T(n/2) + O(n)\` = **O(n log n)**.

**Merge sort** is the cleanest example, and the *combine* step is where the work lives: split the
array in half, sort each half recursively, then **merge** two sorted halves in linear time. Watch it
divide down to single elements, then merge back up:`,
  },
  {
    kind: 'viz',
    spec: {
      type: 'tree',
      title: 'Merge sort: divide to singletons, then merge upward',
      nodes: ['5,2,8,1', '5,2', '8,1', '5', '2', '8', '1'],
      frames: [
        { caption: 'Divide: split the array into two halves.', nodes: ['5,2,8,1', '5,2', '8,1', '5', '2', '8', '1'], active: [0] },
        { caption: 'Split each half again…', nodes: ['5,2,8,1', '5,2', '8,1', '5', '2', '8', '1'], visited: [0], active: [1, 2] },
        { caption: 'Down to single elements — each is trivially sorted. Nothing left to divide.', nodes: ['5,2,8,1', '5,2', '8,1', '5', '2', '8', '1'], visited: [0, 1, 2], active: [3, 4, 5, 6] },
        { caption: 'Merge pairs: [5],[2] → [2,5]; [8],[1] → [1,8]. Merging two sorted lists is linear.', nodes: ['5,2,8,1', '2,5', '1,8', '5', '2', '8', '1'], visited: [3, 4, 5, 6], active: [1, 2] },
        { caption: 'Merge the two sorted halves → [1,2,5,8]. The combine step is the real work; total is O(n log n).', nodes: ['1,2,5,8', '2,5', '1,8', '5', '2', '8', '1'], visited: [1, 2, 3, 4, 5, 6], active: [0] },
      ],
    },
  },
  {
    kind: 'md',
    md: `Because the merge step sees both sorted halves together, it can **count things** during the combine —
counting **inversions** (out-of-order pairs) is the classic example: when an element from the right
half is placed ahead of remaining left-half elements, each of those forms an inversion. Same O(n log n)
as the sort.

Divide and conquer isn't only for arrays. **Fast exponentiation** computes \`xⁿ\` as \`(xⁿ/²)²\` (times an
extra \`x\` when n is odd), halving the exponent each step for **O(log n)** multiplications.

### Key points to remember

- Divide & conquer = split → recurse → **combine**; the combine step is usually where the cleverness lives.
- Merge sort is O(n log n) and stable; its linear merge is a reusable building block.
- Counting inversions piggybacks on the merge step — O(n log n) instead of O(n²).
- Fast (binary) exponentiation halves the exponent for O(log n); keep a running modulus to avoid overflow.
- Recognize \`T(n) = a·T(n/b) + f(n)\` — that recurrence is what makes these efficient.`,
  },
];

const topic: Topic = {
  slug: 'sorting-divide-conquer',
  title: 'Sorting & Divide and Conquer',
  order: 4.5,
  blurb: 'Divide, conquer, combine: merge sort, inversion counting, and fast exponentiation.',
  tutorial,
  blocks,
  problems: [
    {
      id: 'sort-an-array',
      title: 'Sort an Array (Merge Sort)',
      difficulty: 'Medium',
      topicSlug: 'sorting-divide-conquer',
      statement: `Given an array \`nums\`, return it sorted in ascending order. Implement it yourself with **merge sort** (don't call the language's built-in sort). (CSPrimer's "Merge sort".)`,
      constraints: ['0 ≤ nums.length ≤ 5·10⁴', '-5·10⁴ ≤ nums[i] ≤ 5·10⁴'],
      examples: [
        { input: 'nums = [5,2,3,1]', output: '[1,2,3,5]' },
        { input: 'nums = [5,1,1,2,0,0]', output: '[0,0,1,1,2,5]' },
      ],
      functionName: { py: 'sort_array', js: 'sortArray' },
      starter: {
        py: 'def sort_array(nums):\n    # split in half, sort each, merge the sorted halves\n    # your code here\n    pass\n',
        js: 'function sortArray(nums) {\n  // split in half, sort each, merge the sorted halves\n  // your code here\n}\n',
      },
      reference: {
        py: 'def sort_array(nums):\n    if len(nums) <= 1:\n        return nums\n    mid = len(nums) // 2\n    left = sort_array(nums[:mid])\n    right = sort_array(nums[mid:])\n    merged = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            merged.append(left[i])\n            i += 1\n        else:\n            merged.append(right[j])\n            j += 1\n    merged.extend(left[i:])\n    merged.extend(right[j:])\n    return merged\n',
        js: 'function sortArray(nums) {\n  if (nums.length <= 1) return nums;\n  const mid = Math.floor(nums.length / 2);\n  const left = sortArray(nums.slice(0, mid));\n  const right = sortArray(nums.slice(mid));\n  const merged = [];\n  let i = 0, j = 0;\n  while (i < left.length && j < right.length) {\n    if (left[i] <= right[j]) merged.push(left[i++]);\n    else merged.push(right[j++]);\n  }\n  while (i < left.length) merged.push(left[i++]);\n  while (j < right.length) merged.push(right[j++]);\n  return merged;\n}\n',
      },
      tests: [
        { input: [[5, 2, 3, 1]], expected: [1, 2, 3, 5] },
        { input: [[5, 1, 1, 2, 0, 0]], expected: [0, 0, 1, 1, 2, 5] },
        { input: [[1]], expected: [1] },
        { input: [[]], expected: [] },
        { input: [[3, -1, 0, -5, 8, 8]], expected: [-5, -1, 0, 3, 8, 8] },
      ],
      hints: [
        'Base case: an array of length 0 or 1 is already sorted.',
        'Recursively sort the two halves.',
        'Merge by repeatedly taking the smaller front element of the two sorted halves.',
      ],
      complexity: { time: 'O(n log n)', space: 'O(n)' },
    },
    {
      id: 'count-inversions',
      title: 'Count Inversions',
      difficulty: 'Medium',
      topicSlug: 'sorting-divide-conquer',
      statement: `Given an array \`nums\`, count the number of **inversions** — pairs of indices \`i < j\` with \`nums[i] > nums[j]\`. Aim for O(n log n) by counting during a merge sort.`,
      constraints: ['1 ≤ nums.length ≤ 10⁵', 'Values fit in a 32-bit integer.'],
      examples: [
        { input: 'nums = [2,4,1,3,5]', output: '3', explanation: 'Pairs (2,1), (4,1), (4,3).' },
        { input: 'nums = [3,2,1]', output: '3' },
      ],
      functionName: { py: 'count_inversions', js: 'countInversions' },
      starter: {
        py: 'def count_inversions(nums):\n    # count during the merge: right-half element placed before left elements\n    # your code here\n    pass\n',
        js: 'function countInversions(nums) {\n  // count during the merge: right-half element placed before left elements\n  // your code here\n}\n',
      },
      reference: {
        py: 'def count_inversions(nums):\n    def sort_count(arr):\n        if len(arr) <= 1:\n            return arr, 0\n        mid = len(arr) // 2\n        left, lc = sort_count(arr[:mid])\n        right, rc = sort_count(arr[mid:])\n        merged = []\n        i = j = 0\n        inv = lc + rc\n        while i < len(left) and j < len(right):\n            if left[i] <= right[j]:\n                merged.append(left[i])\n                i += 1\n            else:\n                merged.append(right[j])\n                j += 1\n                inv += len(left) - i\n        merged.extend(left[i:])\n        merged.extend(right[j:])\n        return merged, inv\n    return sort_count(nums)[1]\n',
        js: 'function countInversions(nums) {\n  function sortCount(arr) {\n    if (arr.length <= 1) return [arr, 0];\n    const mid = Math.floor(arr.length / 2);\n    const [left, lc] = sortCount(arr.slice(0, mid));\n    const [right, rc] = sortCount(arr.slice(mid));\n    const merged = [];\n    let i = 0, j = 0, inv = lc + rc;\n    while (i < left.length && j < right.length) {\n      if (left[i] <= right[j]) merged.push(left[i++]);\n      else {\n        merged.push(right[j++]);\n        inv += left.length - i;\n      }\n    }\n    while (i < left.length) merged.push(left[i++]);\n    while (j < right.length) merged.push(right[j++]);\n    return [merged, inv];\n  }\n  return sortCount(nums)[1];\n}\n',
      },
      tests: [
        { input: [[2, 4, 1, 3, 5]], expected: 3 },
        { input: [[3, 2, 1]], expected: 3 },
        { input: [[1, 2, 3]], expected: 0 },
        { input: [[1]], expected: 0 },
        { input: [[1, 3, 2, 3, 1]], expected: 4 },
      ],
      hints: [
        'Brute force is O(n²); merge sort can count inversions while it sorts.',
        'During the merge, when you take an element from the right half, it is smaller than all remaining left-half elements.',
        'Add (number of remaining left elements) to the count at that moment.',
      ],
      complexity: { time: 'O(n log n)', space: 'O(n)' },
    },
    {
      id: 'fast-power',
      title: 'Fast Power (Modular Exponentiation)',
      difficulty: 'Medium',
      topicSlug: 'sorting-divide-conquer',
      statement: `Compute \`(base^exp) mod m\` efficiently using binary (fast) exponentiation, in O(log exp) multiplications. (CSPrimer's "Fast exponentiation".)`,
      constraints: ['0 ≤ base, exp ≤ 10⁹', '1 ≤ m ≤ 10⁶'],
      examples: [
        { input: 'base = 2, exp = 10, m = 1000', output: '24', explanation: '1024 mod 1000.' },
        { input: 'base = 3, exp = 5, m = 100', output: '43', explanation: '243 mod 100.' },
      ],
      functionName: { py: 'mod_pow', js: 'modPow' },
      starter: {
        py: 'def mod_pow(base, exp, m):\n    # square the base and halve the exponent each step\n    # your code here\n    pass\n',
        js: 'function modPow(base, exp, m) {\n  // square the base and halve the exponent each step\n  // your code here\n}\n',
      },
      reference: {
        py: 'def mod_pow(base, exp, m):\n    result = 1 % m\n    base %= m\n    while exp > 0:\n        if exp & 1:\n            result = (result * base) % m\n        base = (base * base) % m\n        exp >>= 1\n    return result\n',
        js: 'function modPow(base, exp, m) {\n  let result = 1 % m;\n  base %= m;\n  while (exp > 0) {\n    if (exp & 1) result = (result * base) % m;\n    base = (base * base) % m;\n    exp = Math.floor(exp / 2);\n  }\n  return result;\n}\n',
      },
      tests: [
        { input: [2, 10, 1000], expected: 24 },
        { input: [3, 5, 100], expected: 43 },
        { input: [2, 0, 5], expected: 1 },
        { input: [10, 3, 7], expected: 6 },
        { input: [7, 4, 1000], expected: 401 },
      ],
      hints: [
        'x^n = (x^(n/2))² when n is even, and one extra ×x when n is odd.',
        'Loop while exp > 0: if the lowest bit is set, multiply it into the result; then square base and shift exp right.',
        'Take the modulus after every multiplication to keep numbers small.',
      ],
      complexity: { time: 'O(log exp)', space: 'O(1)' },
    },
  ],
};

export default topic;
