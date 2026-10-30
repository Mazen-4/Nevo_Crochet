import type { NextRequest } from 'next/server';
import { errorResponse, localeFromQuery } from '@/lib/api';
import { getProjectBySlug } from '@/lib/projects';

export async function GET(request: NextRequest, ctx: RouteContext<'/api/projects/[slug]'>) {
  const locale = localeFromQuery(request);
  if (!locale) return errorResponse(400, 'unsupported_locale');

  const { slug } = await ctx.params;
  const project = await getProjectBySlug(slug, locale);
  if (!project) return errorResponse(404, 'not_found');

  return Response.json({ project });
}
