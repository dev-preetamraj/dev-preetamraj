'use server';

import { sanityFetch } from '@/sanity/lib/live';
import {
  categoriesQuery,
  categoryBySlugQuery,
  trendingCategoriesQuery,
} from '@/sanity/lib/queries';
import type {
  CategoriesQueryResult,
  CategoryBySlugQueryResult,
  TrendingCategoriesQueryResult,
} from '../../sanity.types';

export const fetchCategories = async (): Promise<CategoriesQueryResult> => {
  const { data } = await sanityFetch({ query: categoriesQuery });
  return data;
};

export const fetchCategoryBySlug = async (
  slug: string
): Promise<CategoryBySlugQueryResult> => {
  const { data } = await sanityFetch({
    query: categoryBySlugQuery,
    params: { slug },
  });
  return data;
};

export const fetchTrendingCategories =
  async (): Promise<TrendingCategoriesQueryResult> => {
    const { data } = await sanityFetch({ query: trendingCategoriesQuery });
    return data;
  };
