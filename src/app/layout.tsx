import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import InteractiveGridBackground from '@/components/InteractiveGridBackground';
//import PathfindingGrid from '@/components/PathfindingGrid';
//import ParticleBackground from '@/components/ParticleBackground';


const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Ander Fernandez',
  description: 'Personal portfolio of Ander Fernandez.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <InteractiveGridBackground />
        <main className="relative z-10 pt-20">{children}</main>
      </body>
    </html>
  );
}

//<PathfindingGrid /> {/* Fondo interactivo */}
//<ParticleBackground />