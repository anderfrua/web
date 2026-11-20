import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import RegimeMap from '@/components/plasma/RegimeMap';
import JumpDetectorDemo from '@/components/plasma/JumpDetectorDemo';
import ModelComparison from '@/components/plasma/ModelComparison';
import SweepExplorer from '@/components/plasma/SweepExplorer';

export const metadata: Metadata = {
  title: 'Reading a plasma without touching it',
  description:
    'Machine learning that detects and classifies state changes in the hydrogen plasma of an ECR ion source using only the signals the source already produces.',
};

function Figure({
  src,
  alt,
  width,
  height,
  children,
  photo = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  children: React.ReactNode;
  photo?: boolean;
}) {
  return (
    <figure className={`my-10 ${photo ? 'max-w-md' : ''}`}>
      <div className={`overflow-hidden rounded-sm border border-line ${photo ? '' : 'bg-white p-3'}`}>
        <Image src={src} alt={alt} width={width} height={height} className="h-auto w-full" sizes="(min-width: 768px) 720px, 100vw" />
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-muted">{children}</figcaption>
    </figure>
  );
}

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mt-20 scroll-mt-24 font-serif text-3xl leading-tight text-text">
      {children}
    </h2>
  );
}

const P = ({ children }: { children: React.ReactNode }) => <p className="mt-5 leading-relaxed text-muted">{children}</p>;
const Strong = ({ children }: { children: React.ReactNode }) => <span className="text-text">{children}</span>;

