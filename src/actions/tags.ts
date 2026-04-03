'use server';

import { sanityFetch } from '@/sanity/lib/live';
import { tagsQuery, tagBySlugQuery } from '@/sanity/lib/queries';
import type { TagsQueryResult, TagBySlugQueryResult } from '../../sanity.types';

export const fetchTags = async (): Promise<TagsQueryResult> => {
  const { data } = await sanityFetch({ query: tagsQuery });
  return data;
};

export const fetchTagBySlug = async (
  slug: string
): Promise<TagBySlugQueryResult> => {
  const { data } = await sanityFetch({
    query: tagBySlugQuery,
    params: { slug },
  });
  return data;
};
