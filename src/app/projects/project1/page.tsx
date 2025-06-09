'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function ProjectOnePage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-gray-900 dark:text-white">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-6 text-center"
      >
        Automatic Classification of Plasma States in an ECR-Type Ion Source
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mb-8"
      >
        <Image
          src="/images/partacc.png"
          alt="Plasma Classification"
          width={800}
          height={400}
          className="rounded-lg shadow-md mx-auto"
        />
      </motion.div>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="space-y-6"
      >
        <p>
          This project proposes a data-driven system to automatically detect and classify the state transitions of hydrogen plasma inside a custom-built ECR ion source (PIT30) developed at IZPILab (UPV/EHU). These transitions, usually identified by experts through visual inspection of beam behavior and signal metrics, are instead inferred here through machine learning algorithms applied to real experimental data.
        </p>

        <h2 className="text-2xl font-semibold mt-8">🔍 Problem Scope</h2>
        <p>
          The PIT30 plasma source exhibits three dominant ionic states (H<sup>+</sup>, H<sub>2</sub><sup>+</sup>, H<sub>3</sub><sup>+</sup>), whose transitions are governed by variations in RF power, gas flow and other parameters. Manual classification is subjective, time-consuming, and unscalable. My goal was to build a non-intrusive, automatable detection pipeline capable of generalizing to other ECR ion sources.
        </p>

        <h2 className="text-2xl font-semibold mt-8">🛠️ Tools & Stack</h2>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Python</strong> – Core language</li>
          <li><strong>Scikit-learn</strong> – Clustering, classification, preprocessing</li>
          <li><strong>TensorFlow & Keras</strong> – Deep Learning modeling (MLPs, RNNs)</li>
          <li><strong>SciPy</strong> – Signal analysis (e.g. <code>find_peaks</code>)</li>
          <li><strong>Docker</strong> – Environment consistency</li>
          <li><strong>GitHub</strong> – Version control & collaboration</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8">📊 Data Acquisition</h2>
        <p>
          Experimental data was obtained from RF and gas sweep tests under stationary conditions. Features included RF power, reflected power, beam luminosity, gas flow, and impedance metrics. Two datasets were used: one from baseline configuration, and another after structural upgrades to simulate domain shift.
        </p>

        <h2 className="text-2xl font-semibold mt-8">🧠 Methodology</h2>
        <p>
          The problem was divided into two subproblems:
        </p>
        <ol className="list-decimal list-inside space-y-1">
          <li>
            <strong>Jump Detection:</strong> Based on abrupt changes in luminosity or adaptation+noise signatures. Implemented using sliding-window regression and peak detection with thresholds tuned via grid search.
          </li>
          <li>
            <strong>Jump Classification:</strong> Applied both unsupervised (K-Means, DBSCAN) and supervised (Random Forest, Sequential NN, LSTM) models to classify each transition into state categories A, B, or C.
          </li>
        </ol>

        <h2 className="text-2xl font-semibold mt-8">🧪 Key Results</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Jump detection</strong> succeeded with both luminosity and alternative signals (non-intrusive), enabling deployment in integrated systems.</li>
          <li><strong>K-Means</strong> performed best (F1 = 98%) when luminosity was available, while <strong>Random Forest</strong> offered &gt;   97% accuracy without it.</li>
          <li><strong>Sequential NNs</strong> provided robustness to data shift, with generalization across test domains reaching F1 = 84.4% (multi-source training).</li>
          <li><strong>RNNs</strong> achieved moderate performance but showed potential for future real-time sequence classification.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8">🧩 Generalization & Robustness</h2>
        <p>
          Models trained on initial data did not generalize to second dataset without retraining, except for the neural networks, which were able to adapt to the structural changes. This highlights the importance of incorporating domain variability and augmenting data during training.
        </p>

        <h2 className="text-2xl font-semibold mt-8">📌 Conclusion</h2>
        <p>
          This project demonstrates how domain-specific engineering problems can be addressed through ML with careful preprocessing, algorithm selection, and interpretability considerations. It also shows my capability to bridge physics, electronics, and AI, and to build robust, reproducible pipelines ready for scaling.
        </p>

        <p className="text-gray-500 dark:text-gray-400 italic">
          (A scientific publication based on this project has been submitted to a national conference and will be linked here soon.)
        </p>
      </motion.section>

      <div className="mt-12 text-center">
        <Link
          href="/projects"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md transition"
        >
          ← Back to Projects
        </Link>
      </div>
    </main>
  );
}
