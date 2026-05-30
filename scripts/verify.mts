/**
 * Build-time verification of the core invariant:
 * every problem's reference solution (Python + JS) passes its own test suite.
 * JS runs in a Node vm; Python runs via system `python3`.
 * Exits non-zero if any reference solution fails any test case.
 */
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { TOPICS } from '../lib/curriculum';
import { resultsEqual } from '../lib/compare';
import type { Problem, TestCase } from '../lib/types';

type CaseResult = { ok: boolean; value?: unknown; error?: string };

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

function runJs(refCode: string, fnName: string, tests: TestCase[]): CaseResult[] {
  const context = vm.createContext({ console });
  let fn: (...args: unknown[]) => unknown;
  try {
    fn = vm.runInContext(`${refCode}\n;(${fnName});`, context, { timeout: 5000 }) as typeof fn;
  } catch (e) {
    const msg = `compile error: ${(e as Error).message}`;
    return tests.map(() => ({ ok: false, error: msg }));
  }
  return tests.map((tc) => {
    try {
      return { ok: true, value: fn(...(clone(tc.input) as unknown[])) };
    } catch (e) {
      return { ok: false, error: (e as Error).message };
    }
  });
}

function runPy(refCode: string, fnName: string, tests: TestCase[]): CaseResult[] {
  const harness = `import json, sys
${refCode}
data = json.load(open(sys.argv[1]))
out = []
for tc in data:
    try:
        out.append({"ok": True, "value": ${fnName}(*tc)})
    except Exception as e:
        out.append({"ok": False, "error": str(e)})
print(json.dumps(out))
`;
  const dir = mkdtempSync(join(tmpdir(), 'lootcode-'));
  const pyFile = join(dir, 'harness.py');
  const dataFile = join(dir, 'data.json');
  writeFileSync(pyFile, harness);
  writeFileSync(dataFile, JSON.stringify(tests.map((t) => t.input)));
  try {
    const stdout = execFileSync('python3', [pyFile, dataFile], {
      encoding: 'utf8',
      timeout: 20000,
    });
    return JSON.parse(stdout) as CaseResult[];
  } catch (e) {
    const msg = `python error: ${(e as Error).message}`;
    return tests.map(() => ({ ok: false, error: msg }));
  }
}

function withPreamble(preamble: string | undefined, code: string): string {
  return preamble ? `${preamble}\n${code}` : code;
}

function checkLang(problem: Problem, lang: 'js' | 'py'): string[] {
  const failures: string[] = [];
  const results =
    lang === 'js'
      ? runJs(withPreamble(problem.preamble?.js, problem.reference.js), problem.functionName.js, problem.tests)
      : runPy(withPreamble(problem.preamble?.py, problem.reference.py), problem.functionName.py, problem.tests);

  problem.tests.forEach((tc, i) => {
    const r = results[i];
    const label = tc.name ?? `case ${i + 1}`;
    if (!r || !r.ok) {
      failures.push(`[${lang}] ${label}: ${r?.error ?? 'no result'}`);
      return;
    }
    if (!resultsEqual(r.value, tc.expected, problem.compare)) {
      failures.push(
        `[${lang}] ${label}: got ${JSON.stringify(r.value)}, expected ${JSON.stringify(tc.expected)}`,
      );
    }
  });
  return failures;
}

function main(): void {
  let total = 0;
  let passed = 0;
  const problemFailures: string[] = [];

  for (const topic of TOPICS) {
    for (const problem of topic.problems) {
      total += 1;
      const failures = [...checkLang(problem, 'js'), ...checkLang(problem, 'py')];
      const n = problem.tests.length;
      if (failures.length === 0) {
        passed += 1;
        console.log(`  ✓ ${topic.slug}/${problem.id}  (js ${n}/${n}, py ${n}/${n})`);
      } else {
        console.log(`  ✗ ${topic.slug}/${problem.id}`);
        for (const f of failures) console.log(`      ${f}`);
        problemFailures.push(`${topic.slug}/${problem.id}`);
      }
    }
  }

  console.log(`\nverify: ${passed}/${total} problems pass reference solutions in both languages.`);
  if (problemFailures.length > 0) {
    console.log(`FAILED: ${problemFailures.join(', ')}`);
    process.exit(1);
  }
}

main();
