'use client';

import { useState } from 'react';
import { Mail, Github, Linkedin } from 'lucide-react'; // npm install lucide-react

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');

    const form = e.currentTarget;
    const data = {
      name: form.name.valueOf,
      email: form.email.value,
      message: form.message.value,
    };

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus('sent');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <h1 className="text-5xl font-extrabold mb-4 text-gray-900 dark:text-white">Let&apos;s Connect</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mb-10">
        Whether you have a project in mind, a question, or just want to say hello — my inbox is open.
      </p>
      
      <div className="mt-12 flex gap-8 justify-center text-gray-600 dark:text-gray-300">
        <a href="mailto:anderrua@gmail.com" className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2">
          <Mail size={20} /> anderrua@gmail.com
        </a>
        <a
          href="https://github.com/anderfrua?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2"
        >
          <Github size={20} /> GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/ander-fern%C3%A1ndez-r%C3%BAa-4a78a1314/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2"
        >
          <Linkedin size={20} /> LinkedIn
        </a>
      </div>


      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg dark:shadow-none space-y-4 text-left"
      >
        <input
          name="name"
          type="text"
          required
          placeholder="Your Name"
          className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Your Email"
          className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <textarea
          name="message"
          rows={5}
          required
          placeholder="Your Message"
          className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition"
        >
          {status === 'sending' ? 'Sending...' : 'Send Message'}
        </button>
        {status === 'sent' && <p className="text-green-500 text-sm mt-2">Message sent successfully!</p>}
        {status === 'error' && <p className="text-red-500 text-sm mt-2">Something went wrong. Try again.</p>}
      </form>

      
    </section>
  );
}
