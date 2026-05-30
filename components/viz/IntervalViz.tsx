'use client';

import type { IntervalViz as IntervalVizSpec } from '@/lib/types';
import Stepper from './Stepper';

export default function IntervalViz({ spec }: { spec: IntervalVizSpec }) {
  return (
    <Stepper title={spec.title} frames={spec.frames}>
      {(frame) => (
        <div className="vz-intervals">
          {frame.bars.map((bar, i) => (
            <div className="vz-int-row" key={i}>
              <div
                className={`vz-int-bar ${bar.state ? `vz-int-${bar.state}` : ''}`}
                style={{
                  marginLeft: `${(bar.start / spec.span) * 100}%`,
                  width: `${((bar.end - bar.start) / spec.span) * 100}%`,
                }}
              >
                {bar.label ?? `[${bar.start}, ${bar.end}]`}
              </div>
            </div>
          ))}
          <div className="vz-int-axis">
            {Array.from({ length: spec.span + 1 }, (_, t) => (
              <span key={t} className="vz-int-tick" style={{ left: `${(t / spec.span) * 100}%` }}>{t}</span>
            ))}
          </div>
        </div>
      )}
    </Stepper>
  );
}
