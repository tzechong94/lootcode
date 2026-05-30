import type { Topic } from '@/lib/types';

const tutorial = `
## Backtracking — first principles

Backtracking is **systematic, incremental search**: build a candidate solution one choice at a time,
and the moment a partial choice can't possibly lead to a valid answer, **undo it and try the next
option**. It's depth-first search over the tree of all possible choices, with pruning. This is how
you generate *all* subsets / permutations / combinations, and how you solve constraint puzzles
(N-queens, Sudoku, word search).

### The universal template

\`\`\`text
def backtrack(state, choices):
    if state is a complete solution:
        record it
        return
    for choice in choices:
        if choice is valid:
            apply(choice)          # make the move
            backtrack(next_state, remaining_choices)
            undo(choice)           # <-- the "backtrack": restore state
\`\`\`

The single most important line is the **undo**. After exploring everything reachable from a choice,
you must restore the state exactly so the next iteration starts clean. Forgetting to undo (or
undoing incompletely) is the classic backtracking bug.

### Controlling what you generate

The shape of your answer depends on how you iterate the choices:

- **Subsets** — at each index, choose to include it or not; recurse from \`i+1\` so you never look back.
  Every node of the recursion is itself a valid subset.
- **Permutations** — order matters and elements can't repeat, so track which indices are **used** and
  iterate over all *unused* ones at each position.
- **Combinations that reuse elements** (combination sum) — recurse from the **same** index \`i\` to allow
  repeats; pass \`i+1\` to forbid them. A \`start\` index prevents generating the same set in a different
  order.

### Pruning

Pruning is what separates backtracking from brute force. Sort first and **break early** when the
current choice already overshoots (e.g. a candidate larger than the remaining target). Good pruning
turns exponential blowups into something tractable.

### Key points to remember

- Backtracking = DFS over choices + **undo after exploring** + **prune invalid branches early**.
- Always restore state after the recursive call — the mirror of the move you made.
- A \`start\` index avoids duplicate combinations; a \`used\` set enforces "no repeats" for permutations.
- Recurse from \`i\` to reuse an element, from \`i+1\` to consume it.
- The output is inherently exponential — these problems are about generating it *correctly and with pruning*, not beating exponential time.
`;

