/**
 * Where product images may be served from. `next/image` refuses anything else, so
 * `next.config.ts` and the admin project form both read this one list.
 * Cloudinary is limited to this project's own cloud, not every Cloudinary account.
 */
const CLOUDINARY_CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export const IMAGE_SOURCES: ReadonlyArray<{ hostname: string; pathPrefix?: string }> = [
  ...(CLOUDINARY_CLOUD ? [{ hostname: 'res.cloudinary.com', pathPrefix: `/${CLOUDINARY_CLOUD}/` }] : []),
  // Sample catalog photos; remove once every piece uses uploaded photography.
  { hostname: 'images.unsplash.com' },
];

/** Hostnames only, for messages shown to admins. */
export const IMAGE_HOSTS = IMAGE_SOURCES.map((source) => source.hostname);

export function isAllowedImageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      IMAGE_SOURCES.some((source) => url.hostname === source.hostname && (!source.pathPrefix || url.pathname.startsWith(source.pathPrefix)))
    );
  } catch {
    return false;
  }
}
