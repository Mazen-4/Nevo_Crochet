import { syncSocialPosts } from '@/lib/social/sync';

/** Daily Vercel Cron (see vercel.json). Vercel sends `Authorization: Bearer $CRON_SECRET`. */
export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const result = await syncSocialPosts();
  return Response.json(result, { status: result.ok ? 200 : 502 });
}
