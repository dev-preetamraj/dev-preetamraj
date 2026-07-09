import type { PortableTextBlock } from '@portabletext/types';

import { CategoryRef, POST_LIST_PROJECTION, SanityImage, TagRef } from './shared';

export type PostListItem = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  featuredImage: SanityImage;
  publishedAt: string | null;
  _createdAt: string;
  category: CategoryRef | null;
};

export type Post = PostListItem & {
  content: PortableTextBlock[];
  tags: TagRef[] | null;
};

/** Minimal shape for sidebar / "recently updated" links. */
export type PostLink = {
  _id: string;
  title: string;
  slug: string;
};

export const POSTS_QUERY = `*[_type == "post" && isPublished == true] | order(publishedAt desc) {${POST_LIST_PROJECTION}}`;

export const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug && isPublished == true][0] {
  ${POST_LIST_PROJECTION},
  content,
  tags[]->{name, "slug": slug.current}
}`;

export const TRENDING_POSTS_QUERY = `*[_type == "post" && isPublished == true] | order(publishedAt desc)[0...5] {
  _id,
  title,
  "slug": slug.current
}`;
