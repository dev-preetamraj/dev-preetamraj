import type { PortableTextBlock } from '@portabletext/types';

import { COMMENTS_BATCH_SIZE, FEED_POSTS_COUNT } from '@/lib/constants';
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

/** A reply at any nesting level; `parentId` links it to its parent for tree building. */
export type CommentDescendant = PostComment & {
  parentId: string;
  depth: number;
};

/** A top-level comment plus every approved reply in its thread (flat, tree-built client-side). */
export type PostCommentThread = PostComment & {
  descendants: CommentDescendant[];
};

export type Post = PostListItem & {
  content: PortableTextBlock[];
  tags: TagRef[] | null;
  comments: PostCommentThread[];
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

/**
 * A top-level comment with its whole thread. `descendants` gathers every approved
 * reply (any depth) via the denormalized `root` ref, so the client can rebuild the
 * tree without recursive queries. `^._id` is the top-level comment being projected.
 */
const COMMENT_THREAD_PROJECTION = `
  _id,
  authorName,
  content,
  _createdAt,
  "descendants": *[_type == "comment" && root._ref == ^._id && isApproved == true] | order(_createdAt asc){
    _id,
    authorName,
    content,
    _createdAt,
    "parentId": parent._ref,
    depth
  }
`;

export const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug && isPublished == true][0] {
  ${POST_LIST_PROJECTION},
  content,
  tags[]->{name, "slug": slug.current},
  "comments": *[_type == "comment" && post._ref == ^._id && isApproved == true && !defined(parent)] | order(_createdAt asc)[0...${COMMENTS_BATCH_SIZE}]{
    ${COMMENT_THREAD_PROJECTION}
  },
  "commentsCount": count(*[_type == "comment" && post._ref == ^._id && isApproved == true && !defined(parent)])
}`;

export type FeedPost = PostListItem & {
  _updatedAt: string;
};

export const POSTS_FEED_QUERY = `*[_type == "post" && isPublished == true] | order(coalesce(publishedAt, _createdAt) desc)[0...${FEED_POSTS_COUNT}] {
  ${POST_LIST_PROJECTION},
  _updatedAt
}`;

export type RelatedPostCandidate = PostListItem & {
  tags: TagRef[] | null;
};

/**
 * Every published post plus the raw relatedness signals; `@/lib/ranking` scores
 * them and excludes the post being viewed. Deliberately takes no params, so all
 * posts share one ISR cache entry rather than one per slug.
 */
export const RELATED_POSTS_QUERY = `*[_type == "post" && isPublished == true] {
  ${POST_LIST_PROJECTION},
  tags[]->{name, "slug": slug.current}
}`;

/** Minimal fields for OG image generation. */
export const POST_OG_QUERY = `*[_type == "post" && slug.current == $slug && isPublished == true][0] {
  title,
  description,
  featuredImage,
  category->{name}
}`;

/** A single page of top-level comments (each with its thread), used for infinite scroll. */
export const COMMENTS_PAGE_QUERY = `*[_type == "comment" && post._ref == $postId && isApproved == true && !defined(parent)] | order(_createdAt asc)[$start...$end]{
  ${COMMENT_THREAD_PROJECTION}
}`;

export const TRENDING_POSTS_QUERY = `*[_type == "post" && isPublished == true] | order(publishedAt desc)[0...5] {
  _id,
  title,
  "slug": slug.current
}`;

/** Post link plus view count, for the sidebar's "most read" list. */
export type PopularPostLink = PostLink & {
  views: number;
};

export const POPULAR_POSTS_QUERY = `*[_type == "post" && isPublished == true] | order(coalesce(views, 0) desc)[0...5] {
  _id,
  title,
  "slug": slug.current,
  "views": coalesce(views, 0)
}`;
