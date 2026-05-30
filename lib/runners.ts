'use client';

import { resultsEqual } from './compare';
import type { Lang, Problem, TestCase } from './types';

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

export async function runProblem(
  problem: Problem,
  lang: Lang,
  code: string,
): Promise<RunCaseResult[]> {
  const raw =
    lang === 'js'
      ? await runJs(code, problem.functionName.js, problem.tests)
      : await runPy(code, problem.functionName.py, problem.tests);

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
