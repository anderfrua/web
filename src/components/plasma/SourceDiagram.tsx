'use client';

import { useState } from 'react';

// Interactive cross-section of the PIT30 source, redrawn from the thesis figure.
// Geometry is schematic (roughly 600 mm end to end).

type Part = { n: number; name: string; note: string };

const PARTS: Part[] = [
  { n: 1, name: 'Gas inlet', note: 'Hydrogen enters the chamber here. Its flow, swept between 0.7 and 5 sccm, is one of the two knobs in every experiment.' },
  { n: 2, name: 'RF port', note: '3 GHz microwaves come in here. The forward and reflected power and the tuner matching measured on this line are the signals that end up replacing the camera.' },
  { n: 3, name: 'Permanent magnets', note: 'A Halbach array that sets a 110 mT field, the value at which electrons resonate with 3 GHz microwaves.' },
  { n: 4, name: 'Plasma chamber', note: 'Where the gas is ionised. The colour and brightness of its glow is what the camera, and the technician, used to judge the state.' },
  { n: 5, name: 'Extraction electrodes', note: 'A stack of electrodes at high voltage that pulls the ions out of the plasma and shapes them into a beam.' },
  { n: 6, name: 'Vacuum pump', note: 'Keeps the beamline at low pressure so the beam is not scattered by residual gas.' },
  { n: 7, name: 'Pressure sensor', note: 'Monitors the vacuum in the diagnostics chamber.' },
  { n: 8, name: 'Beam diagnostics', note: 'Measures the extracted beam at the end of the line.' },
];

const STROKE = 'var(--color-muted)';

