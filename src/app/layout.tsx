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
  metadataBase: new URL('https://anderfernandez.me'),
  title: {
    default: 'Ander Fernández Rúa',
    template: '%s · Ander Fernández Rúa',
  },
  description:
    'Physicist and electronics engineer. PhD researcher in computational neuroimaging at the BioBizkaia Health Research Institute.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'Ander Fernández Rúa',
    description:
      'PhD researcher in computational neuroimaging at the BioBizkaia Health Research Institute.',
    url: 'https://anderfernandez.me',
    siteName: 'Ander Fernández Rúa',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${sans.variable} ${serif.variable}`}>
      <body className="min-h-screen flex flex-col">
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
