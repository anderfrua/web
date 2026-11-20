'use client';

import { useState } from 'react';
import { AMBER, BLUE, useWidth } from '../socio/useWidth';
import { pct, useAbm } from './data';

// Simulated share of Basque speakers aged 16+ against the Sociolinguistic Survey.
const M = { l: 40, r: 12, t: 14, b: 30 };
const H = 280;
const Y0 = 0.25, Y1 = 0.45, YR = [2006, 2024];

export default function ValidationChart() {
  const data = useAbm();
  const [cal, setCal] = useState<'C1' | 'C2'>('C1');
  const [hover, setHover] = useState<number | null>(null);
  const [box, W] = useWidth<HTMLDivElement>();

  const x = (yr: number) => M.l + ((yr - YR[0]) / (YR[1] - YR[0])) * (W - M.l - M.r);
  const y = (v: number) => M.t + (1 - (v - Y0) / (Y1 - Y0)) * (H - M.t - M.b);

  let band = '', line = '';
  if (data) {
    const c = data.cal[cal].base;
    const n = YR[1] - YR[0] + 1;
    const up = c.hi.slice(0, n).map((v, i) => `${i ? 'L' : 'M'}${x(YR[0] + i).toFixed(1)},${y(v).toFixed(1)}`).join('');
    const dn = c.lo.slice(0, n).map((v, i) => `L${x(YR[0] + n - 1 - i).toFixed(1)},${y(c.lo[n - 1 - i]).toFixed(1)}`).join('');
    band = up + dn + 'Z';
    line = c.mean.slice(0, n).map((v, i) => `${i ? 'L' : 'M'}${x(YR[0] + i).toFixed(1)},${y(v).toFixed(1)}`).join('');
  }

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const yr = Math.round(YR[0] + ((((e.clientX - r.left) / r.width) * W - M.l) / (W - M.l - M.r)) * (YR[1] - YR[0]));
    setHover(Math.max(YR[0], Math.min(YR[1], yr)));
  };

  const hv = data && hover !== null ? data.cal[cal].base : null;
  const si = hover !== null && data ? data.survey.years.indexOf(hover) : -1;
  const levels = data ? [data.survey.levels2021, data.cal[cal].levels2021] : null;

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
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full select-none" role="img" aria-label="Simulated and surveyed share of Basque speakers aged 16 and over, 2006 to 2024"
            onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
            {[0.25, 0.3, 0.35, 0.4, 0.45].map((v) => (
              <g key={v}>
                <line x1={M.l} x2={W - M.r} y1={y(v)} y2={y(v)} stroke="var(--color-line)" />
                <text x={M.l - 6} y={y(v) + 4} textAnchor="end" fontSize={11} fill="var(--color-muted)">{pct(v)}</text>
              </g>
            ))}
            {[2006, 2011, 2016, 2021, 2024].map((yr) => (
              <text key={yr} x={x(yr)} y={H - 10} textAnchor="middle" fontSize={11} fill="var(--color-muted)">{yr}</text>
            ))}
            <line x1={x(2016.5)} x2={x(2016.5)} y1={M.t} y2={H - M.b} stroke="var(--color-muted)" strokeDasharray="3 4" />
            <text x={x(2016.5) - 6} y={M.t + 10} textAnchor="end" fontSize={11} fill="var(--color-muted)">fitted</text>
            <text x={x(2016.5) + 6} y={M.t + 10} fontSize={11} fill="var(--color-muted)">predicted</text>
            <path d={band} fill={AMBER} opacity={0.18} />
            <path d={line} fill="none" stroke={AMBER} strokeWidth={2} />
            {data?.survey.years.map((yr, i) => (
              <circle key={yr} cx={x(yr)} cy={y(data.survey.share16[i])} r={5} fill={BLUE} stroke="var(--color-surface)" strokeWidth={2} />
            ))}
            {hover !== null && <line x1={x(hover)} x2={x(hover)} y1={M.t} y2={H - M.b} stroke="var(--color-muted)" />}
          </svg>
          {hv && hover !== null && (
            <div className="pointer-events-none absolute top-2 rounded-sm border border-line bg-ink/95 px-3 py-2 text-xs"
              style={{ left: Math.min(x(hover) / W, 0.62) * 100 + '%' }}>
              <p className="font-medium text-text">{hover}</p>
              <p className="text-muted">Model <span className="tabular-nums text-text">{pct(hv.mean[hover - 2006], 1)}</span></p>
              <p className="text-muted">80% of runs <span className="tabular-nums text-text">{pct(hv.lo[hover - 2006])}–{pct(hv.hi[hover - 2006])}</span></p>
              {si >= 0 && <p className="text-muted">Survey <span className="tabular-nums text-text">{pct(data!.survey.share16[si], 1)}</span></p>}
            </div>
          )}
        </div>
        <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
          <li className="flex items-center gap-2"><span className="inline-block h-0.5 w-4" style={{ background: AMBER }} />Model, mean of 200 runs</li>
          <li className="flex items-center gap-2"><span className="inline-block h-2.5 w-4" style={{ background: AMBER, opacity: 0.3 }} />80% of runs</li>
          <li className="flex items-center gap-2"><span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: BLUE }} />Sociolinguistic Survey</li>
        </ul>

        {levels && (
          <div className="mt-6 border-t border-line pt-4">
            <p className="text-sm text-muted">Fluency of people aged 16+ in 2021</p>
            <div className="mt-3 grid gap-2 text-xs">
              {['No Basque', 'Easier in Spanish', 'Equally easy', 'Easier in Basque'].map((name, k) => (
                <div key={name} className="grid grid-cols-[7.5rem_1fr] items-center gap-3 sm:grid-cols-[9rem_1fr]">
                  <span className="text-muted">{name}</span>
                  <div className="space-y-1">
                    {levels.map((lv, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <div className="h-2.5 rounded-r-sm" style={{ width: `${(lv[k] / 0.75) * 85}%`, background: j ? AMBER : BLUE }} />
                        <span className="tabular-nums text-text">{pct(lv[k])}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-muted">
        Share of people aged 16 and over who speak Basque in the Basque Autonomous Community. Three scale
        factors were fitted to the 2011 and 2016 surveys; 2021 was left out and is a prediction. The bars
        compare the 2021 fluency mix, survey (blue) and model (amber).
      </figcaption>
    </figure>
  );
}
