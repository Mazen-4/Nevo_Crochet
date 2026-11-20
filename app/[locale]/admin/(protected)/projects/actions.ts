'use server';

import { Locale, Prisma } from '@prisma/client';
import { revalidatePath, updateTag } from 'next/cache';
import type { z } from 'zod';
import { redirect } from '@/i18n/navigation';
import { PROJECT_ORDER } from '@/lib/admin/projects';
import { requireAdmin } from '@/lib/auth/session';
import { createUploadSignature } from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';
import { PROJECTS_TAG } from '@/lib/projects';
import { localeSchema, projectSchema, type ProjectInput } from '@/lib/validation';
import type { ProjectFormState, UploadSignature } from '@/types';

export type DeleteProjectState = { error?: 'inUse' | 'failed' };

/** Signs one batch of photo uploads for the project form. `null` when Cloudinary isn't configured. */
export async function signImageUpload(rawLocale: string): Promise<UploadSignature | null> {
  const locale = localeSchema.parse(rawLocale);
  await requireAdmin(locale);
  return createUploadSignature();
}

const LOCALES = [Locale.en, Locale.ar] as const;

/** Storefront reads are cached under the `projects` tag; the admin list is rendered per request. */
function refresh(locale: string) {
  updateTag(PROJECTS_TAG);
  revalidatePath(`/${locale}/admin/projects`);
}

/** Collapse Zod issues to `{ "en.title": "required" }` so the form can show them next to each field. */
function toFieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join('.') || 'form';
    if (errors[path]) continue;
    errors[path] =
      issue.message === 'host' || issue.message === 'duplicate' || issue.message === 'imageRequired'
        ? issue.message
        : issue.code === 'too_small'
          ? 'required'
          : issue.code === 'too_big'
            ? 'tooLong'
            : 'invalid';
  }
  return errors;
}

function parsePayload(formData: FormData) {
  try {
    return projectSchema.safeParse(JSON.parse(String(formData.get('payload') ?? '')));
  } catch {
    return null;
  }
}

/** Replace a project's translations, colors and images with the submitted values. */
async function writeDetails(tx: Prisma.TransactionClient, projectId: string, data: ProjectInput) {
  for (const locale of LOCALES) {
    const t = data[locale];
    const fields = {
      title: t.title,
      category: t.category,
      description: t.description,
      materials: t.materials ?? null,
      priceLabel: t.priceLabel ?? null,
      seoTitle: t.seoTitle ?? null,
      seoDescription: t.seoDescription ?? null,
    };
    await tx.projectTranslation.upsert({
      where: { projectId_locale: { projectId, locale } },
      create: { projectId, locale, ...fields },
      update: fields,
    });
  }

  await tx.projectColor.deleteMany({ where: { projectId } });
  await tx.projectColor.createMany({
    data: data.colors.map((color, index) => ({ projectId, colorKey: color.key, sortOrder: index })),
  });
  // Color labels are shared by every project that uses the key.
  for (const color of data.colors) {
    for (const locale of LOCALES) {
      await tx.colorTranslation.upsert({
        where: { colorKey_locale: { colorKey: color.key, locale } },
        create: { colorKey: color.key, locale, label: color[locale] },
        update: { label: color[locale] },
      });
    }
  }

  await tx.projectImage.deleteMany({ where: { projectId } });
  await tx.projectImage.createMany({
    data: data.images.map((image, index) => ({
      projectId,
      url: image.url,
      altText: image.altText ?? null,
      sortOrder: index,
      isPrimary: index === 0,
    })),
  });
}

export async function saveProject(
  rawLocale: string,
  id: string | null,
  _previous: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const locale = localeSchema.parse(rawLocale);
  await requireAdmin(locale);

  const parsed = parsePayload(formData);
  if (!parsed) return { result: 'error', errors: { form: 'invalid' } };
  if (!parsed.success) return { result: 'error', errors: toFieldErrors(parsed.error) };
  const data = parsed.data;

  let projectId = id;
  try {
    projectId = await prisma.$transaction(async (tx) => {
      const base = { slug: data.slug, status: data.status, featured: data.featured };
      let target: string;
      if (id) {
        target = (await tx.project.update({ where: { id }, data: base, select: { id: true } })).id;
      } else {
        // New pieces go to the end of the list; reorder from the projects page.
        const { _max } = await tx.project.aggregate({ _max: { sortOrder: true } });
        target = (await tx.project.create({ data: { ...base, sortOrder: (_max.sortOrder ?? 0) + 1 }, select: { id: true } })).id;
      }
      await writeDetails(tx, target, data);
      return target;
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') return { result: 'error', errors: { slug: 'taken' } };
      if (error.code === 'P2025') return { result: 'error', errors: { form: 'missing' } };
    }
    console.error('saveProject failed', error);
    return { result: 'error', errors: { form: 'failed' } };
  }

  refresh(locale);
  // Reload the edit page from the database so the form shows exactly what was stored.
  return redirect({ href: `/admin/projects/${projectId}?${id ? 'saved' : 'created'}=1`, locale });
}

/** Used with `useActionState`; the previous state and form data aren't needed. */
export async function deleteProject(rawLocale: string, id: string): Promise<DeleteProjectState> {
  const locale = localeSchema.parse(rawLocale);
  await requireAdmin(locale);

  // Inquiries keep a reference to the pieces they asked about, so those pieces can only be archived.
  const inUse = await prisma.inquiryItem.count({ where: { projectId: id } });
  if (inUse > 0) return { error: 'inUse' };

  try {
    await prisma.project.delete({ where: { id } });
  } catch (error) {
    console.error('deleteProject failed', error);
    return { error: 'failed' };
  }

  refresh(locale);
  return redirect({ href: '/admin/projects', locale });
}

export async function toggleFeatured(rawLocale: string, id: string): Promise<void> {
  const locale = localeSchema.parse(rawLocale);
  await requireAdmin(locale);

  const project = await prisma.project.findUnique({ where: { id }, select: { featured: true } });
  if (!project) return;
  await prisma.project.update({ where: { id }, data: { featured: !project.featured } });
  refresh(locale);
}

/** Swap a project with its neighbour, then renumber every `sortOrder` so ties can't come back. */
export async function moveProject(rawLocale: string, id: string, direction: 'up' | 'down'): Promise<void> {
  const locale = localeSchema.parse(rawLocale);
  await requireAdmin(locale);

  const ids = (await prisma.project.findMany({ orderBy: PROJECT_ORDER, select: { id: true } })).map((p) => p.id);
  const from = ids.indexOf(id);
  const to = from + (direction === 'up' ? -1 : 1);
  if (from < 0 || to < 0 || to >= ids.length) return;

  [ids[from], ids[to]] = [ids[to], ids[from]];
  await prisma.$transaction(ids.map((projectId, index) => prisma.project.update({ where: { id: projectId }, data: { sortOrder: index } })));
  refresh(locale);
}
