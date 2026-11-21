import type { Metadata } from 'next';
import PublicationCard from '@/components/PublicationCard';

export const metadata: Metadata = {
  title: 'Publications',
  description: 'Conference papers and theses by Ander Fernández Rúa.',
};

export default function PublicationsPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="font-serif text-4xl text-text sm:text-5xl">Publications</h1>
      <p className="mt-4 mb-14 max-w-[60ch] text-muted">
        Peer-reviewed work first, then academic theses. Get in touch if you need data or additional
        material.
      </p>

      <h2 className="font-serif text-2xl text-text">Conference papers</h2>
      <div className="mt-6">
        <PublicationCard
          year="2024"
          type="Conference paper · First author"
          title="Automatic classification of plasma state in an ECR-type ion source"
          venue="Proceedings of the 26th International Workshop on ECR Ion Sources (ECRIS 2024), Darmstadt · JACoW"
          abstract="A methodology to infer the state of the plasma in an ECR ion source without any sensor that perturbs it, using machine-learning classifiers trained on experimental signals."
          href="https://proceedings.jacow.org/ecris2024/doi/JACoW-ECRIS2024-MOP08.html"
          linkLabel="Read on JACoW"
        />
      </div>

      <h2 className="mt-16 font-serif text-2xl text-text">Theses</h2>
      <div className="mt-6">
        <PublicationCard
          year="2026"
          type="Master’s thesis · Big Data & Visual Analytics"
          title="Automated prognostics environment for a wear test bench"
          venue="Universidad Internacional de La Rioja (UNIR) · carried out at Ikerlan"
          abstract="An event-driven pipeline that acquires laser measurements from a crank–slider wear bench, estimates wear with a soft sensor, forecasts it with uncertainty and streams the results to a real-time dashboard, with a comparison of data-driven forecasting models. The data belong to Ikerlan and are not public."
          href="/projects/project3"
          linkLabel="Read the project write-up"
        />

        <PublicationCard
          year="2024"
          type="Bachelor’s thesis · Electronic engineering"
          title="Ion source optimisation with artificial-intelligence techniques"
          venue="University of the Basque Country (UPV/EHU)"
          abstract="Automatic detection and classification of state changes in the hydrogen plasma of the PIT30 ECR ion source, from experimental signals and without perturbing the plasma. Compares k-means, DBSCAN, random forests and neural networks, and tests how well they generalise to a modified source."
          href="https://addi.ehu.es/handle/10810/73191"
          linkLabel="Read on ADDI"
        />

        <PublicationCard
          year="2024"
          type="Bachelor’s thesis · Physics"
          title="Sociophysics applied to Spanish politics"
          venue="University of the Basque Country (UPV/EHU)"
          abstract="Uses statistical-physics tools to study Spanish electoral behaviour: tests the universal vote distribution of Fortunato and Castellano on the Senate, models incumbency as a three-state Markov chain to test whether the system has memory, and proposes an Ising-type model of voters, parties and leaders analysed in the mean-field approximation."
          href="/docs/TFG_Fisica.pdf"
          linkLabel="Read thesis (PDF)"
        />
      </div>
    </section>
  );
}
