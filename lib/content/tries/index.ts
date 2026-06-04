import type { Topic, TutorialBlock } from '@/lib/types';
import implementations from './implement';

const tutorial = `
## Tries — first principles

A trie (prefix tree) is a tree where **each edge is a character** and each path from the root spells
out a prefix. Words that share a prefix share the same path until they diverge. That structure makes
the trie the right tool whenever a problem is about **prefixes** or a **set of strings searched by
their characters** — autocomplete, spell-check, IP routing, word games.

### Why not just a hash set of words?

A hash set answers "is this exact word present?" in O(L) (L = word length) — but it **can't answer
"is any word with this prefix present?"** without scanning everything. A trie answers both:

- \`search(word)\` — walk the characters; the word exists if you land on a node marked *end-of-word*.
- \`startsWith(prefix)\` — walk the characters; the prefix exists if you don't fall off the tree.

Both are O(L), independent of how many words are stored.

### Structure

Each node holds a map from next-character → child node, plus a boolean **end-of-word** flag (a word
can be a strict prefix of another, e.g. \`app\` and \`apple\`, so you must mark *where words actually
end*). A common encoding is a dictionary keyed by character, with a sentinel key (here \`'$'\`) marking
end-of-word.

\`\`\`text
insert(word):  walk/create a child per character; mark the final node end-of-word
search(word):  walk children; return (final node exists AND is end-of-word)
startsWith(p): walk children; return (you never fell off the tree)
\`\`\`

### Wildcards and DFS

Once words live in a trie, fuzzy matching is just a traversal. To support a \`.\` that matches any one
character, recurse into **every** child at that position instead of one — turning search into a small
DFS over the tree.

### Key points to remember

- A trie shines for **prefix** queries; a hash set can't do prefixes efficiently.
- Operations are O(L) in the word/prefix length, regardless of the number of stored words.
- Mark **end-of-word** explicitly — a stored word may be a prefix of another.
- Space is the trade-off: many nodes/pointers. Shared prefixes amortize it.
- Wildcard / pattern search over a trie is a DFS that branches on '.' into all children.
`;

const blocks: TutorialBlock[] = [
  {
    kind: 'md',
    md: `## Tries — from first principles

A trie (prefix tree) stores a set of strings as a tree where **each edge is a character** and each
path from the root spells out a prefix. Words that begin the same way **share the same path** until
they diverge. That shared structure is the whole point: it makes anything about **prefixes** — does
any stored word start with "ca"? — answerable directly, which a hash set of whole words simply can't
do.

The two operations are just walks down the tree, each **O(L)** in the word length (independent of how
many words are stored): \`search\` walks the characters and checks the final node is marked
end-of-word; \`startsWith\` just checks the path exists. Trace a small trie holding "cat", "car", "dog":`,
  },
  {
    kind: 'viz',
    spec: {
      type: 'graph',
      title: 'A trie: shared prefixes are shared paths',
      nodes: [
        { id: '•', x: 0.05, y: 0.5 },
        { id: 'c', x: 0.28, y: 0.3 },
        { id: 'a', x: 0.5, y: 0.3 },
        { id: 't', x: 0.72, y: 0.18 },
        { id: 'r', x: 0.72, y: 0.45 },
        { id: 'd', x: 0.28, y: 0.78 },
        { id: 'o', x: 0.5, y: 0.78 },
        { id: 'g', x: 0.72, y: 0.78 },
      ],
      edges: [
        { from: '•', to: 'c', directed: true },
        { from: 'c', to: 'a', directed: true },
        { from: 'a', to: 't', directed: true },
        { from: 'a', to: 'r', directed: true },
        { from: '•', to: 'd', directed: true },
        { from: 'd', to: 'o', directed: true },
        { from: 'o', to: 'g', directed: true },
      ],
      frames: [
        { caption: 'Each edge is a letter; a path from the root (•) spells a prefix. End-of-word nodes (t, r, g) finish a stored word.', active: ['•'] },
        { caption: 'Search "cat": walk • → c → a → t. O(L), touching only this path.', active: ['•', 'c', 'a', 't'], visited: [] },
        { caption: 'Add/search "car": it shares the prefix "ca" — the c→a path is reused, only "r" diverges.', active: ['•', 'c', 'a', 'r'] },
        { caption: '"dog" shares no prefix with the others, so it gets its own branch from the root.', active: ['•', 'd', 'o', 'g'] },
        { caption: 'startsWith("ca")? Walk • → c → a and we never fall off the tree → true.', active: ['•', 'c', 'a'] },
      ],
    },
  },
  {
    kind: 'md',
    md: `Each node holds a map from next-character → child plus an **end-of-word** flag (needed because a
word like "car" can be a prefix of "cart"). A hash set could match whole words in O(L) too, but it
**cannot** answer prefix queries without scanning everything — that's the trie's edge. Once words live
in a trie, fuzzy matching (a \`.\` wildcard) is just a small DFS that branches into every child at the
wildcard position.

### Key points to remember

- A trie shines for **prefix** queries; a hash set can't do prefixes efficiently.
- Operations are O(L) in the word/prefix length, regardless of how many words are stored.
- Mark **end-of-word** explicitly — a stored word may be a prefix of another.
- Shared prefixes share nodes, which amortizes the (otherwise large) node/pointer memory cost.
- Wildcard / pattern search over a trie is a DFS that branches on '.' into all children.`,
  },
];

