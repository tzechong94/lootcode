import type { Topic } from '@/lib/types';

const tutorial = `
## Stack — first principles

A stack is a **last-in, first-out (LIFO)** collection: you can only add (\`push\`) or remove (\`pop\`)
at one end, the top. Both are O(1). That single restriction is exactly what you want whenever a
problem has **nested or recently-seen structure** — the most recently opened thing is the first
that must be closed or resolved.

In code a stack is just a dynamic array used at one end (\`append\`/\`pop\` in Python, \`push\`/\`pop\`
in JS). You rarely need a special class.

### The two signals that scream "stack"

1. **Matching / nesting** — parentheses, tags, directories, expression evaluation. Push when you
   open something, pop when you close it, and check that the popped item matches.

2. **"Process the most recent unresolved element"** — you're scanning left to right and each new
   element resolves some earlier ones. This is the **monotonic stack**, the key advanced pattern.

### Monotonic stack

Keep the stack's values in sorted order (say, decreasing). Before pushing a new element, pop
everything that the new element "beats". Each popped element has just found its answer — the new
element is the *next greater* (or smaller) value to its right. Because every index is pushed and
popped at most once, the whole scan is **O(n)** even though it looks nested.

\`\`\`text
for i, x in enumerate(arr):
    while stack and arr[stack[-1]] < x:
        j = stack.pop()        # x is the next-greater element for index j
        answer[j] = x
    stack.append(i)
\`\`\`

This solves "next greater element", "daily temperatures", "largest rectangle in histogram", and
many "span" problems.

### Stacks and recursion

Recursion *is* a stack (the call stack). Any recursive traversal can be rewritten with an explicit
stack — useful for iterative tree/graph traversal and to avoid stack-overflow on deep inputs.

### Key points to remember

- Stack = LIFO; push/pop/peek are all O(1) on a dynamic array.
- Reach for it on matching/nesting problems and "resolve the most recent element" scans.
- A **monotonic stack** answers next-greater / next-smaller queries in O(n) — each index is pushed and popped once.
- When you pop on a match, always verify the popped element is the *expected* counterpart.
- The call stack means every recursion has an equivalent explicit-stack iterative form.
`;

