import 'server-only';
import { SocialPlatform } from '@prisma/client';

/**
 * Read-only access to Nevo's official Facebook Page and linked Instagram account (see OFFICIAL_SOCIAL
 * in lib/site.ts). The Page token never expires unless the owner changes their Facebook password or
 * removes the app; then run `npm run meta:setup` again with a fresh Graph API Explorer token.
 */
const GRAPH = 'https://graph.facebook.com/v24.0';
const MAX_PAGES = 10;

/** A post normalized across platforms. `images` are the source URLs (they expire, so copy them). */
export type SocialCandidate = {
  platform: SocialPlatform;
  externalId: string;
  permalink: string;
  caption: string | null;
  postedAt: Date;
  images: { sourceId: string; url: string }[];
};

export class MetaError extends Error {
  constructor(
    message: string,
    /** True when the token is invalid or expired and must be regenerated. */
    readonly tokenProblem: boolean,
  ) {
    super(message);
  }
}

function config() {
  const token = process.env.META_PAGE_TOKEN;
  const pageId = process.env.META_PAGE_ID;
  const igUserId = process.env.META_IG_USER_ID;
  if (!token || !pageId || !igUserId) throw new MetaError('META_PAGE_TOKEN, META_PAGE_ID and META_IG_USER_ID must be set', true);
  return { token, pageId, igUserId };
}

type GraphError = { error?: { message: string; code: number; type: string } };

async function graph<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-store' });
  const body = (await res.json()) as T & GraphError;
  if (!res.ok || body.error) {
    const e = body.error;
    // 190 = invalid/expired token, 10/200-299 = permission revoked.
    const tokenProblem = !!e && (e.code === 190 || e.code === 10 || (e.code >= 200 && e.code < 300));
    throw new MetaError(e ? `Meta: ${e.message}` : `Meta request failed (${res.status})`, tokenProblem);
  }
  return body;
}

/** Follows `paging.next` (which already carries the token) up to MAX_PAGES pages. */
async function graphList<T>(firstUrl: string): Promise<T[]> {
  const items: T[] = [];
  let url: string | undefined = firstUrl;
  for (let page = 0; url && page < MAX_PAGES; page++) {
    const body: { data: T[]; paging?: { next?: string } } = await graph(url);
    items.push(...body.data);
    url = body.paging?.next;
  }
  return items;
}

const query = (params: Record<string, string>) => new URLSearchParams(params).toString();

type FbAttachment = {
  type?: string;
  media_type?: string;
  media?: { image?: { src: string } };
  target?: { id?: string };
  subattachments?: { data: FbAttachment[] };
};
type FbPost = { id: string; message?: string; created_time: string; permalink_url: string; attachments?: { data: FbAttachment[] } };

/** Page housekeeping, not pieces. */
const SKIPPED_FB_TYPES = new Set(['profile_media', 'cover_photo']);

/** The largest stored size of a Facebook photo; attachment previews are downscaled. */
async function fullSizePhoto(photoId: string, token: string): Promise<string | null> {
  try {
    const photo = await graph<{ images?: { source: string; width: number }[] }>(`${GRAPH}/${photoId}?${query({ fields: 'images', access_token: token })}`);
    return photo.images?.sort((a, b) => b.width - a.width)[0]?.source ?? null;
  } catch {
    return null;
  }
}

async function facebookImages(attachment: FbAttachment, postId: string, token: string): Promise<SocialCandidate['images']> {
  const parts = attachment.subattachments?.data.length ? attachment.subattachments.data : [attachment];
  const images: SocialCandidate['images'] = [];
  for (const [index, part] of parts.entries()) {
    if (part.media_type === 'video' || part.type?.startsWith('video')) continue;
    const photoId = part.type === 'photo' ? part.target?.id : undefined;
    const url = (photoId && (await fullSizePhoto(photoId, token))) || part.media?.image?.src;
    if (url) images.push({ sourceId: photoId ?? `${postId}_${index}`, url });
  }
  return images;
}

/** `isKnown` skips posts already stored, so their photos aren't looked up again on every run. */
export async function fetchFacebookPosts(isKnown: (externalId: string) => boolean = () => false): Promise<SocialCandidate[]> {
  const { token, pageId } = config();
  const media = 'type,media_type,media,target';
  const posts = await graphList<FbPost>(
    `${GRAPH}/${pageId}/posts?${query({
      fields: `id,message,created_time,permalink_url,attachments{${media},subattachments.limit(20){${media}}}`,
      limit: '50',
      access_token: token,
    })}`,
  );

  const candidates: SocialCandidate[] = [];
  for (const post of posts) {
    const attachment = post.attachments?.data[0];
    if (!attachment || SKIPPED_FB_TYPES.has(attachment.type ?? '') || isKnown(post.id)) continue;
    const images = await facebookImages(attachment, post.id, token);
    if (images.length === 0) continue; // video-only or text-only posts aren't pieces
    candidates.push({
      platform: SocialPlatform.FACEBOOK,
      externalId: post.id,
      permalink: post.permalink_url,
      caption: post.message?.trim() || null,
      postedAt: new Date(post.created_time),
      images,
    });
  }
  return candidates;
}

type IgMedia = {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url?: string;
  permalink: string;
  timestamp: string;
  children?: { data: { id: string; media_type: string; media_url?: string }[] };
};

export async function fetchInstagramPosts(): Promise<SocialCandidate[]> {
  const { token, igUserId } = config();
  const media = await graphList<IgMedia>(
    `${GRAPH}/${igUserId}/media?${query({
      fields: 'id,caption,media_type,media_url,permalink,timestamp,children{id,media_type,media_url}',
      limit: '50',
      access_token: token,
    })}`,
  );

  return media.flatMap((item): SocialCandidate[] => {
    const parts = item.media_type === 'CAROUSEL_ALBUM' ? (item.children?.data ?? []) : [{ id: item.id, media_type: item.media_type, media_url: item.media_url }];
    const images = parts.filter((part) => part.media_type === 'IMAGE' && part.media_url).map((part) => ({ sourceId: part.id, url: part.media_url! }));
    if (images.length === 0) return [];
    return [
      {
        platform: SocialPlatform.INSTAGRAM,
        externalId: item.id,
        permalink: item.permalink,
        caption: item.caption?.trim() || null,
        postedAt: new Date(item.timestamp),
        images,
      },
    ];
  });
}
