'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DATA_STRUCTURE_TOPICS, CSPRIMER_TOPICS, algorithmsByFamily, totalExercises } from '@/lib/curriculum';
import type { Topic } from '@/lib/types';
import { getSolved } from '@/lib/progress';

export default function Sidebar() {
  const pathname = usePathname();
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const total = totalExercises();
  const families = algorithmsByFamily();

  useEffect(() => {
    const update = () => setSolved(getSolved());
    update();
    window.addEventListener('lootcode:progress', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('lootcode:progress', update);
      window.removeEventListener('storage', update);
    };
  }, []);

  const link = (topic: Topic) => {
    const href = `/topics/${topic.slug}`;
    // Same definition as totalExercises(), so the per-topic counts sum to the total above.
    const ids = [...(topic.implementations ?? []).map((i) => i.id), ...topic.problems.map((p) => p.id)];
    const done = ids.filter((id) => solved.has(id)).length;
    return (
      <Link key={topic.slug} href={href} className={`nav-item ${pathname === href ? 'active' : ''}`}>
        <span>{topic.title}</span>
        <span className={`badge ${done === ids.length ? 'badge-done' : ''}`}>{done}/{ids.length}</span>
      </Link>
    );
  };

  return (
    <aside className="sidebar">
      <Link href="/" className="brand">lootcode</Link>
      <div className="tagline">DSA, from first principles — in your browser.</div>

      <div className="nav-section">Progress</div>
      <span className="nav-item"><span>Exercises done</span><span className="badge">{solved.size}/{total}</span></span>

      <div className="nav-section">Data Structures</div>
      {DATA_STRUCTURE_TOPICS.map(link)}

      <div className="nav-section">Algorithms</div>
      {families.map(({ family, topics }) => (
        <div key={family}>
          <div className="nav-subsection">{family}</div>
          {topics.map(link)}
        </div>
      ))}

      <div className="nav-section">CS Primer</div>
      {CSPRIMER_TOPICS.map(link)}
    </aside>
  );
}
