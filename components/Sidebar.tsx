'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DATA_STRUCTURE_TOPICS, algorithmsByFamily, allProblems } from '@/lib/curriculum';
import type { Topic } from '@/lib/types';
import { getSolved } from '@/lib/progress';

export default function Sidebar() {
  const pathname = usePathname();
  const [solvedCount, setSolvedCount] = useState(0);
  const totalProblems = allProblems().length;
  const families = algorithmsByFamily();

  useEffect(() => {
    const update = () => setSolvedCount(getSolved().size);
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
    const count = (topic.implementations?.length ?? 0) + topic.problems.length;
    return (
      <Link key={topic.slug} href={href} className={`nav-item ${pathname === href ? 'active' : ''}`}>
        <span>{topic.title}</span>
        <span className="badge">{count}</span>
      </Link>
    );
  };

  return (
    <aside className="sidebar">
      <Link href="/" className="brand">lootcode</Link>
      <div className="tagline">DSA, from first principles — in your browser.</div>

      <div className="nav-section">Progress</div>
      <span className="nav-item"><span>Problems solved</span><span className="badge">{solvedCount}/{totalProblems}</span></span>

      <div className="nav-section">Data Structures</div>
      {DATA_STRUCTURE_TOPICS.map(link)}

      <div className="nav-section">Algorithms</div>
      {families.map(({ family, topics }) => (
        <div key={family}>
          <div className="nav-subsection">{family}</div>
          {topics.map(link)}
        </div>
      ))}
    </aside>
  );
}
