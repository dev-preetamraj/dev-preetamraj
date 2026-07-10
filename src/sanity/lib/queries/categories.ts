import { PostListItem } from './posts';
import { POST_LIST_PROJECTION } from './shared';

export type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
};

export type CategoryWithPosts = Category & {
  posts: PostListItem[];
};

/** Minimal shape for sidebar / "trending categories" links. */
export type CategoryLink = {
  _id: string;
  name: string;
  slug: string;
};

/** Raw ranking signals per category; scored/ordered by `@/lib/ranking`. */
export type CategoryStat = CategoryLink & {
  recentViews: number;
  allTimeViews: number;
  postCount: number;
};

export const CATEGORIES_QUERY = `*[_type == "category"] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  description
}`;

export const CATEGORY_BY_SLUG_QUERY = `*[_type == "category" && slug.current == $slug][0] {
  _id,
  name,
  "slug": slug.current,
  description,
  "posts": *[_type == "post" && references(^._id) && isPublished == true] | order(publishedAt desc) {${POST_LIST_PROJECTION}}
}`;

// Raw signals only; scored/ordered in `@/lib/ranking`. `$since` = recent-views window cutoff.
export const TRENDING_CATEGORY_STATS_QUERY = `*[_type == "category" && count(*[_type == "post" && references(^._id) && isPublished == true]) > 0]{
  _id,
  name,
  "slug": slug.current,
  "recentViews": count(*[_type == "postView" && viewedAt > $since && post->category._ref == ^._id]),
  "allTimeViews": coalesce(math::sum(*[_type == "post" && references(^._id) && isPublished == true].views), 0),
  "postCount": count(*[_type == "post" && references(^._id) && isPublished == true])
}`;
