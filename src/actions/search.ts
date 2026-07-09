'use server';

import { IResponse } from '@/lib/types';
import { ServerResponse } from '@/lib/utils';
import {
  SEARCH_QUERY,
  SearchResults,
  sanityFetch,
} from '@/sanity/lib/queries';

const response_obj = new ServerResponse();

const EMPTY_RESULTS: SearchResults = {
  blogs: [],
  projects: [],
  categories: [],
  tags: [],
};

/**
 * Global command-palette search. Runs a single GROQ query against Sanity that
 * returns matching posts, projects, categories and tags in one round-trip,
 * replacing the four MongoDB `fetchAll*ForSearch` actions.
 */
export const searchContent = async (
  keyword: string,
): Promise<IResponse<SearchResults | null>> => {
  const trimmed = keyword.trim();
  if (!trimmed) {
    return response_obj.response(EMPTY_RESULTS, 'Empty query');
  }

  try {
    const results = await sanityFetch<SearchResults>(SEARCH_QUERY, {
      q: `*${trimmed}*`,
    });
    return response_obj.response(
      results ?? EMPTY_RESULTS,
      'Search results fetched successfully',
    );
  } catch (error) {
    console.log(error);
    return response_obj.serverErrorResponse();
  }
};
