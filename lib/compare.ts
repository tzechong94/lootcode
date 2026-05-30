import type { CompareMode } from './types';

/** Recursively sort arrays so order-insensitive results compare equal. */
function sortDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    const mapped = value.map(sortDeep);
    return mapped
      .slice()
      .sort((a, b) => (JSON.stringify(a) < JSON.stringify(b) ? -1 : 1));
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      out[key] = sortDeep((value as Record<string, unknown>)[key]);
    }
    return out;
  }
  return value;
}

function sortOuter(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value
      .slice()
      .sort((a, b) => (JSON.stringify(a) < JSON.stringify(b) ? -1 : 1));
  }
  return value;
}

function normalize(value: unknown, mode: CompareMode): unknown {
  if (mode === 'unordered') return sortDeep(value);
  if (mode === 'unorderedOuter') return sortOuter(value);
  return value;
}

/** Compare an actual result against expected under the given compare mode. */
export function resultsEqual(
  actual: unknown,
  expected: unknown,
  mode: CompareMode = 'deep',
): boolean {
  return (
    JSON.stringify(normalize(actual, mode)) ===
    JSON.stringify(normalize(expected, mode))
  );
}
