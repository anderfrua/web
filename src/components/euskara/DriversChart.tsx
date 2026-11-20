'use client';

import { useState } from 'react';
import { AMBER, BLUE, PINK, useWidth } from '../socio/useWidth';
import { pct, useAbm } from './data';

// Counterfactuals: switch one mechanism off at a time and re-run 2006–2050.
const SERIES = [
  { key: 'base', label: 'Calibrated model', color: 'var(--color-text)', dash: '' },
  { key: 'noschool', label: 'No Basque at school', color: AMBER, dash: '' },
  { key: 'nobrave', label: 'Nobody opens in Basque', color: PINK, dash: '' },
  { key: 'noint', label: 'No conversations', color: BLUE, dash: '' },
  { key: 'notrans', label: 'No transmission at home', color: 'var(--color-muted)', dash: '5 4' },
] as const;

const M = { l: 40, r: 12, t: 12, b: 30 };
const H = 300;
const Y1 = 0.6;

export default function DriversChart() {
  const data = useAbm();
  const [cal, setCal] = useState<'C1' | 'C2'>('C1');
  const [hover, setHover] = useState<number | null>(null);
  const [box, W] = useWidth<HTMLDivElement>();
  const yrs = data?.years ?? [];
  const Y0 = 2006, YE = 2050;
  const x = (yr: number) => M.l + ((yr - Y0) / (YE - Y0)) * (W - M.l - M.r);
  const y = (v: number) => M.t + (1 - v / Y1) * (H - M.t - M.b);
  const get = (k: string) => (data ? (k === 'base' ? data.cal[cal].base.mean : data.cal[cal].scen[k].mean) : []);
  const path = (v: number[]) => v.map((p, i) => `${i ? 'L' : 'M'}${x(yrs[i]).toFixed(1)},${y(p).toFixed(1)}`).join('');

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const yr = Math.round(Y0 + ((((e.clientX - r.left) / r.width) * W - M.l) / (W - M.l - M.r)) * (YE - Y0));
    setHover(Math.max(Y0, Math.min(YE, yr)));
  };

  return (
    <figure className="my-10">
      <div className="rounded-sm border border-line bg-surface/80 p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted">Calibration</span>
          {(['C1', 'C2'] as const).map((c) => (
            <button key={c} type="button" onClick={() => setCal(c)} aria-pressed={cal === c}
              className={`rounded-sm border px-2.5 py-1 ${cal === c ? 'border-signal text-text' : 'border-line text-muted hover:text-text'}`}>
              {c === 'C1' ? 'A: talkative' : 'B: forgiving'}
            </button>
          ))}
        </div>
        <div ref={box} className="relative">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full select-none" role="img" aria-label="Share of Basque speakers aged 16 and over to 2050 when one mechanism is switched off"
            onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
            {[0, 0.2, 0.4, 0.6].map((v) => (
              <g key={v}>
                <line x1={M.l} x2={W - M.r} y1={y(v)} y2={y(v)} stroke="var(--color-line)" />
                <text x={M.l - 6} y={y(v) + 4} textAnchor="end" fontSize={11} fill="var(--color-muted)">{pct(v)}</text>
              </g>
            ))}
            {[2006, 2020, 2035, 2050].map((yr) => (
              <text key={yr} x={x(yr)} y={H - 10} textAnchor="middle" fontSize={11} fill="var(--color-muted)">{yr}</text>
            ))}
            {data && SERIES.slice().reverse().map((s) => (
              <path key={s.key} d={path(get(s.key))} fill="none" stroke={s.color} strokeWidth={s.key === 'base' ? 2.5 : 2} strokeDasharray={s.dash} />
            ))}
            {hover !== null && <line x1={x(hover)} x2={x(hover)} y1={M.t} y2={H - M.b} stroke="var(--color-muted)" />}
          </svg>
          {data && hover !== null && (
            <div className="pointer-events-none absolute top-2 rounded-sm border border-line bg-ink/95 px-3 py-2 text-xs"
              style={{ left: Math.min(x(hover) / W, 0.55) * 100 + '%' }}>
              <p className="font-medium text-text">{hover}</p>
              {SERIES.map((s) => (
                <p key={s.key} className="flex justify-between gap-4 text-muted">
                  {s.label}<span className="tabular-nums text-text">{pct(get(s.key)[hover - Y0], 1)}</span>
                </p>
              ))}
            </div>
          )}
        </div>
        <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
          {SERIES.map((s) => (
            <li key={s.key} className="flex items-center gap-2">
              <svg width="16" height="4" aria-hidden><line x1="0" x2="16" y1="2" y2="2" stroke={s.color} strokeWidth="2" strokeDasharray={s.dash ? '4 3' : ''} /></svg>
              {s.label}
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-muted">
        Share of people aged 16+ who speak Basque, mean of 200 runs per line. Each line switches off one
        mechanism and keeps the rest. Hover to read the values. The dashed line sits almost exactly on the
        calibrated model.
      </figcaption>
    </figure>
  );
}
