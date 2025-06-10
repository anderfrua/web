import PublicationCard from '@/components/PublicationCard';
import { Metadata } from 'next';
import { Microscope } from 'lucide-react';



export const metadata: Metadata = {
  title: 'Publications – Ander Fernandez',
  description:
    'Peer-reviewed papers, theses and technical articles by Ander Fernandez.',
};

export default function PublicationsPage() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-extrabold mb-10 text-center flex items-center justify-center gap-3">
        <Microscope size={40} className="text-blue-600 dark:text-blue-400" />
        Publications
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12">
        Peer-reviewed research, conference proceedings and academic theses.
        Feel free to reach out for additional material.
      </p>

      {/* Grid responsive: 1 col móvil, 2 cols desktop */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* === PAPER – JACoW ECRIS 2024 ================================= */}
        <PublicationCard
          title="Automatic Classification of Plasma States in an ECR-Type Ion Source"
          venue="JACoW • Proceedings of the 25th International Workshop on ECR Ion Sources (ECRIS)"
          year="2024"
          abstract="In this paper we present a methodology to infer the state of
                    the plasma in an ECR source without using any sensor that
                    modifies its behaviour. For this purpose, machine learning
                    techniques are explored."
          pdf="/docs/ECRIS_Article.pdf"
          badge="JACoW · ECRIS 2024"
        />

        {/* === THESIS – ML + PLASMA ==================================== */}
        <PublicationCard
          title="Machine Learning for Plasma State Classification in ECR Ion Sources"
          venue="Bachelor’s Thesis • UPV/EHU"
          year="2025"
          abstract="Developed a real-time ML system (MLP + PCA) that classifies hydrogen plasma
                    regimes with 93 % accuracy. Packaged as a Python module for seamless
                    integration into control systems."
          // Sin PDF público → botón “Request” opcional (omítelo para solo texto)
        />

        {/* === THESIS – SOCIOPHYSICS =================================== */}
        <PublicationCard
          title="Socio-physical Modeling of Spanish Electoral Dynamics"
          venue="Bachelor’s Thesis • UPV/EHU"
          year="2025"
          abstract="Applied Ising-style agent simulations and Markov chains to 40 years of
                    Spanish election data, revealing long-term incumbency bias and universal
                    vote-share patterns."
        />
      </div>
    </section>
  );
}
