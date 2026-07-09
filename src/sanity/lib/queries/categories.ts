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

// Categories that have at least one published post, most-populated first.
export const TRENDING_CATEGORIES_QUERY = `*[_type == "category" && count(*[_type == "post" && references(^._id) && isPublished == true]) > 0]{
  _id,
  name,
  "slug": slug.current,
  "postCount": count(*[_type == "post" && references(^._id) && isPublished == true])
} | order(postCount desc)[0...10]`;
