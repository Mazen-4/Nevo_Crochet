export type ProjectColor = {
  key: string;
  label: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  /** Locale-independent category key (from the English category), used for filtering. */
  categoryKey: string;
  description: string;
  materials: string;
  colors: ProjectColor[];
  featured: boolean;
  image: string;
  gallery: string[];
  priceLabel?: string;
  /** ISO timestamp — kept as a string so it survives the data cache and server→client props. */
  createdAt: string;
};

export type Testimonial = {
  id: string;
  name: string;
  text: string;
};

/** Minimal project info the cart needs to render localized titles. */
export type CatalogEntry = Pick<Project, 'id' | 'slug' | 'title' | 'priceLabel'>;

export type CartItem = {
  id: string;
  slug?: string;
  title: string;
  quantity: number;
  priceLabel?: string;
};
