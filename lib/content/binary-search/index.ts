import type { Topic } from '@/lib/types';

const tutorial = `
## Binary Search — first principles

Binary search finds a target in a **sorted** (more precisely, **monotonic**) search space by
repeatedly halving it: look at the middle, decide which half can possibly contain the answer, and
discard the other half. Each step throws away half the candidates, so the cost is **O(log n)**.

### The exact-match template

\`\`\`text
lo, hi = 0, n - 1
while lo <= hi:
    mid = (lo + hi) // 2
    if a[mid] == target: return mid
    elif a[mid] < target: lo = mid + 1   # answer is to the right
    else: hi = mid - 1                    # answer is to the left
return -1
\`\`\`

The two details that cause 90% of bugs: compute \`mid\` so it can't overflow (\`lo + (hi - lo)//2\`)
and make sure each branch **strictly shrinks** the range (\`mid + 1\` / \`mid - 1\`) so the loop
always terminates.

### The real superpower: "binary search on the answer"

Binary search isn't only for finding a value in an array. Whenever the answer is a number and you
can write a **monotonic predicate** \`feasible(x)\` — "if x works, every larger (or smaller) x also
works" — you can binary-search the *answer space*:

\`\`\`text
lo, hi = min_possible, max_possible
while lo < hi:
    mid = (lo + hi) // 2
    if feasible(mid): hi = mid       # mid works; try to do better (smaller)
    else: lo = mid + 1               # mid too small; need bigger
return lo
\`\`\`

This pattern solves "minimum capacity / speed / time such that a condition holds" (Koko eating
bananas, ship packages in D days, etc.). Recognizing the hidden monotonicity is the whole skill.

### Key points to remember

- The prerequisite is **monotonicity**, not literally a sorted array — a yes/no predicate that flips once is enough.
- Lock in one template and reuse it: \`lo <= hi\` with \`return -1\` for exact match; \`lo < hi\` converging for "find the boundary".
- Always move past \`mid\` (\`mid ± 1\`) on the discard side, or you'll loop forever.
- A 2-D sorted matrix can be treated as one flat sorted array via \`index → (row, col)\`.
- "Find the smallest/largest x such that …" is the tell for binary-searching the answer.
`;

