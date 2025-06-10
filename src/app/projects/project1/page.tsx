'use client';

import { motion } from 'framer-motion';
import 'katex/dist/katex.min.css';
//import Image from 'next/image';
import { InlineMath, BlockMath } from 'react-katex';
import { useActiveSection } from '@/hooks/useActiveSection';

import {
  Brain,
  Bot,
  FlaskConical,
  Microscope,
  Atom,
  SlidersHorizontal,
  Database,
  Filter,
  AreaChart,
  Shapes,
  Zap,
  ScanLine,
  BarChart4,
  FileCheck,
  Repeat,
  PackageSearch,
  CheckCircle,
} from 'lucide-react';



export default function ProjectOnePage() {

const sections = [
    { id: 'context', label: 'Context & Motivation' },
    { id: 'setup', label: 'Experimental Setup' },
    { id: 'modeling', label: 'Modeling Plasma Transitions' },
    { id: 'results', label: 'Evaluation & Results' },
    { id: 'conclusions', label: 'Conclusions & Reflections' },
  ];

const activeId = useActiveSection(sections.map((s) => s.id));

return (
  <>
    {/* Índice fijo visible en pantallas grandes */}
    <div
  className="hidden lg:block fixed top-24 right-2 w-48 
             text-xs text-gray-700 dark:text-gray-300 leading-relaxed z-10
             bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm 
             shadow-md rounded-lg px-3 py-2"
>
  <h3 className="font-semibold text-[11px] mb-2 tracking-wide uppercase text-gray-500 dark:text-gray-400">
    Contents
  </h3>
  <ul className="space-y-1">
    {sections.map(({ id, label }) => (
      <li key={id}>
        <a
          href={`#${id}`}
          className={`block transition-colors ${
            activeId === id
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'hover:text-blue-600 dark:hover:text-blue-400'
          }`}
        >
          {label}
        </a>
      </li>
    ))}
  </ul>
</div>

    
    <main className="max-w-4xl mx-auto px-6 py-12 text-gray-900 dark:text-white text-justify">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-6 text-center"
      >
        Machine Learning for Plasma State Classification in ECR Ion Sources
      </motion.h1>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="space-y-6"
      >
        <section id="context" className="space-y-6">
          <h2 className="text-3xl font-bold mt-12 flex items-center gap-3">
              <Brain className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              Context & Motivation
          </h2>

          <p>
            This project explores a real-world engineering problem in the field of applied physics:
            the <strong>automatic detection and classification of hydrogen plasma states</strong> inside an Electron Cyclotron Resonance (ECR) ion source.
            These sources are critical components in particle accelerators, where precise control over plasma conditions directly impacts beam quality.
          </p>

          <p>
            The work was carried out using the <strong>PIT30</strong> ion source developed at IZPILab (UPV/EHU).
            Rather than relying on traditional, manual signal interpretation, the project introduces a <strong>machine learning approach</strong> to
            classify plasma transitions based on real experimental data — even in the absence of direct observables such as luminosity.
          </p>

          <p>
            The goal was to build a robust, non-intrusive, and reproducible method that could eventually be extended to
            other ion sources and real-time monitoring environments.
          </p>

          <h3 className="text-2xl font-semibold mt-8 flex items-center gap-2">
              Ion Sources in Particle Accelerators
           </h3>

          <p>Particle accelerators rely on a two-stage architecture:</p>

          <ul className="list-disc list-inside space-y-1">
            <li><strong>Ion Source:</strong> generates the plasma that contains charged particles (e.g., protons, molecular ions).</li>
            <li><strong>Acceleration Stage:</strong> extracts and accelerates those particles to high energy levels.</li>
          </ul>

          <p>
            In this project, the ion source is of the <strong>Electron Cyclotron Resonance (ECR)</strong> type.
            These devices ionize gas (in this case hydrogen) by injecting microwave power into a magnetic confinement chamber.
            The electrons in the plasma resonate when the magnetic field matches the Larmor condition:
          </p>

          <div className="text-center my-4">
            <BlockMath math="f = \frac{eB}{2\pi m_e}" />
          </div>

          <p>where:</p>
          <ul className="list-disc list-inside ml-6">
            <li><InlineMath math="e" /> is the elementary charge,</li>
            <li><InlineMath math="B" /> is the magnetic field strength,</li>
            <li><InlineMath math="m_e" /> is the electron mass.</li>
          </ul>

          <p>
            When resonance is achieved, electrons absorb energy and ionize gas particles via collisions,
            creating a dense and magnetically confined plasma. From there, ions can be extracted by applying electric fields.
          </p>

          <h3 className="text-2xl font-semibold mt-8 flex items-center gap-2">
              The Problem: Classifying Plasma States
            </h3>

          <p>
            In the PIT30 source, the plasma exhibits transitions between three dominant ion configurations:{' '}
            <InlineMath math="\mathrm{H}^+" />, <InlineMath math="\mathrm{H}_2^+" />, and <InlineMath math="\mathrm{H}_3^+" />.
            Each corresponds to a distinct plasma state, observable via system parameters such as
            luminosity, RF power, and impedance.
          </p>

          <p>
            Traditionally, experts identify these transitions <em>manually</em> by visually inspecting
            signal plots — a subjective and non-scalable process.
          </p>

          <p>
            The core challenge was to develop an <strong>automatic pipeline</strong> capable of:
          </p>

          <ul className="list-disc list-inside space-y-2">
            <li>Detecting transition points in system signals.</li>
            <li>Classifying the new plasma state accurately and non-intrusively.</li>
            <li>Generalizing across changes in hardware configuration and signal quality.</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-8 flex items-center gap-2">
              Why Machine Learning?
              <Bot className="w-6 h-6 text-blue-500 dark:text-blue-300" />
           </h3>

          <p>
            The project applies both <strong>unsupervised</strong> and <strong>supervised</strong> machine learning methods to achieve its goals:
          </p>

          <ul className="list-disc list-inside space-y-1">
            <li>Unsupervised clustering (e.g. <code>K-Means</code>, <code>DBSCAN</code>) to identify state groupings without labels.</li>
            <li>Supervised classifiers (<code>Random Forest</code>, sequential neural networks, RNNs) to predict states from labeled jumps.</li>
          </ul>

          <p>
            These tools allow us to <strong>replace heuristic, hand-crafted methods</strong> with reproducible algorithms that scale to larger datasets,
            and remain robust even when key sensors (like plasma luminosity) are unavailable.
          </p>
        </section>

        <section id="setup" className="space-y-6">
  <h2 className="text-3xl font-bold mt-12 flex items-center gap-3">
              <FlaskConical className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              Experimental Setup & Data Pipeline
   </h2>

  <p>
    The experiments were conducted using the <strong>PIT30 ECR ion source</strong>, a device designed for applied research at IZPILab.
    The source operates under vacuum and uses a combination of magnetic confinement and microwave radiation to sustain hydrogen plasmas.
    Experimental campaigns consisted of controlled parameter sweeps while monitoring electrical and physical signals.
  </p>

  <h3 className="text-2xl font-semibold mt-8">🧱 Hardware Configuration</h3>

  <p>
    The plasma chamber is enclosed by two magnetic coils creating an axial magnetic field, and a set of hexapole magnets providing radial confinement.
    A <strong>microwave generator at 2.45 GHz</strong> injects power into the chamber through a coaxial line and a directional coupler.
  </p>

  <p>
    Key system parameters monitored during operation include:
  </p>

  <ul className="list-disc list-inside space-y-1">
    <li><strong>Forward and Reflected RF Power</strong> — to track power coupling efficiency.</li>
    <li><strong>DC Current</strong> in the extraction system — to infer plasma density and stability.</li>
    <li><strong>Impedance matching</strong> — a key signal correlated with plasma transitions.</li>
    <li><strong>Plasma Luminosity</strong> — monitored with a camera when available.</li>
  </ul>

  <p>
    Each discharge lasted around 90 seconds, with RF power being ramped up or down gradually. During these ramps,
    the plasma spontaneously transitioned between ion configurations — providing natural training examples for classification.
  </p>

  <h3 className="text-2xl font-semibold mt-8">💾 Data Acquisition Pipeline</h3>

  <p>
    A Python-based acquisition system was developed to record data from National Instruments (NI) analog sensors at high frequency
    (500–1000 samples per second). Each measurement was stored as a time series of synchronized signals:
  </p>

  <ul className="list-disc list-inside space-y-1">
    <li><code>forward_power</code></li>
    <li><code>reflected_power</code></li>
    <li><code>impedance</code></li>
    <li><code>plasma_luminosity</code> (when available)</li>
    <li><code>ion_current</code> (DC component)</li>
  </ul>

  <p>
    The raw time series were saved in <code>.csv</code> format with timestamps and signal metadata, and later pre-processed using
    <code>pandas</code> and <code>numpy</code> for cleaning, filtering and normalization.
  </p>

  <h3 className="text-2xl font-semibold mt-8">🧹 Signal Preprocessing</h3>

  <p>
    Before feeding the data into machine learning algorithms, several preprocessing steps were applied:
  </p>

  <ul className="list-disc list-inside space-y-2">
    <li><strong>Signal filtering</strong> using moving average and Savitzky–Golay filters to reduce high-frequency noise.</li>
    <li><strong>Normalization</strong> to remove absolute scale differences between experiments.</li>
    <li><strong>Dimensionality reduction</strong> via principal component analysis (PCA), when used for unsupervised learning.</li>
    <li><strong>Manual annotation</strong> of transition zones on a subset of signals to generate labeled training data.</li>
  </ul>

  <p>
    All code was developed in Python using Jupyter notebooks and saved as reproducible scripts for future integration into a
    real-time system. The modular architecture allows flexible swapping of feature extraction or classifier components.
  </p>
</section>

<section id="modeling" className="space-y-6">
  <h2 className="text-3xl font-bold mt-12">🧠 Modeling Plasma Transitions</h2>

  <p>
    The core objective of this project was to develop a model capable of classifying plasma states in real time
    based on physical signals, without relying on invasive measurements like spectroscopy or imaging.
    This section outlines the dual strategy adopted:{' '}
    <strong>unsupervised clustering</strong> to identify natural state groupings,
    and <strong>supervised classification</strong> to predict transitions on unseen data.
  </p>

  <h3 className="text-2xl font-semibold mt-8">📊 Unsupervised Clustering</h3>

  <p>
    In the absence of labeled ground truth across the full dataset, initial modeling began with <strong>unsupervised methods</strong>
    to uncover underlying structure in the signal space. The idea was to discover regions in feature space corresponding to dominant ion configurations:{' '}
    <InlineMath math="\mathrm{H}^+" />, <InlineMath math="\mathrm{H}_2^+" />, and <InlineMath math="\mathrm{H}_3^+" />.
  </p>

  <p>
    I applied <strong>Principal Component Analysis (PCA)</strong> to reduce dimensionality and visualize latent structure,
    followed by clustering algorithms such as:
  </p>

  <ul className="list-disc list-inside space-y-1">
    <li><code>K-Means</code> — assuming spherical clusters and fixed number of states.</li>
    <li><code>DBSCAN</code> — for density-based clusters, capable of detecting transition anomalies.</li>
  </ul>

  <p>
    The results revealed three main regions in signal space consistent with expected transitions.
    These clusters were used to generate pseudo-labels for training supervised models and to segment transitions in long signal traces.
  </p>

  <h3 className="text-2xl font-semibold mt-8">🎯 Feature Engineering</h3>

  <p>
    Feature extraction was critical to model success. From each raw signal segment,
    I computed a set of <strong>time-domain features</strong> including:
  </p>

  <ul className="list-disc list-inside space-y-1">
    <li>Mean, standard deviation, and higher-order moments.</li>
    <li>Slope and trend of power curves during transitions.</li>
    <li>Impedance variability and discontinuities.</li>
    <li>Signal derivatives and zero-crossing rates.</li>
  </ul>

  <p>
    These features were concatenated into a compact vector per segment, normalized across the dataset,
    and used as input for classifiers. Dimensionality was reduced via PCA or feature selection to improve generalization.
  </p>

  <h3 className="text-2xl font-semibold mt-8">🧠 Supervised Classification</h3>

  <p>
    Once representative segments were labeled (via unsupervised clustering and manual inspection),
    I trained <strong>supervised learning models</strong> to recognize plasma states in real time.
    Several algorithms were evaluated:
  </p>

  <ul className="list-disc list-inside space-y-1">
    <li><code>Random Forest</code> — robust to noise and interpretable via feature importance.</li>
    <li><code>Gradient Boosting</code> — for improved accuracy on imbalanced segments.</li>
    <li><code>Multilayer Perceptrons (MLPs)</code> — simple neural networks for feedforward classification.</li>
    <li><code>Recurrent Neural Networks (RNNs)</code> — for modeling temporal dependencies across signal windows.</li>
  </ul>

  <p>
    Each model was trained and validated using k-fold cross-validation, with performance measured via accuracy,
    F1 score, and confusion matrices. The best performance was obtained by the <strong>MLP + PCA pipeline</strong>,
    achieving state classification accuracy above 93% on the test set.
  </p>

  <h3 className="text-2xl font-semibold mt-8">📈 Transition Detection</h3>

  <p>
    To make the model practical for online monitoring, a post-processing stage was added to detect{' '}
    <strong>sharp discontinuities in signal features</strong> that suggest transitions between plasma regimes.
    This was implemented with a sliding window and a statistical change point detection algorithm.
  </p>

  <p>
    When a significant change was detected, a new feature vector was extracted and passed through the classifier,
    triggering an update in the displayed plasma state. This enables near real-time state tracking with minimal latency.
  </p>

  <h3 className="text-2xl font-semibold mt-8">🔍 Summary</h3>

  <p>
    The modeling pipeline integrates unsupervised clustering, feature extraction,
    supervised classification, and transition detection into a single modular framework.
    It enables autonomous tracking of plasma dynamics, reduces reliance on manual interpretation,
    and opens the door to integration with feedback control systems.
  </p>
</section>

<section id="results" className="space-y-6">
  <h2 className="text-3xl font-bold mt-12">📉 Evaluation & Results</h2>

  <p>
    To assess the reliability and generalization ability of the classification pipeline, I performed a series of validation experiments across multiple acquisition sessions, hardware configurations, and signal qualities.
    The results confirm that <strong>the model can detect plasma transitions accurately and robustly</strong>, even under moderate noise and variation in operational conditions.
  </p>

  <h3 className="text-2xl font-semibold mt-8">✅ Classification Metrics</h3>

  <p>
    The main performance metrics evaluated were:
  </p>

  <ul className="list-disc list-inside space-y-1">
    <li><strong>Accuracy</strong>: proportion of correctly classified state segments.</li>
    <li><strong>Precision / Recall / F1 Score</strong>: to handle class imbalance.</li>
    <li><strong>Confusion Matrix</strong>: for visualizing misclassification patterns.</li>
  </ul>

  <p>
    The best-performing model (MLP + PCA) achieved:
  </p>

  <ul className="list-disc list-inside ml-6">
    <li><strong>Accuracy:</strong> 93.2%</li>
    <li><strong>Macro F1 Score:</strong> 0.91</li>
    <li><strong>Precision:</strong> &gt;90% for all three ion states</li>
  </ul>

  <p>
    Misclassifications mostly occurred in transition zones, where signal overlap is expected. These regions are naturally ambiguous and were correctly identified by the model as “changing state”.
  </p>

  <h3 className="text-2xl font-semibold mt-8">📊 Visual Results</h3>

  <p>
    The figures below (see thesis, section 5.3) show typical signal traces with model predictions overlaid. Color-coded classifications demonstrate smooth state detection across full discharge cycles. Transitions are marked by abrupt impedance shifts and changes in current slope.
  </p>

  <p>
    The output is sufficiently stable to be displayed in real-time graphical user interfaces (GUIs) for operators, providing a trustworthy view of plasma conditions.
  </p>

  <h3 className="text-2xl font-semibold mt-8">🔁 Robustness Tests</h3>

  <p>
    To evaluate robustness, I conducted simulations with:
  </p>

  <ul className="list-disc list-inside space-y-1">
    <li>Downsampled and noisy versions of signals.</li>
    <li>Modified discharge ramps and altered microwave coupling.</li>
    <li>Loss of luminosity input — the classifier still functioned based on impedance and current alone.</li>
  </ul>

  <p>
    In all scenarios, the model retained classification accuracy above 85%, confirming its capacity for generalization and resilience to experimental variation.
  </p>

  <h3 className="text-2xl font-semibold mt-8">📦 Deployment Readiness</h3>

  <p>
    The full pipeline was packaged as a Python module with configuration options for:
  </p>

  <ul className="list-disc list-inside space-y-1">
    <li>Window size and overlap for feature extraction.</li>
    <li>Choice of classifier and preprocessing method.</li>
    <li>Thresholds for transition detection sensitivity.</li>
  </ul>

  <p>
    It can be integrated with data acquisition systems and eventually linked to actuator controls for closed-loop plasma management — an avenue for future research.
  </p>
</section>

<section id="conclusions" className="space-y-6">
  <h2 className="text-3xl font-bold mt-12">✅ Conclusions & Reflections</h2>

  <p>
    This project demonstrates how <strong>machine learning techniques can be successfully applied to experimental physics</strong> for real-world system monitoring.
    By combining signal processing, unsupervised clustering, supervised classification, and domain-specific knowledge,
    I was able to build a system that classifies hydrogen plasma states in an ECR ion source with high accuracy and robustness.
  </p>

  <p>
    From an engineering standpoint, the pipeline addresses a genuine practical need: <strong>non-intrusive, real-time identification of plasma regimes</strong>,
    which traditionally relied on expert judgment and non-scalable heuristics. It replaces that approach with a modular and reproducible solution that can be adapted to future devices or research setups.
  </p>

  <p>
    Technically, the work strengthened my ability to:
  </p>

  <ul className="list-disc list-inside space-y-2">
    <li>Design and execute experimental protocols in plasma physics and electrical diagnostics</li>
    <li>Process and analyze high-frequency multichannel time-series data</li>
    <li>Develop feature engineering pipelines tailored to physical signal behavior</li>
    <li>Train, evaluate, and interpret machine learning models on real-world datasets</li>
    <li>Communicate technical findings with clarity and precision across disciplines</li>
  </ul>

  <p>
    Importantly, this project also reflects my capacity to <strong>learn and apply concepts outside my primary academic background</strong>.
    I had no prior experience with plasma science, ion sources, or industrial hardware systems. Yet, through independent research, lab work, and collaboration,
    I was able to engage deeply with the physical phenomena, understand the experimental constraints, and translate domain knowledge into computational models.
  </p>

  <p>
    The ability to move across fields, structure complex problems, and deliver working solutions — both theoretically and in code —
    is what I consider the core of good engineering.
  </p>

  <p className="text-gray-500 dark:text-gray-400 italic">
    (This project originated as my undergraduate thesis in electronic engineering. If you’d like to read the full thesis or discuss the technical implementation in detail, feel free to contact me — I’d be happy to share it.)
  </p>
</section>




      </motion.section>
    </main>
    </>
  );
}
