'use client';

import { useState } from 'react';
import type { Topic } from '@/lib/types';
import Markdown from './Markdown';
import TutorialBlocks from './TutorialBlocks';
import ProblemWorkspace from './ProblemWorkspace';
import ImplementWorkspace from './ImplementWorkspace';

export default function TopicView({ topic }: { topic: Topic }) {
  const impls = topic.implementations ?? [];
  // Tab layout: 0 = tutorial, [1 .. impls.length] = implementations, rest = problems.
  const [tab, setTab] = useState(0);
  const firstProblemTab = 1 + impls.length;

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
        {impls.map((im, i) => (
          <button key={im.id} className={`tab ${tab === i + 1 ? 'active' : ''}`} onClick={() => setTab(i + 1)}>
            {im.title}
            <span className="diff diff-build" style={{ color: 'var(--text-dim)' }}>· Build</span>
          </button>
        ))}
        {topic.problems.map((p, i) => (
          <button
            key={p.id}
            className={`tab ${tab === firstProblemTab + i ? 'active' : ''}`}
            onClick={() => setTab(firstProblemTab + i)}
          >
            {p.title}
            <span className={`diff diff-${p.difficulty}`} style={{ color: 'var(--text-dim)' }}>
              · {p.difficulty}
            </span>
          </button>
        ))}
      </div>

      {tab === 0 ? (
        topic.blocks ? (
          <TutorialBlocks blocks={topic.blocks} />
        ) : (
          <Markdown>{topic.tutorial}</Markdown>
        )
      ) : tab < firstProblemTab ? (
        <ImplementWorkspace impl={impls[tab - 1]} />
      ) : (
        <ProblemWorkspace problem={topic.problems[tab - firstProblemTab]} />
      )}
    </div>
  );
}
