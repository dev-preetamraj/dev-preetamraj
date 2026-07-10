import type { PortableTextBlock } from '@portabletext/types';

import { COMMENTS_BATCH_SIZE } from '@/lib/constants';
import {
  CategoryRef,
  POST_LIST_PROJECTION,
  SanityImage,
  SITEMAP_PROJECTION,
  TagRef,
} from './shared';

export type PostListItem = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  featuredImage: SanityImage;
  publishedAt: string | null;
  _createdAt: string;
  views: number;
  category: CategoryRef | null;
};

export type PostComment = {
  _id: string;
  authorName: string;
  content: string;
  _createdAt: string;
};

export type Post = PostListItem & {
  content: PortableTextBlock[];
  tags: TagRef[] | null;
  comments: PostComment[];
  commentsCount: number;
};

/** Minimal shape for sidebar / "recently updated" links. */
export type PostLink = {
  _id: string;
  title: string;
  slug: string;
};

export const POSTS_QUERY = `*[_type == "post" && isPublished == true] | order(publishedAt desc) {${POST_LIST_PROJECTION}}`;

export const POSTS_SITEMAP_QUERY = `*[_type == "post" && isPublished == true && defined(slug.current)]{${SITEMAP_PROJECTION}}`;

export const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug && isPublished == true][0] {
  ${POST_LIST_PROJECTION},
  content,
  tags[]->{name, "slug": slug.current},
  "comments": *[_type == "comment" && post._ref == ^._id && isApproved == true] | order(_createdAt asc)[0...${COMMENTS_BATCH_SIZE}]{
    _id,
    authorName,
    content,
    _createdAt
  },
  "commentsCount": count(*[_type == "comment" && post._ref == ^._id && isApproved == true])
}`;

/** Minimal fields for OG image generation. */
export const POST_OG_QUERY = `*[_type == "post" && slug.current == $slug && isPublished == true][0] {
  title,
  description,
  featuredImage,
  category->{name}
}`;

/** A single page of approved comments for a post, used for infinite scroll. */
export const COMMENTS_PAGE_QUERY = `*[_type == "comment" && post._ref == $postId && isApproved == true] | order(_createdAt asc)[$start...$end]{
  _id,
  authorName,
  content,
  _createdAt
}`;

export const TRENDING_POSTS_QUERY = `*[_type == "post" && isPublished == true] | order(publishedAt desc)[0...5] {
  _id,
  title,
  "slug": slug.current
}`;
