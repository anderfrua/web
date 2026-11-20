import type { Metadata } from 'next';
import Link from 'next/link';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import VoteDistribution from '@/components/socio/VoteDistribution';
import MarkovChain from '@/components/socio/MarkovChain';
import DistrictLattice from '@/components/socio/DistrictLattice';
import MeanField from '@/components/socio/MeanField';

export const metadata: Metadata = {
  title: 'Voters, spins and memory',
  description:
    'A statistical-physics study of Spanish politics: universal vote distributions in the Senate, a Markov model of incumbency and an Ising-type model of how districts vote.',
};

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mt-20 scroll-mt-24 font-serif text-3xl leading-tight text-text">
      {children}
    </h2>
  );
}

const P = ({ children }: { children: React.ReactNode }) => <p className="mt-5 leading-relaxed text-muted">{children}</p>;
const Strong = ({ children }: { children: React.ReactNode }) => <span className="text-text">{children}</span>;
const Eq = ({ math }: { math: string }) => (
  <div className="relative my-6 overflow-x-auto text-text">
    <BlockMath math={math} />
  </div>
);

const LEVELS = [
  {
    name: 'Micro: voters',
    text: 'Each of the 52 provinces is a lattice of voters choosing between two parties. Every voter feels its four neighbours and the field of the party in power.',
  },
  {
    name: 'Meso: parliament',
    text: 'Each district sends one seat to the party it voted for. Inside each party, the two members with the best leadership score compete and the rest vote for the one closest to them.',
  },
  {
    name: 'Macro: government',
    text: 'The leader of the largest party governs. The term is judged a success or a failure, and that verdict feeds back into the voters’ field at the next election.',
  },
];

