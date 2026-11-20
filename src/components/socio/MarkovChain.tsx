'use client';

import { useMemo, useState } from 'react';
import { AMBER, BLUE, PINK, useWidth } from './useWidth';

// Three-state Markov chain of Spanish heads of government (transition matrix from the thesis).
// P[to][from], columns sum to one.
const P = [
  [0.2, 0.4, 0.5],
  [0.8, 0.2, 0.0],
  [0.0, 0.4, 0.5],
];

const STATES = [
  { id: 0, short: 'S₁', name: 'First term', color: AMBER, x: 110, y: 180, note: 'A leader elected for the first time. 80% go on to be re-elected; 20% are replaced by another newcomer.' },
  { id: 1, short: 'S₂', name: 'Re-elected once', color: BLUE, x: 300, y: 100, note: 'Re-elected once. From here it splits: 40% are replaced, 40% win again, and 20% covers a leader who steps down mid-term and is succeeded.' },
  { id: 2, short: 'S₃', name: 'Re-elected twice or more', color: PINK, x: 490, y: 180, note: 'A long-standing incumbent. Even odds of another term or of a new leader.' },
];

const EDGES: { from: number; to: number; d: string; lx: number; ly: number }[] = [
  { from: 0, to: 1, d: 'M138,158 Q185,90 266,92', lx: 184, ly: 108 },
  { from: 1, to: 0, d: 'M272,124 Q215,172 146,184', lx: 224, ly: 168 },
  { from: 1, to: 2, d: 'M334,92 Q415,90 462,158', lx: 416, ly: 108 },
  { from: 2, to: 0, d: 'M462,206 Q300,292 138,206', lx: 300, ly: 266 },
  { from: 0, to: 0, d: 'M82,168 C34,140 34,222 82,194', lx: 30, ly: 187 },
  { from: 1, to: 1, d: 'M286,70 C270,20 330,20 314,70', lx: 300, ly: 24 },
  { from: 2, to: 2, d: 'M518,168 C566,140 566,222 518,194', lx: 572, ly: 187 },
];

function stationary() {
  let x = [1 / 3, 1 / 3, 1 / 3];
  for (let k = 0; k < 500; k++) x = P.map((row) => row.reduce((s, p, j) => s + p * x[j], 0));
  return x;
}

export default function MarkovChain() {
  const [active, setActive] = useState<number | null>(null);
  const [n, setN] = useState(0);
  const pi = useMemo(stationary, []);
  const xn = useMemo(() => {
    let x = [1, 0, 0];
    for (let k = 0; k < n; k++) x = P.map((row) => row.reduce((s, p, j) => s + p * x[j], 0));
    return x;
  }, [n]);
  const current = STATES.find((s) => s.id === active);
  const [box, W] = useWidth<HTMLDivElement>(576);
  // keep labels at ≥12px on screen whatever the diagram's rendered size
  const fs = Math.max(17, (12 * 600) / Math.min(W, 576));

  const bind = (id: number) => ({
    tabIndex: 0,
    role: 'button',
    'aria-label': `${STATES[id].name}`,
    onMouseEnter: () => setActive(id),
    onMouseLeave: () => setActive(null),
    onFocus: () => setActive(id),
    onBlur: () => setActive(null),
    onClick: () => setActive(id),
    className: 'cursor-pointer outline-none',
  });

  return (
    <figure className="my-10">
      <div className="rounded-sm border border-line bg-surface/80 p-4 sm:p-5">
        <div ref={box} className="mx-auto w-full max-w-xl">
        <svg viewBox="0 0 600 290" className="w-full select-none" role="group" aria-label="Transition diagram between the three leadership states">
          <defs>
            {['muted', ...STATES.map((s) => s.id)].map((k) => (
              <marker key={k} id={`mk-${k}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill={k === 'muted' ? 'var(--color-muted)' : STATES[k as number].color} />
              </marker>
            ))}
          </defs>
          {EDGES.map((e) => {
            const p = P[e.to][e.from];
            const on = active === e.from;
            const dim = active !== null && !on;
            const c = on ? STATES[e.from].color : 'var(--color-muted)';
            return (
              <g key={`${e.from}-${e.to}`} opacity={dim ? 0.2 : 1} className="transition-opacity">
                <path d={e.d} fill="none" stroke={c} strokeWidth={on ? 3 : 1.6} markerEnd={`url(#mk-${on ? e.from : 'muted'})`} />
                <text x={e.lx} y={e.ly} textAnchor="middle" fontSize={fs} fill="var(--color-text)" fontWeight={on ? 600 : 400}>
                  {p.toFixed(1)}
                </text>
              </g>
            );
          })}
          {STATES.map((s) => (
            <g key={s.id} {...bind(s.id)} opacity={active !== null && active !== s.id ? 0.55 : 1}>
              <circle cx={s.x} cy={s.y} r={32} fill="var(--color-ink)" stroke={s.color} strokeWidth={active === s.id ? 4 : 2.5} />
              <text x={s.x} y={s.y + 7} textAnchor="middle" fontSize={fs * 1.2} fill="var(--color-text)">{s.short}</text>
            </g>
          ))}
        </svg>
        </div>
        <p className="mt-2 min-h-[3rem] text-sm leading-relaxed text-text" aria-live="polite">
          {current ? (
            <><span className="font-medium">{current.name}.</span> {current.note}</>
          ) : (
            <span className="text-muted">Hover or tap a state to see where a leader goes next. Each arrow is one election.</span>
          )}
        </p>

        <div className="mt-6 border-t border-line pt-5">
          <label className="flex flex-wrap items-center gap-3 text-sm text-muted">
            <span>Start with a newly elected leader and run</span>
            <input type="range" min={0} max={10} value={n} onChange={(e) => setN(Number(e.target.value))} className="w-40 accent-[#c0832c]" aria-label="Number of elections" />
            <span className="tabular-nums text-text">{n} {n === 1 ? 'election' : 'elections'}</span>
          </label>
          <div className="mt-4 space-y-2">
            {STATES.map((s, i) => (
              <div key={s.id} className="grid grid-cols-[8.5rem_1fr_3rem] items-center gap-3 text-sm">
                <span className="text-muted">{s.short} {s.name}</span>
                <div className="relative h-5 rounded-r bg-line/40">
                  <div className="h-full rounded-r-[4px] transition-[width] duration-300" style={{ width: `${xn[i] * 100}%`, background: s.color }} />
                  <div className="absolute inset-y-[-3px] w-0.5 bg-text" style={{ left: `${pi[i] * 100}%` }} title="Long-run share" />
                </div>
                <span className="tabular-nums text-text">{Math.round(xn[i] * 100)}%</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">
            The white tick is the long-run share, the stationary distribution π = ({pi.map((v) => v.toFixed(2)).join(', ')}).
            Within four or five elections the starting point is forgotten.
          </p>
        </div>
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-muted">
        The three-state chain fitted to Spanish heads of government since 1977. Transition probabilities from the
        thesis; the long-run shares are computed here from that matrix.
      </figcaption>
    </figure>
  );
}