const topic: Topic = {
  slug: 'binary-search',
  title: 'Binary Search',
  order: 4,
  blurb: 'Halve a monotonic search space each step — including searching over the answer itself.',
  tutorial,
  problems: [
    {
      id: 'binary-search',
      title: 'Binary Search',
      difficulty: 'Easy',
      topicSlug: 'binary-search',
      statement: `Given a sorted (ascending) array of distinct integers \`nums\` and a \`target\`, return the index of \`target\` if present, otherwise \`-1\`. Your solution must run in O(log n).`,
      constraints: ['1 ≤ nums.length ≤ 10⁴', 'nums is sorted ascending with distinct values.'],
      examples: [
        { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' },
        { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1' },
      ],
      functionName: { py: 'search', js: 'search' },
      starter: {
        py: 'def search(nums, target):\n    # your code here\n    pass\n',
        js: 'function search(nums, target) {\n  // your code here\n}\n',
      },
      reference: {
        py: 'def search(nums, target):\n    lo, hi = 0, len(nums) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1\n',
        js: 'function search(nums, target) {\n  let lo = 0, hi = nums.length - 1;\n  while (lo <= hi) {\n    const mid = Math.floor((lo + hi) / 2);\n    if (nums[mid] === target) return mid;\n    else if (nums[mid] < target) lo = mid + 1;\n    else hi = mid - 1;\n  }\n  return -1;\n}\n',
      },
      tests: [
        { input: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
        { input: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
        { input: [[5], 5], expected: 0 },
        { input: [[5], -5], expected: -1 },
        { input: [[], 1], expected: -1 },
        { input: [[1, 2, 3, 4, 5, 6, 7, 8], 8], expected: 7 },
      ],
      hints: [
        'Maintain a [lo, hi] range and look at the middle each step.',
        'If the middle is too small, the answer is strictly to the right; if too big, strictly to the left.',
        'Use lo <= hi and move past mid (mid ± 1) so the range always shrinks.',
      ],
      complexity: { time: 'O(log n)', space: 'O(1)' },
    },
    {
      id: 'search-2d-matrix',
      title: 'Search a 2D Matrix',
      difficulty: 'Medium',
      topicSlug: 'binary-search',
      statement: `You are given an \`m x n\` integer matrix where each row is sorted ascending, and the first integer of each row is greater than the last integer of the previous row. Return \`true\` if \`target\` is in the matrix.`,
      constraints: ['1 ≤ m, n ≤ 100', 'The matrix is fully sorted as described.'],
      examples: [
        { input: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3', output: 'true' },
        { input: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13', output: 'false' },
      ],
      functionName: { py: 'search_matrix', js: 'searchMatrix' },
      starter: {
        py: 'def search_matrix(matrix, target):\n    # your code here\n    pass\n',
        js: 'function searchMatrix(matrix, target) {\n  // your code here\n}\n',
      },
      reference: {
        py: 'def search_matrix(matrix, target):\n    if not matrix or not matrix[0]:\n        return False\n    rows, cols = len(matrix), len(matrix[0])\n    lo, hi = 0, rows * cols - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        val = matrix[mid // cols][mid % cols]\n        if val == target:\n            return True\n        elif val < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return False\n',
        js: 'function searchMatrix(matrix, target) {\n  if (!matrix.length || !matrix[0].length) return false;\n  const rows = matrix.length, cols = matrix[0].length;\n  let lo = 0, hi = rows * cols - 1;\n  while (lo <= hi) {\n    const mid = Math.floor((lo + hi) / 2);\n    const val = matrix[Math.floor(mid / cols)][mid % cols];\n    if (val === target) return true;\n    else if (val < target) lo = mid + 1;\n    else hi = mid - 1;\n  }\n  return false;\n}\n',
      },
      tests: [
        { input: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 3], expected: true },
        { input: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 13], expected: false },
        { input: [[[1]], 1], expected: true },
        { input: [[[1, 1]], 2], expected: false },
        { input: [[[1, 3, 5]], 5], expected: true },
      ],
      hints: [
        'Because the rows chain together, the whole matrix is one sorted sequence of m·n values.',
        'Binary search indices 0 .. m·n − 1.',
        'Map a flat index to a cell with row = index / cols, col = index % cols.',
      ],
      complexity: { time: 'O(log(m·n))', space: 'O(1)' },
    },
    {
      id: 'koko-eating-bananas',
      title: 'Koko Eating Bananas',
      difficulty: 'Medium',
      topicSlug: 'binary-search',
      statement: `Koko has \`piles\` of bananas and \`h\` hours before the guards return. Each hour she picks a pile and eats up to \`speed\` bananas from it (if the pile has fewer, she eats it and stops for that hour). Return the minimum integer eating \`speed\` so she finishes all piles within \`h\` hours.`,
      constraints: ['1 ≤ piles.length ≤ 10⁴', 'piles.length ≤ h ≤ 10⁹', '1 ≤ piles[i] ≤ 10⁹'],
      examples: [
        { input: 'piles = [3,6,7,11], h = 8', output: '4' },
        { input: 'piles = [30,11,23,4,20], h = 5', output: '30' },
      ],
      functionName: { py: 'min_eating_speed', js: 'minEatingSpeed' },
      starter: {
        py: 'def min_eating_speed(piles, h):\n    # your code here\n    pass\n',
        js: 'function minEatingSpeed(piles, h) {\n  // your code here\n}\n',
      },
      reference: {
        py: 'def min_eating_speed(piles, h):\n    lo, hi = 1, max(piles)\n    while lo < hi:\n        mid = (lo + hi) // 2\n        hours = sum((p + mid - 1) // mid for p in piles)\n        if hours <= h:\n            hi = mid\n        else:\n            lo = mid + 1\n    return lo\n',
        js: 'function minEatingSpeed(piles, h) {\n  let lo = 1, hi = Math.max(...piles);\n  while (lo < hi) {\n    const mid = Math.floor((lo + hi) / 2);\n    let hours = 0;\n    for (const p of piles) hours += Math.ceil(p / mid);\n    if (hours <= h) hi = mid;\n    else lo = mid + 1;\n  }\n  return lo;\n}\n',
      },
      tests: [
        { input: [[3, 6, 7, 11], 8], expected: 4 },
        { input: [[30, 11, 23, 4, 20], 5], expected: 30 },
        { input: [[30, 11, 23, 4, 20], 6], expected: 23 },
        { input: [[1], 1], expected: 1 },
        { input: [[312, 978, 1024, 555], 10], expected: 326 },
      ],
      hints: [
        'If a given speed lets her finish in time, any faster speed does too — the feasibility is monotonic.',
        'Binary search the speed between 1 and max(piles).',
        'Hours needed at speed s is the sum of ceil(pile / s). Find the smallest s with hours ≤ h.',
      ],
      complexity: { time: 'O(n · log(max pile))', space: 'O(1)' },
    },
  ],
};

export default topic;
