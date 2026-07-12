import type { PortableTextBlock } from '@portabletext/types';

import { CategoryRef, SanityImage, SITEMAP_PROJECTION, TagRef } from './shared';

export type ProjectListItem = {
  _id: string;
  title: string;
  slug: string;
  featured: boolean;
  featuredImage: SanityImage;
  description?: string;
  liveUrl?: string;
  githubUrl?: string;
  category: CategoryRef | null;
  tags: TagRef[] | null;
};

export type Project = ProjectListItem & {
  description: string;
  _createdAt: string;
  content: PortableTextBlock[];
  githubUrl?: string;
  frontendGithubUrl?: string;
  liveUrl?: string;
  category: CategoryRef | null;
  tags: TagRef[] | null;
};

/** Minimal shape for sidebar / "featured projects" links. */
export type ProjectLink = {
  _id: string;
  title: string;
  slug: string;
};

export const PROJECTS_QUERY = `*[_type == "project" && isPublished == true] | order(coalesce(featured, false) desc, _createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  "featured": coalesce(featured, false),
  featuredImage,
  description,
  liveUrl,
  githubUrl,
  category->{name, "slug": slug.current},
  tags[]->{name, "slug": slug.current}
}`;

export const PROJECTS_SITEMAP_QUERY = `*[_type == "project" && isPublished == true && defined(slug.current)]{${SITEMAP_PROJECTION}}`;

export const PROJECT_BY_SLUG_QUERY = `*[_type == "project" && slug.current == $slug && isPublished == true][0] {
  _id,
  title,
  "slug": slug.current,
  description,
  featuredImage,
  _createdAt,
  content,
  githubUrl,
  frontendGithubUrl,
  liveUrl,
  category->{name, "slug": slug.current},
  tags[]->{name, "slug": slug.current}
}`;

export const FEATURED_PROJECTS_QUERY = `*[_type == "project" && isPublished == true] | order(coalesce(featured, false) desc, _createdAt desc)[0...5] {
  _id,
  title,
  "slug": slug.current
}`;
