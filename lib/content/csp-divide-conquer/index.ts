import type { Topic } from '@/lib/types';

const tutorial = `
## Divide and conquer, and sorting

Left to your own devices, you'd probably invent an O(n²) sort — compare everything to everything.
The breakthrough is **divide and conquer**: split the work into smaller subproblems, solve those,
and combine. Done well it turns O(n²) into O(n log n).

- **Merge sort** splits the array in half, sorts each half recursively, then **merges** two sorted
  halves in linear time. The combine step is the clever bit.
- **Quicksort** does the clever bit *first*: **partition** around a pivot so smaller elements go left
  and larger go right, then recurse on each side — no merge needed, and it sorts in place.
- **Fast exponentiation** applies the same instinct to arithmetic: \`x^n = (x^{n/2})²\` (times \`x\` if
  \`n\` is odd), turning O(n) multiplications into O(log n).

### Key points to remember

- Divide and conquer: split → solve subproblems → combine. Look for a cheap combine (merge) or a
  cheap split (partition).
- Merge sort is stable and always O(n log n) but needs O(n) scratch space.
- Quicksort is in-place and fast in practice; a good pivot keeps it O(n log n).
- Halving the exponent each step gives O(log n) exponentiation.
`;

const topic: Topic = {
  slug: 'csp-divide-conquer',
  title: 'Divide & Conquer',
  order: 105,
  section: 'csprimer',
  blurb: 'Split, solve, combine — merge sort, quicksort, and O(log n) exponentiation.',
  tutorial,
  problems: [
    {
      id: 'merge-sort',
      title: 'Merge Sort',
      difficulty: 'Medium',
      topicSlug: 'csp-divide-conquer',
      statement: `Implement **merge sort**: return a new list containing the integers of \`nums\` in ascending order.

Split the array in half, sort each half recursively, then **merge** the two sorted halves by repeatedly taking the smaller front element. The merge is O(n) and the recursion is O(log n) deep, giving O(n log n) overall.`,
      constraints: ['0 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹'],
      examples: [
        { input: 'nums = [5,2,4,1,3]', output: '[1,2,3,4,5]' },
        { input: 'nums = [3,1,2]', output: '[1,2,3]' },
      ],
      functionName: { py: 'merge_sort', js: 'mergeSort' },
      starter: {
        py: 'def merge_sort(nums):\n    # your code here\n    pass\n',
        js: 'function mergeSort(nums) {\n  // your code here\n}\n',
      },
      reference: {
        py: `def merge_sort(nums):
    if len(nums) <= 1:
        return list(nums)
    mid = len(nums) // 2
    left = merge_sort(nums[:mid])
    right = merge_sort(nums[mid:])
    merged = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1
    merged.extend(left[i:])
    merged.extend(right[j:])
    return merged
`,
        js: `function mergeSort(nums) {
  if (nums.length <= 1) return nums.slice();
  const mid = Math.floor(nums.length / 2);
  const left = mergeSort(nums.slice(0, mid));
  const right = mergeSort(nums.slice(mid));
  const merged = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) merged.push(left[i++]);
    else merged.push(right[j++]);
  }
  while (i < left.length) merged.push(left[i++]);
  while (j < right.length) merged.push(right[j++]);
  return merged;
}
`,
      },
      tests: [
        { input: [[5, 2, 4, 1, 3]], expected: [1, 2, 3, 4, 5] },
        { input: [[3, 1, 2]], expected: [1, 2, 3] },
        { input: [[]], expected: [] },
        { input: [[1]], expected: [1] },
        { input: [[2, 2, 1, 1, 3]], expected: [1, 1, 2, 2, 3] },
        { input: [[-3, 5, 0, -1, 5]], expected: [-3, -1, 0, 5, 5] },
        { input: [[9, 8, 7, 6, 5, 4, 3, 2, 1]], expected: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
        { input: [[2, 1]], expected: [1, 2] },
        // Already sorted — the right half never drains early.
        { input: [[1, 2, 3, 4, 5]], expected: [1, 2, 3, 4, 5] },
        // Even-length reverse; the existing reverse case is odd-length only.
        { input: [[4, 3, 2, 1]], expected: [1, 2, 3, 4] },
        { input: [[7, 7, 7, 7]], expected: [7, 7, 7, 7] },
        // Both value bounds from the constraints.
        { input: [[1000000000, -1000000000, 0]], expected: [-1000000000, 0, 1000000000] },
      ],
      hints: [
        'Base case: a list of length 0 or 1 is already sorted.',
        'Recurse on the two halves, then merge the sorted halves.',
        'Merge by walking two pointers, always taking the smaller current element (use <= to stay stable).',
      ],
      complexity: { time: 'O(n log n)', space: 'O(n)' },
    },
    {
      id: 'fast-exponent',
      title: 'Fast Exponentiation',
      difficulty: 'Medium',
      topicSlug: 'csp-divide-conquer',
      statement: `Compute \`base\` raised to the power \`exp\` (a non-negative integer) using **O(log exp)** multiplications.

The naive loop multiplies \`exp\` times. Divide and conquer instead: \`x^n = (x^{n/2})²\` when \`n\` is even, and \`x · (x^{(n-1)/2})²\` when \`n\` is odd. Each step halves the exponent.`,
      constraints: ['0 ≤ exp ≤ 40', 'Results fit within a 64-bit float (< 2^53).'],
      examples: [
        { input: 'base = 2, exp = 10', output: '1024' },
        { input: 'base = 3, exp = 0', output: '1' },
      ],
      functionName: { py: 'power', js: 'power' },
      starter: {
        py: 'def power(base, exp):\n    # your code here\n    pass\n',
        js: 'function power(base, exp) {\n  // your code here\n}\n',
      },
      reference: {
        py: `def power(base, exp):
    result = 1
    b = base
    e = exp
    while e > 0:
        if e % 2 == 1:
            result *= b
        b *= b
        e //= 2
    return result
`,
        js: `function power(base, exp) {
  let result = 1;
  let b = base;
  let e = exp;
  while (e > 0) {
    if (e % 2 === 1) result *= b;
    b *= b;
    e = Math.floor(e / 2);
  }
  return result;
}
`,
      },
      tests: [
        { input: [2, 10], expected: 1024 },
        { input: [3, 0], expected: 1 },
        { input: [5, 3], expected: 125 },
        { input: [2, 20], expected: 1048576 },
        { input: [7, 2], expected: 49 },
        { input: [10, 6], expected: 1000000 },
        { input: [2, 30], expected: 1073741824 },
        // 0^0 = 1 by the "anything to the power 0" convention, and its counterpart.
        { input: [0, 0], expected: 1 },
        { input: [0, 5], expected: 0 },
        // Negative bases are in-contract (base is unbounded) and were untested: sign must
        // survive an odd exponent and cancel on an even one.
        { input: [-2, 3], expected: -8 },
        { input: [-2, 10], expected: 1024 },
        { input: [-1, 39], expected: -1 },
        // Top of the exponent range.
        { input: [2, 40], expected: 1099511627776 },
      ],
      hints: [
        'Anything to the power 0 is 1.',
        'Square the base and halve the exponent each step (binary exponentiation).',
        'When the current exponent bit is odd, multiply the running result by the current base.',
      ],
      complexity: { time: 'O(log n)', space: 'O(1)' },
    },
    {
      id: 'quicksort',
      title: 'Quicksort',
      difficulty: 'Medium',
      topicSlug: 'csp-divide-conquer',
      statement: `Implement **quicksort**: return a new list with the integers of \`nums\` in ascending order, using the partition-then-recurse approach.

Pick a **pivot**, **partition** so that everything smaller goes to its left and everything larger to its right, then recurse on each side. Unlike merge sort, the "combine" is trivial — the partition step does the work up front.`,
      constraints: ['0 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹'],
      examples: [
        { input: 'nums = [5,2,4,1,3]', output: '[1,2,3,4,5]' },
        { input: 'nums = [2,2,1]', output: '[1,2,2]' },
      ],
      functionName: { py: 'quicksort', js: 'quicksort' },
      starter: {
        py: 'def quicksort(nums):\n    # your code here\n    pass\n',
        js: 'function quicksort(nums) {\n  // your code here\n}\n',
      },
      reference: {
        py: `def quicksort(nums):
    if len(nums) <= 1:
        return list(nums)
    pivot = nums[len(nums) // 2]
    less = [x for x in nums if x < pivot]
    equal = [x for x in nums if x == pivot]
    greater = [x for x in nums if x > pivot]
    return quicksort(less) + equal + quicksort(greater)
`,
        js: `function quicksort(nums) {
  if (nums.length <= 1) return nums.slice();
  const pivot = nums[Math.floor(nums.length / 2)];
  const less = nums.filter((x) => x < pivot);
  const equal = nums.filter((x) => x === pivot);
  const greater = nums.filter((x) => x > pivot);
  return [...quicksort(less), ...equal, ...quicksort(greater)];
}
`,
      },
      tests: [
        { input: [[5, 2, 4, 1, 3]], expected: [1, 2, 3, 4, 5] },
        { input: [[2, 2, 1]], expected: [1, 2, 2] },
        { input: [[]], expected: [] },
        { input: [[1]], expected: [1] },
        { input: [[4, 5, 3, 2, 1, 5, 4]], expected: [1, 2, 3, 4, 4, 5, 5] },
        { input: [[-2, -5, 0, 3, -1]], expected: [-5, -2, -1, 0, 3] },
        { input: [[10, 9, 8, 7, 6]], expected: [6, 7, 8, 9, 10] },
        // Pivot is the min → `less` is empty.
        { input: [[2, 1]], expected: [1, 2] },
        // Pivot is the max → `greater` is empty. This is the shape that degrades to O(n) depth.
        { input: [[1, 3, 2]], expected: [1, 2, 3] },
        // `equal` absorbs everything; both recursive calls get [].
        { input: [[5, 5, 5, 5]], expected: [5, 5, 5, 5] },
        { input: [[1, 2, 3, 4, 5]], expected: [1, 2, 3, 4, 5] },
        { input: [[4, 3, 2, 1]], expected: [1, 2, 3, 4] },
        { input: [[1000000000, -1000000000, 0]], expected: [-1000000000, 0, 1000000000] },
      ],
      hints: [
        'Base case: length 0 or 1 is already sorted.',
        'Choose a pivot, then split into elements less than, equal to, and greater than it.',
        'Recurse on the "less" and "greater" partitions and concatenate with the equal group in the middle.',
      ],
      complexity: { time: 'O(n log n) average', space: 'O(n)' },
    },
  ],
};

export default topic;
