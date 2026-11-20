import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import CrankBench from '@/components/wear/CrankBench';
import PeakAlign from '@/components/wear/PeakAlign';
import PipelineFlow from '@/components/wear/PipelineFlow';
import ModelMatrix from '@/components/wear/ModelMatrix';
import WearCurves from '@/components/wear/WearCurves';

export const metadata: Metadata = {
  title: 'A wear bench that runs itself',
  description:
    'An automated prognostics environment for a crank–slider wear bench at Ikerlan: event-driven pipeline, soft-sensor wear estimation, forecasts with uncertainty and a real-time dashboard.',
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

const VALIDATION = [
  { value: '< 2 min', label: 'to process each five-minute block' },
  { value: '< 1 s', label: 'latency of the live signals' },
  { value: '< 1 %', label: 'failed blocks in a week of running' },
  { value: '1', label: 'exception in three weeks non-stop' },
];

export default function WearProject() {
  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-16">
      <Link href="/projects" className="text-sm text-muted hover:text-text">
        ← All projects
      </Link>

      {/* Header */}
      <header className="mt-8">
        <p className="text-muted">2026 · Master’s thesis, MSc in Big Data &amp; Visual Analytics, UNIR · with Ikerlan</p>
        <h1 className="mt-4 font-serif text-4xl leading-[1.1] tracking-tight text-text sm:text-6xl">A wear bench that runs itself</h1>
        <p className="mt-6 text-lg leading-relaxed text-muted sm:text-xl">
          A brass bushing wears out on a test bench at Ikerlan, about a tenth of a millimetre a day. I built the
          system around it that measures that wear, forecasts it and shows it live, with no one in the loop.
        </p>
      </header>

      {/* In short */}
      <section aria-label="Summary" className="mt-12 grid gap-6 border-y border-line py-8 sm:grid-cols-3">
        <div>
          <p className="text-sm text-muted">The problem</p>
          <p className="mt-1 text-text">Every experiment needed a technician to move files, run scripts and draw plots by hand.</p>
        </div>
        <div>
          <p className="text-sm text-muted">What I built</p>
          <p className="mt-1 text-text">An event-driven pipeline, a backend and a dashboard, deployed as two Docker images.</p>
        </div>
        <div>
          <p className="text-sm text-muted">What it showed</p>
          <p className="mt-1 text-text">No purely data-driven model wins in every regime: the case for physics-informed ones.</p>
        </div>
      </section>

      {/* Why */}
      <H2 id="why">Predicting a part’s death</H2>
      <P>
        Prognostics and health management (PHM) asks a simple question with an expensive answer: how long until
        this component fails? Answer it well and maintenance happens just before the failure, not after it, and not
        months too early on a schedule. Answering it needs sensor data processed as it arrives, a model of how the
        part degrades, and a way for engineers to see and trust what the model says.
      </P>
      <P>
        Ikerlan’s AI &amp; Data team studies this on a bench that reproduces a <Strong>crank–slider mechanism</Strong>,
        the same geometry that turns rotation into linear motion in engines, compressors and pumps.
        The part under study is the bushing in the joint between crank and rod. As it wears, the joint loosens.
      </P>

      {/* Bench */}
      <H2 id="bench">Measuring wear without touching it</H2>
      <P>
        You cannot put a gauge inside a turning joint. But a looser joint lets the rod reach a little further, so the
        slider’s stroke grows with wear. A laser reading the slider’s position is therefore a{' '}
        <Strong>soft sensor</Strong> for the bushing: take the crest <InlineMath math="m_i" /> of each cycle, and
        the wear accumulated since the start is how far the crest has moved,
      </P>
      <Eq math="W_n = \sum_{i=1}^{n} (m_i - m_{i-1}) = m_n - m_0 ." />
      <P>
        The crest moves by nanometres per cycle, far below the laser’s noise, so the raw estimate is jagged and the
        occasional acquisition glitch produces jumps no bushing could make. The wear module rejects those jumps and
        smooths what is left. Run the bench below to watch the estimate converge on the true wear.
      </P>

      <CrankBench />

      <P>
        On the real bench, each experiment runs for about a week. The wear curves are far from the straight line a
        simple model would draw: a fast run-in while the surfaces bed in, long plateaus, sudden steps. After a week,
        one bushing has lost half a millimetre and another a full one.
      </P>

      <WearCurves />

      {/* Pipeline */}
      <H2 id="pipeline">A pipeline that waits for the bench</H2>
      <P>
        The acquisition software, LabVIEW, logs the motor, the laser and the load cell at 1 kHz into separate files,
        one set per five-minute block. Before my work, turning those files into a wear curve and a forecast was a
        manual job, and so was every change to a model or its parameters.
      </P>
      <P>
        I wrote the pipeline as four Python modules driven by events rather than a schedule. It does nothing until a
        block is complete, processes it and then waits again, so the bench can stop, restart or change speed without
        anyone touching the software. Each module reads and writes plain files with a fixed format, which makes them
        swappable: a new wear estimator or model drops in without the rest noticing.
      </P>

      <PipelineFlow />

      <P>
        The fiddliest step is the merge. The three sensors are logged by separate acquisition tasks whose clocks
        disagree by a fraction of a cycle, and a fraction of a cycle is the difference between the spring pulling
        and pushing. Since all three see the same motion, their peaks must coincide. The pipeline finds the peaks
        in each stream, matches them and shifts the streams until they line up.
      </P>

      <PeakAlign />

      {/* Forecast */}
      <H2 id="forecast">Forecasts that say how sure they are</H2>
      <P>
        Four architectures forecast the wear curve from the sensors: two recurrent networks (LSTM and GRU), a
        temporal convolutional network (TCN) and PatchTST, a transformer that reads the series in patches. The
        pipeline runs whichever one is selected, and I evaluated all four on the bench.
      </P>
      <P>
        A point forecast is not enough to schedule maintenance on: you need to know how far to trust it. The
        predict module uses <Strong>Monte Carlo dropout</Strong>. Dropout, normally switched off after training,
        stays on, so each forward pass samples a slightly different network. Over <InlineMath math="T = 100" />{' '}
        passes,
      </P>
      <Eq math="\hat{y} = \frac{1}{T}\sum_{t=1}^{T} f_{\theta_t}(\mathbf{x}), \qquad \hat{\sigma}^2 = \frac{1}{T-1}\sum_{t=1}^{T}\bigl(f_{\theta_t}(\mathbf{x}) - \hat{y}\bigr)^2 ," />
      <P>
        the mean is the forecast and the spread says how much the sampled networks disagree. To score forecasts
        that come with a spread, RMSE is not enough, because it only looks at the mean. The continuous ranked
        probability score (CRPS) compares the whole predicted distribution <InlineMath math="F" /> with the value
        that actually happened,
      </P>
      <Eq math="\mathrm{CRPS}(F, y) = \int_{-\infty}^{\infty} \bigl(F(z) - \mathbb{1}\{z \ge y\}\bigr)^2 \, dz ," />
      <P>
        and so rewards a forecast that is both close and honestly uncertain. For a forecast with no spread at all,
        it reduces to the absolute error.
      </P>

      <ModelMatrix />

      <P>
        <Strong>No architecture wins everywhere.</Strong> TCN is best in 7 of the 16 regimes on both metrics, GRU
        in 6 by RMSE, and PatchTST takes 4 by CRPS, mostly with long histories. The best error in a regime ranges from
        0.024 to 0.088 mm, which against a millimetre of total wear means relative errors up to about 8 %. Errors grow
        with short histories and long horizons, exactly where a purely data-driven model has least to go on.
      </P>
      <P>
        That last point is the real finding. Wear is governed by physics that is partly known: Archard’s law says the
        worn volume grows with the load and the sliding distance,
      </P>
      <Eq math="V = K \, \frac{F_N \, s}{H} ," />
      <P>
        with a wear coefficient <InlineMath math="K" /> and the hardness <InlineMath math="H" /> of the softer
        material. Models that build this in and learn only what it leaves out (hybrid, physics-informed models) are
        the obvious next step. The environment exists to make testing them cheap.
      </P>

      {/* Dashboard */}
      <H2 id="dashboard">Putting it in front of engineers</H2>
      <P>
        The dashboard is a React app talking to a Flask and Socket.IO backend. It shows the laser, motor and load
        cell live; the wear curve with the forecast and its band, against a failure threshold; a remaining-life
        estimate; and a history view to load past experiments and compare models with their metrics side by side.
        Control panels change the model, the window, the horizon and the bench speed, and the backend writes those
        changes back to the pipeline’s configuration.
      </P>

      <figure className="my-10">
        <div className="overflow-hidden rounded-sm border border-line">
          <Image
            src="/images/projects/wear/dashboard-live.png"
            alt="Dashboard showing the measured wear curve, the live forecast approaching a failure threshold, model and prediction settings, and a remaining-useful-life panel"
            width={1508}
            height={757}
            className="h-auto w-full"
            sizes="(min-width: 768px) 720px, 100vw"
          />
        </div>
        <figcaption className="mt-3 text-sm leading-relaxed text-muted">
          The live forecast view during development: measured wear (blue), the forecast (orange) heading for the
          failure threshold (red), and the controls for model, window and horizon.
        </figcaption>
      </figure>

      {/* Validation */}
      <H2 id="validation">Does it hold up?</H2>
      <P>
        I validated the whole environment with the research team on the real bench: signals in the dashboard
        identical to LabVIEW’s own, computed wear identical to what the pipeline wrote, and the system left running
        through pauses, restarts, gaps in the data and weeks of continuous operation.
      </P>
      <section aria-label="Validation results" className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-4">
        {VALIDATION.map((v) => (
          <div key={v.label} className="bg-surface p-4">
            <p className="font-serif text-3xl text-text tabular-nums">{v.value}</p>
            <p className="mt-1 text-sm leading-snug text-muted">{v.label}</p>
          </div>
        ))}
      </section>
      <P>
        Usability mattered as much: any setting takes one interaction to change, and loading a past experiment and
        adding it to a comparison takes four at most. Before, the same tasks needed someone who knew the code.
      </P>

      {/* Next */}
      <H2 id="next">Limits and what comes next</H2>
      <P>
        The environment was designed and validated on one bench with one set of sensors, so carrying it to another
        machine would need its own validation. The hand-off from LabVIEW goes through files, which is robust and
        simple but adds latency that a faster process might not tolerate. And the models, as the matrix shows, are
        not yet accurate enough for an industrial decision.
      </P>
      <P>
        What I take from it is the other half of doing science with data. A model is only as useful as the system
        that feeds it clean data on time and puts its answer, with its uncertainty, in front of the person who has to
        decide. It is the same discipline I now bring to brain-imaging data.
      </P>

      {/* Credits */}
      <section className="mt-20 border-t border-line pt-8 text-sm leading-relaxed text-muted">
        <p>
          <Strong>Tools.</Strong> Python (pandas, NumPy, SciPy, PyTorch), Flask, Socket.IO, React, Docker, LabVIEW.
        </p>
        <p className="mt-3">
          <Strong>Data.</Strong> All bench data belongs to Ikerlan and is not published here. The model metrics and
          wear curves are those reported in the thesis, the curves digitised from its figure; the bench and peak-alignment figures are simulations.
        </p>
        <p className="mt-3">
          <Strong>Credits.</Strong> Master’s thesis for the MSc in Big Data &amp; Visual Analytics at the Universidad
          Internacional de La Rioja (UNIR), carried out with the AI &amp; Data department of Ikerlan.
        </p>
      </section>
    </article>
  );
}
