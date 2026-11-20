'use client';

import { useState } from 'react';

// Tables 2 and 3 of the thesis: leave-one-out over six experiments, mean error in mm.
const MODELS = ['PatchTST', 'LSTM', 'GRU', 'TCN'] as const;
const WINDOWS = [24, 48, 72, 96];
const HORIZONS = [12, 24, 48, 72];
const DATA: Record<'rmse' | 'crps', number[][]> = {
  rmse: [
    [0.05259, 0.0502, 0.02797, 0.04653], [0.09784, 0.08428, 0.06043, 0.05425], [0.11868, 0.10218, 0.0967, 0.07978], [0.16804, 0.08844, 0.08969, 0.09942],
    [0.07422, 0.06587, 0.02895, 0.0257], [0.10535, 0.07661, 0.05303, 0.04025], [0.06609, 0.06028, 0.04916, 0.05445], [0.13245, 0.06536, 0.04124, 0.08282],
    [0.02875, 0.04888, 0.02802, 0.02444], [0.02807, 0.0709, 0.04091, 0.03405], [0.08831, 0.04335, 0.04199, 0.04822], [0.04577, 0.04537, 0.043, 0.04685],
    [0.04448, 0.05058, 0.04044, 0.02883], [0.02963, 0.04281, 0.02761, 0.02836], [0.02469, 0.05008, 0.06171, 0.04497], [0.09629, 0.16323, 0.11942, 0.08122],
  ],
  crps: [
    [0.03153, 0.03584, 0.01507, 0.02986], [0.07302, 0.06107, 0.03845, 0.03611], [0.08316, 0.07381, 0.07426, 0.05686], [0.12744, 0.05431, 0.06635, 0.07609],
    [0.04799, 0.04743, 0.01651, 0.01535], [0.08547, 0.05906, 0.04035, 0.02567], [0.03666, 0.04471, 0.03249, 0.03896], [0.10221, 0.04021, 0.02681, 0.06557],
    [0.01657, 0.03242, 0.01598, 0.01363], [0.01632, 0.05961, 0.02964, 0.02081], [0.06566, 0.0298, 0.02711, 0.03341], [0.02759, 0.02958, 0.02773, 0.03796],
    [0.02566, 0.03514, 0.02454, 0.01692], [0.01708, 0.02722, 0.01951, 0.01918], [0.01608, 0.04104, 0.05167, 0.03017], [0.06839, 0.07526, 0.05846, 0.04499],
  ],
};
const MAX = 0.17;

// sequential ramp: surface -> amber, stronger = larger error
function shade(v: number) {
  const t = Math.min(1, v / MAX);
  return `color-mix(in oklab, #c0832c ${Math.round(12 + 78 * t)}%, var(--color-surface))`;
}

