import type { Topic } from '@/lib/types';

const tutorial = `
## Arrays & Hashing — first principles

Almost every interview starts here, because two ideas unlock a huge fraction of problems:
**arrays give you O(1) access by index**, and **hash tables give you O(1) access by *value*.**
Most "arrays & hashing" problems are really about trading time for space: instead of re-scanning
the array to answer "have I seen this before?", you remember what you've seen in a hash table.

### The array

An array is a contiguous block of elements. The key costs:

| Operation | Cost |
|-----------|------|
| Access \`a[i]\` | O(1) |
| Update \`a[i]\` | O(1) |
| Search (unsorted) | O(n) |
| Insert / delete at end | O(1) amortized |
| Insert / delete in middle | O(n) (everything shifts) |

The trap is **search**: scanning to find a value is O(n), and doing that inside a loop gives you
the classic O(n²) brute force. That's the cost a hash table removes.

### The hash table

A hash table (\`dict\` in Python, \`Map\`/object/\`Set\` in JS) stores key → value with **O(1)
average** insert, lookup, and delete. You give up ordering and a bit of memory; you gain the
ability to ask "is X here?" instantly. Two flavors you'll reach for constantly:

- **Hash set** — membership: "have I seen this element?"
- **Hash map** — association: "what index / count / group does this element map to?"

### The core pattern: remember as you go

The single most important move in this topic is the **one-pass hash map**. Instead of comparing
every pair (O(n²)), walk the array once and, at each element, *ask the table about what you need
and then record the current element*:

\`\`\`text
for each element x at index i:
    if (something we need) is already in the table:
        we found the answer
    record x (or its index/count) in the table
\`\`\`

Two Sum is the canonical example: for each number, check if its **complement** (\`target - x\`)
was already seen.

### Frequency counting

When a problem mentions anagrams, duplicates, "k most frequent", or "appears more than once,"
reach for a **count map**: element → how many times it occurred. Comparing two frequency maps
(or comparing a sorted/canonical key) answers most of these in O(n).

### Key points to remember

- Unsorted search is O(n); a hash table turns repeated lookups into O(1) average.
- Brute force on arrays is usually O(n²) nested loops — a hash table almost always collapses it to O(n).
- Use a **set** for membership, a **map** for counts/indices/groups.
- A canonical key (e.g. the sorted string of a word) groups items that are "the same" under some rule.
- Hash tables cost extra space — the trade is O(n) memory for O(n) time. Mention this trade-off in interviews.
`;

