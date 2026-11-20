import { Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-ink/85">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Ander Fernández Rúa · Bilbao</p>
        <div className="flex gap-5">
          <a href="mailto:anderrua@gmail.com" className="flex items-center gap-1.5 hover:text-text">
            <Mail size={15} aria-hidden /> Email
          </a>
          <a
            href="https://github.com/anderfrua"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-text"
          >
            <Github size={15} aria-hidden /> GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/ander-fern%C3%A1ndez-r%C3%BAa-4a78a1314/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-text"
          >
            <Linkedin size={15} aria-hidden /> LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
