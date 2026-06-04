import type { Implementation } from '@/lib/types';

const implementations: Implementation[] = [
  {
    id: 'impl-trie',
    title: 'Build a Trie',
    statement: `A **trie** (prefix tree) stores strings by their characters: each node has a child per next-letter, so words that share a prefix share a path. Looking up a word of length L is O(L) — independent of how many words are stored — which is why tries power autocomplete and prefix search.

Build a \`Trie\`:

- \`insert(word)\` — walk the characters, creating child nodes as needed, and mark the final node as the **end** of a word.
- \`search(word)\` — \`True\`/\`true\` only if the exact word was inserted (the path exists **and** its last node is marked end-of-word).
- \`starts_with(prefix)\` / \`startsWith(prefix)\` — \`True\`/\`true\` if any inserted word begins with \`prefix\` (the path exists, end-of-word or not).

The difference between \`search\` and \`starts_with\` is exactly that end-of-word flag.`,
    methods: [
      { name: 'insert', sig: 'insert(word)', doc: 'Add a word.' },
      { name: 'search', sig: 'search(word) -> bool', doc: 'True if the exact word was inserted.' },
      { name: 'startsWith', sig: 'starts_with(prefix) -> bool', doc: 'True if any word has this prefix.' },
    ],
    className: { py: 'Trie', js: 'Trie' },
    methodAliases: { py: { startsWith: 'starts_with' } },
    complexity: { time: 'O(L) per op (L = string length)', space: 'O(total characters)' },
    hints: [
      'Each node holds a map from character → child node, plus a boolean "is this the end of a word?".',
      'insert walks/creates one node per character, then sets end = true on the last node.',
      'Write a helper that follows a string and returns the node it lands on (or None/null). search also checks end; starts_with just checks the node exists.',
    ],
    starter: {
      py: `class Trie:
    def __init__(self):
        # TODO: children map, end-of-word flag
        pass

    def insert(self, word):
        pass

    def search(self, word):
        pass

    def starts_with(self, prefix):
        pass
`,
      js: `class Trie {
  constructor() {
    // TODO: children map, end-of-word flag
  }

  insert(word) {}
  search(word) {}
  startsWith(prefix) {}
}
`,
    },
    reference: {
      py: `class Trie:
    def __init__(self):
        self.children = {}
        self.end = False

    def insert(self, word):
        node = self
        for ch in word:
            if ch not in node.children:
                node.children[ch] = Trie()
            node = node.children[ch]
        node.end = True

    def _find(self, s):
        node = self
        for ch in s:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node

    def search(self, word):
        node = self._find(word)
        return node is not None and node.end

    def starts_with(self, prefix):
        return self._find(prefix) is not None
`,
      js: `class Trie {
  constructor() {
    this.children = {};
    this.end = false;
  }

  insert(word) {
    let node = this;
    for (const ch of word) {
      if (!node.children[ch]) node.children[ch] = new Trie();
      node = node.children[ch];
    }
    node.end = true;
  }

  _find(s) {
    let node = this;
    for (const ch of s) {
      if (!node.children[ch]) return null;
      node = node.children[ch];
    }
    return node;
  }

  search(word) {
    const node = this._find(word);
    return node !== null && node.end;
  }

  startsWith(prefix) {
    return this._find(prefix) !== null;
  }
}
`,
    },
    tests: [
      {
        name: 'search vs prefix',
        ops: [
          { call: 'insert', args: ['apple'] },
          { call: 'search', args: ['apple'], expect: true },
          { call: 'search', args: ['app'], expect: false },
          { call: 'startsWith', args: ['app'], expect: true },
          { call: 'insert', args: ['app'] },
          { call: 'search', args: ['app'], expect: true },
          { call: 'startsWith', args: ['ap'], expect: true },
        ],
      },
      {
        name: 'absent words and prefixes',
        ops: [
          { call: 'insert', args: ['cat'] },
          { call: 'search', args: ['car'], expect: false },
          { call: 'startsWith', args: ['ca'], expect: true },
          { call: 'startsWith', args: ['dog'], expect: false },
          { call: 'search', args: ['ca'], expect: false },
          { call: 'search', args: ['catalog'], expect: false },
        ],
      },
      {
        name: 'shared prefixes',
        ops: [
          { call: 'insert', args: ['to'] },
          { call: 'insert', args: ['tea'] },
          { call: 'insert', args: ['ted'] },
          { call: 'insert', args: ['ten'] },
          { call: 'search', args: ['tea'], expect: true },
          { call: 'search', args: ['te'], expect: false },
          { call: 'startsWith', args: ['te'], expect: true },
          { call: 'startsWith', args: ['ted'], expect: true },
        ],
      },
    ],
  },
];

export default implementations;