const topic: Topic = {
  slug: 'backtracking',
  title: 'Backtracking',
  order: 11,
  blurb: 'DFS over choices with undo + pruning: generate subsets, permutations, and combinations.',
  tutorial,
  problems: [
    {
      id: 'subsets',
      title: 'Subsets',
      difficulty: 'Medium',
      topicSlug: 'backtracking',
      statement: `Given an array \`nums\` of **distinct** integers, return all possible subsets (the power set). The solution must not contain duplicate subsets; return them in any order.`,
      constraints: ['1 ≤ nums.length ≤ 10', 'All numbers are distinct.'],
      examples: [
        { input: 'nums = [1,2,3]', output: '[[],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]' },
        { input: 'nums = [0]', output: '[[],[0]]' },
      ],
      functionName: { py: 'subsets', js: 'subsets' },
      compare: 'unorderedOuter',
      starter: {
        py: 'def subsets(nums):\n    res = []\n    # build subsets by choosing whether to include each later element\n    # your code here\n    return res\n',
        js: 'function subsets(nums) {\n  const res = [];\n  // build subsets by choosing whether to include each later element\n  // your code here\n  return res;\n}\n',
      },
      reference: {
        py: 'def subsets(nums):\n    res = []\n    def backtrack(start, path):\n        res.append(path[:])\n        for i in range(start, len(nums)):\n            path.append(nums[i])\n            backtrack(i + 1, path)\n            path.pop()\n    backtrack(0, [])\n    return res\n',
        js: 'function subsets(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push(path.slice());\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}\n',
      },
      tests: [
        { input: [[1, 2, 3]], expected: [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]] },
        { input: [[0]], expected: [[], [0]] },
        { input: [[1, 2]], expected: [[], [1], [2], [1, 2]] },
      ],
      hints: [
        'Every recursion node is already a valid subset — record the current path each call.',
        'Iterate from a start index and recurse with i+1 so you never reuse earlier elements.',
        'Append, recurse, then pop to undo before trying the next element.',
      ],
      complexity: { time: 'O(n · 2ⁿ)', space: 'O(n)' },
    },
    {
      id: 'permutations',
      title: 'Permutations',
      difficulty: 'Medium',
      topicSlug: 'backtracking',
      statement: `Given an array \`nums\` of **distinct** integers, return all possible permutations in any order.`,
      constraints: ['1 ≤ nums.length ≤ 6', 'All numbers are distinct.'],
      examples: [
        { input: 'nums = [1,2,3]', output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]' },
        { input: 'nums = [0,1]', output: '[[0,1],[1,0]]' },
      ],
      functionName: { py: 'permute', js: 'permute' },
      compare: 'unorderedOuter',
      starter: {
        py: 'def permute(nums):\n    res = []\n    # at each position choose any unused element\n    # your code here\n    return res\n',
        js: 'function permute(nums) {\n  const res = [];\n  // at each position choose any unused element\n  // your code here\n  return res;\n}\n',
      },
      reference: {
        py: 'def permute(nums):\n    res = []\n    used = [False] * len(nums)\n    def backtrack(path):\n        if len(path) == len(nums):\n            res.append(path[:])\n            return\n        for i in range(len(nums)):\n            if used[i]:\n                continue\n            used[i] = True\n            path.append(nums[i])\n            backtrack(path)\n            path.pop()\n            used[i] = False\n    backtrack([])\n    return res\n',
        js: 'function permute(nums) {\n  const res = [];\n  const used = new Array(nums.length).fill(false);\n  function backtrack(path) {\n    if (path.length === nums.length) {\n      res.push(path.slice());\n      return;\n    }\n    for (let i = 0; i < nums.length; i++) {\n      if (used[i]) continue;\n      used[i] = true;\n      path.push(nums[i]);\n      backtrack(path);\n      path.pop();\n      used[i] = false;\n    }\n  }\n  backtrack([]);\n  return res;\n}\n',
      },
      tests: [
        { input: [[1, 2, 3]], expected: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]] },
        { input: [[0, 1]], expected: [[0, 1], [1, 0]] },
        { input: [[1]], expected: [[1]] },
      ],
      hints: [
        'A permutation uses every element exactly once, so track which indices are already used.',
        'At each position, try every unused element, recurse, then mark it unused again.',
        'Record the path when its length equals the input length.',
      ],
      complexity: { time: 'O(n · n!)', space: 'O(n)' },
    },
    {
      id: 'combination-sum',
      title: 'Combination Sum',
      difficulty: 'Medium',
      topicSlug: 'backtracking',
      statement: `Given an array of **distinct** integers \`candidates\` and a \`target\`, return all unique combinations where the chosen numbers sum to \`target\`. The same number may be chosen unlimited times. Combinations are unordered; return them in any order.`,
      constraints: ['1 ≤ candidates.length ≤ 30', '2 ≤ candidates[i] ≤ 40', '1 ≤ target ≤ 500'],
      examples: [
        { input: 'candidates = [2,3,6,7], target = 7', output: '[[2,2,3],[7]]' },
        { input: 'candidates = [2,3,5], target = 8', output: '[[2,2,2,2],[2,3,3],[3,5]]' },
      ],
      functionName: { py: 'combination_sum', js: 'combinationSum' },
      compare: 'unorderedOuter',
      starter: {
        py: 'def combination_sum(candidates, target):\n    res = []\n    # recurse from the same index to allow reusing a number\n    # your code here\n    return res\n',
        js: 'function combinationSum(candidates, target) {\n  const res = [];\n  // recurse from the same index to allow reusing a number\n  // your code here\n  return res;\n}\n',
      },
      reference: {
        py: 'def combination_sum(candidates, target):\n    res = []\n    candidates.sort()\n    def backtrack(start, path, remaining):\n        if remaining == 0:\n            res.append(path[:])\n            return\n        for i in range(start, len(candidates)):\n            if candidates[i] > remaining:\n                break\n            path.append(candidates[i])\n            backtrack(i, path, remaining - candidates[i])\n            path.pop()\n    backtrack(0, [], target)\n    return res\n',
        js: 'function combinationSum(candidates, target) {\n  const res = [];\n  candidates.sort((a, b) => a - b);\n  function backtrack(start, path, remaining) {\n    if (remaining === 0) {\n      res.push(path.slice());\n      return;\n    }\n    for (let i = start; i < candidates.length; i++) {\n      if (candidates[i] > remaining) break;\n      path.push(candidates[i]);\n      backtrack(i, path, remaining - candidates[i]);\n      path.pop();\n    }\n  }\n  backtrack(0, [], target);\n  return res;\n}\n',
      },
      tests: [
        { input: [[2, 3, 6, 7], 7], expected: [[2, 2, 3], [7]] },
        { input: [[2, 3, 5], 8], expected: [[2, 2, 2, 2], [2, 3, 3], [3, 5]] },
        { input: [[2], 1], expected: [] },
        { input: [[3, 5, 8], 11], expected: [[3, 3, 5], [3, 8]] },
      ],
      hints: [
        'Sort the candidates so you can stop early when one exceeds the remaining target.',
        'Recurse from the same index i to allow reusing a number; this also avoids permuted duplicates.',
        'Subtract the chosen value from the remaining target; record a combination when it hits 0.',
      ],
      complexity: { time: 'O(exponential, pruned)', space: 'O(target)' },
    },
  ],
};

export default topic;
