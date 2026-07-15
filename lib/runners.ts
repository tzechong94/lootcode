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
  /** Anything the solution printed while this case ran (console.log / print). */
  stdout?: string;
}

type RawResult = { ok: boolean; value?: unknown; error?: string; stdout?: string };

// Printing inside a loop is a common debugging move, so cap what we keep: an
// unbounded buffer would be shipped across postMessage and rendered as-is.
const MAX_OUT_LINES = 200;
const MAX_OUT_CHARS = 10000;
const TRUNC_NOTE = '… output truncated';

// Time limits are per test case, not per run: a solution that is fast enough for the
// small cases still passes them when one large case runs out of time.
const JS_TIMEOUT_MS = 5000;
// Pyodide interprets Python in WASM and runs several times slower than native JS,
// so a correct solution needs more headroom than the JS limit gives it.
const PY_TIMEOUT_MS = 10000;
// Code that hangs usually hangs on every case. Once this many time out in a row,
// stop paying the limit again for each remaining case.
const MAX_CONSECUTIVE_TIMEOUTS = 2;
const SKIPPED_NOTE = 'skipped (earlier cases hit the time limit)';

/**
 * Run each case under its own time limit. `runOne` resolves to null when that case ran
 * out of time, which is the only thing this driver treats as a timeout.
 */
async function runEachCase<T, R>(
  items: T[],
  runOne: (item: T) => Promise<R | null>,
  onTimeout: () => R,
  onSkipped: () => R,
): Promise<R[]> {
  const out: R[] = [];
  let streak = 0;
  for (const item of items) {
    if (streak >= MAX_CONSECUTIVE_TIMEOUTS) {
      out.push(onSkipped());
      continue;
    }
    const r = await runOne(item);
    if (r === null) {
      streak += 1;
      out.push(onTimeout());
    } else {
      streak = 0;
      out.push(r);
    }
  }
  return out;
}
const PYODIDE_VERSION = '0.26.2';
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

// ---------- JavaScript: sandboxed Web Worker ----------

// Routes console.* into a per-case buffer so the results pane can show what the
// learner printed. Outside a capture window the original console still fires, so
// logs from their top-level code keep reaching devtools instead of vanishing.
// Shared verbatim by both JS workers below.
const CAPTURE_JS = `
var __cap = null;
var __orig = {};
function __fmt(a) {
  if (typeof a === 'string') return a;
  if (a instanceof Error) return a.message;
  try { var s = JSON.stringify(a); return s === undefined ? String(a) : s; }
  catch (err) { return String(a); }
}
['log', 'info', 'warn', 'error', 'debug'].forEach(function (m) {
  __orig[m] = console[m].bind(console);
  console[m] = function () {
    if (!__cap) { __orig[m].apply(null, arguments); return; }
    if (__cap.cut) return;
    if (__cap.lines.length >= ${MAX_OUT_LINES} || __cap.chars >= ${MAX_OUT_CHARS}) {
      __cap.lines.push('${TRUNC_NOTE}');
      __cap.cut = true;
      return;
    }
    var s = Array.prototype.map.call(arguments, __fmt).join(' ');
    __cap.chars += s.length;
    __cap.lines.push(s);
  };
});
function __startCapture() { __cap = { lines: [], chars: 0, cut: false }; }
function __endCapture() { var c = __cap; __cap = null; return c ? c.lines.join('\\n') : ''; }
`;

// One case per worker: a case that never returns can then be killed on its own, and
// each case starts from clean globals rather than inheriting the previous one's.
const WORKER_SOURCE = `
${CAPTURE_JS}
self.onmessage = (e) => {
  'use strict';
  const { code, fnName, input } = e.data;
  let fn;
  try {
    fn = (new Function(code + '\\n; return ' + fnName + ';'))();
    if (typeof fn !== 'function') throw new Error('No function named ' + fnName + ' was defined.');
  } catch (err) {
    self.postMessage({ ok: false, error: 'Compile error: ' + ((err && err.message) ? err.message : String(err)) });
    return;
  }
  __startCapture();
  try {
    const value = fn.apply(null, JSON.parse(JSON.stringify(input)));
    self.postMessage({ ok: true, value: value, stdout: __endCapture() });
  } catch (err) {
    self.postMessage({ ok: false, error: (err && err.message) ? err.message : String(err), stdout: __endCapture() });
  }
};
`;

