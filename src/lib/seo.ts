import { urlFor } from '@/sanity/lib/image';
import type { SanityImage } from '@/sanity/lib/queries';

export const SITE_URL = 'https://preetamraj.dev';
export const SITE_NAME = 'Preetam Raj';
export const SITE_DESCRIPTION =
  'Personal portfolio and blog of Preetam Raj - writing on software engineering, web development, and building products.';
export const AUTHOR_NAME = 'Preetam Raj';
export const TWITTER_HANDLE = '@preetamraj';

export const OG_SIZE = { width: 1200, height: 630 } as const;

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
