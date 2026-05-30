'use client';

import type { VizSpec } from '@/lib/types';
import ArrayViz from './ArrayViz';
import GridViz from './GridViz';
import HashViz from './HashViz';
import TreeViz from './TreeViz';
import ListViz from './ListViz';
import StackQueueViz from './StackQueueViz';
import BitsViz from './BitsViz';
import GraphViz from './GraphViz';
import IntervalViz from './IntervalViz';

// Dispatch a VizSpec to its renderer.
export default function Viz({ spec }: { spec: VizSpec }) {
  switch (spec.type) {
    case 'array':
      return <ArrayViz spec={spec} />;
    case 'grid':
      return <GridViz spec={spec} />;
    case 'hash':
      return <HashViz spec={spec} />;
    case 'tree':
      return <TreeViz spec={spec} />;
    case 'list':
      return <ListViz spec={spec} />;
    case 'stack':
    case 'queue':
      return <StackQueueViz spec={spec} />;
    case 'bits':
      return <BitsViz spec={spec} />;
    case 'graph':
      return <GraphViz spec={spec} />;
    case 'interval':
      return <IntervalViz spec={spec} />;
    default:
      return null;
  }
}