/** Resolves to null if this case exceeded the limit. */
function runJsCase(code: string, fnName: string, input: unknown[]): Promise<RawResult | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: 'application/javascript' }));
    const worker = new Worker(url);
    const done = () => {
      worker.terminate();
      URL.revokeObjectURL(url);
    };

    const timer = setTimeout(() => {
      done();
      resolve(null);
    }, JS_TIMEOUT_MS);

    worker.onmessage = (e: MessageEvent<RawResult>) => {
      clearTimeout(timer);
      done();
      resolve(e.data);
    };
    worker.onerror = (e) => {
      clearTimeout(timer);
      done();
      resolve({ ok: false, error: e.message || 'Worker error' });
    };

    worker.postMessage({ code, fnName, input });
  });
}

function runJs(code: string, fnName: string, tests: TestCase[]): Promise<RawResult[]> {
  return runEachCase<unknown[], RawResult>(
    tests.map((t) => t.input),
    (input) => runJsCase(code, fnName, input),
    () => ({ ok: false, error: `Time limit exceeded (${JS_TIMEOUT_MS}ms)` }),
    () => ({ ok: false, error: SKIPPED_NOTE }),
  );
}

// ---------- Python: Pyodide (WASM) in a sandboxed Web Worker ----------

// Pyodide runs in a worker rather than on the main thread so that an infinite loop in
// user code can be killed with terminate(). On the main thread it would wedge the UI
// thread, and the watchdog timer could never fire to stop it.
//
// The worker starts loading Pyodide on construction and announces 'ready' when done,
// so callers can wait out the ~6MB download *before* starting the execution timer.
const PY_WORKER_SOURCE = `
let pyodide = null;
const boot = (async () => {
  importScripts('${PYODIDE_BASE}pyodide.js');
  pyodide = await loadPyodide({ indexURL: '${PYODIDE_BASE}' });
})();
boot.then(
  function () { self.postMessage({ type: 'ready' }); },
  function (err) { self.postMessage({ type: 'bootfail', error: (err && err.message) ? err.message : String(err) }); }
);
self.onmessage = async (e) => {
  const { id, code, globalName, globalValue } = e.data;
  try {
    await boot;
    pyodide.globals.set(globalName, globalValue);
    const result = await pyodide.runPythonAsync(code);
    self.postMessage({ type: 'done', id: id, ok: true, result: result });
  } catch (err) {
    self.postMessage({ type: 'done', id: id, ok: false, error: (err && err.message) ? err.message : String(err) });
  }
};
`;

interface PyWorkerHandle {
  worker: Worker;
  url: string;
  /** Resolvers for in-flight jobs, keyed by job id. */
  jobs: Map<number, (r: PyRun) => void>;
}

interface PyWorkerMessage {
  type: 'ready' | 'bootfail' | 'done';
  id?: number;
  ok?: boolean;
  result?: string;
  error?: string;
}

/** The live Pyodide worker, kept warm across runs so the download happens once. */
let pyWorkerPromise: Promise<PyWorkerHandle> | null = null;
let pyJobId = 0;

/** Boot (or reuse) the Pyodide worker. Resolves only once Pyodide has finished loading. */
function bootPyWorker(): Promise<PyWorkerHandle> {
  if (pyWorkerPromise) return pyWorkerPromise;

  const promise = new Promise<PyWorkerHandle>((resolve, reject) => {
    const url = URL.createObjectURL(new Blob([PY_WORKER_SOURCE], { type: 'application/javascript' }));
    const worker = new Worker(url);
    const handle: PyWorkerHandle = { worker, url, jobs: new Map() };

    // One permanent listener that routes each result to the job that asked for it.
    // Per-job listeners would clobber each other when two runs overlap (e.g. the
    // learner navigates to another problem mid-run) and cross their results.
    worker.onmessage = (e: MessageEvent<PyWorkerMessage>) => {
      const msg = e.data;
      if (msg?.type === 'ready') {
        resolve(handle);
      } else if (msg?.type === 'bootfail') {
        worker.terminate();
        URL.revokeObjectURL(url);
        reject(new Error(msg.error ?? 'Pyodide failed to initialize.'));
      } else if (msg?.type === 'done' && msg.id !== undefined) {
        const settle = handle.jobs.get(msg.id);
        if (!settle) return; // stale result from a job we already gave up on
        handle.jobs.delete(msg.id);
        settle(
          msg.ok
            ? { ok: true, result: msg.result ?? '' }
            : { ok: false, error: msg.error ?? 'Unknown error' },
        );
      }
    };
    worker.onerror = (e) => {
      const err = e.message || 'Pyodide worker error';
      reject(new Error(err));
      killPyWorker(handle, err);
    };
  });

  pyWorkerPromise = promise;
  // A failed boot (offline, CDN down) shouldn't poison every later run.
  promise.catch(() => {
    if (pyWorkerPromise === promise) pyWorkerPromise = null;
  });
  return promise;
}

