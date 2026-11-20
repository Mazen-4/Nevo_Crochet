/**
 * Hosts that product images may be served from. `next/image` refuses any other host,
 * so `next.config.ts` and the admin project form both read this one list.
 * Add the image storage host here once uploads are set up (Phase 3).
 */
export const IMAGE_HOSTS = ['images.unsplash.com'] as const;

export function isAllowedImageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && (IMAGE_HOSTS as readonly string[]).includes(url.hostname);
  } catch {
    return false;
  }
}
