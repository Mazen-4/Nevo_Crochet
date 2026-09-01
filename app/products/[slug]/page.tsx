import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects } from '@/lib/data/site';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug) ?? null;

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#fffafc] px-5 py-10 text-[#2f1d36] md:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="inline-flex items-center rounded-full border border-[#ead8ef] bg-white px-4 py-2 text-sm font-medium text-[#4f3559] hover:bg-[#fff8fc]">
          ← Back to gallery
        </Link>

        <div className="mt-8 grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[2rem] border border-[#efdff2] bg-white p-3 shadow-[0_24px_60px_rgba(140,111,160,0.08)]">
            <img src={project.image} alt={project.title} className="h-[520px] w-full rounded-[1.5rem] object-cover" />
          </div>

          <div className="space-y-6 rounded-[2rem] border border-[#eedaf1] bg-white p-7 shadow-[0_20px_46px_rgba(139,110,160,0.06)]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8d6e9e]">{project.category}</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-[#2f1d36]">{project.title}</h1>
            </div>

            <p className="text-lg leading-8 text-[#5f4b67]">{project.description}</p>

            <div className="rounded-[1.5rem] bg-[#fdf3fb] p-4">
              <p className="text-sm uppercase tracking-[0.18em] text-[#815f86]">Made to order</p>
              <p className="mt-2 text-2xl font-semibold text-[#2f1d36]">{project.priceLabel}</p>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7c5d8d]">Materials</p>
              <p className="mt-2 text-base leading-7 text-[#564a65]">{project.materials}</p>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7c5d8d]">Palette</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.colors.map((color) => (
                  <span key={color} className="rounded-full border border-[#e6d3ec] bg-[#fffafc] px-3 py-1.5 text-sm text-[#554563]">
                    {color}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="flex-1 rounded-full bg-[#7b5ca8] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(123,92,168,0.25)] transition hover:bg-[#6d4f9b]">
                Add to inquiry
              </button>
              <Link href="#contact" className="flex-1 rounded-full border border-[#e4d0ea] bg-white px-5 py-3.5 text-center text-sm font-semibold text-[#4f3559] transition hover:bg-[#fff8fc]">
                Ask a question
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
