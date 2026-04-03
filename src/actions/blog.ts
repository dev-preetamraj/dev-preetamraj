'use server';

import { sanityFetch } from '@/sanity/lib/live';
import {
  blogsQuery,
  trendingBlogsQuery,
  blogBySlugQuery,
  blogByIdQuery,
  blogSearchQuery,
} from '@/sanity/lib/queries';
import type {
  BlogsQueryResult,
  TrendingBlogsQueryResult,
  BlogBySlugQueryResult,
  BlogByIdQueryResult,
  BlogSearchQueryResult,
} from '../../sanity.types';

export const fetchBlogs = async (): Promise<BlogsQueryResult> => {
  const { data } = await sanityFetch({ query: blogsQuery });
  return data;
};

export const fetchTrendingBlogs =
  async (): Promise<TrendingBlogsQueryResult> => {
    const { data } = await sanityFetch({ query: trendingBlogsQuery });
    return data;
  };

export const getBlogBySlug = async (
  slug: string
): Promise<BlogBySlugQueryResult> => {
  const { data } = await sanityFetch({
    query: blogBySlugQuery,
    params: { slug },
  });
  return data;
};

export const getBlogById = async (
  id: string
): Promise<BlogByIdQueryResult> => {
  const { data } = await sanityFetch({
    query: blogByIdQuery,
    params: { id },
  });
  return data;
};

export const fetchAllBlogsForSearch = async (
  keyword: string
): Promise<BlogSearchQueryResult> => {
  const { data } = await sanityFetch({
    query: blogSearchQuery,
    params: { keyword },
  });
  return data;
};
