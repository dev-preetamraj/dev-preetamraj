import {
  AUTHOR_NAME,
  canonical,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from '@/lib/seo';
import type { Metadata } from 'next';

// Items carry the excerpt (`description`), not the rendered body, so the feed
// never touches Portable Text and needs no serializer.

export type FeedItem = {
  title: string;
  slug: string;
  description: string;
  publishedAt: string | null;
  _createdAt: string;
  category: { name: string } | null;
};

export const FEED_PATH = '/feed.xml';

/**
 * Feed autodiscovery for a page's `alternates`. Next.js replaces `alternates`
 * wholesale rather than merging it, so any page declaring its own (e.g. a
 * canonical) drops the root layout's copy - spread this into those too.
 */
export const FEED_ALTERNATES: Pick<Metadata, 'alternates'>['alternates'] = {
  types: {
    'application/rss+xml': [{ url: FEED_PATH, title: `${SITE_NAME} - Blog` }],
  },
};

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** RSS 2.0 requires RFC-822 dates, not ISO. */
function rfc822(iso: string): string {
  return new Date(iso).toUTCString();
}

function itemXml(item: FeedItem): string {
  const url = canonical(`/blog/${item.slug}`);
  const published = item.publishedAt ?? item._createdAt;

  return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${rfc822(published)}</pubDate>
      <description>${escapeXml(item.description ?? '')}</description>
      <dc:creator>${escapeXml(AUTHOR_NAME)}</dc:creator>
${
  item.category
    ? `      <category>${escapeXml(item.category.name)}</category>\n`
    : ''
}    </item>`;
}

export function buildRssFeed(items: FeedItem[], nowMs: number): string {
  const feedUrl = canonical(FEED_PATH);

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <lastBuildDate>${new Date(nowMs).toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(
      feedUrl
    )}" rel="self" type="application/rss+xml" />
${items.map(itemXml).join('\n')}
  </channel>
</rss>
`;
}