const topic: Topic = {
  slug: 'stack',
  title: 'Stack',
  order: 5,
  blurb: 'LIFO structure for matching/nesting and the monotonic-stack "next greater element" pattern.',
  tutorial,
  problems: [
    {
      id: 'valid-parentheses',
      title: 'Valid Parentheses',
      difficulty: 'Easy',
      topicSlug: 'stack',
      statement: `Given a string \`s\` containing just the characters \`()[]{}\`, determine if the brackets are valid: every opening bracket is closed by the same type, and brackets close in the correct order.`,
      constraints: ['1 ≤ s.length ≤ 10⁴', "s consists only of '()[]{}'."],
      examples: [
        { input: 's = "()[]{}"', output: 'true' },
        { input: 's = "(]"', output: 'false' },
      ],
      functionName: { py: 'is_valid', js: 'isValid' },
      starter: {
        py: 'def is_valid(s):\n    # your code here\n    pass\n',
        js: 'function isValid(s) {\n  // your code here\n}\n',
      },
      reference: {
        py: "def is_valid(s):\n    stack = []\n    pairs = {')': '(', ']': '[', '}': '{'}\n    for c in s:\n        if c in pairs:\n            if not stack or stack.pop() != pairs[c]:\n                return False\n        else:\n            stack.append(c)\n    return not stack\n",
        js: "function isValid(s) {\n  const stack = [];\n  const pairs = { ')': '(', ']': '[', '}': '{' };\n  for (const c of s) {\n    if (c in pairs) {\n      if (stack.pop() !== pairs[c]) return false;\n    } else {\n      stack.push(c);\n    }\n  }\n  return stack.length === 0;\n}\n",
      },
      tests: [
        { input: ['()'], expected: true },
        { input: ['()[]{}'], expected: true },
        { input: ['(]'], expected: false },
        { input: ['([])'], expected: true },
        { input: ['(['], expected: false },
        { input: [']'], expected: false },
      ],
      hints: [
        'Push opening brackets onto a stack.',
        'On a closing bracket, the top of the stack must be the matching opener.',
        'At the end the stack must be empty — leftover openers mean it is invalid.',
      ],
      complexity: { time: 'O(n)', space: 'O(n)' },
    },
    {
      id: 'min-stack',
      title: 'Min Stack',
      difficulty: 'Medium',
      topicSlug: 'stack',
      statement: `Design a stack that supports \`push(x)\`, \`pop()\`, \`top()\`, and \`getMin()\` — retrieving the minimum element — all in **O(1)**.

You are given a list of operations; each is one of \`["push", x]\`, \`["pop"]\`, \`["top"]\`, \`["getMin"]\`. Return a list with the result of each operation: \`null\` for \`push\`/\`pop\`, and the returned value for \`top\`/\`getMin\`.`,
      constraints: ['Operations are valid (no pop/top/getMin on an empty stack).', '-2³¹ ≤ x < 2³¹'],
      examples: [
        {
          input: 'ops = [["push",-2],["push",0],["push",-3],["getMin"],["pop"],["top"],["getMin"]]',
          output: '[null,null,null,-3,null,0,-2]',
        },
      ],
      functionName: { py: 'min_stack_ops', js: 'minStackOps' },
      starter: {
        py: 'def min_stack_ops(ops):\n    out = []\n    # process each op and append its result (None for push/pop)\n    for op in ops:\n        name = op[0]\n        # your code here\n        pass\n    return out\n',
        js: 'function minStackOps(ops) {\n  const out = [];\n  // process each op and push its result (null for push/pop)\n  for (const op of ops) {\n    const name = op[0];\n    // your code here\n  }\n  return out;\n}\n',
      },
      reference: {
        py: "def min_stack_ops(ops):\n    stack = []\n    mins = []\n    out = []\n    for op in ops:\n        name = op[0]\n        if name == 'push':\n            x = op[1]\n            stack.append(x)\n            mins.append(x if not mins else min(x, mins[-1]))\n            out.append(None)\n        elif name == 'pop':\n            stack.pop()\n            mins.pop()\n            out.append(None)\n        elif name == 'top':\n            out.append(stack[-1])\n        elif name == 'getMin':\n            out.append(mins[-1])\n    return out\n",
        js: "function minStackOps(ops) {\n  const stack = [];\n  const mins = [];\n  const out = [];\n  for (const op of ops) {\n    const name = op[0];\n    if (name === 'push') {\n      const x = op[1];\n      stack.push(x);\n      mins.push(mins.length === 0 ? x : Math.min(x, mins[mins.length - 1]));\n      out.push(null);\n    } else if (name === 'pop') {\n      stack.pop();\n      mins.pop();\n      out.push(null);\n    } else if (name === 'top') {\n      out.push(stack[stack.length - 1]);\n    } else if (name === 'getMin') {\n      out.push(mins[mins.length - 1]);\n    }\n  }\n  return out;\n}\n",
      },
      tests: [
        {
          input: [[['push', -2], ['push', 0], ['push', -3], ['getMin'], ['pop'], ['top'], ['getMin']]],
          expected: [null, null, null, -3, null, 0, -2],
        },
        {
          input: [[['push', 1], ['push', 2], ['top'], ['getMin'], ['pop'], ['getMin']]],
          expected: [null, null, 2, 1, null, 1],
        },
        { input: [[['push', 5], ['getMin'], ['top']]], expected: [null, 5, 5] },
      ],
      hints: [
        'getMin must be O(1), so you cannot scan the stack each call.',
        'Keep a second stack tracking the minimum so far at each level.',
        'When you push x, push min(x, currentMin); pop both stacks together.',
      ],
      complexity: { time: 'O(1) per op', space: 'O(n)' },
    },
    {
      id: 'eval-rpn',
      title: 'Evaluate Reverse Polish Notation',
      difficulty: 'Medium',
      topicSlug: 'stack',
      statement: `Evaluate an arithmetic expression in Reverse Polish (postfix) Notation. Valid operators are \`+\`, \`-\`, \`*\`, \`/\`. Division truncates toward zero. Return the integer result.`,
      constraints: ['1 ≤ tokens.length ≤ 10⁴', 'Each token is an operator or an integer.'],
      examples: [
        { input: 'tokens = ["2","1","+","3","*"]', output: '9', explanation: '((2 + 1) * 3) = 9.' },
        { input: 'tokens = ["4","13","5","/","+"]', output: '6', explanation: '(4 + (13 / 5)) = 6.' },
      ],
      functionName: { py: 'eval_rpn', js: 'evalRPN' },
      starter: {
        py: 'def eval_rpn(tokens):\n    # your code here\n    pass\n',
        js: 'function evalRPN(tokens) {\n  // your code here\n}\n',
      },
      reference: {
        py: "def eval_rpn(tokens):\n    stack = []\n    ops = {'+', '-', '*', '/'}\n    for t in tokens:\n        if t in ops:\n            b = stack.pop()\n            a = stack.pop()\n            if t == '+':\n                stack.append(a + b)\n            elif t == '-':\n                stack.append(a - b)\n            elif t == '*':\n                stack.append(a * b)\n            else:\n                stack.append(int(a / b))\n        else:\n            stack.append(int(t))\n    return stack[0]\n",
        js: "function evalRPN(tokens) {\n  const stack = [];\n  const ops = new Set(['+', '-', '*', '/']);\n  for (const t of tokens) {\n    if (ops.has(t)) {\n      const b = stack.pop();\n      const a = stack.pop();\n      let r;\n      if (t === '+') r = a + b;\n      else if (t === '-') r = a - b;\n      else if (t === '*') r = a * b;\n      else r = Math.trunc(a / b);\n      stack.push(r);\n    } else {\n      stack.push(parseInt(t, 10));\n    }\n  }\n  return stack[0];\n}\n",
      },
      tests: [
        { input: [['2', '1', '+', '3', '*']], expected: 9 },
        { input: [['4', '13', '5', '/', '+']], expected: 6 },
        { input: [['3', '-4', '+']], expected: -1 },
        {
          input: [['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+']],
          expected: 22,
        },
      ],
      hints: [
        'Scan left to right; push numbers onto a stack.',
        'On an operator, pop the two most recent values — order matters: the first popped is the right operand.',
        'Push the result back and continue; the final stack holds the answer.',
      ],
      complexity: { time: 'O(n)', space: 'O(n)' },
    },
  ],
};

export default topic;
