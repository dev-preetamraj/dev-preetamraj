import type { MetadataRoute } from 'next';

import {
  CATEGORIES_SITEMAP_QUERY,
  POSTS_SITEMAP_QUERY,
  PROJECTS_SITEMAP_QUERY,
  sanityFetch,
  type SitemapEntry,
  TAGS_SITEMAP_QUERY,
} from '@/sanity/lib/queries';

const BASE_URL = 'https://preetamraj.dev';

// Keep in sync with sanityFetch's revalidate window so newly published
// content lands in the sitemap without a redeploy.
export const revalidate = 60;

const staticRoutes: MetadataRoute.Sitemap = [
  { url: BASE_URL, changeFrequency: 'weekly', priority: 1 },
  { url: `${BASE_URL}/about`, changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE_URL}/portfolio`, changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE_URL}/blog`, changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE_URL}/categories`, changeFrequency: 'weekly', priority: 0.5 },
  { url: `${BASE_URL}/tags`, changeFrequency: 'weekly', priority: 0.5 },
  { url: `${BASE_URL}/contact`, changeFrequency: 'yearly', priority: 0.4 },
];

function toEntries(
  entries: SitemapEntry[],
  prefix: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
): MetadataRoute.Sitemap {
  return entries.map(({ slug, _updatedAt }) => ({
    url: `${BASE_URL}${prefix}/${slug}`,
    lastModified: new Date(_updatedAt),
    changeFrequency,
    priority,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects, categories, tags] = await Promise.all([
    sanityFetch<SitemapEntry[]>(POSTS_SITEMAP_QUERY),
    sanityFetch<SitemapEntry[]>(PROJECTS_SITEMAP_QUERY),
    sanityFetch<SitemapEntry[]>(CATEGORIES_SITEMAP_QUERY),
    sanityFetch<SitemapEntry[]>(TAGS_SITEMAP_QUERY),
  ]);

  return [
    ...staticRoutes,
    ...toEntries(posts, '/blog', 0.7, 'weekly'),
    ...toEntries(projects, '/portfolio', 0.6, 'weekly'),
    ...toEntries(categories, '/categories', 0.5, 'weekly'),
    ...toEntries(tags, '/tags', 0.4, 'monthly'),
  ];
}
