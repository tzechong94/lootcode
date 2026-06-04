'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Implementation, Lang } from '@/lib/types';
import { runImplementation, type ImplCaseResult } from '@/lib/runners';
import { clearDraft, isSolved, loadDraft, markSolved, saveDraft } from '@/lib/progress';
import CodeEditor from './CodeEditor';
import Markdown from './Markdown';

export default function ImplementWorkspace({ impl }: { impl: Implementation }) {
  const [lang, setLang] = useState<Lang>('py');
  const [code, setCode] = useState(impl.starter.py);
  const [results, setResults] = useState<ImplCaseResult[] | null>(null);
  const [running, setRunning] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    const draft = loadDraft(impl.id, lang);
    setCode(draft ?? impl.starter[lang]);
    setResults(null);
    setShowSolution(false);
  }, [impl.id, lang, impl.starter]);

  useEffect(() => {
    setSolved(isSolved(impl.id));
  }, [impl.id]);

  const onChange = (v: string) => {
    setCode(v);
    saveDraft(impl.id, lang, v);
  };

  const reset = () => {
    clearDraft(impl.id, lang);
    setCode(impl.starter[lang]);
    setResults(null);
  };

  const run = async () => {
    setRunning(true);
    setResults(null);
    try {
      const r = await runImplementation(impl, lang, code);
      setResults(r);
      if (r.length > 0 && r.every((c) => c.passed)) {
        markSolved(impl.id);
        setSolved(true);
      }
    } finally {
      setRunning(false);
    }
  };

  const summary = useMemo(() => {
    if (!results) return null;
    const passed = results.filter((c) => c.passed).length;
    return { passed, total: results.length, allPass: passed === results.length };
  }, [results]);

  return (
    <div className="workspace">
      <div className="problem-statement">
        <h2>{impl.title}</h2>
        <div className="meta-row">
          <span className="diff-pill diff-build">Implement</span>
          {solved && <span className="solved-check">✓ Built</span>}
        </div>

        <Markdown>{impl.statement}</Markdown>

        {impl.methods && impl.methods.length > 0 && (
          <table className="method-table">
            <tbody>
              {impl.methods.map((m) => (
                <tr key={m.name}>
                  <td><code>{m.sig}</code></td>
                  <td>{m.doc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {impl.hints && impl.hints.length > 0 && (
          <details className="disclosure">
            <summary>Hints ({impl.hints.length})</summary>
            <ol>
              {impl.hints.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ol>
          </details>
        )}

        {impl.complexity && (
          <details className="disclosure">
            <summary>Target complexity</summary>
            <p className="note">
              Time {impl.complexity.time} · Space {impl.complexity.space}
            </p>
          </details>
        )}

        <details className="disclosure" open={showSolution} onToggle={(e) => setShowSolution((e.target as HTMLDetailsElement).open)}>
          <summary>Show reference implementation ({lang === 'py' ? 'Python' : 'JavaScript'})</summary>
          <pre><code>{impl.reference[lang]}</code></pre>
        </details>
      </div>

      <div className="editor-col">
        <div className="editor-toolbar">
          <div className="lang-switch">
            <button className={lang === 'py' ? 'active' : ''} onClick={() => setLang('py')}>Python</button>
            <button className={lang === 'js' ? 'active' : ''} onClick={() => setLang('js')}>JavaScript</button>
          </div>
          <div className="spacer" />
          <button className="btn" onClick={reset}>Reset</button>
          <button className="btn btn-run" onClick={run} disabled={running}>
            {running ? 'Running…' : '▶ Run Checks'}
          </button>
        </div>

        <CodeEditor lang={lang} value={code} onChange={onChange} />

        {lang === 'py' && running && (
          <div className="pyodide-note">First Python run downloads Pyodide (~6MB) — give it a few seconds.</div>
        )}

        <div className="results">
          {summary && (
            <div className={`results-summary ${summary.allPass ? 'pass' : 'fail'}`}>
              {summary.allPass ? `✓ All checks passed (${summary.passed}/${summary.total})` : `${summary.passed}/${summary.total} checks passed`}
            </div>
          )}
          {results?.map((c, i) => (
            <div key={i} className={`case ${c.passed ? 'pass' : 'fail'}`}>
              <div className="case-head">
                <span>{c.name}</span>
                <span>{c.passed ? '✓' : '✗'}</span>
              </div>
              {!c.passed && c.detail && (
                <div className="kv">{c.detail}</div>
              )}
            </div>
          ))}
          {!results && !running && <div className="note">Run the checks to test your implementation against a sequence of operations.</div>}
        </div>
      </div>
    </div>
  );
}