export default function SociophysicsProject() {
  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-16">
      <Link href="/projects" className="text-sm text-muted hover:text-text">
        ← All projects
      </Link>

      {/* Header */}
      <header className="mt-8">
        <p className="text-muted">2025 · Bachelor’s thesis in physics, UPV/EHU</p>
        <h1 className="mt-4 font-serif text-4xl leading-[1.1] tracking-tight text-text sm:text-6xl">Voters, spins and memory</h1>
        <p className="mt-6 text-lg leading-relaxed text-muted sm:text-xl">
          Can the physics of magnets say something about how Spain votes? Three questions, answered with forty
          years of election results, a Markov chain and an Ising-type model you can run below.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <a href="/docs/TFG_Fisica.pdf" target="_blank" rel="noopener noreferrer" className="rounded-sm bg-signal px-4 py-2 font-medium text-ink hover:bg-[#f0bb68]">
            Read the thesis (Spanish)
          </a>
        </div>
      </header>

      {/* In short */}
      <section aria-label="Summary" className="mt-12 grid gap-6 border-y border-line py-8 sm:grid-cols-3">
        <div>
          <p className="text-sm text-muted">Universal?</p>
          <p className="mt-1 text-text">Spain follows the same log-normal law as other countries, but five times narrower.</p>
        </div>
        <div>
          <p className="text-sm text-muted">Memory?</p>
          <p className="mt-1 text-text">A three-state Markov chain of incumbency fits the record since 1977.</p>
        </div>
        <div>
          <p className="text-sm text-muted">A model?</p>
          <p className="mt-1 text-text">Voters as spins, districts as magnets, and the leader’s record as an external field.</p>
        </div>
      </section>

      {/* Context */}
      <H2 id="idea">Why a physicist would look at elections</H2>
      <P>
        A magnet is made of atoms that know nothing about the magnet. Each spin only feels its neighbours, yet
        together they produce order on a scale no single atom can see. Statistical physics is the toolkit for
        that jump from local rules to collective behaviour.
      </P>
      <P>
        <Strong>Sociophysics</Strong> asks whether the same toolkit works for people. The idea goes back to
        Serge Galam’s first model of a strike in 1982 and was long met with scepticism. It does not try to
        capture everything a voter thinks. It tries to find which regularities survive when you keep only a
        few ingredients, such as the influence of the people around you and what happened at the last
        election.
      </P>
      <P>The thesis tests that idea on Spain in three steps, each building on the previous one:</P>
      <ol className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          ['Is there a universal pattern?', 'If Spanish votes follow the same statistics as other countries, physics-style models are worth trying.'],
          ['Does the system have memory?', 'If the past shapes the next result, a model has to carry it.'],
          ['Can a model reproduce it?', 'Voters, parties and leaders in one Ising-type model with feedback.'],
        ].map(([t, d], i) => (
          <li key={t} className="border-t border-line pt-3">
            <p className="text-sm text-muted">Question {i + 1}</p>
            <p className="mt-1 font-medium text-text">{t}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{d}</p>
          </li>
        ))}
      </ol>

      {/* Universality */}
      <H2 id="universal">Question 1 · A universal law, with a Spanish accent</H2>
      <P>
        In 2007 Fortunato and Castellano found something striking in Italy, Poland and Finland. In elections
        with open lists, compare each candidate’s votes <InlineMath math="v" /> with the average of their own
        list, <InlineMath math="N/Q" />, where <InlineMath math="N" /> is the votes for the list and{' '}
        <InlineMath math="Q" /> its number of candidates. The distribution of that ratio is the same in every
        country and every year, a log-normal curve:
      </P>
      <Eq math={String.raw`F\!\left(\tfrac{vQ}{N}\right) = \frac{1}{\sqrt{2\pi\sigma^2}\,(vQ/N)} \exp\!\left[-\frac{\left(\ln\tfrac{vQ}{N} - \mu\right)^2}{2\sigma^2}\right]`} />
      <P>
        The Spanish Senate is the one Spanish election where voters pick individual candidates, so I gathered
        every result from 1977 to 2023 from the Senate’s archive and computed the ratio for each candidate.
      </P>

      <VoteDistribution />

      <P>
        The shape is the same: Spain is log-normal too. The width is not. The universal curve has{' '}
        <InlineMath math="\sigma \approx 1.04" />; Spain has <InlineMath math="\sigma \approx 0.2" />, tightly
        peaked at 1. <Strong>Spanish candidates almost never stand out from their own list.</Strong> Voters
        tend to tick every name of the party they support, which fits the strong role of parties in Spanish
        politics reported in the political-science literature.
      </P>
      <P>
        So Spain shares the underlying statistics of other democracies, with its own parameters. That is
        enough to justify the next step: treating Spanish voting behaviour as a collective, physics-like
        system.
      </P>

      {/* Markov */}
      <H2 id="memory">Question 2 · Does the system remember?</H2>
      <P>
        If each election were a fresh coin toss, the past would not matter. To test that, I followed an
        approach from Rowden, Lloyd and Gilbert (2014) and modelled Spanish heads of government as a{' '}
        <Strong>Markov chain</Strong> with three states: first term, re-elected once, and re-elected two or
        more times. Each general election is one step. Counting transitions in the record since 1977 gives the
        matrix of probabilities, column by column from each state:
      </P>
      <Eq math={String.raw`x_n = P\,x_{n-1}, \qquad P = \begin{pmatrix} 0.2 & 0.4 & 0.5 \\ 0.8 & 0.2 & 0 \\ 0 & 0.4 & 0.5 \end{pmatrix}`} />

      <MarkovChain />

      <P>
        Because the chain is irreducible, it has a single long-run state, the eigenvector of{' '}
        <InlineMath math="P" /> with eigenvalue 1. A <InlineMath math="\chi^2" /> goodness-of-fit test against
        the observed time spent in each state (5, 5 and 2 terms) gives <InlineMath math="\chi^2 = 0.83" /> and{' '}
        <InlineMath math="p = 0.66" />: the record is <Strong>consistent with a chain where incumbency
        matters</Strong>, so the hypothesis of memory cannot be ruled out. With twelve terms that is a modest
        claim, but it is the ingredient the model needs.
      </P>

      {/* Model */}
      <H2 id="model">Question 3 · Voters as spins</H2>
      <P>
        The final step combines both findings in one model, adapted from Rowden et al. and the Sznajd model
        of opinion dynamics. Spain is simplified to two parties, which is close to its history, and the model
        works at three levels:
      </P>
      <ol className="mt-6 space-y-4">
        {LEVELS.map((l, i) => (
          <li key={l.name} className="grid grid-cols-[2rem_1fr] gap-3">
            <span className="font-serif text-2xl leading-none text-signal">{i + 1}</span>
            <div>
              <p className="font-medium text-text">{l.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{l.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <P>
        At the micro level each voter <InlineMath math="s_i = \pm 1" /> carries a <Strong>tension</Strong>, the
        social equivalent of the energy of a spin in the Ising model. It is low when you agree with your
        neighbours and with the prevailing field:
      </P>
      <Eq math={String.raw`T_i = -\frac{J}{2}\, s_i \sum_{\langle il \rangle} s_l \;-\; \mu\, s_i`} />
      <P>
        <InlineMath math="J" /> is the strength of social influence. The field <InlineMath math="\mu" /> carries
        the memory: it depends on how the district voted last time, whether it went with the country, and
        whether the leader’s term was judged a success (<InlineMath math="\beta_{\text{success}}" />) or a
        failure (<InlineMath math="\beta_{\text{failure}}" />):
      </P>
      <Eq math={String.raw`\mu = \operatorname{sign}\!\left(\bar s^{\,\text{prev}}\right) - \beta\, \operatorname{sign}\!\Big(\tfrac{1}{N_c}\textstyle\sum_{j} \bar s_j^{\,\text{prev}}\Big)`} />
      <P>
        Districts then relax towards low tension with Boltzmann statistics and Metropolis updates, exactly as a
        magnet does at a fixed temperature. This is what one district looks like:
      </P>

      <DistrictLattice />

      <P>
        Before running the full model it helps to know what to expect. In the <Strong>mean-field
        approximation</Strong> each voter feels the average vote <InlineMath math="\bar s" /> of its{' '}
        <InlineMath math="z = 4" /> neighbours instead of their actual votes, and the model collapses to one
        self-consistency equation:
      </P>
      <Eq math={String.raw`\bar s = \tanh\!\left(\frac{Jz}{2}\,\bar s + \mu\right)`} />
      <P>
        It has no closed-form solution, so the thesis solves it graphically. Try it:
      </P>

      <MeanField />

      <P>
        Two results come out of this analysis. The leader’s field drags the district towards its own sign, and
        stronger peer influence pushes the solutions towards ±1, meaning more polarised districts. And with
        the feedback written as a smooth function, the condition for a non-trivial solution,
      </P>
      <Eq math={String.raw`\frac{Jz}{2} + \alpha\,(1-\beta) > 1, \qquad \alpha \gg 1,`} />
      <P>
        is met for any <InlineMath math="J" /> whenever <InlineMath math="0 < \beta < 1" />. So no critical
        coupling should appear in the full simulations. What should change is the re-election rate: a
        positive <InlineMath math="\beta" /> works against the incumbent, a negative one in their favour.
      </P>

      {/* Next */}
      <H2 id="next">Where it goes next</H2>
      <P>
        The thesis ran first simulations of the full three-level model on the 52 Spanish provinces and used
        them to explore how <InlineMath math="J" />, <InlineMath math="\beta_{\text{success}}" /> and{' '}
        <InlineMath math="\beta_{\text{failure}}" /> shape re-election. Those runs were short and noisy. The
        natural next steps are longer simulations to calibrate the model properly against Spain’s re-election
        record, a comparison with other countries’ electoral systems, and shocks such as an economic crisis
        added as external perturbations.
      </P>
      <P>
        What I take from this project is a way of working: reduce a messy system to the few interactions that
        matter, check that the reduction matches the data, and only then build the model. It is the same
        approach I now use for brain networks.
      </P>

      {/* Credits */}
      <section className="mt-20 border-t border-line pt-8 text-sm leading-relaxed text-muted">
        <p>
          <Strong>Tools.</Strong> Python (NumPy, pandas, SciPy, Matplotlib), Docker, Git. The interactive
          figures are recomputed from the original data or run in your browser.
        </p>
        <p className="mt-3">
          <Strong>Data.</Strong> Historical Senate results from the Senado de España; general election results
          from the Ministerio del Interior.
        </p>
        <p className="mt-3">
          <Strong>Credits.</Strong> Bachelor’s thesis in physics at the University of the Basque Country
          (UPV/EHU), supervised by Jesús Martínez Perdiguero. Builds on Fortunato &amp; Castellano (2007),
          Sznajd-Weron &amp; Sznajd (2000) and Rowden, Lloyd &amp; Gilbert (2014).
        </p>
      </section>
    </article>
  );
}
