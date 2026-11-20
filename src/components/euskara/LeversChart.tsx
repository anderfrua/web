'use client';

import { useState } from 'react';
import { AMBER, BLUE, useWidth } from '../socio/useWidth';
import { pp, useAbm } from './data';

// Effect of each policy on the share of speakers aged 16+, against the same runs without it.
const LEVERS = [
  { key: 'brave0.2', label: '20% more fluent speakers open in Basque' },
  { key: 'alfa0.01', label: 'Adult classes reach 1% of people a year, not 0.3%' },
  { key: 'imm0.5', label: 'Half of adult immigrants reach a basic level' },
  { key: 'imm0.25', label: 'A quarter of adult immigrants reach a basic level' },
  { key: 'AtoD', label: 'Every Spanish-medium (A) pupil moves to Basque-medium (D)' },
  { key: 'gainA3', label: 'A schools teach 3 points a year instead of 1' },
  { key: 'gainBD8', label: 'B and D schools teach 8 points a year instead of 6' },
];
const HORIZONS = [2024, 2034, 2050];
const X1 = 0.22;
const ROW = 46;

export default function LeversChart() {
  const data = useAbm();
  const [hz, setHz] = useState(2034);
  const [hover, setHover] = useState<string | null>(null);
  const [box, W] = useWidth<HTMLDivElement>();
  const narrow = true; // labels above each row: long policy names never clip
  const labelW = narrow ? 0 : 250;
  const M = { l: labelW + 8, r: 16, t: 8, b: 28 };
  const H = M.t + M.b + LEVERS.length * (narrow ? ROW + 16 : ROW);
  const x = (v: number) => M.l + ((v + 0.02) / (X1 + 0.02)) * (W - M.l - M.r);
  const i = hz - 2006;

  return (
    <figure className="my-10">
      <div className="rounded-sm border border-line bg-surface/80 p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted">Effect by</span>
          {HORIZONS.map((h) => (
            <button key={h} type="button" onClick={() => setHz(h)} aria-pressed={hz === h}
              className={`rounded-sm border px-2.5 py-1 tabular-nums ${hz === h ? 'border-signal text-text' : 'border-line text-muted hover:text-text'}`}>
              {h}
            </button>
          ))}
        </div>
        <div ref={box}>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full select-none" role="img" aria-label={`Gain in the share of Basque speakers by ${hz} for each policy, under two calibrations`}>
            {[0, 0.05, 0.1, 0.15, 0.2].map((v) => (
              <g key={v}>
                <line x1={x(v)} x2={x(v)} y1={M.t} y2={H - M.b} stroke="var(--color-line)" strokeWidth={v === 0 ? 1.5 : 1} />
                <text x={x(v)} y={H - 10} textAnchor="middle" fontSize={11} fill="var(--color-muted)">{v === 0 ? '0' : `+${v * 100}`}</text>
              </g>
            ))}
            <text x={W - M.r} y={H - 10} textAnchor="end" fontSize={11} fill="var(--color-muted)">pts</text>
            {LEVERS.map((l, k) => {
              const rowH = narrow ? ROW + 16 : ROW;
              const cy = M.t + k * rowH + (narrow ? 30 : rowH / 2);
              return (
                <g key={l.key} onPointerEnter={() => setHover(l.key)} onPointerLeave={() => setHover(null)}>
                  <rect x={0} y={cy - rowH / 2 - (narrow ? 8 : 0)} width={W} height={rowH} fill={hover === l.key ? 'var(--color-line)' : 'transparent'} opacity={0.35} />
                  <text x={narrow ? M.l : labelW} y={narrow ? cy - 16 : cy + 4} textAnchor={narrow ? 'start' : 'end'} fontSize={12} fill="var(--color-text)">{l.label}</text>
                  {data && (['C1', 'C2'] as const).map((c, j) => {
                    const s = data.cal[c].scen[l.key];
                    const dy = j ? 5 : -5;
                    return (
                      <g key={c}>
                        <line x1={x(s.d[i] - s.ci[i])} x2={x(s.d[i] + s.ci[i])} y1={cy + dy} y2={cy + dy} stroke={j ? BLUE : AMBER} strokeWidth={2} />
                        <circle cx={x(s.d[i])} cy={cy + dy} r={4.5} fill={j ? BLUE : AMBER} stroke="var(--color-surface)" strokeWidth={1.5} />
                      </g>
                    );
                  })}
                  {data && hover === l.key && (
                    <text x={W - M.r} y={narrow ? cy - 16 : cy - 12} textAnchor="end" fontSize={11} fill="var(--color-text)">
                      {pp(data.cal.C1.scen[l.key].d[i])} / {pp(data.cal.C2.scen[l.key].d[i])}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
        <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
          <li className="flex items-center gap-2"><span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: AMBER }} />Calibration A: talkative</li>
          <li className="flex items-center gap-2"><span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: BLUE }} />Calibration B: forgiving</li>
          <li>Whiskers: 95% interval of the mean effect</li>
        </ul>
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-muted">
        Percentage points gained in the share of speakers aged 16+, each policy against the same 200 runs
        without it (same random seeds, so the noise cancels). All policies start in 2006. Both calibrations fit
        the survey data equally well; where their dots disagree, the data cannot tell us which is right.
      </figcaption>
    </figure>
  );
}
