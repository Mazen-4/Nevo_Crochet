"use client";

import { FormEvent, useState } from 'react';

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  };

  return (
    <section id="contact" className="bg-[#291d35] py-20 text-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-[1fr_1.1fr] md:px-8 lg:px-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e9d0ff]">Let’s create something personal</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] md:text-4xl">
            Ready for a custom crochet piece or a cozy home refresh?
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-8 text-[#efe2f8]">
            Share your idea and we’ll shape a piece that fits your space, mood, and everyday rituals.
          </p>

          <div className="mt-8 space-y-4 text-sm text-[#f4ebff]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#d4b5f3]">Email</p>
              <a href="mailto:hello@nevo-studio.com" className="mt-1 block text-lg font-medium text-white">
                hello@nevo-studio.com
              </a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#d4b5f3]">WhatsApp</p>
              <a href="https://wa.me/1234567890" className="mt-1 block text-lg font-medium text-white">
                +1 (234) 567-890
              </a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#d4b5f3]">Response time</p>
              <p className="mt-1 text-lg font-medium text-white">Usually within 1–2 days</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-[#f0e6ff]">Name</label>
            <input id="name" name="name" required className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-[#d9c0eb] focus:border-[#e9d0ff] focus:outline-none" placeholder="Your name" />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#f0e6ff]">Email</label>
            <input id="email" name="email" type="email" required className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-[#d9c0eb] focus:border-[#e9d0ff] focus:outline-none" placeholder="you@example.com" />
          </div>

          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-medium text-[#f0e6ff]">Details</label>
            <textarea id="message" name="message" rows={4} required className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-[#d9c0eb] focus:border-[#e9d0ff] focus:outline-none" placeholder="Tell us about the mood, colors, or space you're thinking of..." />
          </div>

          <button type="submit" className="w-full rounded-full bg-[#f5dcff] px-5 py-3.5 text-sm font-semibold text-[#2f1d36] transition hover:bg-[#efd6ff]">
            Send message
          </button>

          {submitted && (
            <p className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              Your message has been sent. I’ll be in touch soon.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
