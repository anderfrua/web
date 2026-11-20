import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Research projects by Ander Fernández Rúa.',
};

const projects = [
  {
    slug: 'project1',
    year: '2024',
    title: 'Reading a plasma without touching it',
    description: `Machine learning that detects and classifies state changes in the hydrogen plasma of a particle-accelerator ion source, using only signals the source already measures. First-author paper at ECRIS 2024.`,
    image: '/images/projects/plasma/source.png',
    cover: true,
    tags: ['Plasma physics', 'Time series', 'Machine learning', 'Particle accelerators'],
  },
  {
    slug: 'project2',
    year: '2025',
    title: 'Voters, spins and memory',
    description: `Statistical physics applied to Spanish politics: a universal law in Senate votes, a Markov chain of incumbency, and an Ising-type model of how districts vote that you can run in the browser.`,
    image: '/images/DiagramaTransiciones.png',
    tags: ['Sociophysics', 'Ising model', 'Markov chains', 'Monte Carlo'],
  },
];

export default function ProjectsPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="font-serif text-4xl text-text sm:text-5xl">Projects</h1>
      <p className="mt-4 mb-14 max-w-[60ch] text-muted">
        Selected research projects, each with a write-up of the method and results.
      </p>

      <div className="grid gap-8 md:grid-cols-2">
        {projects.map(({ slug, year, title, description, image, tags, cover }) => (
          <Link
            key={slug}
            href={`/projects/${slug}`}
            className="group flex flex-col overflow-hidden rounded-sm border border-line bg-surface/80 transition-colors hover:border-muted"
          >
            <div className="relative aspect-[16/9] bg-white">
              <Image src={image} alt="" fill sizes="(min-width: 768px) 480px, 100vw" className={cover ? 'object-cover' : 'object-contain p-4'} />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <p className="text-sm tabular-nums text-muted">{year}</p>
              <h2 className="mt-1 font-serif text-xl leading-snug text-text group-hover:text-signal transition-colors">
                {title}
              </h2>
              <p className="mt-3 flex-1 leading-relaxed text-muted">{description}</p>
              <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted/80">
                {tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
