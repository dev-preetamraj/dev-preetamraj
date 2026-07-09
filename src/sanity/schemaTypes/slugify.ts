import type { SlugifierFn } from 'sanity';

/**
 * Matches the server-side Mongoose behaviour: slugify(x, { lower: true, strict: true }).
 * Lowercase, strip anything that isn't a-z0-9, collapse to single dashes, trim dashes.
 */
export const strictSlugify: SlugifierFn = (input) =>
  input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
