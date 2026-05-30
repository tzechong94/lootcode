import { notFound } from 'next/navigation';
import { TOPICS, getTopic } from '@/lib/curriculum';
import TopicView from '@/components/TopicView';

export function generateStaticParams() {
  return TOPICS.map((t) => ({ slug: t.slug }));
}

export default function TopicPage({ params }: { params: { slug: string } }) {
  const topic = getTopic(params.slug);
  if (!topic) notFound();
  return <TopicView topic={topic} />;
}
