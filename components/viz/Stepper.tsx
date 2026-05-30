'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface Framelike {
  caption: string;
}

/**
 * Generic step-through container for concept visualizers.
 * Renders prev/next/play-pause controls, a progress bar, and the current frame's
 * caption; delegates the visual to `children(frame, index)`.
 */
export default function Stepper<T extends Framelike>({
  title,
  frames,
  children,
}: {
  title?: string;
  frames: T[];
  children: (frame: T, index: number) => ReactNode;
}) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const last = frames.length - 1;

  useEffect(() => {
    if (!playing) return;
    if (i >= last) {
      setPlaying(false);
      return;
    }
    timer.current = setTimeout(() => setI((n) => Math.min(n + 1, last)), 1100);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [playing, i, last]);

  const go = (n: number) => {
    setPlaying(false);
    setI(Math.max(0, Math.min(n, last)));
  };

  const frame = frames[i];

  return (
    <figure className="viz">
      {title && <figcaption className="viz-title">{title}</figcaption>}
      <div className="viz-stage">{children(frame, i)}</div>
      <div className="viz-caption">{frame.caption}</div>
      <div className="viz-controls">
        <button className="viz-btn" onClick={() => go(0)} disabled={i === 0} aria-label="Restart">⏮</button>
        <button className="viz-btn" onClick={() => go(i - 1)} disabled={i === 0} aria-label="Previous">◀</button>
        <button
          className="viz-btn viz-play"
          onClick={() => (i >= last ? (go(0), setPlaying(true)) : setPlaying((p) => !p))}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? '❙❙ Pause' : '▶ Play'}
        </button>
        <button className="viz-btn" onClick={() => go(i + 1)} disabled={i === last} aria-label="Next">▶</button>
        <span className="viz-step">{i + 1} / {frames.length}</span>
      </div>
      <div className="viz-progress">
        <div className="viz-progress-fill" style={{ width: `${((i + 1) / frames.length) * 100}%` }} />
      </div>
    </figure>
  );
}
