import { createClient } from 'next-sanity';

import { apiVersion, dataset, projectId } from '@/sanity/env';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // ISR is our cache layer; the CDN adds a second, eventually-consistent one that serves stale posts
});
