import type { Project, Testimonial } from '@/types';

export const projects: Project[] = [
  {
    id: '1',
    slug: 'luna-cushion-set',
    title: 'Luna Cushion Set',
    category: 'Home',
    description:
      'Soft pastel cushions made in a cozy, heirloom finish with plush texture and careful stitching.',
    materials: 'Cotton yarn, wool blend, hand-finished edges',
    colors: ['Blush pink', 'Lavender', 'Cream'],
    featured: true,
    image:
      'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    ],
    priceLabel: 'Made to order',
  },
  {
    id: '2',
    slug: 'rose-loop-throw',
    title: 'Rose Loop Throw',
    category: 'Blankets',
    description:
      'A layered throw with a gentle drape and warm, tactile finish designed for slow evenings.',
    materials: 'Merino blend, brushed cotton, hand-knotted tassels',
    colors: ['Rose', 'Lilac', 'Warm grey'],
    featured: true,
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1200&q=80',
    ],
    priceLabel: 'Custom sizing',
  },
  {
    id: '3',
    slug: 'petal-market-basket',
    title: 'Petal Market Basket',
    category: 'Accessories',
    description:
      'A structured crochet basket with a soft silhouette and a sweet color story for daily rituals.',
    materials: 'Cotton rope, braided handle, natural liner',
    colors: ['Petal pink', 'Peony', 'Sand'],
    featured: false,
    image:
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
    ],
    priceLabel: 'Small batch',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Amelia',
    text: 'Every piece feels thoughtful and intentional. It instantly made our home feel softer and more personal.',
  },
  {
    id: 't2',
    name: 'Nora',
    text: 'The detail is beautiful, and the colors feel like a gentle keepsake rather than mass-produced décor.',
  },
  {
    id: 't3',
    name: 'Sofia',
    text: 'The process felt personal from start to finish, and the final piece looked even more beautiful in person.',
  },
];
