import 'server-only';
import { createHash } from 'node:crypto';
import type { UploadSignature } from '@/types';

/**
 * Signed direct uploads: the server signs a fixed set of upload options, and the browser
 * sends the file straight to Cloudinary, so photos never pass through our server.
 * Signing every option means a signature can't be reused with a different folder or size.
 */
const UPLOAD_OPTIONS = {
  folder: 'nevo/products',
  // Incoming transformation: store at most 2400px on the long side (plenty for retina product pages).
  transformation: 'c_limit,w_2400,h_2400',
  allowed_formats: 'jpg,jpeg,png,webp,avif',
};

function credentials() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  return cloudName && apiKey && apiSecret ? { cloudName, apiKey, apiSecret } : null;
}

/** Cloudinary's signature: SHA-1 of the alphabetically sorted `key=value` pairs, followed by the API secret. */
function sign(params: Record<string, string | number>, apiSecret: string): string {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');
  return createHash('sha1').update(payload + apiSecret).digest('hex');
}

/**
 * Server-side copy of a remote image (used by the social import: Facebook/Instagram URLs expire).
 * The `publicId` is deterministic per source photo and `overwrite` is off, so re-running a sync
 * returns the already-stored copy instead of uploading a duplicate. Returns the HTTPS delivery URL.
 */
export async function uploadRemoteImage(sourceUrl: string, publicId: string): Promise<string> {
  const config = credentials();
  if (!config) throw new Error('Cloudinary is not configured');

  const params = {
    folder: 'nevo/social',
    public_id: publicId,
    overwrite: 'false',
    transformation: UPLOAD_OPTIONS.transformation,
    timestamp: Math.floor(Date.now() / 1000),
  };
  const body = new URLSearchParams({
    ...Object.fromEntries(Object.entries(params).map(([key, value]) => [key, String(value)])),
    file: sourceUrl,
    api_key: config.apiKey,
    signature: sign(params, config.apiSecret),
  });
  const res = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`, { method: 'POST', body });
  const json = (await res.json()) as { secure_url?: string; error?: { message: string } };
  if (!res.ok || !json.secure_url) throw new Error(`Cloudinary upload failed: ${json.error?.message ?? res.status}`);
  return json.secure_url;
}

/** Returns `null` when Cloudinary isn't configured. Cloudinary accepts a signature for one hour. */
export function createUploadSignature(): UploadSignature | null {
  const config = credentials();
  if (!config) return null;

  const params = { ...UPLOAD_OPTIONS, timestamp: Math.floor(Date.now() / 1000) };
  return {
    uploadUrl: `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
    fields: { ...params, timestamp: String(params.timestamp), api_key: config.apiKey, signature: sign(params, config.apiSecret) },
  };
}
