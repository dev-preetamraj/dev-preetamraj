import { client } from '@/sanity/lib/client';

export * from './shared';
export * from './posts';
export * from './projects';
export * from './categories';
export * from './tags';
export * from './search';

/**
 * Thin wrapper around `client.fetch` that revalidates every 60s so newly
 * published/edited content appears without a redeploy.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  return client.fetch<T>(query, params, { next: { revalidate: 60 } });
}
