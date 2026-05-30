'use client';

import type { TreeViz as TreeVizSpec } from '@/lib/types';
import Stepper from './Stepper';

export default function TreeViz({ spec }: { spec: TreeVizSpec }) {
  const nodes = spec.nodes;
  const n = nodes.length;
  const levels = Math.max(1, Math.ceil(Math.log2(n + 1)));
  const W = 560;
  const levelH = 66;
  const H = levels * levelH + 16;

  const pos = (i: number) => {
    const level = Math.floor(Math.log2(i + 1));
    const idxInLevel = i - (2 ** level - 1);
    const count = 2 ** level;
    return { x: ((idxInLevel + 0.5) / count) * W, y: level * levelH + 28 };
  };

  return (
    <Stepper title={spec.title} frames={spec.frames}>
      {(frame) => {
        const active = new Set(frame.active ?? []);
        const visited = new Set(frame.visited ?? []);
        const faded = new Set(frame.faded ?? []);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="vz-tree" width="100%" style={{ maxHeight: H }}>
            {nodes.map((v, i) => {
              if (v === null) return null;
              const p = pos(i);
              return [2 * i + 1, 2 * i + 2].map((c) =>
                c < n && nodes[c] !== null ? (
                  <line key={`${i}-${c}`} x1={p.x} y1={p.y} x2={pos(c).x} y2={pos(c).y} className="vz-tree-edge" />
                ) : null,
              );
            })}
            {nodes.map((v, i) => {
              if (v === null) return null;
              const p = pos(i);
              const cls = active.has(i)
                ? 'vz-tn-active'
                : visited.has(i)
                  ? 'vz-tn-visited'
                  : faded.has(i)
                    ? 'vz-tn-faded'
                    : '';
              return (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r={17} className={`vz-tnode ${cls}`} />
                  <text x={p.x} y={p.y} className="vz-tlabel" dominantBaseline="central" textAnchor="middle">{v}</text>
                </g>
              );
            })}
          </svg>
        );
      }}
    </Stepper>
  );
}