export default function PlasmaProject() {
  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-16">
      <Link href="/projects" className="text-sm text-muted hover:text-text">
        ← All projects
      </Link>

      {/* Header */}
      <header className="mt-8">
        <p className="text-muted">2024 · Bachelor’s thesis in electronic engineering, IZPILab, UPV/EHU</p>
        <h1 className="mt-4 font-serif text-4xl leading-[1.1] tracking-tight text-text sm:text-6xl">
          Reading a plasma without touching it
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted sm:text-xl">
          A machine-learning system that tells which state the hydrogen plasma inside a particle-accelerator
          ion source is in, using only signals the source already produces. Presented as a first-author paper
          at ECRIS 2024 in Darmstadt.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <a
            href="https://proceedings.jacow.org/ecris2024/doi/JACoW-ECRIS2024-MOP08.html"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm bg-signal px-4 py-2 font-medium text-ink hover:bg-[#f0bb68]"
          >
            Read the paper
          </a>
          <a
            href="https://addi.ehu.es/handle/10810/73191"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm border border-line px-4 py-2 text-text hover:border-muted"
          >
            Read the thesis
          </a>
        </div>
      </header>

      <Figure src="/images/projects/plasma/source.png" alt="The PIT30 ion source on the LINAC7 test bench at IZPILab" width={524} height={458} photo>
        PIT30, the ion source where the data was taken, on the LINAC7 bench at IZPILab (UPV/EHU).
      </Figure>

      {/* In short */}
      <section aria-label="Summary" className="grid gap-6 border-y border-line py-8 sm:grid-cols-3">
        <div>
          <p className="text-sm text-muted">The problem</p>
          <p className="mt-1 text-text">Plasma states are judged by eye, from a camera you lose once the source is built in.</p>
        </div>
        <div>
          <p className="text-sm text-muted">The idea</p>
          <p className="mt-1 text-text">Replace the camera with two RF signals the source always measures.</p>
        </div>
        <div>
          <p className="text-sm text-muted">The result</p>
          <p className="mt-1 text-text">97% F1 without the camera, and a model that still works on a modified source.</p>
        </div>
      </section>

      {/* Context */}
      <H2 id="context">An accelerator starts with a plasma</H2>
      <P>
        Every particle accelerator begins with a source of charged particles. At the UPV/EHU’s IZPILab that
        source is <Strong>PIT30</Strong>, the first stage of LINAC7, a compact linear accelerator designed to
        produce radiopharmaceutical isotopes for medicine.
      </P>
      <P>
        PIT30 is an electron cyclotron resonance (ECR) source. Hydrogen gas flows into a small chamber
        surrounded by a Halbach array of permanent magnets that creates a 110 mT field. Electrons in that
        field spiral at a fixed frequency, and when 3 GHz microwaves match it they absorb energy, collide with
        the gas and ionise it:
      </P>
      <div className="my-6 overflow-x-auto text-text">
        <BlockMath math={String.raw`f = \frac{eB}{2\pi m_e} \;\approx\; 3\ \text{GHz} \quad \text{for } B = 110\ \text{mT}`} />
      </div>

      <Figure src="/images/projects/plasma/chamber.png" alt="Cross-section of the PIT30 plasma chamber" width={968} height={451}>
        Cross-section of the chamber, about 600 mm end to end: (1) gas inlet, (2) RF port, (3) magnets,
        (4) plasma chamber, (5) extraction electrodes, (6) vacuum pump, (7) pressure sensor, (8) beam diagnostics.
      </Figure>

      <P>
        The plasma does not sit still. Depending on the microwave power and the amount of gas, it settles into
        one of three regimes, each dominated by a different ion: H⁺, H₂⁺ or H₃⁺. For an accelerator that wants
        protons, knowing which regime you are in is the whole game.
      </P>

      <RegimeMap />

      {/* Problem */}
      <H2 id="problem">The problem: a judgement call and a camera</H2>
      <P>
        Until now, a trained technician watched the signals during a power and gas sweep and decided, by eye,
        when the plasma had jumped and to which state. The clearest clue is the light the plasma emits,
        recorded by a camera looking into the chamber. Once the source is bolted into the accelerator that
        view is usually gone.
      </P>
      <P>
        So the question was twofold: can a model make that call objectively, and can it do it{' '}
        <Strong>without the camera</Strong>, from signals that do not perturb the plasma?
      </P>

      {/* Insight */}
      <H2 id="insight">The insight: the RF line already knows</H2>
      <P>
        Each sweep logged nine signals, from forward and reflected RF power to gas flow and the camera’s
        luminosity. Cross-correlating them showed that luminosity tracks one of them closely:{' '}
        <Strong>the RF matching signal (“adaptation”), with r = 0.67</Strong>. On top of that, every state jump
        comes with a burst of RF noise. Together, those two always-available signals can stand in for the
        camera.
      </P>
      <P>
        A first attempt to classify every sample directly into three states failed: at low power it missed the
        jumps, at high power it could not tell them apart. So I split the problem into three steps.
      </P>

      <ol className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          ['Detect', 'Find the moments the plasma jumps, from changes in the slope of the signal.'],
          ['Filter', 'Throw away false alarms, such as the turning points of the gas sweep.'],
          ['Classify', 'Decide which kind of jump it was, i.e. which state the plasma moved into.'],
        ].map(([t, d], i) => (
          <li key={t} className="border-t border-signal/60 pt-3">
            <p className="text-sm tabular-nums text-muted">Step {i + 1}</p>
            <p className="font-medium text-text">{t}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{d}</p>
          </li>
        ))}
      </ol>

      {/* Detect */}
      <H2 id="detect">Step 1 · Detecting a jump</H2>
      <P>
        A state change shows up as a sudden change in how fast the signal is growing. The detector fits a
        straight line to every block of 80 samples (about one second) and compares the change in slope between
        consecutive blocks with the average change in the surrounding 100 seconds. Comparing against the local
        average, rather than a fixed value, keeps isolated spikes and slow drifts from triggering it.
      </P>

      <JumpDetectorDemo />

      <SweepExplorer
        initial="detect"
        caption={
          <>
            The detector on the real measurements. Top: plasma luminosity during two gas sweeps, one line per RF
            power level. Bottom: the gas flow swept between 0.7 and 5 sccm. Hover a marker for its time and power;
            the tabs switch to the views used in steps 2 and 3. Reproduced from the original data and thesis code.
          </>
        }
      />

      {/* Filter */}
      <H2 id="filter">Step 2 · Doing it without the camera</H2>
      <P>
        Without luminosity, the detector runs on the adaptation signal and, independently, looks for peaks in
        the RF noise with a prominence threshold. Only moments where both agree count as jumps. That catches the
        real transitions but also flags the minima of the adaptation signal, where the gas sweep turns around.
      </P>
      <P>
        Those false alarms have a different signature: the gas flow is changing direction and the adaptation is
        at a minimum. A two-cluster k-means on features from a 100-second window around each candidate (mean
        adaptation, its trend, the gas trend, RF power and noise level) separates them cleanly from real jumps.
      </P>

      <SweepExplorer
        initial="nocam"
        caption={
          <>
            Detection without the camera: the same sweeps seen through the RF matching signal only. Crosses are
            candidates the k-means filter discards as false alarms; they pile up where the gas sweep turns
            around. Reproduced from the original data and thesis code.
          </>
        }
      />

      {/* Classify */}
      <H2 id="classify">Step 3 · Naming the new state</H2>
      <P>
        With the jumps found, each one is described by features computed around it (signal level, size of the
        change, gas flow and its trend, RF power) and classified. I compared an unsupervised approach with three
        supervised ones, scored with F1 against the technician’s labels.
      </P>
      <P>
        <Strong>k-means</Strong> needs no labels at all. The elbow method suggested four clusters rather than
        three, and the fourth turned out to be useful: it collected the remaining false positives. With
        luminosity it reproduced the human classification well; without it, it classified 78% of the jumps
        correctly.
      </P>

      <SweepExplorer
        initial="clusters"
        caption={
          <>
            Unsupervised classification with luminosity: each detected jump coloured and shaped by its k-means
            cluster (k = 4). Numbering is ordered by RF power and may differ from the thesis figure.
            Reproduced from the original data and thesis code.
          </>
        }
      />

      <P>
        The supervised models were a <Strong>random forest</Strong> (tuned by grid search: 10 trees, depth 5,
        Gini, evaluated with 5-fold cross-validation), a <Strong>dense neural network</Strong> (512, 256 and
        128 units with batch normalisation, dropout and L2 regularisation) and an <Strong>LSTM</Strong> over
        sequences of samples.
      </P>

      <ModelComparison
        ariaLabel="F1 scores by model, with and without the camera"
        rows={[
          { model: 'Random forest', detail: '10 trees, depth 5', cam: 98, noCam: 97 },
          { model: 'Dense network', detail: '512–256–128', cam: 76, noCam: 64 },
          { model: 'LSTM', detail: '200 hidden units', cam: 53, noCam: 54 },
        ]}
        caption={
          <>
            F1 score on the original dataset. The random forest barely notices the camera is gone. The LSTM
            does poorly because it classifies whole sequences, which leaves it far fewer training examples.
          </>
        }
      />

      {/* Twist */}
      <H2 id="generalisation">The twist: the best model on paper wasn’t</H2>
      <P>
        Midway through, the source was upgraded, and its behaviour changed enough to treat it as a different
        machine. That made a good test: would the models still work on a source they had never seen?
      </P>
      <P>
        Detection did, after recalibrating two parameters. Classification was another story. The random forest
        and k-means, so accurate before, <Strong>dropped below 50% F1</Strong>: they had learned the exact
        shape of the original sweeps. The dense network, trained only on the old data, kept 79% with the
        camera. Retrained on both datasets, it reached <Strong>84% with the camera and 85% without</Strong>.
        It no longer needed the camera at all.
      </P>

      <ModelComparison
        ariaLabel="F1 scores on the modified source"
        rows={[
          { model: 'Random forest', detail: 'trained on original', cam: 45, noCam: 45 },
          { model: 'Dense network', detail: 'trained on original', cam: 79, noCam: 64 },
          { model: 'Dense network', detail: 'retrained on both', cam: 84, noCam: 85 },
        ]}
        caption={<>F1 score after the source was modified. Striped bars are only known to be below 50%; the thesis does not report them more precisely.</>}
      />

      <P>
        The lesson I took from it: the highest score on one dataset is not the same as the most useful model.
        For a system that has to run on real hardware that changes, how well it generalises matters more.
      </P>

      {/* Next */}
      <H2 id="next">What I would do next</H2>
      <ul className="mt-5 list-disc space-y-2 pl-5 leading-relaxed text-muted marker:text-signal/70">
        <li>Collect more sweeps with more jumps per sweep: the data, not the models, was the bottleneck.</li>
        <li>Retrain automatically as new experiments are run, so the model follows the source as it changes.</li>
        <li>Add live anomaly detection to flag when something in the source is going wrong.</li>
        <li>Go from describing the state to steering it: learn the most efficient way to move the source into a target regime.</li>
      </ul>

      {/* Footer */}
      <section className="mt-20 grid gap-8 border-t border-line pt-8 text-sm sm:grid-cols-2">
        <div>
          <p className="text-muted">Tools</p>
          <p className="mt-1 text-text">Python, scikit-learn, TensorFlow/Keras, SciPy, Docker, Git</p>
        </div>
        <div>
          <p className="text-muted">Credits</p>
          <p className="mt-1 leading-relaxed text-text">
            Supervised by Iñigo Arredondo and Raquel Justo. Measurements by Pello Usabiaga, Jon Vivas and Jorge
            Feuchtwanger. Funded by the Basque Government’s Elkartek programme (LINAC7).
          </p>
        </div>
      </section>
    </article>
  );
}
