import { PUBLIC_API_URL } from '$env/static/public';
import { CLIENT_TEMPLATES } from '$lib/templates/templates';
import type { PageServerLoad } from './$types';

export interface Template {
  id: string;
  name: string;
  slug: string;
  tag: string | null;
  imageUrl: string | null;
}

const fallbackTemplates: Template[] = Object.keys(CLIENT_TEMPLATES).map((slug) => ({
  id: slug,
  name: slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' '),
  slug,
  tag: slug,
  imageUrl: null
}));

async function fetchTemplatesWithTimeout(): Promise<Response | null> {
  if (!PUBLIC_API_URL) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    return await fetch(`${PUBLIC_API_URL}/templates`, { signal: controller.signal });
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export const load: PageServerLoad = async () => {
  try {
    const res = await fetchTemplatesWithTimeout();
    if (!res || !res.ok) return { templates: fallbackTemplates };

    const templates: Template[] = await res.json();
    return { templates: templates.length ? templates : fallbackTemplates };
  } catch {
    return { templates: fallbackTemplates };
  }
};
