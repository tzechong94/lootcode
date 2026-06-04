import type { Topic, TutorialBlock } from '@/lib/types';

const tutorial = `
## Two Pointers — first principles

The two-pointer technique replaces a nested loop with **two indices that move through the data in
a coordinated way**, usually turning an O(n²) scan into a single O(n) pass. It works whenever you
can make a decision that lets you *permanently* advance one of the pointers — so each element is
visited a constant number of times.

There are two dominant shapes:

### 1. Converging pointers (ends → middle)

Start one pointer at each end and move them toward each other. This is the go-to for **sorted
arrays** and **palindromes**:

\`\`\`text
left = 0, right = n - 1
while left < right:
    look at a[left] and a[right]
    decide which pointer to move based on the comparison
\`\`\`

The magic is in the *decision*: in a sorted array, if \`a[left] + a[right]\` is too small, the only
way to grow the sum is to move \`left\` right. You never need to revisit, so the whole array is
processed in O(n). This is why **sorting first** (O(n log n)) often unlocks a two-pointer solution.

### 2. Fast & slow / same-direction pointers

Both pointers start at the front; one races ahead while the other lags. Used for in-place array
rewriting ("move zeros", "remove duplicates"), and — with a linked list — for cycle detection and
finding the middle (Floyd's algorithm, covered later).

### When to reach for it

- The array is **sorted**, or sorting it doesn't break the problem.
- You're looking for a **pair / triplet** that meets a condition (sum, difference).
- You're checking **symmetry** (palindrome) or rewriting an array **in place** with O(1) extra space.

### Key points to remember

- Two pointers turn "check every pair" (O(n²)) into one linear pass (O(n)) — but usually only after sorting.
- The correctness hinges on a monotonic decision: each comparison lets you discard possibilities and advance a pointer for good.
- For k-sum problems, fix the outer element(s) and two-pointer the rest; **skip duplicates** to avoid repeated answers.
- Converging pointers need sorted data; same-direction pointers are about in-place rewriting and traversal.
- It's O(1) extra space — call that out versus a hash-set approach that costs O(n) memory.
`;

const blocks: TutorialBlock[] = [
  {
    kind: 'md',
    md: `## Two Pointers — from first principles

Checking every pair of elements is O(n²): for each of n elements you scan the other n. The
two-pointer technique asks a sharper question — *do I actually need to look at every pair?* When the
data is **sorted**, the answer is no, because a single comparison tells you which whole set of
possibilities to throw away.

Picture two indices, one at each end of a sorted array, and a target sum. Look only at the pair they
point to:

- If their sum is **too big**, every pair that uses the right element is also too big (everything to
  its left is smaller, but it's still paired with that large right value)... so the *only* useful
  move is to pull the **right** pointer left.
- If their sum is **too small**, symmetrically, move the **left** pointer right.

Each comparison eliminates an entire row or column of the pair grid and advances a pointer that
never goes back — so the whole array is processed in **one O(n) pass**. Watch the pointers converge:`,
  },
  {
    kind: 'viz',
    spec: {
      type: 'array',
      title: 'Converging pointers on a sorted array (target sum = 10)',
      frames: [
        { caption: 'Sorted array. Pointers L and R start at the two ends. We want a pair summing to 10.', cells: [{ value: 1, state: 'active' }, { value: 3 }, { value: 4 }, { value: 6 }, { value: 8 }, { value: 11, state: 'active' }], pointers: [{ name: 'L', index: 0 }, { name: 'R', index: 5 }] },
        { caption: '1 + 11 = 12 > 10. Too big — 11 is too large for any partner here, so move R left.', cells: [{ value: 1, state: 'compare' }, { value: 3 }, { value: 4 }, { value: 6 }, { value: 8 }, { value: 11, state: 'compare' }], pointers: [{ name: 'L', index: 0 }, { name: 'R', index: 5 }] },
        { caption: '1 + 8 = 9 < 10. Too small — 1 is too little, so move L right to grow the sum.', cells: [{ value: 1, state: 'compare' }, { value: 3 }, { value: 4 }, { value: 6 }, { value: 8, state: 'compare' }, { value: 11, state: 'eliminated' }], pointers: [{ name: 'L', index: 0 }, { name: 'R', index: 4 }] },
        { caption: '3 + 8 = 11 > 10. Too big — move R left.', cells: [{ value: 1, state: 'eliminated' }, { value: 3, state: 'compare' }, { value: 4 }, { value: 6 }, { value: 8, state: 'compare' }, { value: 11, state: 'eliminated' }], pointers: [{ name: 'L', index: 1 }, { name: 'R', index: 4 }] },
        { caption: '3 + 6 = 9 < 10. Too small — move L right.', cells: [{ value: 1, state: 'eliminated' }, { value: 3, state: 'compare' }, { value: 4 }, { value: 6, state: 'compare' }, { value: 8, state: 'eliminated' }, { value: 11, state: 'eliminated' }], pointers: [{ name: 'L', index: 1 }, { name: 'R', index: 3 }] },
        { caption: '4 + 6 = 10. Found it — in a single pass, O(n), never revisiting a pair we ruled out.', cells: [{ value: 1, state: 'eliminated' }, { value: 3, state: 'eliminated' }, { value: 4, state: 'match' }, { value: 6, state: 'match' }, { value: 8, state: 'eliminated' }, { value: 11, state: 'eliminated' }], pointers: [{ name: 'L', index: 2 }, { name: 'R', index: 3 }] },
      ],
    },
  },
  {
    kind: 'md',
    md: `That's the **converging** shape, the go-to for sorted arrays and palindromes. There's a second
shape — **fast & slow** pointers moving the *same* direction at different speeds — used to rewrite an
array in place (read pointer races ahead, write pointer lags) and, on linked lists, to find the
middle or detect a cycle (covered in Linked Lists).

### Key points to remember

- Two pointers turn "check every pair" (O(n²)) into one linear pass (O(n)) — usually after **sorting**.
- It works because each comparison is **monotonic**: it rules out a whole set of pairs and lets a pointer advance for good.
- **Converging** pointers (ends → middle) need sorted data; **fast/slow** (same direction) handle in-place rewrites and traversal.
- For k-sum, fix the outer element(s) and two-pointer the rest; **skip duplicates** to avoid repeats.
- It's O(1) extra space — contrast that with the O(n) memory a hash-set approach would use.`,
  },
];

