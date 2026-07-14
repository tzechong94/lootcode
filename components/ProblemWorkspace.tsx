'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Lang, Problem } from '@/lib/types';
import { runProblem, type RunCaseResult } from '@/lib/runners';
import { clearDraft, isSolved, loadDraft, markSolved, saveDraft } from '@/lib/progress';
import CodeEditor from './CodeEditor';
import Markdown from './Markdown';

export default function ProblemWorkspace({ problem }: { problem: Problem }) {
  const [lang, setLang] = useState<Lang>('py');
  const [code, setCode] = useState(problem.starter.py);
  const [results, setResults] = useState<RunCaseResult[] | null>(null);
  const [running, setRunning] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [solved, setSolved] = useState(false);
  /** Indices of cases whose details are open. Failures start open; any case can be toggled. */
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  // Load draft (or starter) whenever the problem or language changes.
  useEffect(() => {
    const draft = loadDraft(problem.id, lang);
    setCode(draft ?? problem.starter[lang]);
    setResults(null);
    setShowSolution(false);
  }, [problem.id, lang, problem.starter]);

  useEffect(() => {
    setSolved(isSolved(problem.id));
  }, [problem.id]);

  const onChange = (v: string) => {
    setCode(v);
    saveDraft(problem.id, lang, v);
  };

  const reset = () => {
    clearDraft(problem.id, lang);
    setCode(problem.starter[lang]);
    setResults(null);
  };

  const toggleCase = (i: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const run = async () => {
    setRunning(true);
    setResults(null);
    try {
      const r = await runProblem(problem, lang, code);
      setResults(r);
      setExpanded(new Set(r.flatMap((c, i) => (c.passed ? [] : [i]))));
      if (r.length > 0 && r.every((c) => c.passed)) {
        markSolved(problem.id);
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
        <h2>{problem.title}</h2>
        <div className="meta-row">
          <span className={`diff-pill diff-${problem.difficulty}`}>{problem.difficulty}</span>
          {solved && <span className="solved-check">✓ Solved</span>}
        </div>

        <Markdown>{problem.statement}</Markdown>

        {problem.examples?.map((ex, i) => (
          <div className="example" key={i}>
            <span className="lbl">Input: </span>{ex.input}{'\n'}
            <span className="lbl">Output: </span>{ex.output}
            {ex.explanation ? `\n${ex.explanation}` : ''}
          </div>
        ))}

        {problem.constraints && (
          <>
            <p className="lbl note">Constraints:</p>
            <ul className="constraints">
              {problem.constraints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </>
        )}

        {problem.hints && problem.hints.length > 0 && (
          <details className="disclosure">
            <summary>Hints ({problem.hints.length})</summary>
            <ol>
              {problem.hints.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ol>
          </details>
        )}

        {problem.complexity && (
          <details className="disclosure">
            <summary>Target complexity</summary>
            <p className="note">
              Time {problem.complexity.time} · Space {problem.complexity.space}
            </p>
          </details>
        )}

        <details className="disclosure" open={showSolution} onToggle={(e) => setShowSolution((e.target as HTMLDetailsElement).open)}>
          <summary>Show reference solution ({lang === 'py' ? 'Python' : 'JavaScript'})</summary>
          <pre><code>{problem.reference[lang]}</code></pre>
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
            {running ? 'Running…' : '▶ Run Tests'}
          </button>
        </div>

        <CodeEditor lang={lang} value={code} onChange={onChange} />

        {lang === 'py' && running && (
          <div className="pyodide-note">First Python run downloads Pyodide (~6MB) — give it a few seconds.</div>
        )}

        <div className="results">
          {summary && (
            <div className={`results-summary ${summary.allPass ? 'pass' : 'fail'}`}>
              {summary.allPass ? `✓ All tests passed (${summary.passed}/${summary.total})` : `${summary.passed}/${summary.total} tests passed`}
            </div>
          )}
          {results?.map((c, i) => (
            <div key={i} className={`case ${c.passed ? 'pass' : 'fail'}`}>
              <button className="case-head" onClick={() => toggleCase(i)} aria-expanded={expanded.has(i)}>
                <span>
                  <span className="case-caret">{expanded.has(i) ? '▾' : '▸'}</span> {c.name}
                </span>
                <span>{c.passed ? '✓' : '✗'}</span>
              </button>
              {expanded.has(i) && (
                <div className="kv">
                  <b>input:</b> {JSON.stringify(c.input)}{'\n'}
                  {c.error ? (
                    <><b>error:</b> {c.error}</>
                  ) : (
                    <>
                      <b>expected:</b> {JSON.stringify(c.expected)}{'\n'}
                      <b>got:</b> {JSON.stringify(c.actual)}
                    </>
                  )}
                  {c.stdout && (
                    <>
                      {'\n'}<b>output:</b>{'\n'}
                      <span className="case-stdout">{c.stdout}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
          {!results && !running && <div className="note">Run the tests to check your solution.</div>}
        </div>
      </div>
    </div>
  );
}