export default function ModelMatrix() {
  const [metric, setMetric] = useState<'rmse' | 'crps'>('rmse');
  const [view, setView] = useState<'best' | number>('best');
  const [hover, setHover] = useState<number | null>(null);
  const rows = DATA[metric];
  const winner = rows.map((v) => v.indexOf(Math.min(...v)));
  const wins = MODELS.map((_, j) => winner.filter((w) => w === j).length);

  const btn = (on: boolean) =>
    `rounded-sm border px-2.5 py-1 text-sm transition-colors ${on ? 'border-signal text-text' : 'border-line text-muted hover:text-text'}`;

  return (
    <figure className="my-10">
      <div className="rounded-sm border border-line bg-surface/80 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Metric">
          <span className="mr-1 text-sm text-muted">Metric</span>
          {(['rmse', 'crps'] as const).map((k) => (
            <button key={k} type="button" className={btn(metric === k)} aria-pressed={metric === k} onClick={() => setMetric(k)}>
              {k.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2" role="group" aria-label="View">
          <span className="mr-1 text-sm text-muted">Show</span>
          <button type="button" className={btn(view === 'best')} aria-pressed={view === 'best'} onClick={() => setView('best')}>
            Best per mode
          </button>
          {MODELS.map((name, j) => (
            <button key={name} type="button" className={btn(view === j)} aria-pressed={view === j} onClick={() => setView(j)}>
              {name}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <div role="img" aria-label={`${metric.toUpperCase()} by training window and forecast horizon`}>
            <div className="grid grid-cols-[2.75rem_repeat(4,minmax(0,1fr))] gap-[2px] text-sm">
              <div />
              {HORIZONS.map((h) => (
                <div key={h} className="pb-1 text-center text-xs text-muted">+{h} h</div>
              ))}
              {WINDOWS.map((w, wi) => (
                <div key={w} className="contents">
                  <div className="flex items-center pr-2 text-xs text-muted">{w} h</div>
                  {HORIZONS.map((h, hi) => {
                    const k = wi * 4 + hi;
                    const j = view === 'best' ? winner[k] : view;
                    const v = rows[k][j];
                    const isWin = winner[k] === j;
                    const dark = v / MAX > 0.55;
                    return (
                      <div
                        key={h}
                        className="relative flex h-16 flex-col items-center justify-center rounded-[3px] outline-offset-[-2px]"
                        style={{ background: shade(v), outline: hover === k ? '2px solid var(--color-text)' : undefined }}
                        onMouseEnter={() => setHover(k)}
                        onMouseLeave={() => setHover(null)}
                      >
                        <span className={`tabular-nums ${dark ? 'text-ink' : 'text-text'}`}>{v.toFixed(3)}</span>
                        <span className={`text-xs ${dark ? 'text-ink/80' : 'text-muted'}`}>
                          {view === 'best' ? MODELS[j] : isWin ? 'best' : ''}
                        </span>
                        {hover === k && (
                          <div
                            className={`pointer-events-none absolute z-10 w-44 rounded-sm border border-line bg-ink p-2 text-xs text-text ${wi < 2 ? 'top-full mt-1' : 'bottom-full mb-1'} ${hi === 0 ? 'left-0' : hi === 3 ? 'right-0' : 'left-1/2 -translate-x-1/2'}`}
                          >
                            <p className="mb-1 text-muted">{w} h window, {h} h ahead</p>
                            {MODELS.map((nm, mj) => (
                              <p key={nm} className="flex justify-between tabular-nums">
                                <span className={winner[k] === mj ? 'text-signal' : ''}>{nm}</span>
                                <span>{rows[k][mj].toFixed(4)}</span>
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted">Rows: hours of history the model sees. Columns: how far ahead it forecasts. Stronger colour: larger error (mm).</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-muted">Modes won, out of 16</p>
          <ul className="mt-2 space-y-1.5">
            {MODELS.map((name, j) => (
              <li key={name} className="grid grid-cols-[5.5rem_1fr] items-center gap-3 text-sm">
                <span className={view === j ? 'text-text' : 'text-muted'}>{name}</span>
                <span className="flex items-center gap-2">
                  <span
                    className="h-3 rounded-r-[4px]"
                    style={{ width: `${(wins[j] / 16) * 100}%`, minWidth: 2, background: view === j || (view === 'best' && wins[j] === Math.max(...wins)) ? '#c0832c' : 'var(--color-muted)' }}
                  />
                  <span className="tabular-nums text-text">{wins[j]}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <details className="mt-6 text-sm text-muted">
          <summary className="cursor-pointer text-text">Show as table</summary>
          <div className="overflow-x-auto">
            <table className="mt-3 w-full min-w-[28rem] text-left tabular-nums">
              <thead>
                <tr className="border-b border-line">
                  <th className="py-1.5 font-medium">Window</th>
                  <th className="py-1.5 font-medium">Horizon</th>
                  {MODELS.map((m) => (
                    <th key={m} className="py-1.5 font-medium">{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((v, k) => (
                  <tr key={k} className="border-b border-line/60">
                    <td className="py-1.5">{WINDOWS[Math.floor(k / 4)]} h</td>
                    <td className="py-1.5">{HORIZONS[k % 4]} h</td>
                    {v.map((x, j) => (
                      <td key={j} className={`py-1.5 ${winner[k] === j ? 'text-text' : ''}`}>{x.toFixed(5)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-muted">
        Forecast error of the four architectures on the bench, by how much history they see and how far ahead they
        forecast. Leave-one-out over six experiments: train on five, test on the sixth, average the six results.
        RMSE scores the mean forecast; CRPS scores the whole predictive distribution. Both in millimetres, lower is
        better. Hover a cell to compare all four models.
      </figcaption>
    </figure>
  );
}
