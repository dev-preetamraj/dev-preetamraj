'use server';

import { sanityFetch } from '@/sanity/lib/live';
import { combinedSearchQuery } from '@/sanity/lib/queries';
import type { CombinedSearchQueryResult } from '../../sanity.types';

export const searchAll = async (
  keyword: string
): Promise<CombinedSearchQueryResult> => {
  const { data } = await sanityFetch({
    query: combinedSearchQuery,
    params: { keyword },
  });
  return data;
};
