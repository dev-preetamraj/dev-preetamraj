import { CategoryLink } from './categories';
import { PostLink } from './posts';
import { ProjectLink } from './projects';
import { Tag } from './tags';

/** A matched category, with its most recent published posts nested under it. */
export type SearchCategory = CategoryLink & { posts: PostLink[] };

/** A matched tag, with its most recent published posts nested under it. */
export type SearchTag = Tag & { posts: PostLink[] };

/** Combined result set for the global command-palette search. */
export type SearchResults = {
  blogs: PostLink[];
  projects: ProjectLink[];
  categories: SearchCategory[];
  tags: SearchTag[];
};

/**
 * Single round-trip search across posts, projects, categories and tags.
 * `$q` is expected to be a wildcard-wrapped token (e.g. `*react*`) so GROQ's
 * `match` behaves like a case-insensitive "contains". Only published content
 * is returned for posts/projects; each group is capped for a tidy palette.
 *
 * A matched category/tag also carries its most recent published posts so the
 * palette can surface relevant content the title search alone would miss.
 */
export const SEARCH_QUERY = `{
  "blogs": *[_type == "post" && isPublished == true && title match $q] | order(publishedAt desc)[0...6]{
    _id, title, "slug": slug.current
  },
  "projects": *[_type == "project" && isPublished == true && title match $q] | order(_createdAt desc)[0...6]{
    _id, title, "slug": slug.current
  },
  "categories": *[_type == "category" && name match $q] | order(name asc)[0...4]{
    _id, name, "slug": slug.current,
    "posts": *[_type == "post" && references(^._id) && isPublished == true] | order(publishedAt desc)[0...4]{
      _id, title, "slug": slug.current
    }
  },
  "tags": *[_type == "tag" && name match $q] | order(name asc)[0...4]{
    _id, name, "slug": slug.current,
    "posts": *[_type == "post" && references(^._id) && isPublished == true] | order(publishedAt desc)[0...4]{
      _id, title, "slug": slug.current
    }
  }
}`;
