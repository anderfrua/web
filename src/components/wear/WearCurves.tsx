'use client';

import { useEffect, useState } from 'react';
import { useWidth, AMBER } from '@/components/socio/useWidth';

type Pt = [number, number] | null; // [days, mm]
type Data = Record<string, Pt[]>;

const NOTES: Record<string, string> = {
  '2': 'Steady climb with short plateaus; the most worn bushing, about 1 mm after a week.',
  '3': 'The sharpest run-in: 0.15 mm in the first few hours, then a slow, even climb to 0.7 mm.',
  '4': 'Logging stopped for two days; when it resumed, the bushing had worn on. It ends earlier than the rest.',
  '5': 'Tracks test 2 closely but in bigger steps, with long flat stretches between them.',
  '6': 'After run-in, almost no wear for more than a day, then a slow climb to half a millimetre.',
};

export default function WearCurves() {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [data, setData] = useState<Data | null>(null);
  const [sel, setSel] = useState<string>('3');
  const [hover, setHover] = useState<{ k: string; p: [number, number] } | null>(null);

  useEffect(() => {
    fetch('/data/wear-curves.json')
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  const W = width, H = Math.max(240, Math.min(320, width * 0.5)), m = { l: 44, r: 58, t: 14, b: 34 };
  const iw = W - m.l - m.r, ih = H - m.t - m.b;
  const X = (d: number) => m.l + (d / 7) * iw;
  const Y = (v: number) => m.t + ih - (v / 1.05) * ih;
  const path = (pts: Pt[]) => {
    let d = '', pen = false;
    for (const p of pts) {
      if (!p) { pen = false; continue; }
      d += `${pen ? 'L' : 'M'}${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`;
      pen = true;
    }
    return d;
  };
  const keys = data ? Object.keys(data) : [];
  // end labels, nudged apart so they don't collide
  const ends = keys
    .map((k) => {
      const last = [...data![k]].reverse().find(Boolean) as [number, number];
      return { k, x: X(last[0]), y: Y(last[1]) };
    })
    .sort((a, b) => a.y - b.y);
  for (let i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 14) ends[i].y = ends[i - 1].y + 14;

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!data) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    let best: { k: string; p: [number, number]; d: number } | null = null;
    for (const k of keys)
      for (const p of data[k]) {
        if (!p) continue;
        const d = Math.hypot(X(p[0]) - mx, Y(p[1]) - my);
        if (!best || d < best.d) best = { k, p, d };
      }
    if (best && best.d < 24) {
      setHover({ k: best.k, p: best.p });
      setSel(best.k);
    } else setHover(null);
  };

  return (
    <figure className="my-10">
      <div className="rounded-sm border border-line bg-surface/80 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Experiment">
          <span className="mr-1 text-sm text-muted">Test</span>
          {['2', '3', '4', '5', '6'].map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={sel === k}
              onClick={() => setSel(k)}
              className={`rounded-sm border px-2.5 py-1 text-sm tabular-nums transition-colors ${sel === k ? 'border-signal text-text' : 'border-line text-muted hover:text-text'}`}
            >
              {k}
            </button>
          ))}
        </div>
        <p className="mt-3 min-h-[2.75rem] text-sm leading-relaxed text-muted" aria-live="polite">
          <span className="text-text">Test {sel}.</span> {NOTES[sel]}
        </p>
        <div ref={ref} className="relative mt-2">
          <svg width={W} height={H} role="img" aria-label="Bushing wear against time for five bench experiments" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
            {[0, 0.25, 0.5, 0.75, 1].map((v) => (
              <g key={v}>
                <line x1={m.l} x2={m.l + iw} y1={Y(v)} y2={Y(v)} stroke="var(--color-line)" />
                <text x={m.l - 8} y={Y(v) + 4} textAnchor="end" fontSize={11} fill="var(--color-muted)">{v.toFixed(2)}</text>
              </g>
            ))}
            {Array.from({ length: 8 }, (_, d) => (
              <text key={d} x={X(d)} y={H - 14} textAnchor="middle" fontSize={11} fill="var(--color-muted)">{d}</text>
            ))}
            <text x={m.l + iw / 2} y={H - 1} textAnchor="middle" fontSize={11} fill="var(--color-muted)">days</text>
            <text x={m.l - 8} y={m.t - 2} textAnchor="end" fontSize={11} fill="var(--color-muted)">mm</text>
            {keys.filter((k) => k !== sel).map((k) => (
              <path key={k} d={path(data![k])} fill="none" stroke="var(--color-muted)" strokeOpacity={0.45} strokeWidth={1.5} />
            ))}
            {data && (
              <path d={path(data[sel])} fill="none" stroke="var(--color-surface)" strokeWidth={6} />
            )}
            {data && <path d={path(data[sel])} fill="none" stroke={AMBER} strokeWidth={2.5} />}
            {ends.map((e) => (
              <text key={e.k} x={e.x + 6} y={e.y + 4} fontSize={11} fill={e.k === sel ? 'var(--color-text)' : 'var(--color-muted)'}>
                Test {e.k}
              </text>
            ))}
            {hover && <circle cx={X(hover.p[0])} cy={Y(hover.p[1])} r={4.5} fill={AMBER} stroke="var(--color-surface)" strokeWidth={2} />}
          </svg>
          {hover && (
            <div
              className="pointer-events-none absolute z-10 rounded-sm border border-line bg-ink px-2 py-1 text-xs tabular-nums text-text"
              style={{ left: Math.min(X(hover.p[0]) + 10, W - 170), top: Math.max(0, Y(hover.p[1]) - 34) }}
            >
              Test {hover.k}: {hover.p[1].toFixed(2)} mm after {hover.p[0].toFixed(1)} days
            </div>
          )}
        </div>
        {!data && <p className="text-sm text-muted">Loading the curves…</p>}
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-muted">
        Bushing wear measured with the laser soft sensor in five bench experiments, each run for about a week. Curves
        digitised from the thesis figure, so values are accurate to about 0.01 mm. Pick a test or hover a curve.
      </figcaption>
    </figure>
  );
}
