'use client';

import dynamic from 'next/dynamic';
import type { Lang } from '@/lib/types';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div className="editor-loading">Loading editor…</div>,
});

const MONACO_LANG: Record<Lang, string> = { py: 'python', js: 'javascript' };

export default function CodeEditor({
  lang,
  value,
  onChange,
}: {
  lang: Lang;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="editor-box">
      <MonacoEditor
        height="380px"
        theme="vs-dark"
        language={MONACO_LANG[lang]}
        value={value}
        onChange={(v) => onChange(v ?? '')}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          scrollBeyondLastLine: false,
          tabSize: lang === 'py' ? 4 : 2,
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
          // The suggest/hover popups are rendered inside the editor, so `.editor-box`'s
          // `overflow: hidden` clips them to a sliver. This re-parents them so they can
          // escape the box.
          fixedOverflowWidgets: true,
        }}
      />
    </div>
  );
}
