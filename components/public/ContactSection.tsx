export function ContactSection() {
  return (
    <section id="contact" className="bg-[#291d35] py-20 text-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-[1fr_0.9fr] md:px-8 lg:px-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e9d0ff]">Let’s create something personal</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] md:text-4xl">
            Ready for a custom crochet piece or a cozy home refresh?
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-8 text-[#efe2f8]">
            Share your idea and we’ll shape a piece that fits your space, mood, and everyday rituals.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="space-y-4 text-sm text-[#f4ebff]">
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
      </div>
    </section>
  );
}
