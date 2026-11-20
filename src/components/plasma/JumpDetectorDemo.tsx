'use client';

import { useMemo, useState } from 'react';

// Synthetic luminosity trace with five state jumps, an isolated spike and a
// smooth dip (like the turning point of a gas sweep). Deterministic seed.
function makeSignal(N = 1200) {
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const gauss = () => {
    let u = 0;
    for (let i = 0; i < 6; i++) u += rand();
    return (u - 3) / Math.sqrt(0.5);
  };
  const jumps = [
    { i: 193, h: 0.09 },
    { i: 425, h: -0.07 },
    { i: 612, h: 0.06 },
    { i: 887, h: -0.08 },
    { i: 1046, h: 0.07 },
  ];
  const y: number[] = [];
  for (let i = 0; i < N; i++) {
    const t = i / N;
    let v =
      0.62 +
      0.12 * Math.sin(2 * Math.PI * (t * 1.1 + 0.05)) -
      0.16 * Math.exp(-((t - 0.62) ** 2) / 0.0035);
    for (const j of jumps) v += j.h * Math.min(1, Math.max(0, (i - j.i) / 6));
    v += 0.009 * gauss();
    if (i === 300) v += 0.05;
    y.push(v);
  }
  return { y, jumps: jumps.map((j) => j.i) };
}

// The thesis method: fit a line to every block of n samples, take the change in
// slope between consecutive blocks, and compare it with the average change in a
// window around it. Flag blocks where that ratio exceeds the threshold.
function detect(y: number[], n: number, w: number, thr: number) {
  const B = Math.floor(y.length / n);
  const slopes: number[] = [];
  for (let b = 0; b < B; b++) {
    let sx = 0, sy = 0, sxx = 0, sxy = 0;
    for (let k = 0; k < n; k++) {
      const v = y[b * n + k];
      sx += k; sy += v; sxx += k * k; sxy += k * v;
    }
    slopes.push((n * sxy - sx * sy) / (n * sxx - sx * sx));
  }
  const d = slopes.map((s, b) => (b === 0 ? 0 : Math.abs(s - slopes[b - 1])));
  const hits: number[] = [];
  d.forEach((v, b) => {
    let sum = 0, c = 0;
    for (let k = Math.max(1, b - w); k <= Math.min(B - 1, b + w); k++) {
      if (Math.abs(k - b) > 1) { sum += d[k]; c++; }
    }
    const ratio = v / (sum / c);
    if (ratio > thr && !(hits.length && b - hits[hits.length - 1] <= 1)) hits.push(b);
  });
  return hits.map((b) => b * n + n / 2);
}

const W = 640;
const H = 220;
const PAD = { l: 8, r: 8, t: 12, b: 28 };

export default function JumpDetectorDemo() {
  const { y, jumps } = useMemo(() => makeSignal(), []);
  const [thr, setThr] = useState(2);
  const hits = useMemo(() => detect(y, 20, 12, thr), [y, thr]);

  const min = Math.min(...y) - 0.02;
  const max = Math.max(...y) + 0.02;
  const x = (i: number) => PAD.l + (i / (y.length - 1)) * (W - PAD.l - PAD.r);
  const yy = (v: number) => PAD.t + (1 - (v - min) / (max - min)) * (H - PAD.t - PAD.b);
  const path = y.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${yy(v).toFixed(1)}`).join('');

  const found = jumps.filter((j) => hits.some((h) => Math.abs(h - j) <= 40)).length;
  const falseAlarms = hits.filter((h) => !jumps.some((j) => Math.abs(h - j) <= 40)).length;

  const verdict =
    falseAlarms > 0
      ? 'Too sensitive: noise and the dip are being flagged as jumps.'
      : found < jumps.length
        ? 'Too strict: real jumps are slipping through.'
        : 'Every jump found, no false alarms.';

  return (
    <figure className="my-10 rounded-sm border border-line bg-surface/80 p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-medium text-text">Try the detector</p>
        <p className="text-sm tabular-nums text-muted" aria-live="polite">
          {found} of {jumps.length} jumps found · {falseAlarms} false alarm{falseAlarms === 1 ? '' : 's'}
        </p>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" role="img" aria-label="Synthetic luminosity signal with detected jumps">
        {jumps.map((j) => (
          <line key={j} x1={x(j)} x2={x(j)} y1={H - PAD.b + 4} y2={H - PAD.b + 12} stroke="var(--color-muted)" strokeWidth={2} />
        ))}
        <path d={path} fill="none" stroke="var(--color-text)" strokeOpacity={0.85} strokeWidth={1.5} />
        {hits.map((h) => {
          const real = jumps.some((j) => Math.abs(h - j) <= 40);
          return (
            <g key={h}>
              <line x1={x(h)} x2={x(h)} y1={PAD.t} y2={H - PAD.b} stroke={real ? '#c0832c' : '#c2577f'} strokeOpacity={0.35} strokeWidth={10} />
              <circle cx={x(h)} cy={PAD.t + 4} r={4} fill={real ? '#c0832c' : '#c2577f'} stroke="var(--color-surface)" strokeWidth={2} />
            </g>
          );
        })}
        <text x={PAD.l} y={H - 4} fill="var(--color-muted)" fontSize={11}>time →</text>
        <text x={W - PAD.r} y={H - 4} fill="var(--color-muted)" fontSize={11} textAnchor="end">ticks: labelled jumps</text>
      </svg>

      <div className="mt-5 grid gap-2 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-4">
        <label htmlFor="thr" className="text-sm text-muted">Jump threshold</label>
        <input
          id="thr"
          type="range"
          min={0.6}
          max={7}
          step={0.1}
          value={thr}
          onChange={(e) => setThr(Number(e.target.value))}
          className="w-full accent-[#e8a849]"
        />
        <span className="w-12 text-sm tabular-nums text-text">×{thr.toFixed(1)}</span>
      </div>
      <figcaption className="mt-4 text-sm leading-relaxed text-muted">
        <span className="text-text">{verdict}</span> A line is fitted to every 20 samples; a block is flagged
        when its change in slope is more than the threshold times the average change around it.
        <span className="ml-1 inline-flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-[#c0832c]" />jump</span>
        <span className="ml-3 inline-flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-[#c2577f]" />false alarm</span>
        . Synthetic signal; the real one is below.
      </figcaption>
    </figure>
  );
}
