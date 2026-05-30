'use client';

import type { HashViz as HashVizSpec } from '@/lib/types';
import Stepper from './Stepper';

export default function HashViz({ spec }: { spec: HashVizSpec }) {
  return (
    <Stepper title={spec.title} frames={spec.frames}>
      {(frame) => (
        <div className="vz-hash">
          {frame.incoming && (
            <div className="vz-hash-incoming">
              <span className="vz-hash-key">{frame.incoming.key}</span>
              <span className="vz-hash-fn">hash → {frame.incoming.bucket}</span>
            </div>
          )}
          <div className="vz-hash-buckets">
            {frame.buckets.map((entries, b) => (
              <div className={`vz-hash-row ${frame.activeBucket === b ? 'vz-hash-active' : ''}`} key={b}>
                <div className="vz-hash-bidx">{b}</div>
                <div className="vz-hash-chips">
                  {entries.map((e, i) => (
                    <span className="vz-hash-chip" key={i}>{e}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Stepper>
  );
}
