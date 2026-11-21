import './globals.css';
import type { Metadata } from 'next';
import { IBM_Plex_Sans, Source_Serif_4 } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InteractiveGridBackground from '@/components/InteractiveGridBackground';

const sans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-sans',
});

const serif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-source-serif',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.anderfernandez.me'),
  alternates: { canonical: './' },
  title: {
    default: 'Ander Fernández Rúa',
    template: '%s · Ander Fernández Rúa',
  },
  description:
    'PhD researcher in computational neuroscience at the BioBizkaia Health Research Institute: brain network models, brain ageing, neurodegeneration and brain–metabolism interactions.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'Ander Fernández Rúa',
    description:
      'PhD researcher in computational neuroscience at the BioBizkaia Health Research Institute.',
    url: './',
    siteName: 'Ander Fernández Rúa',
    type: 'website',
  },
};

// Structured data so search engines can tie the site to the person.
const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Ander Fernández Rúa',
  alternateName: 'Ander Fernandez Rua',
  url: 'https://www.anderfernandez.me',
  jobTitle: 'PhD researcher in computational neuroscience',
  affiliation: { '@type': 'Organization', name: 'BioBizkaia Health Research Institute' },
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'University of the Basque Country (UPV/EHU)' },
    { '@type': 'CollegeOrUniversity', name: 'Universidad Internacional de La Rioja (UNIR)' },
  ],
  knowsAbout: ['Computational neuroscience', 'Brain network models', 'Statistical physics', 'Machine learning'],
  sameAs: ['https://www.linkedin.com/in/ander-fern%C3%A1ndez-r%C3%BAa-4a78a1314/', 'https://github.com/anderfrua'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${sans.variable} ${serif.variable}`}>
      <body className="min-h-screen flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] bg-surface px-3 py-2 text-sm"
        >
          Skip to content
        </a>
        <Navbar />
        <InteractiveGridBackground />
        <main id="main" className="relative z-10 flex-1 pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
