import type { Implementation } from '@/lib/types';

const implementations: Implementation[] = [
  {
    id: 'impl-hashmap',
    title: 'Build a HashMap',
    statement: `A hash map gives you average **O(1)** \`get\`/\`put\` by turning a key into an array index with a **hash function**, then storing key/value pairs in that slot ("bucket").

Two keys can hash to the same bucket (a **collision**). The simplest fix is **separate chaining**: each bucket holds a list of \`[key, value]\` pairs, and you scan that short list.

Build a \`HashMap\` with a fixed array of buckets and chaining:

- \`put(key, value)\` — insert or update.
- \`get(key)\` — value for key, or \`None\`/\`null\` if absent.
- \`contains(key)\` — \`True\`/\`true\` if the key is present.
- \`remove(key)\` — delete the key if present.
- \`size()\` — number of keys stored.
- \`keys()\` — a list of all keys (any order).

Keys are strings here. The whole point: the bucket scan stays short, so each op is O(1) on average.`,
    methods: [
      { name: 'put', sig: 'put(key, value)', doc: 'Insert or update key → value.' },
      { name: 'get', sig: 'get(key) -> value', doc: 'Value for key, or None/null if absent.' },
      { name: 'contains', sig: 'contains(key) -> bool', doc: 'True if key is present.' },
      { name: 'remove', sig: 'remove(key)', doc: 'Delete key if present.' },
      { name: 'size', sig: 'size() -> int', doc: 'Number of keys.' },
      { name: 'keys', sig: 'keys() -> list', doc: 'All keys, any order.' },
    ],
    className: { py: 'HashMap', js: 'HashMap' },
    compare: 'unordered',
    complexity: { time: 'O(1) average per operation', space: 'O(n)' },
    hints: [
      'Keep an array of B buckets; each bucket is a list of [key, value] pairs.',
      'Bucket index = hash(key) % B. Python has hash(); in JS, fold the characters into a number.',
      'put scans the bucket: if the key exists, overwrite; otherwise append. Track size on insert/remove.',
    ],
    starter: {
      py: `class HashMap:
    def __init__(self):
        # TODO: create B empty buckets and a size counter
        pass

    def put(self, key, value):
        # TODO: insert or update
        pass

    def get(self, key):
        # TODO: return value or None
        pass

    def contains(self, key):
        # TODO: True/False
        pass

    def remove(self, key):
        # TODO: delete if present
        pass

    def size(self):
        # TODO: number of keys
        pass

    def keys(self):
        # TODO: list of all keys
        pass
`,
      js: `class HashMap {
  constructor() {
    // TODO: create B empty buckets and a size counter
  }

  put(key, value) {
    // TODO: insert or update
  }

  get(key) {
    // TODO: return value or null
  }

  contains(key) {
    // TODO: true/false
  }

  remove(key) {
    // TODO: delete if present
  }

  size() {
    // TODO: number of keys
  }

  keys() {
    // TODO: array of all keys
  }
}
`,
    },
    reference: {
      py: `class HashMap:
    def __init__(self):
        self._n = 8
        self._buckets = [[] for _ in range(self._n)]
        self._size = 0

    def _index(self, key):
        return hash(key) % self._n

    def put(self, key, value):
        bucket = self._buckets[self._index(key)]
        for pair in bucket:
            if pair[0] == key:
                pair[1] = value
                return
        bucket.append([key, value])
        self._size += 1

    def get(self, key):
        for pair in self._buckets[self._index(key)]:
            if pair[0] == key:
                return pair[1]
        return None

    def contains(self, key):
        for pair in self._buckets[self._index(key)]:
            if pair[0] == key:
                return True
        return False

    def remove(self, key):
        bucket = self._buckets[self._index(key)]
        for i, pair in enumerate(bucket):
            if pair[0] == key:
                bucket.pop(i)
                self._size -= 1
                return

    def size(self):
        return self._size

    def keys(self):
        out = []
        for bucket in self._buckets:
            for pair in bucket:
                out.append(pair[0])
        return out
`,
      js: `class HashMap {
  constructor() {
    this._n = 8;
    this._buckets = Array.from({ length: this._n }, () => []);
    this._size = 0;
  }

  _index(key) {
    const s = String(key);
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return Math.abs(h) % this._n;
  }

  put(key, value) {
    const bucket = this._buckets[this._index(key)];
    for (const pair of bucket) {
      if (pair[0] === key) { pair[1] = value; return; }
    }
    bucket.push([key, value]);
    this._size++;
  }

  get(key) {
    for (const pair of this._buckets[this._index(key)]) {
      if (pair[0] === key) return pair[1];
    }
    return null;
  }

  contains(key) {
    for (const pair of this._buckets[this._index(key)]) {
      if (pair[0] === key) return true;
    }
    return false;
  }

  remove(key) {
    const bucket = this._buckets[this._index(key)];
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) { bucket.splice(i, 1); this._size--; return; }
    }
  }

  size() {
    return this._size;
  }

  keys() {
    const out = [];
    for (const bucket of this._buckets) {
      for (const pair of bucket) out.push(pair[0]);
    }
    return out;
  }
}
`,
    },
    tests: [
      {
        name: 'put / get / update',
        ops: [
          { call: 'put', args: ['a', 1] },
          { call: 'put', args: ['b', 2] },
          { call: 'get', args: ['a'], expect: 1 },
          { call: 'get', args: ['b'], expect: 2 },
          { call: 'size', expect: 2 },
          { call: 'put', args: ['a', 9] },
          { call: 'get', args: ['a'], expect: 9 },
          { call: 'size', expect: 2 },
        ],
      },
      {
        name: 'missing keys',
        ops: [
          { call: 'get', args: ['x'], expect: null },
          { call: 'contains', args: ['x'], expect: false },
          { call: 'put', args: ['x', 5] },
          { call: 'contains', args: ['x'], expect: true },
        ],
      },
      {
        name: 'remove',
        ops: [
          { call: 'put', args: ['k', 7] },
          { call: 'contains', args: ['k'], expect: true },
          { call: 'remove', args: ['k'] },
          { call: 'contains', args: ['k'], expect: false },
          { call: 'get', args: ['k'], expect: null },
          { call: 'size', expect: 0 },
        ],
      },
      {
        name: 'keys (any order)',
        ops: [
          { call: 'put', args: ['a', 1] },
          { call: 'put', args: ['b', 2] },
          { call: 'put', args: ['c', 3] },
          { call: 'keys', expect: ['a', 'b', 'c'] },
          { call: 'size', expect: 3 },
        ],
      },
    ],
  },
];

export default implementations;
