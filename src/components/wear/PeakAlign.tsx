'use client';

import { useEffect, useRef, useState } from 'react';
import { useWidth, AMBER, BLUE } from '@/components/socio/useWidth';

// Two sensors logged by separate acquisition tasks: same motion, clocks that
// disagree. Peaks are found with the neighbour rule (x[i-1] < x[i] > x[i+1]),
// matched in order, and the mean gap between matched peaks is the shift.

const F = 0.83; // Hz, ~50 rpm
const T = 6; // seconds shown
const FS = 120; // samples per second in this demo
const OFFSET = 0.31; // s, how far the load-cell clock runs behind

function series(shift: number, kind: 'laser' | 'force') {
  const out: { t: number; v: number }[] = [];
  for (let i = 0; i <= T * FS; i++) {
    const t = i / FS;
    const ph = 2 * Math.PI * F * (t - (kind === 'force' ? shift : 0));
    const v = kind === 'laser' ? 0.5 + 0.42 * Math.cos(ph) : 0.48 + 0.22 * Math.cos(ph) + 0.03 * Math.cos(2 * ph);
    out.push({ t, v });
  }
  return out;
}

function peaks(s: { t: number; v: number }[]) {
  const p: number[] = [];
  for (let i = 1; i < s.length - 1; i++) if (s[i].v > s[i - 1].v && s[i].v > s[i + 1].v && s[i].v > 0.6) p.push(i);
  return p;
}

export default function PeakAlign() {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [shift, setShift] = useState(OFFSET);
  const [aligned, setAligned] = useState(false);
  const raf = useRef(0);

  const laser = series(0, 'laser');
  const force = series(shift, 'force');
  const pl = peaks(laser), pf = peaks(force);
  // match each laser crest to the nearest load-cell crest within half a cycle
  const matched = pl
    .map((i) => {
      const t = laser[i].t;
      const j = pf.reduce((best, k) => (Math.abs(force[k].t - t) < Math.abs(force[best].t - t) ? k : best), pf[0]);
      return Math.abs(force[j].t - t) < 0.5 / F ? [i, j] : null;
    })
    .filter((x): x is number[] => x !== null);
  const gaps = matched.map(([i, j]) => force[j].t - laser[i].t);
  const meanGap = gaps.length ? gaps.reduce((a, b) => a + b, 0) / gaps.length : 0;

  const animateTo = (target: number) => {
    cancelAnimationFrame(raf.current);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setShift(target);
      return;
    }
    const start = performance.now(), from = shift;
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / 700);
      const e = 1 - (1 - k) ** 3;
      setShift(from + (target - from) * e);
      if (k < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const W = width, H = 190, m = { l: 12, r: 12, t: 14, b: 26 };
  const iw = W - m.l - m.r, ih = H - m.t - m.b;
  const X = (t: number) => m.l + (t / T) * iw;
  const Y = (v: number) => m.t + ih - v * ih;
  const path = (s: { t: number; v: number }[]) => s.map((p, i) => `${i ? 'L' : 'M'}${X(p.t).toFixed(1)},${Y(p.v).toFixed(1)}`).join(' ');

  return (
    <figure className="my-10">
      <div className="rounded-sm border border-line bg-surface/80 p-5 sm:p-6">
        <ul className="mb-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted" aria-label="Legend">
          <li className="flex items-center gap-2"><span className="inline-block h-0.5 w-4" style={{ background: BLUE }} />Laser position</li>
          <li className="flex items-center gap-2"><span className="inline-block h-0.5 w-4" style={{ background: AMBER }} />Load-cell force</li>
          <li className="flex items-center gap-2"><span className="text-text">×</span>Detected peak</li>
        </ul>
        <div ref={ref}>
          <svg width={W} height={H} role="img" aria-label="Laser and load-cell signals with their detected peaks, before and after alignment">
            {Array.from({ length: T + 1 }, (_, s) => (
              <g key={s}>
                <line x1={X(s)} x2={X(s)} y1={m.t} y2={m.t + ih} stroke="var(--color-line)" />
                <text x={X(s)} y={H - 8} textAnchor="middle" fontSize={11} fill="var(--color-muted)">{s} s</text>
              </g>
            ))}
            <path d={path(laser)} fill="none" stroke={BLUE} strokeWidth={2} />
            <path d={path(force)} fill="none" stroke={AMBER} strokeWidth={2} />
            {matched.map(([i, j]) => (
              <line key={i} x1={X(laser[i].t)} x2={X(force[j].t)} y1={Y(laser[i].v) - 10} y2={Y(laser[i].v) - 10} stroke="var(--color-text)" strokeWidth={1.5} opacity={Math.abs(meanGap) > 0.01 ? 0.6 : 0} />
            ))}
            {[...pl.map((i) => laser[i]), ...pf.map((i) => force[i])].map((p, k) => (
              <text key={k} x={X(p.t)} y={Y(p.v) + 4} textAnchor="middle" fontSize={13} fill="var(--color-text)">×</text>
            ))}
          </svg>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <button
            type="button"
            onClick={() => {
              animateTo(aligned ? OFFSET : 0);
              setAligned(!aligned);
            }}
            className="rounded-sm bg-signal px-3 py-1.5 font-medium text-ink hover:bg-[#f0bb68]"
          >
            {aligned ? 'Show the raw clocks' : 'Align on the peaks'}
          </button>
          <span className="tabular-nums text-muted" aria-live="polite">
            mean gap between matched peaks: {(meanGap * 1000).toFixed(0)} ms
          </span>
        </div>
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-muted">
        Illustration with synthetic signals. Each sensor is logged by its own acquisition task, so their clocks
        disagree by a fraction of a cycle. Both see the same motion, so their crests must coincide: the pipeline
        finds the peaks in each signal, pairs each with its nearest partner and shifts one stream by the mean gap before merging.
      </figcaption>
    </figure>
  );
}
