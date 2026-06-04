import Link from 'next/link';
import { DATA_STRUCTURE_TOPICS, algorithmsByFamily } from '@/lib/curriculum';
import type { Topic } from '@/lib/types';

function TopicCard({ topic }: { topic: Topic }) {
  const impls = topic.implementations?.length ?? 0;
  return (
    <Link href={`/topics/${topic.slug}`} className="roadmap-card built">
      <div className="title">{topic.title}</div>
      <div className="blurb">{topic.blurb}</div>
      <div className="card-tags">
        {impls > 0 && <span className="card-tag tag-build">{impls === 1 ? 'Build it' : `${impls} builds`}</span>}
        {topic.problems.length > 0 && <span className="card-tag">{topic.problems.length} problems</span>}
      </div>
    </Link>
  );
}

export default function Home() {
  const families = algorithmsByFamily();
  return (
    <div>
      <div className="hero">
        <h1>Master the building blocks, from first principles.</h1>
        <p>
          A self-study path split in two. First, <strong>data structures</strong>: read how each one
          works, then <strong>implement it yourself</strong> in an in-browser editor — your class is
          checked against a sequence of operations. Then, <strong>algorithms</strong>: organized by
          family, each derived from the problem it solves. Write Python or JavaScript and run it
          against real tests, right here. No setup, no backend.
        </p>
      </div>

      <section className="section-block">
        <div className="section-head">
          <h2>Data Structures</h2>
          <p>Learn how it&apos;s built — then build it yourself, and apply it.</p>
        </div>
        <div className="roadmap-grid">
          {DATA_STRUCTURE_TOPICS.map((topic) => (
            <TopicCard key={topic.slug} topic={topic} />
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-head">
          <h2>Algorithms</h2>
          <p>First-principles techniques, grouped by family.</p>
        </div>
        {families.map(({ family, topics }) => (
          <div key={family} className="family-group">
            <h3 className="family-head">{family}</h3>
            <div className="roadmap-grid">
              {topics.map((topic) => (
                <TopicCard key={topic.slug} topic={topic} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
