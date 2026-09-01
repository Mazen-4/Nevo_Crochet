import { testimonials } from '@/lib/data/site';

export function AboutSection() {
  return (
    <section id="about" className="bg-[#fdf8fb]">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-[0.9fr_1.1fr] md:px-8 lg:px-10">
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8d6e9e]">Why Nevo</p>
          <h2 className="text-3xl font-semibold tracking-[-0.05em] text-[#2f1d36] md:text-4xl">
            Handmade pieces designed for the rituals of home.
          </h2>
          <p className="text-lg leading-8 text-[#5c4d66]">
            Each piece is made with a slow, tactile approach that values softness, durability, and the comfort of familiar textures.
          </p>
          <p className="text-base leading-7 text-[#5c4d66]">
            From dreamy décor to everyday heirlooms, the studio focuses on small-batch work that feels personal, lived-in, and treasured over time.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {[
            ['Small-batch making', 'Each creation is worked in limited runs to keep quality personal and intentional.'],
            ['Thoughtful textures', 'Soft finishes and tactile yarn blends create warmth in both look and feel.'],
            ['Custom details', 'Colors, sizing, and finishing touches can be tailored to your space and story.'],
            ['Heirloom feel', 'Every piece is designed to be kept, used, and loved for years.'],
          ].map(([title, text]) => (
            <div key={title} className="rounded-[1.5rem] border border-[#eedaf1] bg-white p-5 shadow-[0_12px_28px_rgba(143,116,163,0.07)]">
              <h3 className="text-lg font-semibold text-[#2f1d36]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#5d4e68]">{text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-20 md:px-8 lg:px-10">
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <blockquote key={testimonial.id} className="rounded-[1.5rem] border border-[#efdfef] bg-white p-6 shadow-[0_10px_24px_rgba(140,112,163,0.05)]">
              <p className="text-base leading-7 text-[#4f3c5c]">“{testimonial.text}”</p>
              <footer className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#8a6a95]">{testimonial.name}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
