import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { routing, type Locale } from '@/i18n/routing';
import { localeSchema } from '@/lib/validation';

export function errorResponse(status: number, error: string, details?: unknown) {
  return Response.json(details === undefined ? { error } : { error, details }, { status });
}

/** Reads `?locale=` (defaulting to the routing default); `null` if it is not a supported locale. */
export function localeFromQuery(request: NextRequest): Locale | null {
  const result = localeSchema.safeParse(request.nextUrl.searchParams.get('locale') ?? routing.defaultLocale);
  return result.success ? result.data : null;
}

/** Parses a JSON body against `schema`, returning either the data or a ready 400 response. */
export async function parseJsonBody<T extends z.ZodType>(
  request: Request,
  schema: T,
): Promise<{ data: z.infer<T> } | { response: Response }> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return { response: errorResponse(400, 'invalid_json') };
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    return { response: errorResponse(400, 'validation_failed', z.flattenError(result.error).fieldErrors) };
  }
  return { data: result.data };
}
