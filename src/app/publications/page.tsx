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
        Conference proceedings and academic theses, newest first. Get in touch if you need data or
        additional material.
      </p>

      <PublicationCard
        year="2025"
        type="Bachelor’s thesis · Physics"
        title="Sociophysics applied to Spanish politics"
        venue="University of the Basque Country (UPV/EHU)"
        abstract="Uses statistical-physics tools to study Spanish electoral behaviour: tests the universal vote distribution of Fortunato and Castellano on the Senate, models incumbency as a three-state Markov chain to test whether the system has memory, and proposes an Ising-type model of voters, parties and leaders analysed in the mean-field approximation."
        href="/docs/TFG_Fisica.pdf"
        linkLabel="Read thesis (PDF)"
      />

      <PublicationCard
        year="2024"
        type="Conference paper · First author"
        title="Automatic classification of plasma state in an ECR-type ion source"
        venue="Proceedings of the 26th International Workshop on ECR Ion Sources (ECRIS 2024), Darmstadt · JACoW"
        abstract="A methodology to infer the state of the plasma in an ECR ion source without any sensor that perturbs it, using machine-learning classifiers trained on experimental signals."
        href="https://proceedings.jacow.org/ecris2024/doi/JACoW-ECRIS2024-MOP08.html"
        linkLabel="Read on JACoW"
      />

      <PublicationCard
        year="2024"
        type="Bachelor’s thesis · Applied physics"
        title="Ion source optimisation with artificial-intelligence techniques"
        venue="University of the Basque Country (UPV/EHU)"
        abstract="Automatic detection and classification of state changes in the hydrogen plasma of the PIT30 ECR ion source, from experimental signals and without perturbing the plasma. Compares k-means, DBSCAN, random forests and neural networks, and tests how well they generalise to a modified source."
        href="https://addi.ehu.es/handle/10810/73191"
        linkLabel="Read on ADDI"
      />
    </section>
  );
}
