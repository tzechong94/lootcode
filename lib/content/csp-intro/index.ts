import type { Topic } from '@/lib/types';

const tutorial = `
## Introduction — modelling state and data

The first CS Primer problems aren't about fancy algorithms. They're about two habits that
separate solid engineers from the rest: **representing data cleanly** and **thinking clearly about
state** before you write a line of logic.

### Derive, don't duplicate

A recurring theme: keep a single source of truth and *derive* everything else from it. In
tic-tac-toe, the board is the truth; "who won?" is a pure function of the board, not a separate
flag you have to keep in sync. Whenever you find yourself updating two things to keep them
consistent, ask whether one can be computed from the other.

### Checksums and digit manipulation

The Luhn algorithm is a warm-up in working with the *digits* of a number: walk them from the right,
transform every second one, and reduce to a single check. It shows up in credit cards, IMEI numbers,
and more — and it's a clean exercise in indexing and modular arithmetic.

### Key points to remember

- Model your state first; make everything else a pure function of it.
- Iterating over digits from the right is just \`reversed()\` + \`enumerate\` (or a reverse index loop).
- A "winner" or "valid" check is a *query* over state — no side effects, easy to test.
`;

const topic: Topic = {
  slug: 'csp-intro',
  title: 'Introduction',
  order: 101,
  section: 'csprimer',
  blurb: 'Model state cleanly and derive answers from it — checksums and game state.',
  tutorial,
  problems: [
    {
      id: 'luhn',
      title: 'Luhn Algorithm',
      difficulty: 'Easy',
      topicSlug: 'csp-intro',
      statement: `Implement the **Luhn algorithm**, the checksum used to catch typos in credit-card and other ID numbers.

Given \`digits\`, a string of decimal digits, return \`true\` if it is valid under Luhn, \`false\` otherwise.

The rule: starting from the **rightmost** digit and moving left, double every second digit. If a doubled value is greater than 9, subtract 9. Sum all the resulting digits. The number is valid when that sum is a multiple of 10.`,
      constraints: ['1 ≤ digits.length', 'digits contains only characters 0–9.'],
      examples: [
        { input: 'digits = "49927398716"', output: 'true' },
        { input: 'digits = "1234567812345678"', output: 'false' },
      ],
      functionName: { py: 'verify', js: 'verify' },
      starter: {
        py: 'def verify(digits):\n    # your code here\n    pass\n',
        js: 'function verify(digits) {\n  // your code here\n}\n',
      },
      reference: {
        py: `def verify(digits):
    total = 0
    for i, ch in enumerate(reversed(digits)):
        d = int(ch)
        if i % 2 == 1:
            d *= 2
            if d > 9:
                d -= 9
        total += d
    return total % 10 == 0
`,
        js: `function verify(digits) {
  let total = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    total += d;
  }
  return total % 10 === 0;
}
`,
      },
      tests: [
        { input: ['49927398716'], expected: true },
        { input: ['49927398717'], expected: false },
        { input: ['1234567812345678'], expected: false },
        { input: ['1234567812345670'], expected: true },
        { input: ['79927398713'], expected: true },
        { input: ['0'], expected: true },
        { input: ['5'], expected: false },
        // Two digits: the second-from-right is the first one that gets doubled.
        { input: ['18'], expected: true },
        // 9 doubles to 18 → subtract 9. Skip that rule and this reads as invalid.
        { input: ['91'], expected: true },
        { input: ['0000'], expected: true },
      ],
      hints: [
        'Process digits from the right — reversed(digits) with an index tells you which ones to double.',
        'Every second digit (odd index when 0-based from the right) gets doubled; if the result exceeds 9, subtract 9.',
        'Valid when the total sum is divisible by 10.',
      ],
      complexity: { time: 'O(n)', space: 'O(1)' },
    },
    {
      id: 'tic-tac-toe',
      title: 'Tic-Tac-Toe Winner',
      difficulty: 'Easy',
      topicSlug: 'csp-intro',
      statement: `A tic-tac-toe board is a 3×3 grid where each cell is \`"X"\`, \`"O"\`, or \`""\` (empty). Given \`board\`, a list of 3 rows, determine the game state:

- Return \`"X"\` or \`"O"\` if that player has three in a row (horizontally, vertically, or diagonally).
- Return \`"Draw"\` if the board is full with no winner.
- Return \`""\` if the game is still in progress.

This is the "derive from state" idea: the winner is a pure function of the board.`,
      constraints: ['board is 3×3.', 'Each cell is one of "X", "O", "".', 'At most one player has a winning line.'],
      examples: [
        { input: 'board = [["X","X","X"],["O","O",""],["","",""]]', output: '"X"' },
        { input: 'board = [["X","O","X"],["O","O","X"],["O","X","O"]]', output: '"Draw"' },
        { input: 'board = [["X","",""],["","O",""],["","","X"]]', output: '""', explanation: 'No line yet and empty cells remain.' },
      ],
      functionName: { py: 'winner', js: 'winner' },
      starter: {
        py: 'def winner(board):\n    # your code here\n    pass\n',
        js: 'function winner(board) {\n  // your code here\n}\n',
      },
      reference: {
        py: `def winner(board):
    lines = []
    for i in range(3):
        lines.append([board[i][0], board[i][1], board[i][2]])
        lines.append([board[0][i], board[1][i], board[2][i]])
    lines.append([board[0][0], board[1][1], board[2][2]])
    lines.append([board[0][2], board[1][1], board[2][0]])
    for a, b, c in lines:
        if a and a == b == c:
            return a
    if all(cell for row in board for cell in row):
        return "Draw"
    return ""
`,
        js: `function winner(board) {
  const lines = [];
  for (let i = 0; i < 3; i++) {
    lines.push([board[i][0], board[i][1], board[i][2]]);
    lines.push([board[0][i], board[1][i], board[2][i]]);
  }
  lines.push([board[0][0], board[1][1], board[2][2]]);
  lines.push([board[0][2], board[1][1], board[2][0]]);
  for (const [a, b, c] of lines) {
    if (a && a === b && b === c) return a;
  }
  const full = board.every((row) => row.every((cell) => cell !== ''));
  return full ? 'Draw' : '';
}
`,
      },
      tests: [
        { input: [[['X', 'X', 'X'], ['O', 'O', ''], ['', '', '']]], expected: 'X' },
        { input: [[['X', 'O', 'X'], ['O', 'O', 'X'], ['O', 'X', 'O']]], expected: 'Draw' },
        { input: [[['X', '', ''], ['', 'O', ''], ['', '', 'X']]], expected: '' },
        { input: [[['O', '', ''], ['O', 'X', 'X'], ['O', '', '']]], expected: 'O' },
        { input: [[['X', 'O', ''], ['', 'X', 'O'], ['', '', 'X']]], expected: 'X' },
        { input: [[['', '', ''], ['', '', ''], ['', '', '']]], expected: '' },
        // Anti-diagonal: the one winning line no other case exercises.
        { input: [[['', '', 'O'], ['X', 'O', 'X'], ['O', '', '']]], expected: 'O' },
        // Full board *with* a winner: a winning line beats "Draw".
        { input: [[['X', 'X', 'X'], ['O', 'O', 'X'], ['X', 'O', 'O']]], expected: 'X' },
        // One cell left and no line: still in progress, not a draw.
        { input: [[['X', 'O', 'X'], ['X', 'O', 'O'], ['O', 'X', '']]], expected: '' },
      ],
      hints: [
        'Enumerate all 8 winning lines: 3 rows, 3 columns, 2 diagonals.',
        'A line wins if its first cell is non-empty and all three cells are equal.',
        'No winner + every cell filled ⇒ "Draw"; otherwise the game is still going ("").',
      ],
      complexity: { time: 'O(1)', space: 'O(1)' },
    },
  ],
};

export default topic;
