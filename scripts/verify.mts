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
import type { DsOp, DsTestCase, Implementation, Lang, Problem, TestCase } from '../lib/types';

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

// ---------- Implement-it-yourself: op-sequence reference checks ----------

function describeOp(op: DsOp): string {
  const args = (op.args ?? []).map((a) => JSON.stringify(a)).join(', ');
  return op.call === 'new' ? `new(${args})` : `${op.call}(${args})`;
}

function resolveAliases(impl: Implementation, lang: Lang): DsTestCase[] {
  const alias = impl.methodAliases?.[lang];
  if (!alias) return impl.tests;
  return impl.tests.map((tc) => ({
    name: tc.name,
    ops: tc.ops.map((op) => (op.call === 'new' ? op : { ...op, call: alias[op.call] ?? op.call })),
  }));
}

function runJsImpl(code: string, className: string, cases: DsTestCase[]): CaseResult[][] {
  const context = vm.createContext({ console });
  let Cls: new (...args: unknown[]) => Record<string, (...a: unknown[]) => unknown>;
  try {
    Cls = vm.runInContext(`${code}\n;(${className});`, context, { timeout: 5000 }) as typeof Cls;
  } catch (e) {
    const msg = `compile error: ${(e as Error).message}`;
    return cases.map((c) => c.ops.map(() => ({ ok: false, error: msg })));
  }
  return cases.map((c) => {
    let inst: Record<string, (...a: unknown[]) => unknown> | undefined;
    let constructed = false;
    let dead = false;
    return c.ops.map((op) => {
      if (dead) return { ok: false, error: 'skipped (earlier op failed)' };
      try {
        const args = (op.args ? clone(op.args) : []) as unknown[];
        if (op.call === 'new') {
          inst = new Cls(...args);
          constructed = true;
          return { ok: true };
        }
        if (!constructed) {
          inst = new Cls();
          constructed = true;
        }
        if (typeof inst![op.call] !== 'function') throw new Error(`no method ${op.call}`);
        return { ok: true, value: inst![op.call](...args) };
      } catch (e) {
        dead = true;
        return { ok: false, error: (e as Error).message };
      }
    });
  });
}

function runPyImpl(code: string, className: string, cases: DsTestCase[]): CaseResult[][] {
  const harness = `import json, sys
${code}
cases = json.load(open(sys.argv[1]))
out = []
for c in cases:
    inst = None
    constructed = False
    dead = False
    ops = []
    for op in c["ops"]:
        if dead:
            ops.append({"ok": False, "error": "skipped (earlier op failed)"})
            continue
        try:
            args = op.get("args", []) or []
            if op["call"] == "new":
                inst = ${className}(*args)
                constructed = True
                ops.append({"ok": True})
                continue
            if not constructed:
                inst = ${className}()
                constructed = True
            m = getattr(inst, op["call"], None)
            if not callable(m):
                raise Exception("no method " + op["call"])
            v = m(*args)
            try:
                json.dumps(v)
            except TypeError:
                v = str(v)
            ops.append({"ok": True, "value": v})
        except Exception as e:
            dead = True
            ops.append({"ok": False, "error": str(e)})
    out.append(ops)
print(json.dumps(out))
`;
  const dir = mkdtempSync(join(tmpdir(), 'lootcode-'));
  const pyFile = join(dir, 'harness.py');
  const dataFile = join(dir, 'data.json');
  writeFileSync(pyFile, harness);
  writeFileSync(dataFile, JSON.stringify(cases));
  try {
    const stdout = execFileSync('python3', [pyFile, dataFile], { encoding: 'utf8', timeout: 20000 });
    return JSON.parse(stdout) as CaseResult[][];
  } catch (e) {
    const msg = `python error: ${(e as Error).message}`;
    return cases.map((c) => c.ops.map(() => ({ ok: false, error: msg })));
  }
}

function checkImplLang(impl: Implementation, lang: 'js' | 'py'): string[] {
  const code = withPreamble(impl.preamble?.[lang], impl.reference[lang]);
  const className = impl.className[lang];
  const cases = resolveAliases(impl, lang);
  const raw = lang === 'js' ? runJsImpl(code, className, cases) : runPyImpl(code, className, cases);

  const failures: string[] = [];
  impl.tests.forEach((tc, i) => {
    const ops = raw[i] ?? [];
    const label = tc.name ?? `case ${i + 1}`;
    for (let j = 0; j < tc.ops.length; j++) {
      const op = tc.ops[j];
      const r = ops[j];
      if (!r || !r.ok) {
        failures.push(`[${lang}] ${label}: ${describeOp(op)} → ${r?.error ?? 'no result'}`);
        return;
      }
      if (op.expect !== undefined && !resultsEqual(r.value, op.expect, impl.compare)) {
        failures.push(
          `[${lang}] ${label}: ${describeOp(op)} → got ${JSON.stringify(r.value)}, expected ${JSON.stringify(op.expect)}`,
        );
        return;
      }
    }
  });
  return failures;
}

function main(): void {
  let total = 0;
  let passed = 0;
  const problemFailures: string[] = [];

  for (const topic of TOPICS) {
    for (const impl of topic.implementations ?? []) {
      total += 1;
      const failures = [...checkImplLang(impl, 'js'), ...checkImplLang(impl, 'py')];
      const n = impl.tests.length;
      if (failures.length === 0) {
        passed += 1;
        console.log(`  ✓ ${topic.slug}/${impl.id}  [impl]  (js ${n}/${n}, py ${n}/${n})`);
      } else {
        console.log(`  ✗ ${topic.slug}/${impl.id}  [impl]`);
        for (const f of failures) console.log(`      ${f}`);
        problemFailures.push(`${topic.slug}/${impl.id}`);
      }
    }
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

  console.log(`\nverify: ${passed}/${total} exercises pass reference solutions in both languages.`);
  if (problemFailures.length > 0) {
    console.log(`FAILED: ${problemFailures.join(', ')}`);
    process.exit(1);
  }
}

main();
