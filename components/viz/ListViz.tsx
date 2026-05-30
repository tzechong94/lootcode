'use client';

import { Fragment } from 'react';
import type { ListViz as ListVizSpec } from '@/lib/types';
import Stepper from './Stepper';

export default function ListViz({ spec }: { spec: ListVizSpec }) {
  return (
    <Stepper title={spec.title} frames={spec.frames}>
      {(frame) => {
        const byIndex = new Map<number, string[]>();
        for (const p of frame.pointers ?? []) {
          const key = p.index === null ? frame.nodes.length : p.index;
          if (!byIndex.has(key)) byIndex.set(key, []);
          byIndex.get(key)!.push(p.name);
        }
        return (
          <div className="vz-list">
            {frame.nodes.map((node, i) => (
              <Fragment key={i}>
                <div className="vz-list-col">
                  <div className="vz-list-ptrs">
                    {(byIndex.get(i) ?? []).map((name) => (
                      <span className="vz-ptr" key={name}>↓{name}</span>
                    ))}
                  </div>
                  <div className={`vz-list-node ${node.state ? `vz-${node.state}` : ''}`}>{node.value}</div>
                </div>
                <span className="vz-list-arrow">→</span>
              </Fragment>
            ))}
            <div className="vz-list-col">
              <div className="vz-list-ptrs">
                {(byIndex.get(frame.nodes.length) ?? []).map((name) => (
                  <span className="vz-ptr" key={name}>↓{name}</span>
                ))}
              </div>
              <div className="vz-list-null">null</div>
            </div>
          </div>
        );
      }}
    </Stepper>
  );
}