export default function SourceDiagram() {
  const [active, setActive] = useState<number | null>(null);
  const current = PARTS.find((p) => p.n === active);

  const part = (n: number) => {
    const on = active === n;
    const dim = active !== null && !on;
    return {
      tabIndex: 0,
      role: 'button',
      'aria-label': `${n}. ${PARTS[n - 1].name}`,
      'aria-pressed': on,
      onMouseEnter: () => setActive(n),
      onMouseLeave: () => setActive(null),
      onFocus: () => setActive(n),
      onBlur: () => setActive(null),
      onClick: () => setActive(n),
      className: 'cursor-pointer outline-none transition-opacity duration-150',
      style: { opacity: dim ? 0.35 : 1 },
    };
  };
  const fill = (n: number, base = 'var(--color-line)') => (active === n ? '#c0832c' : base);
  const fillOp = (n: number) => (active === n ? 0.55 : 0.7);

  const label = (n: number, x: number, y: number) => (
    <text x={x} y={y} textAnchor="middle" fontSize={15} fill={active === n ? 'var(--color-text)' : 'var(--color-muted)'} fontWeight={active === n ? 600 : 400} pointerEvents="none">
      {n}
    </text>
  );

  return (
    <figure className="my-10">
      <div className="rounded-sm border border-line bg-surface/80 p-4 sm:p-5">
        <style>{`
          @keyframes pit-beam { from { transform: translateX(0); opacity: 0 } 10% { opacity: 1 } 90% { opacity: 1 } to { transform: translateX(490px); opacity: 0 } }
          @keyframes pit-glow { 0%,100% { opacity: .55 } 50% { opacity: .9 } }
          .pit-beam { animation: pit-beam 2.4s linear infinite }
          .pit-glow { animation: pit-glow 3.2s ease-in-out infinite }
          @media (prefers-reduced-motion: reduce) { .pit-beam { animation: none; opacity: 0 } .pit-glow { animation: none } }
        `}</style>
        <svg viewBox="40 0 820 440" className="w-full select-none" role="group" aria-label="Cross-section of the PIT30 ion source. Select a part to read what it does.">
          <defs>
            <radialGradient id="pit-plasma" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="#e8a849" stopOpacity={0.95} />
              <stop offset="60%" stopColor="#c0832c" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#c0832c" stopOpacity={0} />
            </radialGradient>
          </defs>

          {/* centre line of the beam */}
          <line x1={150} x2={830} y1={197} y2={197} stroke="var(--color-line)" strokeDasharray="6 6" />

          {/* 4 plasma chamber (drawn first, sits inside the flanges) */}
          <g {...part(4)}>
            <rect x={165} y={160} width={115} height={75} fill="var(--color-ink)" stroke={STROKE} strokeWidth={1.5} />
            <ellipse className="pit-glow" cx={225} cy={197} rx={52} ry={30} fill="url(#pit-plasma)" />
            {active === 4 && <rect x={165} y={160} width={115} height={75} fill="none" stroke="#c0832c" strokeWidth={2.5} />}
          </g>

          {/* back flange of the source */}
          <rect x={148} y={130} width={17} height={130} fill="var(--color-line)" stroke={STROKE} strokeWidth={1} />

          {/* 3 magnets */}
          <g {...part(3)}>
            <rect x={193} y={128} width={62} height={30} fill={fill(3)} fillOpacity={fillOp(3)} stroke={STROKE} strokeWidth={1.5} />
            <rect x={193} y={237} width={62} height={30} fill={fill(3)} fillOpacity={fillOp(3)} stroke={STROKE} strokeWidth={1.5} />
            <text x={224} y={148} textAnchor="middle" fontSize={11} fill="var(--color-text)" pointerEvents="none">N</text>
            <text x={224} y={257} textAnchor="middle" fontSize={11} fill="var(--color-text)" pointerEvents="none">S</text>
          </g>

          {/* 1 gas inlet */}
          <g {...part(1)}>
            <rect x={50} y={160} width={125} height={18} fill="transparent" />
            <line x1={57} x2={168} y1={169} y2={169} stroke={active === 1 ? '#c0832c' : STROKE} strokeWidth={4} strokeLinecap="round" />
          </g>

          {/* 2 RF port */}
          <g {...part(2)}>
            <path d="M118 190 h34 l6 -6 h22 v24 h-22 l-6 -6 h-34 z" fill={fill(2)} fillOpacity={fillOp(2)} stroke={STROKE} strokeWidth={1.5} />
          </g>

          {/* flange between source and extraction */}
          <rect x={280} y={110} width={20} height={175} fill="var(--color-line)" stroke={STROKE} strokeWidth={1} />

          {/* 5 extraction electrodes */}
          <g {...part(5)}>
            <rect x={298} y={140} width={36} height={115} fill="transparent" />
            {[304, 313, 322].map((x) => (
              <g key={x}>
                <rect x={x} y={145} width={5} height={42} rx={1} fill={fill(5, 'var(--color-muted)')} />
                <rect x={x} y={207} width={5} height={42} rx={1} fill={fill(5, 'var(--color-muted)')} />
              </g>
            ))}
          </g>

          {/* drift tube */}
          <path d="M334 145 L355 128 H468 L490 145 V250 L468 267 H355 L334 250 Z" fill="var(--color-ink)" stroke={STROKE} strokeWidth={1.5} />
          <rect x={355} y={124} width={113} height={8} fill="var(--color-line)" />
          <rect x={355} y={263} width={113} height={8} fill="var(--color-line)" />

          {/* flange into the diagnostics cross */}
          <rect x={496} y={110} width={40} height={175} fill="var(--color-line)" stroke={STROKE} strokeWidth={1} />

          {/* diagnostics cross */}
          <path
            d="M536 140 H612 V70 H735 V140 H808 V255 H735 V325 H612 V255 H536 Z"
            fill="var(--color-ink)"
            stroke={STROKE}
            strokeWidth={1.5}
          />
          <circle cx={673} cy={197} r={58} fill="none" stroke={STROKE} strokeWidth={1} />
          <circle cx={673} cy={197} r={54} fill="none" stroke="var(--color-line)" strokeWidth={1} />
          {/* flanges of the cross */}
          <rect x={586} y={46} width={172} height={24} fill="var(--color-line)" stroke={STROKE} strokeWidth={1} />
          <rect x={586} y={325} width={172} height={24} fill="var(--color-line)" stroke={STROKE} strokeWidth={1} />
          <rect x={808} y={110} width={20} height={175} fill="var(--color-line)" stroke={STROKE} strokeWidth={1} />

          {/* 7 pressure sensor (top port) */}
          <g {...part(7)}>
            <rect x={640} y={14} width={66} height={32} rx={3} fill={fill(7)} fillOpacity={fillOp(7)} stroke={STROKE} strokeWidth={1.5} />
          </g>

          {/* 8 beam diagnostics (end plate) */}
          <g {...part(8)}>
            <rect x={828} y={150} width={18} height={95} rx={2} fill={fill(8)} fillOpacity={fillOp(8)} stroke={STROKE} strokeWidth={1.5} />
          </g>

          {/* 6 vacuum pump */}
          <g {...part(6)}>
            <line x1={673} x2={673} y1={349} y2={372} stroke={STROKE} strokeWidth={1.5} />
            <path d="M667 366 L673 374 L679 366" fill="none" stroke={STROKE} strokeWidth={1.5} />
            <circle cx={673} cy={400} r={22} fill={fill(6)} fillOpacity={fillOp(6)} stroke={STROKE} strokeWidth={1.5} />
            <circle cx={673} cy={400} r={11} fill="none" stroke={STROKE} strokeWidth={1.5} />
            <circle cx={673} cy={400} r={5} fill="none" stroke={STROKE} strokeWidth={1.5} />
          </g>

          {/* ion beam */}
          <g pointerEvents="none">
            {[0, 0.6, 1.2, 1.8].map((d) => (
              <circle key={d} className="pit-beam" cx={336} cy={197} r={3} fill="#e8a849" style={{ animationDelay: `${d}s` }} />
            ))}
          </g>

          {label(1, 92, 155)}
          {label(2, 104, 204)}
          {label(3, 224, 120)}
          {label(4, 225, 228)}
          {label(5, 315, 132)}
          {label(6, 712, 405)}
          {label(7, 723, 35)}
          {label(8, 852, 140)}

          {/* scale */}
          <g fill="var(--color-muted)" fontSize={11}>
            <line x1={148} x2={846} y1={432} y2={432} stroke="var(--color-line)" />
            <line x1={148} x2={148} y1={427} y2={437} stroke="var(--color-line)" />
            <line x1={846} x2={846} y1={427} y2={437} stroke="var(--color-line)" />
            <text x={400} y={428} textAnchor="middle">≈ 600 mm</text>
          </g>
        </svg>

        <ol className="mt-4 flex flex-wrap gap-1.5" aria-label="Parts of the source">
          {PARTS.map((p) => (
            <li key={p.n}>
              <button
                type="button"
                onMouseEnter={() => setActive(p.n)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(p.n)}
                onBlur={() => setActive(null)}
                onClick={() => setActive(p.n)}
                aria-pressed={active === p.n}
                className={`rounded-sm border px-2.5 py-1 text-sm transition-colors ${
                  active === p.n ? 'border-signal text-text' : 'border-line text-muted hover:text-text'
                }`}
              >
                <span className="tabular-nums">{p.n}</span> {p.name}
              </button>
            </li>
          ))}
        </ol>
        <p className="mt-3 min-h-[3rem] text-sm leading-relaxed text-text" aria-live="polite">
          {current ? (
            <>
              <span className="font-medium">{current.name}.</span> {current.note}
            </>
          ) : (
            <span className="text-muted">Hover or tap a part to see what it does. The dots show the ion beam leaving the plasma.</span>
          )}
        </p>
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-muted">
        Cross-section of PIT30, about 600 mm end to end, redrawn from the thesis. Microwaves and gas go in on the
        left; ions come out as a beam to the right.
      </figcaption>
    </figure>
  );
}
