'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

const research = [
  {
    title: 'Whole-brain network models',
    body: 'Dynamical models running on structural and functional connectomes, to explain how large-scale brain activity emerges from anatomy and how it reorganises with ageing and neurodegeneration.',
  },
  {
    title: 'Brain and metabolism',
    body: 'Coupling physiological models of glucose and insulin regulation to brain network dynamics, to ask how insulin resistance and metabolic state shape neural synchronisation and cognition.',
  },
  {
    title: 'Biological data meets neuroimaging',
    body: 'Integrating gene-expression maps and clinical data with neuroimaging, and using machine learning to find markers of brain health and disease.',
  },
];

type Entry = { period: string; title: string; place: string; detail?: string | string[]; current?: boolean };

const timeline: Entry[] = [
  {
    period: '2026 – present',
    title: 'PhD researcher, Computational Neuroimaging Lab',
    place: 'BioBizkaia Health Research Institute, Cruces University Hospital · PhD in Biomedical Research, UPV/EHU',
    detail:
      'Supervised by Prof. Jesús M. Cortés (Ikerbasque) and Ivan Carcamo. Mathematical and computational modelling of brain dynamics and connectivity, applied to brain ageing, neurodegenerative disease and the interplay between brain and metabolism.',
    current: true,
  },
  {
    period: '2025 – 2026',
    title: 'Data scientist, AI & Data department',
    place: 'Ikerlan Technology Research Centre',
    detail:
      'Worked on an industrial prognostics and health management (PHM) project for wind turbines, predicting mechanical wear from sensor time series with machine learning. I designed and built an automated pipeline that acquires, processes and makes real-time predictions on experimental wear data, and an interactive tool that lets engineers use those predictions for predictive maintenance.',
  },
  {
    period: '2025',
    title: 'MSc in Big Data & Visual Analytics',
    place: 'UNIR · Specialisation in artificial intelligence and automated reasoning',
    detail:
      'Processing and analysing large datasets, machine learning, and visual analytics: turning complex data into visualisations people can explore and reason with.',
  },
  {
    period: '2019 – 2024',
    title: 'Double degree in Physics and Electronic Engineering',
    place: 'University of the Basque Country (UPV/EHU)',
    detail: [
      'Electronic engineering thesis: machine-learning classification of plasma states in an ECR ion source from sensor signals, published as a first-author paper at ECRIS 2024.',
      'Physics thesis: statistical-physics models (Ising-type agents, Markov chains) of Spanish voting behaviour.',
    ],
  },
  {
    period: '2023',
    title: 'Research internship',
    place: 'UPV/EHU, group of Dr. Hegoi Manzano',
    detail: 'Code to compute topological rigidity in disordered materials.',
  },
];

const skills = [
  {
    group: 'Modelling',
    items: [
      'Dynamical systems and differential-equation models',
      'Network dynamics and synchronisation',
      'Statistical physics and agent-based simulation',
      'Markov and Monte Carlo methods',
    ],
  },
  {
    group: 'Data & learning',
    items: [
      'Time-series and signal analysis',
      'Machine learning: random forests, clustering, PCA',
      'Neural networks, including recurrent (LSTM)',
      'Interactive data visualisation',
    ],
  },
  {
    group: 'Programming',
    items: ['Python (NumPy, SciPy, scikit-learn, TensorFlow/Keras)', 'MATLAB', 'Fortran', 'Java', 'Git'],
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
          PhD researcher in computational neuroscience
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
          I build mathematical and computational models of brain networks to understand how they
          age, how they fail in neurodegenerative disease, and how the body’s metabolism shapes them.
          Based at the <span className="text-text">Computational Neuroimaging Lab, BioBizkaia Health Research Institute</span>.
        </motion.p>
        <motion.div {...reveal(0.24)} className="mt-10 flex flex-wrap gap-3">
          <a
            href="#research"
            className="rounded-sm bg-signal px-5 py-2.5 font-medium text-ink transition-colors hover:bg-[#f0bb68]"
          >
            See my research
          </a>
          <Link
            href="/contact"
            className="rounded-sm border border-line px-5 py-2.5 text-text transition-colors hover:border-muted"
          >
            Get in touch
          </Link>
        </motion.div>
      </section>

      {/* Research */}
      <section id="research" className="grid scroll-mt-20 gap-6 border-t border-line py-20 md:grid-cols-[12rem_1fr]">
        <h2 className="font-serif text-2xl text-text">Research</h2>
        <div>
          <p className="max-w-[65ch] leading-relaxed text-muted">
            The brain is a network of billions of interacting parts whose collective behaviour we can
            measure, but still struggle to predict. My PhD treats it the way a physicist treats any
            complex system: write down a model, fit it to data, and see where it breaks.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {research.map(({ title, body }) => (
              <div key={title} className="border-t border-signal/50 pt-4">
                <h3 className="font-medium text-text">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="grid gap-6 border-t border-line py-20 md:grid-cols-[12rem_1fr]">
        <h2 className="font-serif text-2xl text-text">About</h2>
        <div className="max-w-[65ch] space-y-5 leading-relaxed text-muted">
          <p>
            <span className="text-text">
              I keep asking the same question of very different systems: how do many simple parts add
              up to something that behaves as a whole?
            </span>{' '}
            I first asked it of a hydrogen plasma, training a classifier to tell its states apart from
            sensor signals alone. That became my first paper. Then of voters, with Ising models and
            Markov chains fitted to forty years of Spanish elections. Then of wind turbines wearing
            out at Ikerlan.
          </p>
          <p>
            The brain is where that question gets hardest and where the answer matters most. It is
            noisy, multiscale and tied to the rest of the body, and getting its models right has
            consequences for how we understand ageing, dementia and metabolic disease. That is
            what I want to spend my career on.
          </p>
          <p>
            I trained as both a physicist and an electronic engineer, so I am as comfortable deriving
            a model as writing the pipeline that tests it against data. When I am not doing either,
            I am probably reading science fiction.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section id="experience" className="grid gap-6 border-t border-line py-20 md:grid-cols-[12rem_1fr]">
        <h2 className="font-serif text-2xl text-text">Experience & education</h2>
        <ol className="relative max-w-[65ch] border-l border-line">
          {timeline.map((e) => (
            <li key={e.title} className="relative pb-10 pl-8 last:pb-0">
              <span
                aria-hidden
                className={`absolute -left-[5px] top-1.5 h-[9px] w-[9px] rounded-full ${
                  e.current ? 'bg-signal ring-4 ring-signal/20' : 'border border-muted bg-ink'
                }`}
              />
              <p className="text-sm tabular-nums text-muted">{e.period}</p>
              <h3 className={`mt-1 font-medium text-text ${e.current ? 'text-xl' : 'text-base'}`}>{e.title}</h3>
              <p className="text-sm text-muted">{e.place}</p>
              {typeof e.detail === 'string' && (
                <p className="mt-2 text-sm leading-relaxed text-muted">{e.detail}</p>
              )}
              {Array.isArray(e.detail) && (
                <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-muted marker:text-signal/70">
                  {e.detail.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* Skills */}
      <section id="skills" className="grid gap-6 border-t border-line py-20 md:grid-cols-[12rem_1fr]">
        <h2 className="font-serif text-2xl text-text">Skills</h2>
        <div>
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
          <p className="mt-10 text-sm text-muted">
            Languages: Spanish (native), English (C2), Basque (C1), French (B1), German (basic).
          </p>
        </div>
      </section>
    </div>
  );
}
