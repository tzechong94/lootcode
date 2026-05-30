'use client';

import type { ArrayViz as ArrayVizSpec } from '@/lib/types';
import Stepper from './Stepper';

export default function ArrayViz({ spec }: { spec: ArrayVizSpec }) {
  return (
    <Stepper title={spec.title} frames={spec.frames}>
      {(frame) => {
        // Pointers grouped by index so multiple (e.g. L and R) stack under a cell.
        const byIndex = new Map<number, string[]>();
        for (const p of frame.pointers ?? []) {
          if (!byIndex.has(p.index)) byIndex.set(p.index, []);
          byIndex.get(p.index)!.push(p.name);
        }
        return (
          <div className="vz-array">
            {frame.cells.map((cell, idx) => (
              <div className="vz-array-col" key={idx}>
                <div className={`vz-cell ${cell.state ? `vz-${cell.state}` : ''}`}>{cell.value}</div>
                <div className="vz-idx">{idx}</div>
                <div className="vz-ptrs">
                  {(byIndex.get(idx) ?? []).map((name) => (
                    <span className="vz-ptr" key={name}>↑{name}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      }}
    </Stepper>
  );
}
