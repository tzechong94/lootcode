'use client';

import type { BitsViz as BitsVizSpec } from '@/lib/types';
import Stepper from './Stepper';

export default function BitsViz({ spec }: { spec: BitsVizSpec }) {
  return (
    <Stepper title={spec.title} frames={spec.frames}>
      {(frame) => {
        const hi = new Set(frame.highlight ?? []);
        const n = frame.bits.length;
        return (
          <div className="vz-bits-wrap">
            {frame.label && <div className="vz-bits-label">{frame.label}</div>}
            <div className="vz-bits">
              {frame.bits.map((b, i) => (
                <div className="vz-bit-col" key={i}>
                  <div className={`vz-bit ${b === 1 ? 'vz-bit-on' : ''} ${hi.has(i) ? 'vz-bit-hi' : ''}`}>{b}</div>
                  <div className="vz-idx">2^{n - 1 - i}</div>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    </Stepper>
  );
}
