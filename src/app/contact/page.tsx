'use client';

import { useState } from 'react';
import { Mail, Github, Linkedin } from 'lucide-react'; // npm install lucide-react
import emailjs from '@emailjs/browser';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');

    const form = e.currentTarget;

    try {
      const res = await emailjs.sendForm(
        'service_vl7ow4n', // Reemplaza esto con tu Service ID de EmailJS
        'template_dkqnmxn', // Reemplaza esto con tu Template ID de EmailJS
        form, // Usamos el formulario HTML directamente
        'PBDaABZrFGqVAR9S6' // Tu public key de EmailJS
      );

      if (res.status === 200) {
        setStatus('sent');
        form.reset(); // Reseteamos el formulario si el envío fue exitoso
      } else {
        setStatus('error');
      }
    } catch (error: unknown) {
      setStatus('error');
      // Aquí verificamos si el error es un objeto con una propiedad 'message'
      if (error instanceof Error) {
        console.error('Error sending message:', error.message);
      } else {
        console.error('An unknown error occurred:', error);
      }
    }
  };

  return (
    <section className="min-h-screen relative z-10 flex flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-5xl font-extrabold mb-4 text-gray-900 dark:text-white">Let&apos;s Connect!</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mb-10">
        Whether you have a project in mind, a question, or just want to say hello — my inbox is always open.
      </p>

      <div className="mt-12 flex gap-8 justify-center text-gray-600 dark:text-gray-300 flex-wrap">
        <a href="mailto:anderrua@gmail.com" className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 text-xl sm:text-2xl">
          <Mail size={20} /> anderrua@gmail.com
        </a>
        <a
          href="https://github.com/anderfrua?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 text-xl sm:text-2xl"
        >
          <Github size={20} /> GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/ander-fern%C3%A1ndez-r%C3%BAa-4a78a1314/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 text-xl sm:text-2xl"
        >
          <Linkedin size={20} /> LinkedIn
        </a>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-10 w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg dark:shadow-none space-y-4 text-left"
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
