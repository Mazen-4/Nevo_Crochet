import 'server-only';
import { Prisma, SocialPlatform, SocialPostStatus } from '@prisma/client';
import { uploadRemoteImage } from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';
import { fetchFacebookPosts, fetchInstagramPosts, MetaError, type SocialCandidate } from '@/lib/social/meta';

/** Stored in SiteSetting so the admin inbox can show when the last sync ran and whether it worked. */
export const LAST_SYNC_KEY = 'social.lastSync';

export type SyncResult = {
  at: string;
  ok: boolean;
  added: number;
  /** New posts left for the next run because the time budget ran out. */
  remaining: number;
  error?: string;
  tokenProblem?: boolean;
};

/** Stay well inside a 60 s serverless limit; the next run picks up where this one stopped. */
const TIME_BUDGET_MS = 45_000;
const UPLOAD_CONCURRENCY = 4;
/** Captions must match on at least this many letters to count as the same post. */
const MIN_MATCH_LENGTH = 30;

/** Letters and digits only, so emoji, spacing and punctuation differences between platforms don't matter. */
const captionKey = (caption: string | null, length = 80) => (caption ?? '').normalize('NFKC').replace(/[^\p{L}\p{N}]+/gu, '').slice(0, length);

async function mapLimited<T, R>(items: T[], limit: number, fn: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const index = next++;
        results[index] = await fn(items[index], index);
      }
    }),
  );
  return results;
}

async function store(candidate: SocialCandidate): Promise<boolean> {
  const prefix = candidate.platform === SocialPlatform.FACEBOOK ? 'fb' : 'ig';
  const urls = await mapLimited(candidate.images.slice(0, 12), UPLOAD_CONCURRENCY, (image) =>
    uploadRemoteImage(image.url, `${prefix}_${image.sourceId.replace(/[^\w-]/g, '_')}`),
  );
  try {
    await prisma.socialPost.create({
      data: {
        platform: candidate.platform,
        externalId: candidate.externalId,
        permalink: candidate.permalink,
        caption: candidate.caption,
        postedAt: candidate.postedAt,
        images: { create: urls.map((url, sortOrder) => ({ url, sortOrder })) },
      },
    });
    return true;
  } catch (error) {
    // Another sync (cron + "Sync now") stored it first.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') return false;
    throw error;
  }
}

/**
 * Facebook is the primary source (it has the full history). An Instagram post whose caption matches
 * exactly one Facebook post is a cross-post: link it and keep it out of the inbox. Pieces are often
 * reposted on Instagram weeks later, so dates aren't compared; requiring a single match keeps stock
 * captions shared by many pieces ("available in any colour…") from being linked. If the full caption
 * doesn't match (one side was edited), the first 40 letters are tried the same way.
 */
async function linkCrossPosts() {
  const [facebook, instagram] = await Promise.all([
    prisma.socialPost.findMany({ where: { platform: SocialPlatform.FACEBOOK }, select: { id: true, caption: true, postedAt: true } }),
    prisma.socialPost.findMany({
      where: { platform: SocialPlatform.INSTAGRAM, duplicateOfId: null, status: SocialPostStatus.NEW },
      select: { id: true, caption: true, postedAt: true },
    }),
  ]);
  const uniqueMatch = (caption: string | null, length: number) => {
    const key = captionKey(caption, length);
    if (key.length < MIN_MATCH_LENGTH) return undefined;
    const hits = facebook.filter((fb) => captionKey(fb.caption, length) === key);
    return hits.length === 1 ? hits[0] : undefined;
  };
  for (const post of instagram) {
    const match = uniqueMatch(post.caption, 80) ?? uniqueMatch(post.caption, 40);
    if (match) {
      await prisma.socialPost.update({ where: { id: post.id }, data: { duplicateOfId: match.id, status: SocialPostStatus.IGNORED } });
    }
  }
}

async function saveResult(result: SyncResult) {
  const settingValue = JSON.stringify(result);
  await prisma.siteSetting.upsert({ where: { settingKey: LAST_SYNC_KEY }, create: { settingKey: LAST_SYNC_KEY, settingValue }, update: { settingValue } });
  return result;
}

export async function getLastSync(): Promise<SyncResult | null> {
  const row = await prisma.siteSetting.findUnique({ where: { settingKey: LAST_SYNC_KEY } });
  try {
    return row ? (JSON.parse(row.settingValue) as SyncResult) : null;
  } catch {
    return null;
  }
}

/** One-way import: reads both accounts, stores posts not seen before (oldest first). Never writes to Meta. */
export async function syncSocialPosts(): Promise<SyncResult> {
  const started = Date.now();
  const at = new Date().toISOString();
  try {
    const known = new Set(
      (await prisma.socialPost.findMany({ select: { platform: true, externalId: true } })).map((p) => `${p.platform}:${p.externalId}`),
    );
    const [facebook, instagram] = await Promise.all([
      fetchFacebookPosts((id) => known.has(`${SocialPlatform.FACEBOOK}:${id}`)),
      fetchInstagramPosts(),
    ]);
    // Facebook first so cross-posted Instagram posts find their match; oldest first so an interrupted run resumes cleanly.
    const fresh = [...facebook, ...instagram]
      .filter((c) => !known.has(`${c.platform}:${c.externalId}`))
      .sort((a, b) => Number(a.platform !== SocialPlatform.FACEBOOK) - Number(b.platform !== SocialPlatform.FACEBOOK) || a.postedAt.getTime() - b.postedAt.getTime());

    let added = 0;
    let processed = 0;
    let firstFailure: string | undefined;
    for (const candidate of fresh) {
      if (Date.now() - started > TIME_BUDGET_MS) break;
      processed++;
      try {
        if (await store(candidate)) added++;
      } catch (error) {
        // One bad photo shouldn't block the rest; the post is retried on the next run.
        console.error(`social sync: skipped ${candidate.platform} ${candidate.externalId}`, error);
        firstFailure ??= error instanceof Error ? error.message : 'Unknown error';
      }
    }
    await linkCrossPosts();
    return saveResult({ at, ok: !firstFailure, added, remaining: fresh.length - processed, ...(firstFailure && { error: firstFailure }) });
  } catch (error) {
    console.error('syncSocialPosts failed', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return saveResult({ at, ok: false, added: 0, remaining: 0, error: message, tokenProblem: error instanceof MetaError && error.tokenProblem });
  }
}
