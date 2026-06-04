'use client';

import { resultsEqual } from './compare';
import type { DsOp, DsTestCase, Implementation, Lang, Problem, TestCase } from './types';

export interface RunCaseResult {
  name: string;
  passed: boolean;
  input: unknown[];
  expected: unknown;
  actual?: unknown;
  error?: string;
}

type RawResult = { ok: boolean; value?: unknown; error?: string };

const JS_TIMEOUT_MS = 5000;
const PYODIDE_VERSION = '0.26.2';
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

// ---------- JavaScript: sandboxed Web Worker ----------

const WORKER_SOURCE = `
self.onmessage = (e) => {
  'use strict';
  const { code, fnName, inputs } = e.data;
  let results = [];
  try {
    const fn = (new Function(code + '\\n; return ' + fnName + ';'))();
    if (typeof fn !== 'function') throw new Error('No function named ' + fnName + ' was defined.');
    for (const input of inputs) {
      try {
        const value = fn.apply(null, JSON.parse(JSON.stringify(input)));
        results.push({ ok: true, value: value });
      } catch (err) {
        results.push({ ok: false, error: (err && err.message) ? err.message : String(err) });
      }
    }
  } catch (err) {
    const msg = 'Compile error: ' + ((err && err.message) ? err.message : String(err));
    results = inputs.map(function () { return { ok: false, error: msg }; });
  }
  self.postMessage(results);
};
`;

function runJs(code: string, fnName: string, tests: TestCase[]): Promise<RawResult[]> {
  return new Promise((resolve) => {
    const blob = new Blob([WORKER_SOURCE], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);
    const inputs = tests.map((t) => t.input);

    const timer = setTimeout(() => {
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(tests.map(() => ({ ok: false, error: `Time limit exceeded (${JS_TIMEOUT_MS}ms)` })));
    }, JS_TIMEOUT_MS);

    worker.onmessage = (e: MessageEvent<RawResult[]>) => {
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(e.data);
    };
    worker.onerror = (e) => {
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(tests.map(() => ({ ok: false, error: e.message || 'Worker error' })));
    };

    worker.postMessage({ code, fnName, inputs });
  });
}

// ---------- Python: Pyodide (WASM) ----------

interface PyodideInstance {
  runPythonAsync: (code: string) => Promise<unknown>;
  globals: { set: (name: string, value: unknown) => void };
}

let pyodidePromise: Promise<PyodideInstance> | null = null;

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideInstance>;
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Pyodide.'));
    document.head.appendChild(script);
  });
}

export function getPyodide(): Promise<PyodideInstance> {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      await loadScript(`${PYODIDE_BASE}pyodide.js`);
      if (!window.loadPyodide) throw new Error('Pyodide failed to initialize.');
      return window.loadPyodide({ indexURL: PYODIDE_BASE });
    })();
  }
  return pyodidePromise;
}

async function runPy(code: string, fnName: string, tests: TestCase[]): Promise<RawResult[]> {
  let pyodide: PyodideInstance;
  try {
    pyodide = await getPyodide();
  } catch (e) {
    return tests.map(() => ({ ok: false, error: (e as Error).message }));
  }
  pyodide.globals.set('__lootcode_inputs', JSON.stringify(tests.map((t) => t.input)));
  const harness = `
import json as __json
${code}
__data = __json.loads(__lootcode_inputs)
__out = []
for __tc in __data:
    try:
        __out.append({"ok": True, "value": ${fnName}(*__tc)})
    except Exception as __e:
        __out.append({"ok": False, "error": str(__e)})
__json.dumps(__out)
`;
  try {
    const raw = (await pyodide.runPythonAsync(harness)) as string;
    return JSON.parse(raw) as RawResult[];
  } catch (e) {
    return tests.map(() => ({ ok: false, error: (e as Error).message }));
  }
}

// ---------- Unified entry point ----------

function withPreamble(preamble: string | undefined, code: string): string {
  return preamble ? `${preamble}\n${code}` : code;
}

export async function runProblem(
  problem: Problem,
  lang: Lang,
  code: string,
): Promise<RunCaseResult[]> {
  const raw =
    lang === 'js'
      ? await runJs(withPreamble(problem.preamble?.js, code), problem.functionName.js, problem.tests)
      : await runPy(withPreamble(problem.preamble?.py, code), problem.functionName.py, problem.tests);

  return problem.tests.map((tc, i) => {
    const r = raw[i];
    const name = tc.name ?? `Case ${i + 1}`;
    if (!r || !r.ok) {
      return { name, passed: false, input: tc.input, expected: tc.expected, error: r?.error ?? 'No result' };
    }
    return {
      name,
      passed: resultsEqual(r.value, tc.expected, problem.compare),
      input: tc.input,
      expected: tc.expected,
      actual: r.value,
    };
  });
}

// ---------- Implement-it-yourself: op-sequence runner ----------

/** Outcome of one op in a sequence (raw value before comparison). */
type OpResult = { ok: boolean; value?: unknown; error?: string };

export interface ImplCaseResult {
  name: string;
  passed: boolean;
  /** Human description of the first failing op (when not passed). */
  detail?: string;
}

function describeOp(op: DsOp): string {
  const args = (op.args ?? []).map((a) => JSON.stringify(a)).join(', ');
  return op.call === 'new' ? `new(${args})` : `${op.call}(${args})`;
}