/**
 * Kill the worker outright: the only way to stop Python code that will not yield.
 * Any other in-flight job dies with it, so settle them all rather than let them hang.
 */
function killPyWorker(handle: PyWorkerHandle, reason: string, timedOut = false): void {
  handle.worker.terminate();
  URL.revokeObjectURL(handle.url);
  pyWorkerPromise = null;
  const orphaned = [...handle.jobs.values()];
  handle.jobs.clear();
  for (const settle of orphaned) settle({ ok: false, error: reason, timedOut });
}

type PyRun = { ok: true; result: string } | { ok: false; error: string; timedOut?: boolean };

/**
 * Run one Python harness to completion, or kill the worker if it exceeds the time limit.
 * Pyodide's load time is deliberately excluded from the limit: only execution is raced.
 */
async function runPyHarness(code: string, globalName: string, globalValue: string): Promise<PyRun> {
  let handle: PyWorkerHandle;
  try {
    handle = await bootPyWorker();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  const id = ++pyJobId;
  return new Promise<PyRun>((resolve) => {
    const timer = setTimeout(() => {
      // The next case pays the Pyodide load again, but that beats a wedged tab.
      killPyWorker(handle, `Time limit exceeded (${PY_TIMEOUT_MS}ms)`, true);
    }, PY_TIMEOUT_MS);

    handle.jobs.set(id, (r) => {
      clearTimeout(timer);
      resolve(r);
    });
    handle.worker.postMessage({ id, code, globalName, globalValue });
  });
}

function runPy(code: string, fnName: string, tests: TestCase[]): Promise<RawResult[]> {
  const harness = `
import json as __json
import io as __io
import contextlib as __ctx
def __clip(s):
    return s if len(s) <= ${MAX_OUT_CHARS} else s[:${MAX_OUT_CHARS}] + "\\n${TRUNC_NOTE}"
${code}
__tc = __json.loads(__lootcode_input)
__buf = __io.StringIO()
try:
    with __ctx.redirect_stdout(__buf):
        __v = ${fnName}(*__tc)
    __out = {"ok": True, "value": __v, "stdout": __clip(__buf.getvalue())}
except Exception as __e:
    __out = {"ok": False, "error": str(__e), "stdout": __clip(__buf.getvalue())}
__json.dumps(__out)
`;
  return runEachCase<unknown[], RawResult>(
    tests.map((t) => t.input),
    async (input) => {
      const run = await runPyHarness(harness, '__lootcode_input', JSON.stringify(input));
      if (!run.ok) return run.timedOut ? null : { ok: false, error: run.error };
      try {
        return JSON.parse(run.result) as RawResult;
      } catch {
        return { ok: false, error: 'Could not read harness output.' };
      }
    },
    () => ({ ok: false, error: `Time limit exceeded (${PY_TIMEOUT_MS}ms)` }),
    () => ({ ok: false, error: SKIPPED_NOTE }),
  );
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
      return {
        name,
        passed: false,
        input: tc.input,
        expected: tc.expected,
        error: r?.error ?? 'No result',
        stdout: r?.stdout || undefined,
      };
    }
    return {
      name,
      passed: resultsEqual(r.value, tc.expected, problem.compare),
      input: tc.input,
      expected: tc.expected,
      actual: r.value,
      stdout: r.stdout || undefined,
    };
  });
}

// ---------- Implement-it-yourself: op-sequence runner ----------

/** Outcome of one op in a sequence (raw value before comparison). */
type OpResult = { ok: boolean; value?: unknown; error?: string; stdout?: string };

export interface ImplCaseResult {
  name: string;
  passed: boolean;
  /** Human description of the first failing op (when not passed). */
  detail?: string;
  /** Anything the implementation printed across this case's ops. */
  stdout?: string;
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
// One op-sequence per worker, for the same reason as WORKER_SOURCE above.
const IMPL_WORKER_SOURCE = `
${CAPTURE_JS}
self.onmessage = (e) => {
  'use strict';
  const { code, className, testCase } = e.data;
  let Cls;
  try {
    Cls = (new Function(code + '\\n; return ' + className + ';'))();
    if (typeof Cls !== 'function') throw new Error('No class named ' + className + ' was defined.');
  } catch (err) {
    const msg = 'Compile error: ' + ((err && err.message) ? err.message : String(err));
    self.postMessage(testCase.ops.map(function () { return { ok: false, error: msg }; }));
    return;
  }
  const out = (function (c) {
    let inst;
    let constructed = false;
    let dead = false;
    return c.ops.map(function (op) {
      if (dead) return { ok: false, error: 'skipped (earlier op failed)' };
      __startCapture();
      try {
        var args = op.args ? JSON.parse(JSON.stringify(op.args)) : [];
        if (op.call === 'new') {
          inst = new Cls(...args);
          constructed = true;
          return { ok: true, stdout: __endCapture() };
        }
        if (!constructed) { inst = new Cls(); constructed = true; }
        if (typeof inst[op.call] !== 'function') throw new Error('no method ' + op.call);
        var v = inst[op.call](...args);
        return { ok: true, value: v, stdout: __endCapture() };
      } catch (err) {
        dead = true;
        return { ok: false, error: (err && err.message) ? err.message : String(err), stdout: __endCapture() };
      }
    });
  })(testCase);
  self.postMessage(out);
};
`;

/** Resolves to null if this op-sequence exceeded the limit. */
function runJsImplCase(code: string, className: string, testCase: DsTestCase): Promise<OpResult[] | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(new Blob([IMPL_WORKER_SOURCE], { type: 'application/javascript' }));
    const worker = new Worker(url);
    const done = () => {
      worker.terminate();
      URL.revokeObjectURL(url);
    };

