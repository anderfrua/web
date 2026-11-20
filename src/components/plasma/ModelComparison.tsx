'use client';

import { useState } from 'react';

type Row = { model: string; detail: string; cam: number; noCam: number };

const SERIES = [
  { key: 'cam' as const, label: 'With camera (luminosity)', color: '#c0832c' },
  { key: 'noCam' as const, label: 'Without camera (RF signals only)', color: '#5f8fd6' },
];

export default function ModelComparison({
  rows,
  caption,
  ariaLabel,
}: {
  rows: Row[];
  caption: React.ReactNode;
  ariaLabel: string;
}) {
  const [hover, setHover] = useState<string | null>(null);

  return (
    <figure className="my-10">
      <div className="rounded-sm border border-line bg-surface/80 p-5 sm:p-6">
        <ul className="mb-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted" aria-label="Legend">
          {SERIES.map((s) => (
            <li key={s.key} className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />
              {s.label}
            </li>
          ))}
        </ul>

        <div role="img" aria-label={ariaLabel} className="space-y-5">
          {rows.map((r) => (
            <div key={r.model} className="grid gap-2 sm:grid-cols-[9rem_1fr] sm:gap-4">
              <div>
                <p className="text-sm font-medium text-text">{r.model}</p>
                <p className="text-xs text-muted">{r.detail}</p>
              </div>
              <div className="space-y-[2px]">
                {SERIES.map((s) => {
                  const v = r[s.key];
                  const id = `${r.model}-${s.key}`;
                  return (
                    <div
                      key={s.key}
                      className="relative flex h-6 items-center"
                      onMouseEnter={() => setHover(id)}
                      onMouseLeave={() => setHover(null)}
                    >
                      <div className="absolute inset-y-0 left-0 right-12 rounded-r bg-line/40" aria-hidden />
                      <div
                        className="relative h-full rounded-r-[4px] transition-opacity"
                        style={{
                          width: `calc((100% - 3rem) * ${v < 50 ? 0.5 : v / 100})`,
                          background:
                            v < 50
                              ? `repeating-linear-gradient(135deg, ${s.color} 0 3px, transparent 3px 7px)`
                              : s.color,
                          opacity: hover && hover !== id ? 0.45 : 1,
                        }}
                      />
                      <span className="ml-2 text-sm tabular-nums text-text">{v < 50 ? '<50%' : `${v}%`}</span>
                      {hover === id && (
                        <span className="pointer-events-none absolute -top-8 left-0 z-10 whitespace-nowrap rounded-sm border border-line bg-ink px-2 py-1 text-xs text-text">
                          {r.model}, {s.label.toLowerCase()}: F1 {v < 50 ? 'below 50%' : `${v}%`}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <details className="mt-6 text-sm text-muted">
          <summary className="cursor-pointer text-text">Show as table</summary>
          <table className="mt-3 w-full text-left tabular-nums">
            <thead>
              <tr className="border-b border-line">
                <th className="py-1.5 font-medium">Model</th>
                <th className="py-1.5 font-medium">With camera</th>
                <th className="py-1.5 font-medium">Without camera</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.model} className="border-b border-line/60">
                  <td className="py-1.5">{r.model}</td>
                  <td className="py-1.5">{r.cam < 50 ? '<50%' : `${r.cam}%`}</td>
                  <td className="py-1.5">{r.noCam < 50 ? '<50%' : `${r.noCam}%`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-muted">{caption}</figcaption>
    </figure>
  );
}
