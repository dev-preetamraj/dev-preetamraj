import 'server-only';

import { createClient } from 'next-sanity';

import { apiVersion, dataset, projectId } from '@/sanity/env';

/**
 * Server-only Sanity client with write access. Uses a privileged token, so it
 * must NEVER be imported into a client component. `useCdn: false` guarantees
 * fresh reads (needed for the rate-limit count in the comment action).
 */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});
