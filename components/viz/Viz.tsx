'use client';

import type { VizSpec } from '@/lib/types';
import ArrayViz from './ArrayViz';
import GridViz from './GridViz';

// Dispatch a VizSpec to its renderer. Renderers are added incrementally;
// types without a renderer yet fall through to a small notice (no topic uses
// them until their renderer exists).
export default function Viz({ spec }: { spec: VizSpec }) {
  switch (spec.type) {
    case 'array':
      return <ArrayViz spec={spec} />;
    case 'grid':
      return <GridViz spec={spec} />;
    default:
      return null;
  }
}
