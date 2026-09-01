import Link from 'next/link';
import { projects } from '@/lib/data/site';

export function FeaturedGallery() {
  return (
    <section id="gallery" className="mx-auto max-w-6xl px-5 py-20 md:px-8 lg:px-10">
      <div className="mb-10 flex items-end justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8d6e9e]">Curated pieces</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#2f1d36] md:text-4xl">
            A gallery for slow living
          </h2>
        </div>
        <Link href="#contact" className="hidden text-sm font-semibold text-[#6d4e82] hover:text-[#4f3459] md:inline-block">
          Request a custom piece →
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {projects.map((project) => (
          <article key={project.id} className="group overflow-hidden rounded-[1.75rem] border border-[#f1e1f0] bg-white shadow-[0_16px_38px_rgba(140,110,166,0.08)] transition hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(119,80,146,0.12)]">
            <Link href={`/products/${project.slug}`} className="block">
              <div className="overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-80 w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
            </Link>
            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-[#f9ebf5] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#815f86]">
                  {project.category}
                </span>
                <span className="text-sm font-medium text-[#7d5d8f]">{project.priceLabel}</span>
              </div>

              <div>
                <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#2f1d36]">{project.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#5e4b66]">{project.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {project.colors.map((color) => (
                  <span key={color} className="rounded-full border border-[#ead8ef] bg-[#fffafc] px-2.5 py-1 text-xs text-[#5f4e69]">
                    {color}
                  </span>
                ))}
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/products/${project.slug}`}
                  className="inline-flex rounded-full bg-[#f4ebff] px-4 py-2.5 text-sm font-semibold text-[#504061] transition hover:bg-[#e9dcff]"
                >
                  View details
                </Link>
                <Link
                  href="#contact"
                  className="inline-flex rounded-full border border-[#ead8ef] px-4 py-2.5 text-sm font-semibold text-[#504061] transition hover:bg-[#fff8fc]"
                >
                  Add to inquiry
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
