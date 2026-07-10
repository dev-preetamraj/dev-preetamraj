import { PostListItem } from './posts';
import { POST_LIST_PROJECTION, SITEMAP_PROJECTION } from './shared';

export type Tag = {
  _id: string;
  name: string;
  slug: string;
};

export type TagWithPosts = Tag & {
  posts: PostListItem[];
};

export const TAGS_QUERY = `*[_type == "tag"] | order(name asc) {
  _id,
  name,
  "slug": slug.current
}`;

export const TAGS_SITEMAP_QUERY = `*[_type == "tag" && defined(slug.current) && count(*[_type == "post" && references(^._id) && isPublished == true]) > 0]{${SITEMAP_PROJECTION}}`;

export const TAG_BY_SLUG_QUERY = `*[_type == "tag" && slug.current == $slug][0] {
  _id,
  name,
  "slug": slug.current,
  "posts": *[_type == "post" && references(^._id) && isPublished == true] | order(publishedAt desc) {${POST_LIST_PROJECTION}}
}`;