const topic: Topic = {
  slug: 'arrays-hashing',
  title: 'Arrays & Hashing',
  order: 1,
  blurb: 'Trade space for time: use hash sets and maps to collapse O(n²) scans into O(n).',
  tutorial,
  problems: [
    {
      id: 'two-sum',
      title: 'Two Sum',
      difficulty: 'Easy',
      topicSlug: 'arrays-hashing',
      statement: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers that add up to \`target\`.

You may assume exactly one solution exists, and you may not use the same element twice. Return the indices in increasing order.`,
      constraints: ['2 ≤ nums.length ≤ 10⁴', 'Exactly one valid answer exists.'],
      examples: [
        { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 9.' },
        { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
      ],
      functionName: { py: 'two_sum', js: 'twoSum' },
      starter: {
        py: 'def two_sum(nums, target):\n    # your code here\n    pass\n',
        js: 'function twoSum(nums, target) {\n  // your code here\n}\n',
      },
      reference: {
        py: 'def two_sum(nums, target):\n    seen = {}\n    for i, x in enumerate(nums):\n        if target - x in seen:\n            return [seen[target - x], i]\n        seen[x] = i\n    return []\n',
        js: 'function twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (seen.has(need)) return [seen.get(need), i];\n    seen.set(nums[i], i);\n  }\n  return [];\n}\n',
      },
      tests: [
        { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
        { input: [[3, 2, 4], 6], expected: [1, 2] },
        { input: [[3, 3], 6], expected: [0, 1] },
        { input: [[-1, -2, -3, -4, -5], -8], expected: [2, 4] },
      ],
      hints: [
        'Brute force checks every pair in O(n²). What do you actually need to look up?',
        'For each x, the partner you need is target - x. Could you remember numbers you have already seen?',
        'Store value → index in a hash map. Check for the complement before inserting the current number.',
      ],
      complexity: { time: 'O(n)', space: 'O(n)' },
    },
    {
      id: 'contains-duplicate',
      title: 'Contains Duplicate',
      difficulty: 'Easy',
      topicSlug: 'arrays-hashing',
      statement: `Given an integer array \`nums\`, return \`true\` if any value appears at least twice, and \`false\` if every element is distinct.`,
      constraints: ['1 ≤ nums.length ≤ 10⁵'],
      examples: [
        { input: 'nums = [1,2,3,1]', output: 'true' },
        { input: 'nums = [1,2,3,4]', output: 'false' },
      ],
      functionName: { py: 'contains_duplicate', js: 'containsDuplicate' },
      starter: {
        py: 'def contains_duplicate(nums):\n    # your code here\n    pass\n',
        js: 'function containsDuplicate(nums) {\n  // your code here\n}\n',
      },
      reference: {
        py: 'def contains_duplicate(nums):\n    seen = set()\n    for x in nums:\n        if x in seen:\n            return True\n        seen.add(x)\n    return False\n',
        js: 'function containsDuplicate(nums) {\n  const seen = new Set();\n  for (const x of nums) {\n    if (seen.has(x)) return true;\n    seen.add(x);\n  }\n  return false;\n}\n',
      },
      tests: [
        { input: [[1, 2, 3, 1]], expected: true },
        { input: [[1, 2, 3, 4]], expected: false },
        { input: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expected: true },
        { input: [[7]], expected: false },
      ],
      hints: [
        'Sorting would make duplicates adjacent — but that is O(n log n).',
        'A hash set answers "have I seen this value before?" in O(1) average.',
        'Walk once: if the element is already in the set return true, otherwise add it.',
      ],
      complexity: { time: 'O(n)', space: 'O(n)' },
    },
    {
      id: 'group-anagrams',
      title: 'Group Anagrams',
      difficulty: 'Medium',
      topicSlug: 'arrays-hashing',
      statement: `Given an array of strings \`strs\`, group the anagrams together. Two strings are anagrams if one is a rearrangement of the other.

Return the groups in any order, and the strings within each group in any order.`,
      constraints: ['1 ≤ strs.length ≤ 10⁴', '0 ≤ strs[i].length ≤ 100', 'strs[i] is lowercase English.'],
      examples: [
        { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
      ],
      functionName: { py: 'group_anagrams', js: 'groupAnagrams' },
      starter: {
        py: 'def group_anagrams(strs):\n    # your code here\n    pass\n',
        js: 'function groupAnagrams(strs) {\n  // your code here\n}\n',
      },
      reference: {
        py: "def group_anagrams(strs):\n    groups = {}\n    for s in strs:\n        key = ''.join(sorted(s))\n        groups.setdefault(key, []).append(s)\n    return list(groups.values())\n",
        js: "function groupAnagrams(strs) {\n  const groups = new Map();\n  for (const s of strs) {\n    const key = s.split('').sort().join('');\n    if (!groups.has(key)) groups.set(key, []);\n    groups.get(key).push(s);\n  }\n  return Array.from(groups.values());\n}\n",
      },
      compare: 'unordered',
      tests: [
        {
          input: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']],
          expected: [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']],
        },
        { input: [['']], expected: [['']] },
        { input: [['a']], expected: [['a']] },
        { input: [['abc', 'bca', 'cab', 'xyz', 'zyx']], expected: [['abc', 'bca', 'cab'], ['xyz', 'zyx']] },
      ],
      hints: [
        'Anagrams share the same multiset of letters. How can you make that into a single comparable key?',
        'Sorting the letters of a word gives a canonical key: "eat" and "tea" both become "aet".',
        'Use a hash map from canonical key → list of words, then return the map values.',
      ],
      complexity: { time: 'O(n · k log k)', space: 'O(n · k)' },
    },
  ],
};

export default topic;
