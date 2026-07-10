/** Types and GROQ projections shared across query files. */

export type SanityImage = {
  _type?: string;
  asset?: { _ref: string; _type: string };
  alt?: string;
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
};

export type CategoryRef = {
  name: string;
  slug: string;
};

export type TagRef = {
  name: string;
  slug: string;
};

/** Fields projected for every post listing (home, /blog, category, tag). */
export const POST_LIST_PROJECTION = `
  _id,
  title,
  "slug": slug.current,
  description,
  featuredImage,
  publishedAt,
  _createdAt,
  "views": coalesce(views, 0),
  category->{name, "slug": slug.current}
`;
