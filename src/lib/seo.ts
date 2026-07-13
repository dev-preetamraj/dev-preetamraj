import { urlFor } from '@/sanity/lib/image';
import type { SanityImage } from '@/sanity/lib/queries';

export const SITE_URL = 'https://preetamraj.dev';
export const SITE_NAME = 'Preetam Raj';
export const SITE_DESCRIPTION =
  'Personal portfolio and blog of Preetam Raj - writing on software engineering, web development, and building products.';
export const AUTHOR_NAME = 'Preetam Raj';
export const AUTHOR_JOB_TITLE = 'Fullstack Software Engineer';
export const TWITTER_HANDLE = '@preetamraj';

// Profiles that prove "Preetam Raj" is the same entity across the web.
// Used as schema.org sameAs to consolidate the person's identity for search.
export const AUTHOR_SAME_AS = [
  'https://github.com/dev-preetamraj',
  'https://www.linkedin.com/in/raj-preetam/',
];

// Stable node ids so every page references one shared Person/WebSite entity.
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const OG_SIZE = { width: 1200, height: 630 } as const;

/** schema.org Person for Preetam Raj - the key signal for ranking the name. */
export const personLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': PERSON_ID,
  name: AUTHOR_NAME,
  url: SITE_URL,
  image: `${SITE_URL}/preview.png`,
  jobTitle: AUTHOR_JOB_TITLE,
  description: SITE_DESCRIPTION,
  sameAs: AUTHOR_SAME_AS,
} as const;

/** schema.org WebSite tying the domain to its owner. */
export const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  publisher: { '@id': PERSON_ID },
} as const;

export function canonical(path = ''): string {
  return path ? `${SITE_URL}${path}` : SITE_URL;
}

/** Absolute 1200x630 URL for a Sanity image, or null when there is no asset. */
export function ogImageUrl(image?: SanityImage): string | null {
  if (!image?.asset) return null;
  return urlFor(image)
    .width(OG_SIZE.width)
    .height(OG_SIZE.height)
    .fit('crop')
    .url();
}
