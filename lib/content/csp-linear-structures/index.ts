import type { Topic } from '@/lib/types';
import implementations from './implement';

const tutorial = `
## Linear structures — stacks, deques, and expression evaluation

A **stack** (last in, first out) is the workhorse behind matching, parsing, and search. The pattern:
whenever a problem cares most about the *most recent* unmatched thing, a stack is probably the tool.

- **Bracket matching**: push each opener; on a closer, the top of the stack must be its matching
  opener. Empty stack at the end ⇒ balanced. This is a tiny linter.
- **Evaluating expressions**: parentheses nest, and nesting is exactly what a stack tracks. With two
  stacks (values and operators) you can evaluate arithmetic while respecting precedence and parens.

A **deque** (double-ended queue) generalizes stack and queue: O(1) at both ends. CS Primer builds it
on a **doubly linked list**, which gives worst-case O(1) push/pop at each end with no resizing.

### Key points to remember

- Reach for a stack when "most recent unmatched item" is the thing you keep asking about.
- Bracket matching: push openers, match on closers, require an empty stack at the end.
- Two stacks (or shunting-yard) evaluate arithmetic with precedence and parentheses.
- A doubly linked list gives a deque O(1) at both ends; mind the empty/one-element transitions.
`;

const topic: Topic = {
  slug: 'csp-linear-structures',
  title: 'Linear Structures',
  order: 104,
  section: 'csprimer',
  blurb: 'Stacks for matching and parsing; a deque built on a doubly linked list.',
  tutorial,
  implementations,
  problems: [
    {
      id: 'paren-match',
      title: 'Parenthesis Match',
      difficulty: 'Easy',
      topicSlug: 'csp-linear-structures',
      statement: `Given a string \`s\` containing the bracket characters \`()\`, \`[]\`, and \`{}\` (possibly mixed with other characters, which you ignore), return \`true\` if every bracket is correctly matched and nested, and \`false\` otherwise.

Think of it as a primitive linter: \`([{}])\` is valid, \`([)]\` is not (the brackets close in the wrong order).`,
      constraints: ['0 ≤ s.length ≤ 10⁴', 'Non-bracket characters are ignored.'],
      examples: [
        { input: 's = "([{}])"', output: 'true' },
        { input: 's = "([)]"', output: 'false' },
        { input: 's = "a(b)c"', output: 'true' },
      ],
      functionName: { py: 'is_balanced', js: 'isBalanced' },
      starter: {
        py: 'def is_balanced(s):\n    # your code here\n    pass\n',
        js: 'function isBalanced(s) {\n  // your code here\n}\n',
      },
      reference: {
        py: `def is_balanced(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    openers = set(pairs.values())
    stack = []
    for ch in s:
        if ch in openers:
            stack.append(ch)
        elif ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack
`,
        js: `function isBalanced(s) {
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const openers = new Set(['(', '[', '{']);
  const stack = [];
  for (const ch of s) {
    if (openers.has(ch)) {
      stack.push(ch);
    } else if (ch in pairs) {
      if (stack.length === 0 || stack.pop() !== pairs[ch]) return false;
    }
  }
  return stack.length === 0;
}
`,
      },
      tests: [
        { input: ['()'], expected: true },
        { input: ['([{}])'], expected: true },
        { input: ['([)]'], expected: false },
        { input: ['((('], expected: false },
        { input: [''], expected: true },
        { input: ['a(b)c'], expected: true },
        { input: ['}'], expected: false },
        { input: ['(]'], expected: false },
        // Nesting 5000 deep, at the stated 10⁴ length bound: a recursive solution blows
        // the stack here, an explicit stack doesn't.
        { input: ['('.repeat(5000) + ')'.repeat(5000)], expected: true },
      ],
      hints: [
        'Push every opening bracket onto a stack.',
        'On a closing bracket, the top of the stack must be its matching opener — otherwise fail.',
        'After scanning, the stack must be empty (no unclosed openers).',
      ],
      complexity: { time: 'O(n)', space: 'O(n)' },
    },
    {
      id: 'calculator',
      title: 'Basic Calculator',
      difficulty: 'Medium',
      topicSlug: 'csp-linear-structures',
      statement: `Evaluate an arithmetic expression string \`expr\` and return its integer value.

The expression contains non-negative integers, the operators \`+\`, \`-\`, \`*\`, parentheses, and spaces. Respect normal precedence (\`*\` before \`+\`/\`-\`) and parentheses, e.g. \`"1 + 2 * 3" = 7\` and \`"(1 - (2 - 3))" = 2\`.

A clean approach is the **shunting-yard** idea with two stacks — one for values, one for operators — applying an operator when a higher-or-equal precedence one is already on top.`,
      constraints: ['The expression is well-formed.', 'All intermediate and final values fit in a 32-bit integer.', 'Only +, -, * appear (no division).'],
      examples: [
        { input: 'expr = "1 + 2 * 3"', output: '7' },
        { input: 'expr = "(1 - (2 - 3))"', output: '2' },
      ],
      functionName: { py: 'evaluate', js: 'evaluate' },
      starter: {
        py: 'def evaluate(expr):\n    # your code here\n    pass\n',
        js: 'function evaluate(expr) {\n  // your code here\n}\n',
      },
      reference: {
        py: `def evaluate(expr):
    tokens = []
    i = 0
    while i < len(expr):
        c = expr[i]
        if c == " ":
            i += 1
        elif c.isdigit():
            j = i
            while j < len(expr) and expr[j].isdigit():
                j += 1
            tokens.append(int(expr[i:j]))
            i = j
        else:
            tokens.append(c)
            i += 1

    prec = {"+": 1, "-": 1, "*": 2}
    values = []
    ops = []

    def apply():
        b = values.pop()
        a = values.pop()
        op = ops.pop()
        if op == "+":
            values.append(a + b)
        elif op == "-":
            values.append(a - b)
        else:
            values.append(a * b)

    for t in tokens:
        if isinstance(t, int):
            values.append(t)
        elif t in prec:
            while ops and ops[-1] in prec and prec[ops[-1]] >= prec[t]:
                apply()
            ops.append(t)
        elif t == "(":
            ops.append(t)
        elif t == ")":
            while ops[-1] != "(":
                apply()
            ops.pop()

    while ops:
        apply()
    return values[0]
`,
        js: `function evaluate(expr) {
  const tokens = [];
  let i = 0;
  while (i < expr.length) {
    const c = expr[i];
    if (c === ' ') {
      i++;
    } else if (c >= '0' && c <= '9') {
      let j = i;
      while (j < expr.length && expr[j] >= '0' && expr[j] <= '9') j++;
      tokens.push(Number(expr.slice(i, j)));
      i = j;
    } else {
      tokens.push(c);
      i++;
    }
  }

  const prec = { '+': 1, '-': 1, '*': 2 };
  const values = [];
  const ops = [];

  const apply = () => {
    const b = values.pop();
    const a = values.pop();
    const op = ops.pop();
    if (op === '+') values.push(a + b);
    else if (op === '-') values.push(a - b);
    else values.push(a * b);
  };

  for (const t of tokens) {
    if (typeof t === 'number') {
      values.push(t);
    } else if (t in prec) {
      while (ops.length && ops[ops.length - 1] in prec && prec[ops[ops.length - 1]] >= prec[t]) apply();
      ops.push(t);
    } else if (t === '(') {
      ops.push(t);
    } else if (t === ')') {
      while (ops[ops.length - 1] !== '(') apply();
      ops.pop();
    }
  }

  while (ops.length) apply();
  return values[0];
}
`,
      },
      tests: [
        { input: ['(1 - (2 - 3))'], expected: 2 },
        { input: ['2 * (3 + 4)'], expected: 14 },
        { input: ['(2 + 3) * 4'], expected: 20 },
        { input: ['1 + 2 * 3'], expected: 7 },
        { input: ['10 - 2 - 3'], expected: 5 },
        { input: ['((1))'], expected: 1 },
        { input: ['2 * 3 * 4'], expected: 24 },
        { input: ['1 + 2 + 3 * 4 - 5'], expected: 10 },
        // Every other expected value is non-negative, so abs() around a correct solution
        // passes the whole suite. This is the only case that rules it out.
        { input: ['2 - 3 * 4'], expected: -10 },
        { input: ['42'], expected: 42 },
        { input: ['1+2*3'], expected: 7 },
        { input: ['(1 + 2) * (3 + 4)'], expected: 21 },
        { input: ['(1 - (2 - (3 - 4)))'], expected: -2 },
        { input: ['2000000000 + 147483647'], expected: 2147483647 },
      ],
      hints: [
        'First tokenize into numbers, operators, and parentheses.',
        'Keep a value stack and an operator stack; when you see an operator, apply any pending ops of higher-or-equal precedence first.',
        'On ")", apply operators until the matching "(" and discard it.',
      ],
      complexity: { time: 'O(n)', space: 'O(n)' },
    },
  ],
};

export default topic;