const topic: Topic = {
  slug: 'tries',
  title: 'Tries',
  order: 9,
  section: 'data-structure',
  blurb: 'Prefix trees: O(L) insert/search/prefix queries and DFS-based wildcard matching.',
  tutorial,
  blocks,
  implementations,
  problems: [
    {
      id: 'implement-trie',
      title: 'Implement Trie (Prefix Tree)',
      difficulty: 'Medium',
      topicSlug: 'tries',
      statement: `Implement a trie supporting \`insert(word)\`, \`search(word)\` (exact word present?), and \`startsWith(prefix)\` (any word with this prefix?).

You are given operations, each \`["insert", w]\`, \`["search", w]\`, or \`["startsWith", p]\`. Return a list with each operation's result: \`null\` for insert, and a boolean for search / startsWith.`,
      constraints: ['1 ≤ word/prefix length ≤ 2000', 'Only lowercase English letters.', '≤ 3·10⁴ operations'],
      examples: [
        {
          input: 'ops = [["insert","apple"],["search","apple"],["search","app"],["startsWith","app"],["insert","app"],["search","app"]]',
          output: '[null,true,false,true,null,true]',
        },
      ],
      functionName: { py: 'trie_ops', js: 'trieOps' },
      starter: {
        py: 'def trie_ops(ops):\n    root = {}\n    out = []\n    # implement insert / search / startsWith over the nested-dict trie\n    for op in ops:\n        name = op[0]\n        # your code here\n        pass\n    return out\n',
        js: 'function trieOps(ops) {\n  const root = {};\n  const out = [];\n  // implement insert / search / startsWith over the nested-object trie\n  for (const op of ops) {\n    const name = op[0];\n    // your code here\n  }\n  return out;\n}\n',
      },
      reference: {
        py: "def trie_ops(ops):\n    root = {}\n    out = []\n    def insert(w):\n        node = root\n        for c in w:\n            node = node.setdefault(c, {})\n        node['$'] = True\n    def search(w):\n        node = root\n        for c in w:\n            if c not in node:\n                return False\n            node = node[c]\n        return '$' in node\n    def starts_with(p):\n        node = root\n        for c in p:\n            if c not in node:\n                return False\n            node = node[c]\n        return True\n    for op in ops:\n        name = op[0]\n        if name == 'insert':\n            insert(op[1])\n            out.append(None)\n        elif name == 'search':\n            out.append(search(op[1]))\n        elif name == 'startsWith':\n            out.append(starts_with(op[1]))\n    return out\n",
        js: "function trieOps(ops) {\n  const root = {};\n  const out = [];\n  const insert = (w) => {\n    let node = root;\n    for (const c of w) {\n      if (!node[c]) node[c] = {};\n      node = node[c];\n    }\n    node['$'] = true;\n  };\n  const search = (w) => {\n    let node = root;\n    for (const c of w) {\n      if (!node[c]) return false;\n      node = node[c];\n    }\n    return node['$'] === true;\n  };\n  const startsWith = (p) => {\n    let node = root;\n    for (const c of p) {\n      if (!node[c]) return false;\n      node = node[c];\n    }\n    return true;\n  };\n  for (const op of ops) {\n    const name = op[0];\n    if (name === 'insert') { insert(op[1]); out.push(null); }\n    else if (name === 'search') out.push(search(op[1]));\n    else if (name === 'startsWith') out.push(startsWith(op[1]));\n  }\n  return out;\n}\n",
      },
      tests: [
        {
          input: [[['insert', 'apple'], ['search', 'apple'], ['search', 'app'], ['startsWith', 'app'], ['insert', 'app'], ['search', 'app']]],
          expected: [null, true, false, true, null, true],
        },
        {
          input: [[['insert', 'a'], ['search', 'a'], ['startsWith', 'a'], ['startsWith', 'b']]],
          expected: [null, true, true, false],
        },
        {
          input: [[['search', 'x'], ['startsWith', 'x']]],
          expected: [false, false],
        },
      ],
      hints: [
        'Each node maps a character to a child node; use a dictionary/object.',
        'Mark the end of a word with a sentinel flag — a word can be a prefix of another.',
        'search requires the end flag; startsWith only requires the path to exist.',
      ],
      complexity: { time: 'O(L) per op', space: 'O(total characters)' },
    },
    {
      id: 'add-and-search-words',
      title: 'Design Add and Search Words Data Structure',
      difficulty: 'Medium',
      topicSlug: 'tries',
      statement: `Design a structure supporting \`addWord(word)\` and \`search(word)\`, where in \`search\` a \`.\` matches any single letter.

You are given operations, each \`["addWord", w]\` or \`["search", w]\`. Return a list with each operation's result: \`null\` for addWord, and a boolean for search.`,
      constraints: ['1 ≤ word length ≤ 25', 'addWord words are lowercase letters; search words may contain "."', '≤ 10⁴ operations'],
      examples: [
        {
          input: 'ops = [["addWord","bad"],["addWord","dad"],["addWord","mad"],["search","pad"],["search","bad"],["search",".ad"],["search","b.."]]',
          output: '[null,null,null,false,true,true,true]',
        },
      ],
      functionName: { py: 'word_dict_ops', js: 'wordDictOps' },
      starter: {
        py: 'def word_dict_ops(ops):\n    root = {}\n    out = []\n    # addWord builds the trie; search supports "." via DFS over children\n    for op in ops:\n        name = op[0]\n        # your code here\n        pass\n    return out\n',
        js: 'function wordDictOps(ops) {\n  const root = {};\n  const out = [];\n  // addWord builds the trie; search supports "." via DFS over children\n  for (const op of ops) {\n    const name = op[0];\n    // your code here\n  }\n  return out;\n}\n',
      },
      reference: {
        py: "def word_dict_ops(ops):\n    root = {}\n    out = []\n    def add(w):\n        node = root\n        for c in w:\n            node = node.setdefault(c, {})\n        node['$'] = True\n    def search(w):\n        def dfs(node, i):\n            if i == len(w):\n                return '$' in node\n            c = w[i]\n            if c == '.':\n                for k, child in node.items():\n                    if k != '$' and dfs(child, i + 1):\n                        return True\n                return False\n            if c not in node:\n                return False\n            return dfs(node[c], i + 1)\n        return dfs(root, 0)\n    for op in ops:\n        name = op[0]\n        if name == 'addWord':\n            add(op[1])\n            out.append(None)\n        elif name == 'search':\n            out.append(search(op[1]))\n    return out\n",
        js: "function wordDictOps(ops) {\n  const root = {};\n  const out = [];\n  const add = (w) => {\n    let node = root;\n    for (const c of w) {\n      if (!node[c]) node[c] = {};\n      node = node[c];\n    }\n    node['$'] = true;\n  };\n  const search = (w) => {\n    const dfs = (node, i) => {\n      if (i === w.length) return node['$'] === true;\n      const c = w[i];\n      if (c === '.') {\n        for (const k of Object.keys(node)) {\n          if (k !== '$' && dfs(node[k], i + 1)) return true;\n        }\n        return false;\n      }\n      if (!node[c]) return false;\n      return dfs(node[c], i + 1);\n    };\n    return dfs(root, 0);\n  };\n  for (const op of ops) {\n    const name = op[0];\n    if (name === 'addWord') { add(op[1]); out.push(null); }\n    else if (name === 'search') out.push(search(op[1]));\n  }\n  return out;\n}\n",
      },
      tests: [
        {
          input: [[['addWord', 'bad'], ['addWord', 'dad'], ['addWord', 'mad'], ['search', 'pad'], ['search', 'bad'], ['search', '.ad'], ['search', 'b..']]],
          expected: [null, null, null, false, true, true, true],
        },
        {
          input: [[['addWord', 'a'], ['search', '.'], ['search', 'a'], ['search', 'b']]],
          expected: [null, true, true, false],
        },
        {
          input: [[['addWord', 'at'], ['addWord', 'and'], ['search', 'a.'], ['search', 'a..'], ['search', '...']]],
          expected: [null, null, true, true, true],
        },
      ],
      hints: [
        'addWord is the same as a normal trie insert.',
        'For search, walk character by character; on a normal letter, descend that one child.',
        'On a ".", recurse into every child and succeed if any branch matches the rest.',
      ],
      complexity: { time: 'O(L) add; O(26^dots · L) search', space: 'O(total characters)' },
    },
  ],
};

export default topic;
