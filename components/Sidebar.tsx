'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ROADMAP, TOPICS, allProblems } from '@/lib/curriculum';
import { getSolved } from '@/lib/progress';

const builtByTitle = new Map(TOPICS.map((t) => [t.title, t]));

export default function Sidebar() {
  const pathname = usePathname();
  const [solvedCount, setSolvedCount] = useState(0);
  const totalProblems = allProblems().length;

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

  return (
    <aside className="sidebar">
      <Link href="/" className="brand">lootcode</Link>
      <div className="tagline">DSA, from first principles — in your browser.</div>

      <div className="nav-section">Progress</div>
      <span className="nav-item"><span>Problems solved</span><span className="badge">{solvedCount}/{totalProblems}</span></span>

      <div className="nav-section">Curriculum</div>
      {ROADMAP.map((title, i) => {
        const topic = builtByTitle.get(title);
        if (topic) {
          const href = `/topics/${topic.slug}`;
          return (
            <Link key={title} href={href} className={`nav-item ${pathname === href ? 'active' : ''}`}>
              <span>{i + 1}. {title}</span>
              <span className="badge">{topic.problems.length}</span>
            </Link>
          );
        }
        return (
          <span key={title} className="nav-item soon">
            <span>{i + 1}. {title}</span>
            <span className="badge">soon</span>
          </span>
        );
      })}
    </aside>
  );
}
