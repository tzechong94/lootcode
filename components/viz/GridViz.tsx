'use client';

import type { GridViz as GridVizSpec } from '@/lib/types';
import Stepper from './Stepper';

export default function GridViz({ spec }: { spec: GridVizSpec }) {
  return (
    <Stepper title={spec.title} frames={spec.frames}>
      {(frame) => (
        <div className="vz-grid">
          {frame.grid.map((row, r) => (
            <div className="vz-grid-row" key={r}>
              {row.map((cell, c) => (
                <div className={`vz-grid-cell ${cell.state ? `vz-g-${cell.state}` : ''}`} key={c}>
                  {cell.value ?? ''}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </Stepper>
  );
}
