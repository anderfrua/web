'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

type Entry = {
  period: string;
  title: string;
  place: string;
  detail: string;
  current?: boolean;
};

const timeline: Entry[] = [
  {
    period: '2026 – present',
    title: 'PhD candidate, Computational Neuroimaging Lab',
    place: 'BioBizkaia Health Research Institute · Biomedical Research PhD programme, UPV/EHU',
    detail:
      'Doctoral research under Prof. Jesús M. Cortés on computational neuroscience and neuroimaging, applying machine learning to the study of the brain and neurological disease.',
    current: true,
  },
  {
    period: '2025',
    title: 'Data science & AI intern',
    place: 'Ikerlan Technology Research Centre',
    detail:
      'Prognostics and health management for mechanical systems: built an automated pipeline for acquiring, processing and predicting wear from experimental data in real time, plus an interactive tool for predictive maintenance.',
  },
  {
    period: '2025',
    title: 'MSc in Big Data & Visual Analytics',
    place: 'UNIR',
    detail: 'Specialisation in artificial intelligence and machine learning.',
  },
  {
    period: '2025',
    title: 'BSc in Physics & BSc in Electronic Engineering (double degree)',
    place: 'University of the Basque Country (UPV/EHU)',
    detail:
      'Two final-year theses: machine-learning classification of plasma states in an ECR ion source (2024, graded 9.4/10), and a sociophysical model of Spanish voting dynamics (2025).',
  },
];

const skills = [
  {
    group: 'Methods',
    items: [
      'Machine learning and neural networks',
      'Agent-based and Monte Carlo simulation',
      'Statistical-physics modelling',
      'Signal processing of experimental data',
      'Interactive data visualisation',
    ],
  },
  {
    group: 'Tools',
    items: ['Python', 'scikit-learn', 'TensorFlow / Keras', 'Jupyter', 'MongoDB', 'Google Cloud', 'Ollama'],
  },
  {
    group: 'Languages',
    items: ['Spanish (native)', 'English (C2)', 'Basque (C1)', 'French (B1)'],
  },
];

export default function Home() {
  const reduce = useReducedMotion();
  const reveal = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <div className="mx-auto max-w-5xl px-6">
      {/* Hero */}
      <section className="flex min-h-[calc(100svh-4rem)] flex-col justify-center py-20">
        <motion.p {...reveal(0)} className="mb-5 text-muted">
          Physicist & electronics engineer
        </motion.p>
        <motion.h1
          {...reveal(0.08)}
          className="font-serif text-5xl leading-[1.05] tracking-tight text-text sm:text-7xl"
        >
          Ander Fernández Rúa
        </motion.h1>
        <motion.p
          {...reveal(0.16)}
          className="mt-8 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl"
        >
          PhD researcher at the{' '}
          <span className="text-text">Computational Neuroimaging Lab, BioBizkaia Health Research Institute</span>
          . I use machine learning and the tools of statistical physics to model complex systems, from
          plasma in a particle accelerator to the human brain.
        </motion.p>
        <motion.div {...reveal(0.24)} className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/publications"
            className="rounded-sm bg-signal px-5 py-2.5 font-medium text-ink transition-colors hover:bg-[#f0bb68]"
          >
            Read my publications
          </Link>
          <Link
            href="/contact"
            className="rounded-sm border border-line px-5 py-2.5 text-text transition-colors hover:border-muted"
          >
            Get in touch
          </Link>
        </motion.div>
      </section>

      {/* About */}
      <section id="about" className="grid gap-6 border-t border-line py-20 md:grid-cols-[12rem_1fr]">
        <h2 className="font-serif text-2xl text-text">About</h2>
        <div className="max-w-[65ch] space-y-5 leading-relaxed text-muted">
          <p>
            I trained as both a physicist and an electronic engineer at the UPV/EHU, because I wanted to
            understand how things work and also build things that work. Data and machine learning became
            the bridge between the two.
          </p>
          <p>
            My first paper, presented at the ECRIS 2024 workshop in Darmstadt, used machine learning to
            recognise plasma states in an ion source without disturbing it. Since then I have applied
            sociophysics to electoral data, built predictive-maintenance systems at Ikerlan, and moved
            into computational neuroimaging for my PhD.
          </p>
          <p>
            Outside research I read a lot of science fiction and spend more time than I should on video
            games. I built this site from scratch.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section id="experience" className="grid gap-6 border-t border-line py-20 md:grid-cols-[12rem_1fr]">
        <h2 className="font-serif text-2xl text-text">Experience & education</h2>
        <ol className="relative max-w-[65ch] border-l border-line">
          {timeline.map((e) => (
            <li key={e.title} className="relative pb-12 pl-8 last:pb-0">
              <span
                aria-hidden
                className={`absolute -left-[5px] top-1.5 h-[9px] w-[9px] rounded-full ${
                  e.current ? 'bg-signal ring-4 ring-signal/20' : 'border border-muted bg-ink'
                }`}
              />
              <p className="text-sm tabular-nums text-muted">{e.period}</p>
              <h3 className="mt-1 text-lg font-medium text-text">{e.title}</h3>
              <p className="text-sm text-muted">{e.place}</p>
              <p className="mt-3 leading-relaxed text-muted">{e.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Skills */}
      <section id="skills" className="grid gap-6 border-t border-line py-20 md:grid-cols-[12rem_1fr]">
        <h2 className="font-serif text-2xl text-text">Skills</h2>
        <div className="grid gap-10 sm:grid-cols-3">
          {skills.map(({ group, items }) => (
            <div key={group}>
              <h3 className="mb-3 font-medium text-text">{group}</h3>
              <ul className="space-y-2 text-sm leading-snug text-muted">
                {items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
