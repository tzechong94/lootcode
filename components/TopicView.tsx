'use client';

import { useState } from 'react';
import type { Topic } from '@/lib/types';
import Markdown from './Markdown';
import ProblemWorkspace from './ProblemWorkspace';

export default function TopicView({ topic }: { topic: Topic }) {
  const [tab, setTab] = useState(0); // 0 = tutorial, 1..n = problems

  return (
    <div>
      <div className="topic-header">
        <h1>{topic.title}</h1>
        <p className="blurb">{topic.blurb}</p>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 0 ? 'active' : ''}`} onClick={() => setTab(0)}>
          Tutorial
        </button>
        {topic.problems.map((p, i) => (
          <button key={p.id} className={`tab ${tab === i + 1 ? 'active' : ''}`} onClick={() => setTab(i + 1)}>
            {p.title}
            <span className={`diff diff-${p.difficulty}`} style={{ color: 'var(--text-dim)' }}>
              · {p.difficulty}
            </span>
          </button>
        ))}
      </div>

      {tab === 0 ? (
        <Markdown>{topic.tutorial}</Markdown>
      ) : (
        <ProblemWorkspace problem={topic.problems[tab - 1]} />
      )}
    </div>
  );
}
