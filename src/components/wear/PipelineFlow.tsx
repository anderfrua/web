'use client';

import { useState } from 'react';

type Stage = { id: string; name: string; where: string; role: string; detail: string[] };

const STAGES: Stage[] = [
  {
    id: 'labview',
    name: 'Acquisition',
    where: 'LabVIEW, lab PC',
    role: 'Logs motor, laser and load cell at 1 kHz, one set of files per five-minute block.',
    detail: [
      'Three independent tasks write three files per block, each with its own timestamps.',
      'In parallel, a TCP link streams the live signals straight to the backend for the real-time view.',
    ],
  },
  {
    id: 'auto',
    name: 'auto',
    where: 'Python, lab PC',
    role: 'Watches the data folder and starts the chain when a block is complete.',
    detail: [
      'Event-driven: nothing runs until all three files of a block exist, so the bench can stop and restart without touching the pipeline.',
      'A log of processed blocks makes restarts idempotent.',
    ],
  },
  {
    id: 'merge',
    name: 'datamerging',
    where: 'Python, lab PC',
    role: 'Synchronises the three sensors into one table.',
    detail: [
      'Aligns the streams on matching peaks, then merges them on the corrected time index.',
      'Tags each sample as ascending or descending stroke and fills gaps by monotone (PCHIP) interpolation. At 1 kHz against a motion of at most 1.67 Hz, interpolating between samples is safe.',
    ],
  },
  {
    id: 'wear',
    name: 'wear',
    where: 'Python, lab PC',
    role: 'Turns the laser signal into a wear curve.',
    detail: [
      'Takes the crest of the slider position in every cycle; wear is how far the crest has moved.',
      'Changes that are implausibly large for one step are flagged as anomalies and re-interpolated before smoothing.',
    ],
  },
  {
    id: 'predict',
    name: 'predict',
    where: 'Python + PyTorch, lab PC',
    role: 'Forecasts wear with the selected model and its uncertainty.',
    detail: [
      'Reads the model and its hyperparameters from a JSON file that the dashboard can edit.',
      'Scales inputs exactly as in training, cuts them into windows and runs 100 forward passes with dropout active.',
    ],
  },
  {
    id: 'backend',
    name: 'Backend',
    where: 'Flask + Socket.IO, any machine',
    role: 'Relays everything between the lab and the browser.',
    detail: [
      'Pushes new wear and predictions to the dashboard as events, and forwards the live TCP stream from LabVIEW.',
      'Writes configuration changes made in the dashboard back to the pipeline’s files.',
    ],
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    where: 'React, browser',
    role: 'Live signals, wear against prediction, history and controls.',
    detail: [
      'Real-time views of laser, motor and load cell; the wear curve with the forecast and its band.',
      'Loads past experiments, compares models side by side, and changes model, window and horizon in one click.',
    ],
  },
];

export default function PipelineFlow() {
  const [sel, setSel] = useState('wear');
  const s = STAGES.find((x) => x.id === sel)!;
  const lab = STAGES.slice(0, 5);
  const remote = STAGES.slice(5);

  const Node = ({ st, i }: { st: Stage; i: number }) => (
    <li>
      <button
        type="button"
        onClick={() => setSel(st.id)}
        aria-pressed={sel === st.id}
        className={`group flex w-full items-baseline gap-3 rounded-sm border px-3 py-2 text-left transition-colors ${
          sel === st.id ? 'border-signal bg-ink' : 'border-line hover:border-muted'
        }`}
      >
        <span className="tabular-nums text-xs text-muted">{i + 1}</span>
        <span className={`font-medium ${st.id.length < 12 && /^[a-z]/.test(st.name) ? 'font-mono text-[0.95em]' : ''} ${sel === st.id ? 'text-signal' : 'text-text'}`}>
          {st.name}
        </span>
      </button>
    </li>
  );

  return (
    <figure className="my-10">
      <div className="grid gap-6 rounded-sm border border-line bg-surface/80 p-5 sm:p-6 md:grid-cols-[13rem_1fr]">
        <div>
          <p className="mb-2 text-sm text-muted">In the lab, every five minutes</p>
          <ol className="space-y-1.5 border-l border-line pl-3">
            {lab.map((st, i) => (
              <Node key={st.id} st={st} i={i} />
            ))}
          </ol>
          <p className="mb-2 mt-5 text-sm text-muted">Anywhere, as events arrive</p>
          <ol className="space-y-1.5 border-l border-line pl-3">
            {remote.map((st, i) => (
              <Node key={st.id} st={st} i={i + 5} />
            ))}
          </ol>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            Live signals skip the batch: LabVIEW → backend → dashboard over TCP, in under a second.
          </p>
        </div>
        <div aria-live="polite" className="md:border-l md:border-line md:pl-6">
          <p className="text-sm text-muted">{s.where}</p>
          <p className="mt-1 font-serif text-2xl text-text">{s.name}</p>
          <p className="mt-3 leading-relaxed text-text">{s.role}</p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
            {s.detail.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-muted">
        The automated environment. Steps 1–5 run in one Docker image on the lab PC next to LabVIEW, with the data,
        models and configuration mounted as volumes; the backend and dashboard ship in a second image that can run on
        any machine. Pick a step to see what it does.
      </figcaption>
    </figure>
  );
}