/** Rewrite each op's `call` to the language-specific method name (the `'new'` op is left alone). */
function resolveAliases(impl: Implementation, lang: Lang): DsTestCase[] {
  const alias = impl.methodAliases?.[lang];
  if (!alias) return impl.tests;
  return impl.tests.map((tc) => ({
    name: tc.name,
    ops: tc.ops.map((op) => (op.call === 'new' ? op : { ...op, call: alias[op.call] ?? op.call })),
  }));
}

// JS worker: build the class, then run each test case's op sequence on a fresh instance.
const IMPL_WORKER_SOURCE = `
self.onmessage = (e) => {
  'use strict';
  const { code, className, cases } = e.data;
  let Cls;
  try {
    Cls = (new Function(code + '\\n; return ' + className + ';'))();
    if (typeof Cls !== 'function') throw new Error('No class named ' + className + ' was defined.');
  } catch (err) {
    const msg = 'Compile error: ' + ((err && err.message) ? err.message : String(err));
    self.postMessage(cases.map(function (c) { return c.ops.map(function () { return { ok: false, error: msg }; }); }));
    return;
  }
  const out = cases.map(function (c) {
    let inst;
    let constructed = false;
    let dead = false;
    return c.ops.map(function (op) {
      if (dead) return { ok: false, error: 'skipped (earlier op failed)' };
      try {
        var args = op.args ? JSON.parse(JSON.stringify(op.args)) : [];
        if (op.call === 'new') {
          inst = new Cls(...args);
          constructed = true;
          return { ok: true };
        }
        if (!constructed) { inst = new Cls(); constructed = true; }
        if (typeof inst[op.call] !== 'function') throw new Error('no method ' + op.call);
        var v = inst[op.call](...args);
        return { ok: true, value: v };
      } catch (err) {
        dead = true;
        return { ok: false, error: (err && err.message) ? err.message : String(err) };
      }
    });
  });
  self.postMessage(out);
};
`;

function runJsImpl(code: string, className: string, cases: DsTestCase[]): Promise<OpResult[][]> {
  return new Promise((resolve) => {
    const blob = new Blob([IMPL_WORKER_SOURCE], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);

    const fail = (msg: string) => cases.map((c) => c.ops.map(() => ({ ok: false, error: msg })));
    const timer = setTimeout(() => {
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(fail(`Time limit exceeded (${JS_TIMEOUT_MS}ms)`));
    }, JS_TIMEOUT_MS);

    worker.onmessage = (e: MessageEvent<OpResult[][]>) => {
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(e.data);
    };
    worker.onerror = (e) => {
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(fail(e.message || 'Worker error'));
    };

    worker.postMessage({ code, className, cases });
  });
}

async function runPyImpl(code: string, className: string, cases: DsTestCase[]): Promise<OpResult[][]> {
  const fail = (msg: string) => cases.map((c) => c.ops.map(() => ({ ok: false, error: msg })));
  let pyodide: PyodideInstance;
  try {
    pyodide = await getPyodide();
  } catch (e) {
    return fail((e as Error).message);
  }
  pyodide.globals.set('__lootcode_cases', JSON.stringify(cases));
  const harness = `
import json as __json
${code}
__cases = __json.loads(__lootcode_cases)
__out = []
for __c in __cases:
    __inst = None
    __constructed = False
    __dead = False
    __ops = []
    for __op in __c["ops"]:
        if __dead:
            __ops.append({"ok": False, "error": "skipped (earlier op failed)"})
            continue
        try:
            __args = __op.get("args", []) or []
            if __op["call"] == "new":
                __inst = ${className}(*__args)
                __constructed = True
                __ops.append({"ok": True})
                continue
            if not __constructed:
                __inst = ${className}()
                __constructed = True
            __m = getattr(__inst, __op["call"], None)
            if not callable(__m):
                raise Exception("no method " + __op["call"])
            __v = __m(*__args)
            try:
                __json.dumps(__v)
            except TypeError:
                __v = str(__v)
            __ops.append({"ok": True, "value": __v})
        except Exception as __e:
            __dead = True
            __ops.append({"ok": False, "error": str(__e)})
    __out.append(__ops)
__json.dumps(__out)
`;
  try {
    const raw = (await pyodide.runPythonAsync(harness)) as string;
    return JSON.parse(raw) as OpResult[][];
  } catch (e) {
    return fail((e as Error).message);
  }
}

export async function runImplementation(
  impl: Implementation,
  lang: Lang,
  code: string,
): Promise<ImplCaseResult[]> {
  const fullCode = withPreamble(impl.preamble?.[lang], code);
  const className = impl.className[lang];
  const cases = resolveAliases(impl, lang);
  const raw =
    lang === 'js'
      ? await runJsImpl(fullCode, className, cases)
      : await runPyImpl(fullCode, className, cases);

  return impl.tests.map((tc, i) => {
    const ops = raw[i] ?? [];
    const name = tc.name ?? `Case ${i + 1}`;
    for (let j = 0; j < tc.ops.length; j++) {
      const op = tc.ops[j];
      const r = ops[j];
      if (!r || !r.ok) {
        return { name, passed: false, detail: `${describeOp(op)} → ${r?.error ?? 'no result'}` };
      }
      if (op.expect !== undefined) {
        if (!resultsEqual(r.value, op.expect, impl.compare)) {
          return {
            name,
            passed: false,
            detail: `${describeOp(op)} → expected ${JSON.stringify(op.expect)}, got ${JSON.stringify(r.value)}`,
          };
        }
      }
    }
    return { name, passed: true };
  });
}
