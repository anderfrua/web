'use client';

import { useState } from 'react';
import { Mail, Github, Linkedin } from 'lucide-react';
import emailjs from '@emailjs/browser';

const inputClass =
  'w-full rounded-sm border border-line bg-surface px-4 py-3 text-text placeholder:text-muted/60 focus:border-signal focus:outline-none transition-colors';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    const form = e.currentTarget;

    try {
      const res = await emailjs.sendForm(
        'service_vl7ow4n',
        'template_dkqnmxn',
        form,
        'PBDaABZrFGqVAR9S6'
      );
      if (res.status === 200) {
        setStatus('sent');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch (error: unknown) {
      setStatus('error');
      console.error('Error sending message:', error instanceof Error ? error.message : error);
    }
  };

  return (
    <section className="mx-auto grid max-w-5xl gap-14 px-6 py-20 md:grid-cols-[1fr_1.2fr]">
      <div>
        <h1 className="font-serif text-4xl text-text sm:text-5xl">Contact</h1>
        <p className="mt-4 max-w-[45ch] leading-relaxed text-muted">
          For research collaborations, questions about my work or anything else, write to me directly
          or use the form.
        </p>

        <ul className="mt-10 space-y-4">
          <li>
            <a href="mailto:anderrua@gmail.com" className="flex items-center gap-3 text-text hover:text-signal">
              <Mail size={18} aria-hidden className="text-muted" /> anderrua@gmail.com
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/ander-fern%C3%A1ndez-r%C3%BAa-4a78a1314/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-text hover:text-signal"
            >
              <Linkedin size={18} aria-hidden className="text-muted" /> LinkedIn
            </a>
          </li>
          <li>
            <a
              href="https://github.com/anderfrua"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-text hover:text-signal"
            >
              <Github size={18} aria-hidden className="text-muted" /> GitHub
            </a>
          </li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm text-muted">Name</label>
          <input id="name" name="name" type="text" required autoComplete="name" className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm text-muted">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
        </div>
        <div>
          <label htmlFor="message" className="mb-1.5 block text-sm text-muted">Message</label>
          <textarea id="message" name="message" rows={6} required className={inputClass} />
        </div>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="rounded-sm bg-signal px-6 py-3 font-medium text-ink transition-colors hover:bg-[#f0bb68] disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        <p role="status" className="text-sm">
          {status === 'sent' && <span className="text-text">Message sent. I’ll reply by email.</span>}
          {status === 'error' && (
            <span className="text-[#f08a7e]">
              The message couldn’t be sent. Check your connection and try again, or email me directly.
            </span>
          )}
        </p>
      </form>
    </section>
  );
}
