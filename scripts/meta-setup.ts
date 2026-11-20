/**
 * One-time Meta setup: turns a short-lived user token from the Graph API Explorer into a
 * Page token that never expires, finds the Nevo Handmade Page and its linked Instagram
 * professional account, and saves META_PAGE_ID / META_PAGE_TOKEN / META_IG_USER_ID to .env.local.
 *
 * Usage: put META_USER_TOKEN=<token from Graph API Explorer> in .env.local, then
 *   npx tsx scripts/meta-setup.ts
 * The short-lived token is removed from .env.local afterwards. Tokens are never printed.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const GRAPH = 'https://graph.facebook.com/v24.0';
const ENV_FILE = '.env.local';
const PAGE_NAME = 'Nevo Handmade';

function readEnv(): Map<string, string> {
  const env = new Map<string, string>();
  for (const line of readFileSync(ENV_FILE, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match) env.set(match[1], match[2].trim().replace(/^"(.*)"$/, '$1'));
  }
  return env;
}

/** Sets or replaces KEY=value lines (and deletes keys mapped to null), keeping the rest of the file as is. */
function writeEnv(changes: Record<string, string | null>) {
  const lines = readFileSync(ENV_FILE, 'utf8').split(/\r?\n/);
  const pending = new Map(Object.entries(changes));
  const out: string[] = [];
  for (const line of lines) {
    const key = line.match(/^([A-Z0-9_]+)=/)?.[1];
    if (key && pending.has(key)) {
      const value = pending.get(key);
      pending.delete(key);
      if (value !== null) out.push(`${key}=${value}`);
    } else {
      out.push(line);
    }
  }
  while (out.length && out[out.length - 1] === '') out.pop();
  for (const [key, value] of pending) if (value !== null) out.push(`${key}=${value}`);
  writeFileSync(ENV_FILE, out.join('\n') + '\n');
}

async function graph<T>(path: string, params: Record<string, string>): Promise<T> {
  const res = await fetch(`${GRAPH}${path}?${new URLSearchParams(params)}`);
  const body = (await res.json()) as T & { error?: { message: string; type: string; code: number } };
  if (!res.ok || body.error) {
    const e = body.error;
    throw new Error(`Graph ${path} failed: ${e ? `${e.type} (${e.code}): ${e.message}` : res.status}`);
  }
  return body;
}

type PageAccount = {
  id: string;
  name: string;
  access_token: string;
  tasks?: string[];
  instagram_business_account?: { id: string; username: string };
};

async function main() {
  const env = readEnv();
  const appId = env.get('META_APP_ID');
  const appSecret = env.get('META_APP_SECRET');
  const userToken = env.get('META_USER_TOKEN');
  if (!appId || !appSecret) throw new Error('META_APP_ID and META_APP_SECRET must be set in .env.local');
  if (!userToken) throw new Error('Add META_USER_TOKEN=<token from Graph API Explorer> to .env.local first');

  // 1. Short-lived user token (~1 hour) → long-lived user token (~60 days).
  const { access_token: longUserToken } = await graph<{ access_token: string }>('/oauth/access_token', {
    grant_type: 'fb_exchange_token',
    client_id: appId,
    client_secret: appSecret,
    fb_exchange_token: userToken,
  });
  console.log('✓ Exchanged for a long-lived user token');

  // 2. Page tokens fetched with a long-lived user token don't expire.
  const { data: pages } = await graph<{ data: PageAccount[] }>('/me/accounts', {
    fields: 'id,name,access_token,tasks,instagram_business_account{id,username}',
    access_token: longUserToken,
  });
  console.log(`✓ Pages you manage: ${pages.map((p) => `${p.name} (${p.id})`).join(', ') || 'none'}`);

  const page = pages.find((p) => p.name.trim().toLowerCase() === PAGE_NAME.toLowerCase()) ?? (pages.length === 1 ? pages[0] : undefined);
  if (!page) throw new Error(`No Page named "${PAGE_NAME}". When generating the token, make sure that Page is ticked in the permission dialog.`);

  const ig = page.instagram_business_account;
  if (!ig) {
    throw new Error(`"${page.name}" has no linked Instagram professional account visible to this token. Check the link in Business Suite and that instagram_basic was granted.`);
  }
  console.log(`✓ Page "${page.name}" (${page.id}) → Instagram @${ig.username} (${ig.id})`);

  // 3. Confirm the page token never expires.
  const { data: info } = await graph<{ data: { is_valid: boolean; expires_at: number; scopes: string[] } }>('/debug_token', {
    input_token: page.access_token,
    access_token: `${appId}|${appSecret}`,
  });
  if (!info.is_valid) throw new Error('The Page token came back invalid.');
  console.log(`✓ Page token valid, expires: ${info.expires_at === 0 ? 'never' : new Date(info.expires_at * 1000).toISOString()}`);
  console.log(`  Scopes: ${info.scopes.join(', ')}`);

  // 4. Smoke test: newest post from each source.
  const igMedia = await graph<{ data: { id: string; timestamp: string }[] }>(`/${ig.id}/media`, {
    fields: 'id,timestamp',
    limit: '1',
    access_token: page.access_token,
  });
  console.log(`✓ Instagram readable — newest post: ${igMedia.data[0]?.timestamp ?? 'none'}`);
  try {
    const fbPosts = await graph<{ data: { id: string; created_time: string }[] }>(`/${page.id}/posts`, {
      fields: 'id,created_time',
      limit: '1',
      access_token: page.access_token,
    });
    console.log(`✓ Facebook readable — newest post: ${fbPosts.data[0]?.created_time ?? 'none'}`);
  } catch (error) {
    console.warn(`! Facebook posts not readable yet: ${(error as Error).message}`);
  }

  writeEnv({
    META_PAGE_ID: page.id,
    META_PAGE_TOKEN: page.access_token,
    META_IG_USER_ID: ig.id,
    META_USER_TOKEN: null,
  });
  console.log(`✓ Saved META_PAGE_ID, META_PAGE_TOKEN, META_IG_USER_ID to ${ENV_FILE} (removed META_USER_TOKEN)`);
}

main().catch((error: Error) => {
  console.error(`✗ ${error.message}`);
  process.exit(1);
});
