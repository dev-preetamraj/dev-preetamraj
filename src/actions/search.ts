'use server';

import { IResponse } from '@/lib/types';
import {
  SEARCH_QUERY,
  SearchResults,
  sanityFetch,
} from '@/sanity/lib/queries';

const EMPTY_RESULTS: SearchResults = {
  blogs: [],
  projects: [],
  categories: [],
  tags: [],
};

/**
 * Global command-palette search. Runs a single GROQ query against Sanity that
 * returns matching posts, projects, categories and tags in one round-trip.
 */
export const searchContent = async (
  keyword: string,
): Promise<IResponse<SearchResults | null>> => {
  const trimmed = keyword.trim();
  if (!trimmed) {
    return { success: true, data: EMPTY_RESULTS, message: 'Empty query' };
  }

  try {
    const results = await sanityFetch<SearchResults>(SEARCH_QUERY, {
      q: `*${trimmed}*`,
    });
    return {
      success: true,
      data: results ?? EMPTY_RESULTS,
      message: 'Search results fetched successfully',
    };
  } catch (error) {
    console.log(error);
    return { success: false, data: null, message: 'Something went wrong' };
  }
};
