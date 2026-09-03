export type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  materials: string;
  colors: string[];
  featured: boolean;
  image: string;
  gallery: string[];
  priceLabel?: string;
};

export type Testimonial = {
  id: string;
  name: string;
  text: string;
};

export type CartItem = {
  id: string;
  slug?: string;
  title: string;
  quantity: number;
  priceLabel?: string;
};
