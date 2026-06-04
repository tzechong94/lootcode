'use client';

import type { StackViz as StackVizSpec } from '@/lib/types';
import Stepper from './Stepper';

export default function StackQueueViz({ spec }: { spec: StackVizSpec }) {
  const isStack = spec.type === 'stack';
  return (
    <Stepper title={spec.title} frames={spec.frames}>
      {(frame) => {
        const hi = new Set(frame.highlight ?? []);
        // Stack: render top-of-stack at the top (reverse visual order). Queue: front on left.
        const order = isStack ? [...frame.items.keys()].reverse() : [...frame.items.keys()];
        return (
          <div className={isStack ? 'vz-stack' : 'vz-queue'}>
            {isStack && frame.items.length > 0 && <div className="vz-sq-label">top ↓</div>}
            <div className={isStack ? 'vz-stack-items' : 'vz-queue-items'}>
              {order.map((idx) => (
                <div key={idx} className={`vz-sq-cell ${hi.has(idx) ? 'vz-active' : ''}`}>{frame.items[idx]}</div>
              ))}
              {frame.items.length === 0 && <div className="vz-sq-empty">empty</div>}
            </div>
            {!isStack && <div className="vz-sq-label">front → … → back</div>}
          </div>
        );
      }}
    </Stepper>
  );
}
