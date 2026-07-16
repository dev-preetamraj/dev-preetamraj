import { buildRssFeed } from '@/lib/feed';
import {
  POSTS_FEED_QUERY,
  sanityFetch,
  type FeedPost,
} from '@/sanity/lib/queries';

// Keep in sync with sanityFetch's revalidate window so newly published posts
// reach the feed without a redeploy.
export const revalidate = 60;

export async function GET() {
  const posts = await sanityFetch<FeedPost[]>(POSTS_FEED_QUERY);

  return new Response(buildRssFeed(posts, Date.now()), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
