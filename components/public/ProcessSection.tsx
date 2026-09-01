const steps = [
  {
    title: '01 — Share the idea',
    text: 'Tell us what you want, the colors you love, and how it will live in your space.',
  },
  {
    title: '02 — We craft it slowly',
    text: 'Every piece is created in low batches with careful attention to texture, finish, and comfort.',
  },
  {
    title: '03 — It arrives ready to keep',
    text: 'Your piece is packed with care and sent out as a functional keepsake made to be loved long-term.',
  },
];

export function ProcessSection() {
  return (
    <section id="process" className="mx-auto max-w-6xl px-5 py-20 md:px-8 lg:px-10">
      <div className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8d6e9e]">Process</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#2f1d36] md:text-4xl">
          Thoughtful work, from first sketch to final stitch.
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <div key={step.title} className="rounded-[1.75rem] border border-[#eedaf1] bg-white p-7 shadow-[0_14px_32px_rgba(148,112,169,0.07)]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8e6da5]">{step.title}</p>
            <p className="mt-5 text-base leading-7 text-[#5d4b67]">{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
