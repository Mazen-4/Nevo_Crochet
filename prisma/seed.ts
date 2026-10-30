import { PrismaClient, Locale } from '@prisma/client';

const prisma = new PrismaClient();

const projects = [
  {
    slug: 'luna-cushion-set',
    featured: true,
    sortOrder: 1,
    en: {
      title: 'Luna Cushion Set',
      category: 'Home',
      description:
        'Soft pastel cushions made in a cozy, heirloom finish with plush texture and careful stitching.',
      materials: 'Cotton yarn, wool blend, hand-finished edges',
      priceLabel: 'Made to order',
    },
    ar: {
      title: 'طقم وسائد لونا',
      category: 'المنزل',
      description:
        'وسائد بألوان باستيلية ناعمة وتشطيب دافئ يدوم، بملمس غني وغرز متقنة.',
      materials: 'خيط قطني، مزيج صوف، حواف منتهية يدوياً',
      priceLabel: 'يُصنع عند الطلب',
    },
    colors: [
      { key: 'blush', en: 'Blush pink', ar: 'وردي ناعم' },
      { key: 'lavender', en: 'Lavender', ar: 'لافندر' },
      { key: 'cream', en: 'Cream', ar: 'كريمي' },
    ],
    images: [
      'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    slug: 'rose-loop-throw',
    featured: true,
    sortOrder: 2,
    en: {
      title: 'Rose Loop Throw',
      category: 'Blankets',
      description:
        'A layered throw with a gentle drape and warm, tactile finish designed for slow evenings.',
      materials: 'Merino blend, brushed cotton, hand-knotted tassels',
      priceLabel: 'Custom sizing',
    },
    ar: {
      title: 'بطانية روز لوب',
      category: 'بطانيات',
      description:
        'بطانية متعددة الطبقات بانسدال لطيف وتشطيب دافئ وملمس مريح لأمسيات هادئة.',
      materials: 'مزيج ميرينو، قطن ممشط، شرابات معقودة يدوياً',
      priceLabel: 'مقاسات مخصصة',
    },
    colors: [
      { key: 'rose', en: 'Rose', ar: 'وردي' },
      { key: 'lilac', en: 'Lilac', ar: 'ليلكي' },
      { key: 'grey', en: 'Warm grey', ar: 'رمادي دافئ' },
    ],
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    slug: 'petal-market-basket',
    featured: false,
    sortOrder: 3,
    en: {
      title: 'Petal Market Basket',
      category: 'Accessories',
      description:
        'A structured crochet basket with a soft silhouette and a sweet color story for daily rituals.',
      materials: 'Cotton rope, braided handle, natural liner',
      priceLabel: 'Small batch',
    },
    ar: {
      title: 'سلة بتلات اليومية',
      category: 'إكسسوارات',
      description:
        'سلة كروشيه متينة بانحناءة ناعمة وتوليفة ألوان جميلة لطقوسك اليومية.',
      materials: 'حبل قطني، مقبض مضفّر، بطانة طبيعية',
      priceLabel: 'دفعة محدودة',
    },
    colors: [
      { key: 'petal', en: 'Petal pink', ar: 'وردي بتلات' },
      { key: 'peony', en: 'Peony', ar: 'بيوني' },
      { key: 'sand', en: 'Sand', ar: 'رملي' },
    ],
    images: [
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
    ],
  },
];

const testimonials = [
  {
    en: { name: 'Amelia', text: 'Every piece feels thoughtful and intentional. It instantly made our home feel softer and more personal.' },
    ar: { name: 'أميليا', text: 'كل قطعة تحمل عناية وقصداً واضحين، وقد جعلت منزلنا أكثر دفئاً وشخصية منذ اللحظة الأولى.' },
  },
  {
    en: { name: 'Nora', text: 'The detail is beautiful, and the colors feel like a gentle keepsake rather than mass-produced décor.' },
    ar: { name: 'نورا', text: 'التفاصيل جميلة، والألوان تمنح إحساساً بذكرى لطيفة، لا بقطعة ديكور مصنّعة بكميات كبيرة.' },
  },
  {
    en: { name: 'Sofia', text: 'The process felt personal from start to finish, and the final piece looked even more beautiful in person.' },
    ar: { name: 'صوفيا', text: 'كانت التجربة شخصية من البداية إلى النهاية، والقطعة النهائية بدت أجمل حتى مما تخيلت.' },
  },
];

async function main() {
  console.log('Seeding database...');

  for (const p of projects) {
    const project = await prisma.project.create({
      data: {
        slug: p.slug,
        featured: p.featured,
        sortOrder: p.sortOrder,
        translations: {
          create: [
            { locale: Locale.en, title: p.en.title, category: p.en.category, description: p.en.description, materials: p.en.materials, priceLabel: p.en.priceLabel },
            { locale: Locale.ar, title: p.ar.title, category: p.ar.category, description: p.ar.description, materials: p.ar.materials, priceLabel: p.ar.priceLabel },
          ],
        },
        images: {
          create: p.images.map((url, i) => ({
            url,
            isPrimary: i === 0,
            sortOrder: i,
          })),
        },
        colors: {
          create: p.colors.map((c, i) => ({
            colorKey: c.key,
            sortOrder: i,
          })),
        },
      },
    });

    for (const c of p.colors) {
      await prisma.colorTranslation.createMany({
        data: [
          { colorKey: c.key, locale: Locale.en, label: c.en },
          { colorKey: c.key, locale: Locale.ar, label: c.ar },
        ],
        skipDuplicates: true,
      });
    }

    console.log(`  Created project: ${project.slug}`);
  }

  for (const [i, t] of testimonials.entries()) {
    await prisma.testimonial.createMany({
      data: [
        { locale: Locale.en, name: t.en.name, text: t.en.text, sortOrder: i },
        { locale: Locale.ar, name: t.ar.name, text: t.ar.text, sortOrder: i },
      ],
    });
  }

  console.log(`  Created ${testimonials.length} testimonials (EN + AR)`);
  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
