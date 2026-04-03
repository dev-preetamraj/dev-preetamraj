'use server';

import { sanityFetch } from '@/sanity/lib/live';
import {
  portfoliosQuery,
  featuredPortfoliosQuery,
  portfolioBySlugQuery,
  portfolioSearchQuery,
} from '@/sanity/lib/queries';
import type {
  PortfoliosQueryResult,
  FeaturedPortfoliosQueryResult,
  PortfolioBySlugQueryResult,
  PortfolioSearchQueryResult,
} from '../../sanity.types';

export const fetchProjects =
  async (): Promise<PortfoliosQueryResult> => {
    const { data } = await sanityFetch({ query: portfoliosQuery });
    return data;
  };

export const getPortfolioBySlug = async (
  slug: string
): Promise<PortfolioBySlugQueryResult> => {
  const { data } = await sanityFetch({
    query: portfolioBySlugQuery,
    params: { slug },
  });
  return data;
};

export const fetchFeaturedProjects =
  async (): Promise<FeaturedPortfoliosQueryResult> => {
    const { data } = await sanityFetch({ query: featuredPortfoliosQuery });
    return data;
  };

export const fetchAllProjectsForSearch = async (
  keyword: string
): Promise<PortfolioSearchQueryResult> => {
  const { data } = await sanityFetch({
    query: portfolioSearchQuery,
    params: { keyword },
  });
  return data;
};
