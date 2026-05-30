'use client';

import type { GraphViz as GraphVizSpec } from '@/lib/types';
import Stepper from './Stepper';

export default function GraphViz({ spec }: { spec: GraphVizSpec }) {
  const W = 520;
  const H = 300;
  const px = (x: number) => 30 + x * (W - 60);
  const py = (y: number) => 30 + y * (H - 60);
  const nodeById = new Map(spec.nodes.map((nd) => [nd.id, nd]));

  return (
    <Stepper title={spec.title} frames={spec.frames}>
      {(frame) => {
        const active = new Set(frame.active ?? []);
        const visited = new Set(frame.visited ?? []);
        const frontier = new Set(frame.frontier ?? []);
        const edges = frame.edges ?? spec.edges;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="vz-graph" width="100%" style={{ maxHeight: H }}>
            {edges.map((e, i) => {
              const a = nodeById.get(e.from);
              const b = nodeById.get(e.to);
              if (!a || !b) return null;
              const x1 = px(a.x), y1 = py(a.y), x2 = px(b.x), y2 = py(b.y);
              const cls = e.state ? `vz-ge-${e.state}` : '';
              const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
              return (
                <g key={i}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} className={`vz-graph-edge ${cls}`} markerEnd={e.directed ? 'url(#vz-arrow)' : undefined} />
                  {e.weight !== undefined && <text x={mx} y={my - 4} className="vz-graph-weight" textAnchor="middle">{e.weight}</text>}
                </g>
              );
            })}
            {spec.nodes.map((nd) => {
              const cls = active.has(nd.id)
                ? 'vz-gn-active'
                : frontier.has(nd.id)
                  ? 'vz-gn-frontier'
                  : visited.has(nd.id)
                    ? 'vz-gn-visited'
                    : '';
              return (
                <g key={String(nd.id)}>
                  <circle cx={px(nd.x)} cy={py(nd.y)} r={16} className={`vz-gnode ${cls}`} />
                  <text x={px(nd.x)} y={py(nd.y)} className="vz-tlabel" dominantBaseline="central" textAnchor="middle">{nd.id}</text>
                </g>
              );
            })}
            <defs>
              <marker id="vz-arrow" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L7,3 L0,6 Z" className="vz-arrow-head" />
              </marker>
            </defs>
          </svg>
        );
      }}
    </Stepper>
  );
}
