import type { Metadata } from 'next';
import Link from 'next/link';
import EncounterField from '@/components/euskara/EncounterField';
import ValidationChart from '@/components/euskara/ValidationChart';
import DriversChart from '@/components/euskara/DriversChart';
import LeversChart from '@/components/euskara/LeversChart';

export const metadata: Metadata = {
  title: 'Who speaks Basque first',
  description:
    'An agent-based model of the Basque language in the Basque Autonomous Community: demography, schooling, migration and everyday conversations, calibrated on survey data and used to test language policies.',
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

const RULES = [
  ['Two Spanish speakers', 'They talk in Spanish. Nothing changes for Basque.'],
  ['A Basque speaker meets someone who has no Basque', 'They switch to Spanish and the speaker loses a little fluency. The other person may pick up a point just by hearing it.'],
  ['Two Basque speakers, both reserved', 'Neither opens in Basque, so neither finds out. They talk in Spanish and both lose fluency.'],
  ['Two Basque speakers, at least one opens in Basque', 'They talk in Basque and both gain fluency.'],
];

const ADDED = [
  ['Migration', 'Net immigration of 0.6% of the population a year, with the age profile of people arriving in Euskadi (Eustat). Newcomers start with no Basque.'],
  ['Family transmission', 'From the Sociolinguistic Survey, 2001–2021: a child learns Basque at home 92% of the time if both parents speak it, 49% if only the mother does and 42% if only the father does.'],
  ['School', 'Each child is placed in model A, B or D with the 2006 shares (22.6%, 23.0%, 54.4%). B and D add 6 fluency points a year from age 6 to 15; A adds 1.'],
  ['Adult classes', 'Each year 0.3% of the population starts Basque at an euskaltegi, the share enrolling at A1 according to HABE.'],
  ['Communities', 'Speakers belong to one of three Basque-speaking areas and drift towards it, so they meet each other more often than chance.'],
  ['Fluency bands', 'A 0–100 scale cut into the survey’s categories: no Basque, easier in Spanish, equally easy, easier in Basque. Gains and losses depend on the band.'],
];

export default function BasqueProject() {
  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-16">
      <Link href="/projects" className="text-sm text-muted hover:text-text">
        ← All projects
      </Link>

      {/* Header */}
      <header className="mt-8">
        <p className="text-muted">2026 · Computational modelling for a master’s thesis on Basque revitalisation</p>
        <h1 className="mt-4 font-serif text-4xl leading-[1.1] tracking-tight text-text sm:text-6xl">Who speaks Basque first</h1>
        <p className="mt-6 text-lg leading-relaxed text-muted sm:text-xl">
          A simulated Basque Country where every person ages, moves, goes to school and talks to whoever is
          nearby. Fitted to twenty years of survey data, then used to ask which language policies would
          actually move the number of speakers.
        </p>
      </header>

      {/* In short */}
      <section aria-label="Summary" className="mt-12 grid gap-6 border-y border-line py-8 sm:grid-cols-3">
        <div>
          <p className="text-sm text-muted">The model</p>
          <p className="mt-1 text-text">About a thousand agents, built on Civico (2019) and adapted to the Basque Autonomous Community.</p>
        </div>
        <div>
          <p className="text-sm text-muted">The engine</p>
          <p className="mt-1 text-text">Schooling in Basque drives almost all of the growth. Everyday conversations drain it.</p>
        </div>
        <div>
          <p className="text-sm text-muted">The lever</p>
          <p className="mt-1 text-text">Who opens a conversation in Basque matters as much as tripling adult classes.</p>
        </div>
      </section>

      <H2 id="project">A sociolinguistic question, a physicist’s tool</H2>
      <P>
        Can a simulation say anything about the future of a minority language? This project was the
        computational part of a master’s thesis on Basque revitalisation. The tool is an{' '}
        <Strong>agent-based model</Strong>, standard in sociophysics: you write down how individuals behave,
        let thousands of them interact, and see what the population does.
      </P>
      <P>
        I designed and implemented the model, adapted it to the Basque Autonomous Community, calibrated it
        against official statistics and ran the simulations and policy experiments. The thesis, written in
        Basque, sets them in their sociolinguistic context; this page tells the computational story.
      </P>

      <H2 id="encounter">Everything starts with a conversation</H2>
      <P>
        The model starts from Marco Civico’s 2019 study of minority languages, which he validated on Romansh in
        Switzerland. Everyone speaks the majority language. Some people also speak the minority one, with a
        fluency between 0 and 100. Each year every person moves a little and has one conversation with whoever
        is closest. Four things can happen:
      </P>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {RULES.map(([t, d]) => (
          <li key={t} className="border-t border-line pt-3">
            <p className="font-medium text-text">{t}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{d}</p>
          </li>
        ))}
      </ul>
      <P>
        The key ingredient is politeness. Speaking Basque to someone who does not know it can feel rude, so
        many speakers open in Spanish just in case. Civico calls them reserved. If two reserved speakers meet,
        the conversation happens in Spanish even though both could have spoken Basque. In the calibrated model,{' '}
        <Strong>65% of speakers are reserved</Strong>.
      </P>

      <EncounterField />

      <P>
        Run on its own, the conversation rule behaves like a system with a tipping point. Below roughly half of
        speakers opening in Basque, more conversations erode fluency than build it, and the language slowly
        disappears. Above it, Basque spreads. At the calibrated 35%, <Strong>conversations alone are a net
        loss</Strong>. Something else has to keep the language growing.
      </P>

      <H2 id="adapting">From Romansh to the Basque Country</H2>
      <P>
        Civico’s community is closed and static. Basque is not: people move to Euskadi, children learn the
        language at school as much as at home, and adults go to classes. I added each of these and tied every
        parameter I could to official data, mostly the Sociolinguistic Survey, Eustat and HABE.
      </P>
      <dl className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {ADDED.map(([t, d]) => (
          <div key={t} className="border-t border-line pt-3">
            <dt className="font-medium text-text">{t}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-muted">{d}</dd>
          </div>
        ))}
      </dl>
      <P>
        The demography was calibrated first: deaths, births and migration together have to reproduce Eustat’s
        population curve, which grew 4.4% between 2006 and 2024. Only then did I turn to the language.
      </P>

      <H2 id="validation">Does it reproduce the last twenty years?</H2>
      <P>
        The simulation starts in 2006 with the real age pyramid and the real fluency mix: 30% of people aged 16
        and over spoke Basque. The survey has measured that share every five years since, and it has risen to
        36%. That is the curve the model has to follow.
      </P>
      <P>
        Not all the conversation parameters can be measured, so some have to be fitted. To keep the fit
        honest I fixed the structure of the fluency rules and fitted only three scale factors: how much a
        Basque conversation adds, how much a Spanish one costs, and how often people without Basque pick some
        up. I fitted them on the 2011 and 2016 surveys and kept 2021 back as a genuine prediction.
      </P>

      <ValidationChart />

      <P>
        The model runs about a point high throughout and predicts 38% for 2021 against the 36% measured. The survey points stay inside the spread of the runs. The fluency mix is
        right at the extremes and less right in the middle. The model has too many people who find both
        languages equally easy.
      </P>
      <P>
        More important, two quite different calibrations fit the data equally well. One makes conversations in
        Basque more rewarding (A, talkative). The other makes conversations in Spanish less costly (B,
        forgiving). Four survey points cannot tell them apart, so every result below is shown for both. Where
        they agree, the conclusion does not hinge on parameters nobody has measured.
      </P>

      <H2 id="drivers">What actually drives the curve</H2>
      <P>
        A model that fits is only useful if you know why it fits. The cleanest way to find out is to switch
        mechanisms off one at a time and re-run 2006–2050.
      </P>

      <DriversChart />

      <P>
        <Strong>School is the engine.</Strong> Without Basque at school the share of speakers falls by 20
        points by 2024 and almost vanishes by 2050. Nearly all the growth since 2006 is cohorts educated in models B and
        D replacing older ones.
      </P>
      <P>
        <Strong>Conversations are a sink.</Strong> Remove them altogether and Basque grows faster, by about 5
        points by 2024. What keeps them from being a disaster is the minority who open in Basque: if nobody did,
        the share would collapse by more than 30 points.
      </P>
      <P>
        <Strong>Family transmission barely registers.</Strong> In the model a child who hears Basque at home starts at 30 points, and school then adds 60.
        School covers 77% of children whatever their parents speak. The home head start is overwritten before
        anyone is old enough to count. That is a property of the model rather than a finding about Basque
        families, and it marks where the model would need extending to study transmission in depth.
      </P>

      <H2 id="policies">Testing language policies</H2>
      <P>
        With the model calibrated, each policy can be tested as a what-if: getting more speakers to open in
        Basque, teaching Basque to adult immigrants, expanding adult classes and changing the school models.
        Each one was run 200 times in pairs, with the same random seeds with and without the policy, so the
        comparison isolates the policy from the noise.
      </P>

      <LeversChart />

      <P>
        <Strong>Who speaks first is the strongest lever.</Strong> If 20% more of the fluent speakers opened in
        Basque, the share of speakers would be 7 to 9 points higher by 2034, close to what tripling adult
        classes would do. The effect is clear within the first three years and grows roughly in proportion to
        the push, by 1.3 to 2 points by 2024 for every extra 5% of speakers.
      </P>
      <P>
        <Strong>Adult classes add speakers one by one.</Strong> The gain is linear in the enrolment rate, with
        no knock-on effect through conversations. Adults leave the euskaltegi at 10 points, in the band where
        every conversation in Spanish costs them.
      </P>
      <P>
        <Strong>Teaching immigrants helps, slowly.</Strong> The effect grows with time, since each year’s
        newcomers add to the last. It depends little on the target level: 5, 15 or 30 points give similar gains,
        because the model counts anyone with some fluency as a speaker.
      </P>
      <P>
        <Strong>School reform works through access, not hours.</Strong> Moving every A-model pupil to D adds 1
        to 2 points. Adding hours in models B and D beyond the calibrated 6 points a year adds nothing, because
        pupils who leave school very fluent are the ones who lose most in conversations in Spanish.
      </P>

      <H2 id="next">Where it goes next</H2>
      <P>
        Agent-based models are only as good as the rules they are given, so the natural next steps are about
        tightening those rules:
      </P>
      <ul className="mt-6 space-y-4">
        <li className="border-t border-line pt-3">
          <p className="font-medium text-text">Smoother fluency rules</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Gains and losses that change continuously with fluency, instead of one value per band, with fewer
            parameters to fit.
          </p>
        </li>
        <li className="border-t border-line pt-3">
          <p className="font-medium text-text">Fit by age group</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            The survey breaks the speaker share down by age. Fitting each cohort would separate school from
            conversation effects more sharply than the total share can.
          </p>
        </li>
        <li className="border-t border-line pt-3">
          <p className="font-medium text-text">Navarre and the Northern Basque Country</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            The same model, adapted to the other Basque-speaking territories, where data are sparser and the
            situation of the language is very different.
          </p>
        </li>
      </ul>
      <P>
        The result that holds across every calibration is the one with the clearest message: school builds
        speakers, and whether they keep their Basque depends on how often someone dares to speak it first.
      </P>

      {/* Credits */}
      <section className="mt-20 border-t border-line pt-8 text-sm leading-relaxed text-muted">
        <p>
          <Strong>Tools.</Strong> Python (NumPy, SciPy, Matplotlib, multiprocessing), KD-trees for the
          nearest-neighbour search. The figures on this page come from 200 runs of the model per scenario; the
          conversation demo runs in your browser.
        </p>
        <p className="mt-3">
          <Strong>Data.</Strong> Basque Government Sociolinguistic Survey (Inkesta Soziolinguistikoa, 2006–2021),
          Eustat population, migration and school enrolment series, HABE adult-learning indicators.
        </p>
        <p className="mt-3">
          <Strong>Credits.</Strong> Master’s thesis by Maddi Aldaiturriaga Tuñon, supervised by Iñaki Iurrebaso
          Biteri, 2025–2026. Model design, implementation, calibration and simulations by me. Builds on
          Civico (2019), <span className="italic">The Dynamics of Language Minorities</span>, JASSS 22(4).
        </p>
      </section>
    </article>
  );
}