    const timer = setTimeout(() => {
      done();
      resolve(null);
    }, JS_TIMEOUT_MS);

    worker.onmessage = (e: MessageEvent<OpResult[]>) => {
      clearTimeout(timer);
      done();
      resolve(e.data);
    };
    worker.onerror = (e) => {
      clearTimeout(timer);
      done();
      resolve(testCase.ops.map(() => ({ ok: false, error: e.message || 'Worker error' })));
    };

    worker.postMessage({ code, className, testCase });
  });
}

function runJsImpl(code: string, className: string, cases: DsTestCase[]): Promise<OpResult[][]> {
  return runEachCase<DsTestCase, OpResult[]>(
    cases,
    (c) => runJsImplCase(code, className, c),
    () => [{ ok: false, error: `Time limit exceeded (${JS_TIMEOUT_MS}ms)` }],
    () => [{ ok: false, error: SKIPPED_NOTE }],
  );
}

function runPyImpl(code: string, className: string, cases: DsTestCase[]): Promise<OpResult[][]> {
  const harness = `
import json as __json
import io as __io
import contextlib as __ctx
def __clip(s):
    return s if len(s) <= ${MAX_OUT_CHARS} else s[:${MAX_OUT_CHARS}] + "\\n${TRUNC_NOTE}"
${code}
__c = __json.loads(__lootcode_case)
__inst = None
__constructed = False
__dead = False
__ops = []
for __op in __c["ops"]:
    if __dead:
        __ops.append({"ok": False, "error": "skipped (earlier op failed)"})
        continue
    __buf = __io.StringIO()
    try:
        __args = __op.get("args", []) or []
        with __ctx.redirect_stdout(__buf):
            if __op["call"] == "new":
                __inst = ${className}(*__args)
                __constructed = True
                __ops.append({"ok": True, "stdout": __clip(__buf.getvalue())})
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
        __ops.append({"ok": True, "value": __v, "stdout": __clip(__buf.getvalue())})
    except Exception as __e:
        __dead = True
        __ops.append({"ok": False, "error": str(__e), "stdout": __clip(__buf.getvalue())})
__json.dumps(__ops)
`;
  return runEachCase<DsTestCase, OpResult[]>(
    cases,
    async (c) => {
      const run = await runPyHarness(harness, '__lootcode_case', JSON.stringify(c));
      if (!run.ok) return run.timedOut ? null : c.ops.map(() => ({ ok: false, error: run.error }));
      try {
        return JSON.parse(run.result) as OpResult[];
      } catch {
        return c.ops.map(() => ({ ok: false, error: 'Could not read harness output.' }));
      }
    },
    () => [{ ok: false, error: `Time limit exceeded (${PY_TIMEOUT_MS}ms)` }],
    () => [{ ok: false, error: SKIPPED_NOTE }],
  );
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
    // Ops run against one shared instance, so report the case's prints as one stream.
    const stdout = ops.map((o) => o?.stdout).filter(Boolean).join('\n') || undefined;
    for (let j = 0; j < tc.ops.length; j++) {
      const op = tc.ops[j];
      const r = ops[j];
      if (!r || !r.ok) {
        return { name, passed: false, detail: `${describeOp(op)} → ${r?.error ?? 'no result'}`, stdout };
      }
      if (op.expect !== undefined) {
        if (!resultsEqual(r.value, op.expect, impl.compare)) {
          return {
            name,
            passed: false,
            detail: `${describeOp(op)} → expected ${JSON.stringify(op.expect)}, got ${JSON.stringify(r.value)}`,
            stdout,
          };
        }
      }
    }
    return { name, passed: true, stdout };
  });
}
