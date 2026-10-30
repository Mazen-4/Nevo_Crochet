import type { NextRequest } from 'next/server';
import { errorResponse, localeFromQuery } from '@/lib/api';
import { getProjects } from '@/lib/projects';

export async function GET(request: NextRequest) {
  const locale = localeFromQuery(request);
  if (!locale) return errorResponse(400, 'unsupported_locale');

  const projects = await getProjects(locale);
  return Response.json({ projects });
}
