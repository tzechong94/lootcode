'use client';

import type { TutorialBlock } from '@/lib/types';
import Markdown from './Markdown';
import Viz from './viz/Viz';

export default function TutorialBlocks({ blocks }: { blocks: TutorialBlock[] }) {
  return (
    <div className="tutorial-blocks">
      {blocks.map((block, i) =>
        block.kind === 'md' ? (
          <Markdown key={i}>{block.md}</Markdown>
        ) : (
          <Viz key={i} spec={block.spec} />
        ),
      )}
    </div>
  );
}