const topic: Topic = {
  slug: 'two-pointers',
  title: 'Two Pointers',
  order: 2,
  section: 'algorithm',
  family: 'Two Pointers & Sliding Window',
  blurb: 'Coordinate two indices to turn nested-loop pair searches into a single O(n) pass.',
  tutorial,
  blocks,
  problems: [
    {
      id: 'valid-palindrome',
      title: 'Valid Palindrome',
      difficulty: 'Easy',
      topicSlug: 'two-pointers',
      statement: `Given a string \`s\`, return \`true\` if it is a palindrome after converting all uppercase letters to lowercase and removing all non-alphanumeric characters.`,
      constraints: ['1 ≤ s.length ≤ 2·10⁵', 's consists of printable ASCII characters.'],
      examples: [
        { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" reads the same backward.' },
        { input: 's = "race a car"', output: 'false' },
      ],
      functionName: { py: 'is_palindrome', js: 'isPalindrome' },
      starter: {
        py: 'def is_palindrome(s):\n    # your code here\n    pass\n',
        js: 'function isPalindrome(s) {\n  // your code here\n}\n',
      },
      reference: {
        py: 'def is_palindrome(s):\n    f = [c.lower() for c in s if c.isalnum()]\n    i, j = 0, len(f) - 1\n    while i < j:\n        if f[i] != f[j]:\n            return False\n        i += 1\n        j -= 1\n    return True\n',
        js: "function isPalindrome(s) {\n  const f = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  let i = 0, j = f.length - 1;\n  while (i < j) {\n    if (f[i] !== f[j]) return false;\n    i++;\n    j--;\n  }\n  return true;\n}\n",
      },
      tests: [
        { input: ['A man, a plan, a canal: Panama'], expected: true },
        { input: ['race a car'], expected: false },
        { input: [' '], expected: true },
        { input: ['0P'], expected: false },
        { input: ['ab_a'], expected: true },
      ],
      hints: [
        'First reduce the string to just lowercase alphanumeric characters.',
        'Compare characters from both ends moving inward.',
        'If any mismatched pair is found, it is not a palindrome.',
      ],
      complexity: { time: 'O(n)', space: 'O(n)' },
    },
    {
      id: 'two-sum-ii',
      title: 'Two Sum II — Sorted Array',
      difficulty: 'Medium',
      topicSlug: 'two-pointers',
      statement: `Given a **1-indexed** array of integers \`numbers\` that is sorted in non-decreasing order, find two numbers that add up to \`target\`. Return their 1-based indices \`[i, j]\` with \`i < j\`. Exactly one solution exists, and you may not use the same element twice.`,
      constraints: ['2 ≤ numbers.length ≤ 3·10⁴', 'numbers is sorted in non-decreasing order.'],
      examples: [
        { input: 'numbers = [2,7,11,15], target = 9', output: '[1,2]' },
        { input: 'numbers = [2,3,4], target = 6', output: '[1,3]' },
      ],
      functionName: { py: 'two_sum_sorted', js: 'twoSumSorted' },
      starter: {
        py: 'def two_sum_sorted(numbers, target):\n    # your code here\n    pass\n',
        js: 'function twoSumSorted(numbers, target) {\n  // your code here\n}\n',
      },
      reference: {
        py: 'def two_sum_sorted(numbers, target):\n    i, j = 0, len(numbers) - 1\n    while i < j:\n        s = numbers[i] + numbers[j]\n        if s == target:\n            return [i + 1, j + 1]\n        elif s < target:\n            i += 1\n        else:\n            j -= 1\n    return []\n',
        js: 'function twoSumSorted(numbers, target) {\n  let i = 0, j = numbers.length - 1;\n  while (i < j) {\n    const s = numbers[i] + numbers[j];\n    if (s === target) return [i + 1, j + 1];\n    else if (s < target) i++;\n    else j--;\n  }\n  return [];\n}\n',
      },
      tests: [
        { input: [[2, 7, 11, 15], 9], expected: [1, 2] },
        { input: [[2, 3, 4], 6], expected: [1, 3] },
        { input: [[-1, 0], -1], expected: [1, 2] },
        { input: [[1, 2, 3, 4, 4, 9, 56, 90], 8], expected: [4, 5] },
      ],
      hints: [
        'The array is sorted — what does that let you conclude when the current pair sums too high or too low?',
        'Start a pointer at each end. If the sum is too small, move the left pointer up; if too big, move the right pointer down.',
        'Remember the answer is 1-indexed.',
      ],
      complexity: { time: 'O(n)', space: 'O(1)' },
    },
    {
      id: 'three-sum',
      title: '3Sum',
      difficulty: 'Medium',
      topicSlug: 'two-pointers',
      statement: `Given an integer array \`nums\`, return all unique triplets \`[a, b, c]\` such that \`a + b + c = 0\`. The solution set must not contain duplicate triplets. Triplets and their elements may be returned in any order.`,
      constraints: ['3 ≤ nums.length ≤ 3000', '-10⁵ ≤ nums[i] ≤ 10⁵'],
      examples: [
        { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' },
        { input: 'nums = [0,1,1]', output: '[]' },
      ],
      functionName: { py: 'three_sum', js: 'threeSum' },
      starter: {
        py: 'def three_sum(nums):\n    # your code here\n    pass\n',
        js: 'function threeSum(nums) {\n  // your code here\n}\n',
      },
      reference: {
        py: 'def three_sum(nums):\n    nums.sort()\n    res = []\n    n = len(nums)\n    for i in range(n):\n        if i > 0 and nums[i] == nums[i - 1]:\n            continue\n        l, r = i + 1, n - 1\n        while l < r:\n            s = nums[i] + nums[l] + nums[r]\n            if s < 0:\n                l += 1\n            elif s > 0:\n                r -= 1\n            else:\n                res.append([nums[i], nums[l], nums[r]])\n                l += 1\n                r -= 1\n                while l < r and nums[l] == nums[l - 1]:\n                    l += 1\n                while l < r and nums[r] == nums[r + 1]:\n                    r -= 1\n    return res\n',
        js: 'function threeSum(nums) {\n  nums.sort((a, b) => a - b);\n  const res = [];\n  const n = nums.length;\n  for (let i = 0; i < n; i++) {\n    if (i > 0 && nums[i] === nums[i - 1]) continue;\n    let l = i + 1, r = n - 1;\n    while (l < r) {\n      const s = nums[i] + nums[l] + nums[r];\n      if (s < 0) l++;\n      else if (s > 0) r--;\n      else {\n        res.push([nums[i], nums[l], nums[r]]);\n        l++;\n        r--;\n        while (l < r && nums[l] === nums[l - 1]) l++;\n        while (l < r && nums[r] === nums[r + 1]) r--;\n      }\n    }\n  }\n  return res;\n}\n',
      },
      compare: 'unordered',
      tests: [
        { input: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]] },
        { input: [[0, 1, 1]], expected: [] },
        { input: [[0, 0, 0]], expected: [[0, 0, 0]] },
        { input: [[-2, 0, 1, 1, 2]], expected: [[-2, 0, 2], [-2, 1, 1]] },
      ],
      hints: [
        'Sort the array first. Then fix one number and solve a Two Sum on the rest with converging pointers.',
        'For the fixed index i, look for two values in nums[i+1:] that sum to -nums[i].',
        'Skip duplicate values for the fixed element and for both pointers to avoid duplicate triplets.',
      ],
      complexity: { time: 'O(n²)', space: 'O(1) extra (excluding output)' },
    },
  ],
};

export default topic;
