import Link from 'next/link';
import { ROADMAP, TOPICS } from '@/lib/curriculum';

const builtByTitle = new Map(TOPICS.map((t) => [t.title, t]));

export default function Home() {
  return (
    <div>
      <div className="hero">
        <h1>Get interview-ready, from first principles.</h1>
        <p>
          A self-study path through data structures & algorithms. Each topic opens with a concise,
          first-principles tutorial, then a few problems you solve in an in-browser editor — write
          Python or JavaScript and run it against real tests, right here. No setup, no backend.
        </p>
      </div>

      <div className="roadmap-grid">
        {ROADMAP.map((title, i) => {
          const topic = builtByTitle.get(title);
          if (topic) {
            return (
              <Link key={title} href={`/topics/${topic.slug}`} className="roadmap-card built">
                <div className="num">{String(i + 1).padStart(2, '0')}</div>
                <div className="title">{title}</div>
                <div className="blurb">{topic.blurb}</div>
              </Link>
            );
          }
          return (
            <div key={title} className="roadmap-card">
              <div className="num">{String(i + 1).padStart(2, '0')}</div>
              <div className="title">{title}</div>
              <div className="soon-tag">Coming soon</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
