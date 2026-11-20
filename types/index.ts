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
  /** Optional search-engine overrides set in the admin; fall back to title/description. */
  seoTitle?: string;
  seoDescription?: string;
  /** ISO timestamp — kept as a string so it survives the data cache and server→client props. */
  createdAt: string;
};

export type Testimonial = {
  id: string;
  name: string;
  text: string;
};

/** Admin project form — one translation block per locale. Serialized as JSON into the form's `payload` field. */
export type ProjectTranslationValues = {
  title: string;
  category: string;
  description: string;
  materials: string;
  priceLabel: string;
  seoTitle: string;
  seoDescription: string;
};

export type ProjectFormValues = {
  slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featured: boolean;
  en: ProjectTranslationValues;
  ar: ProjectTranslationValues;
  colors: Array<{ key: string; en: string; ar: string }>;
  images: Array<{ url: string; altText: string }>;
};

/**
 * Result of saving the admin project form. A successful save redirects instead of returning,
 * so only failures come back. `errors` maps a field path (`en.title`, `images.0.url`) to an error code.
 */
export type ProjectFormState = {
  result?: 'error';
  errors?: Record<string, string>;
};

/** A signed Cloudinary upload: POST the file plus `fields` as multipart form data to `uploadUrl`. */
export type UploadSignature = {
  uploadUrl: string;
  fields: Record<string, string>;
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
