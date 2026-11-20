'use client';

import { useMemo, useState } from 'react';
import { AMBER, useWidth } from './useWidth';

// Graphical solution of the mean-field equation  s = tanh(K s + mu),  K = Jz/2.
const M = { l: 36, r: 12, t: 12, b: 40 };
const H = 280;
const S = 1.25;

function roots(K: number, mu: number) {
  const f = (s: number) => Math.tanh(K * s + mu) - s;
  const out: { s: number; stable: boolean }[] = [];
  const N = 800;
  for (let i = 0; i < N; i++) {
    let a = -1 + (2 * i) / N, b = -1 + (2 * (i + 1)) / N;
    let fa = f(a), fb = f(b);
    if (fa === 0) fb = fa;
    if (fa * fb > 0) continue;
    for (let k = 0; k < 40; k++) {
      const m = (a + b) / 2, fm = f(m);
      if (fa * fm <= 0) { b = m; fb = fm; } else { a = m; fa = fm; }
    }
    const s = (a + b) / 2;
    if (out.some((r) => Math.abs(r.s - s) < 1e-3)) continue;
    const t = Math.tanh(K * s + mu);
    out.push({ s, stable: K * (1 - t * t) < 1 });
  }
  return out;
}

export default function MeanField() {
  const [K, setK] = useState(1.6);
  const [mu, setMu] = useState(0);
  const [box, W] = useWidth<HTMLDivElement>();
  const side = Math.min(W, 460);
  const x = (s: number) => M.l + ((s + S) / (2 * S)) * (side - M.l - M.r);
  const y = (v: number) => M.t + (1 - (v + S) / (2 * S)) * (H - M.t - M.b);

  const path = useMemo(() => {
    let d = '';
    for (let i = 0; i <= 120; i++) {
      const s = -S + (2 * S * i) / 120;
      d += `${i ? 'L' : 'M'}${x(s).toFixed(1)},${y(Math.tanh(K * s + mu)).toFixed(1)}`;
    }
    return d;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [K, mu, side]);
  const rs = roots(K, mu);
  const stable = rs.filter((r) => r.stable);

  const verdict =
    stable.length > 1
      ? `Two stable outcomes, s̄ ≈ ${stable.map((r) => r.s.toFixed(2)).join(' and ')}: neighbours lock the district into one camp, and which one depends on history.`
      : Math.abs(stable[0]?.s ?? 0) < 0.05
        ? 'One outcome, s̄ ≈ 0: a split district. Peer pressure is too weak to pick a side.'
        : `One outcome, s̄ ≈ ${stable[0].s.toFixed(2)}: the district leans the way the leader’s field pushes it.`;

  return (
    <figure className="my-10">
      <div className="rounded-sm border border-line bg-surface/80 p-4 sm:p-5">
        <div className="grid gap-5 sm:grid-cols-[1fr_12rem] sm:items-center">
          <div ref={box}>
            <svg viewBox={`0 0 ${side} ${H}`} className="w-full max-w-[460px] select-none" role="img" aria-label="The curves y equals s and y equals tanh of K s plus mu, and where they cross">
              {[-1, 0, 1].map((v) => (
                <g key={v}>
                  <line x1={x(v)} x2={x(v)} y1={M.t} y2={H - M.b} stroke="var(--color-line)" />
                  <line x1={M.l} x2={side - M.r} y1={y(v)} y2={y(v)} stroke="var(--color-line)" />
                  <text x={x(v)} y={H - M.b + 16} textAnchor="middle" fontSize={11} fill="var(--color-muted)">{v}</text>
                  <text x={M.l - 6} y={y(v) + 4} textAnchor="end" fontSize={11} fill="var(--color-muted)">{v}</text>
                </g>
              ))}
              <line x1={x(-S)} y1={y(-S)} x2={x(S)} y2={y(S)} stroke="var(--color-muted)" strokeWidth={1.5} strokeDasharray="5 4" />
              <path d={path} fill="none" stroke={AMBER} strokeWidth={2.5} />
              {rs.map((r) => (
                <circle key={r.s} cx={x(r.s)} cy={y(r.s)} r={6} fill={r.stable ? 'var(--color-text)' : 'var(--color-surface)'} stroke="var(--color-text)" strokeWidth={2} />
              ))}
              <text x={side - M.r} y={H - 4} textAnchor="end" fontSize={11} fill="var(--color-muted)">s̄, average vote in the district</text>
            </svg>
          </div>
          <div className="space-y-5 text-sm">
            <label className="block">
              <span className="flex justify-between text-muted">Peer influence <span className="tabular-nums text-text">Jz/2 = {K.toFixed(2)}</span></span>
              <input type="range" min={0} max={3} step={0.05} value={K} onChange={(e) => setK(Number(e.target.value))} className="mt-2 w-full accent-[#c0832c]" />
            </label>
            <label className="block">
              <span className="flex justify-between text-muted">Leader’s field <span className="tabular-nums text-text">μ = {mu.toFixed(2)}</span></span>
              <input type="range" min={-1} max={1} step={0.05} value={mu} onChange={(e) => setMu(Number(e.target.value))} className="mt-2 w-full accent-[#c0832c]" />
            </label>
            <ul className="space-y-1 text-xs text-muted">
              <li className="flex items-center gap-2"><span className="inline-block h-0.5 w-4" style={{ background: AMBER }} />tanh(Jz s̄/2 + μ)</li>
              <li className="flex items-center gap-2"><span className="inline-block w-4 border-t border-dashed border-muted" />s̄ itself</li>
              <li className="flex items-center gap-2"><span className="inline-block h-2.5 w-2.5 rounded-full bg-text" />stable solution <span className="ml-1 inline-block h-2.5 w-2.5 rounded-full border-2 border-text" />unstable</li>
            </ul>
          </div>
        </div>
        <p className="mt-4 min-h-[2.5rem] text-sm leading-relaxed text-text" aria-live="polite">{verdict}</p>
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-muted">
        The self-consistency condition of the mean-field approximation. Solutions are where the two curves cross.
        With no field, the split solution s̄ = 0 loses stability once Jz/2 &gt; 1; a field μ tips the district
        towards its sign.
      </figcaption>
    </figure>
  );
}
