import { describe, expect, test } from 'bun:test';

import { buildRssFeed, escapeXml, type FeedItem } from '../feed';

const NOW = Date.parse('2026-07-10T00:00:00.000Z');

const item = (over: Partial<FeedItem> = {}): FeedItem => ({
  title: 'A post',
  slug: 'a-post',
  description: 'An excerpt.',
  publishedAt: '2026-07-01T12:00:00.000Z',
  _createdAt: '2026-06-01T12:00:00.000Z',
  category: { name: 'Engineering' },
  ...over,
});

describe('escapeXml', () => {
  test('escapes the five XML entities', () => {
    expect(escapeXml(`&<>"'`)).toBe('&amp;&lt;&gt;&quot;&apos;');
  });

  test('escapes ampersands before the entities they introduce', () => {
    expect(escapeXml('a & <b>')).toBe('a &amp; &lt;b&gt;');
  });

  test('leaves ordinary text untouched', () => {
    expect(escapeXml('Plain text 123')).toBe('Plain text 123');
  });
});

describe('buildRssFeed', () => {
  test('escapes markup in titles and descriptions', () => {
    const xml = buildRssFeed(
      [item({ title: 'Tips & <Tricks>', description: `He said "hi" & left` })],
      NOW
    );

    expect(xml).toContain('<title>Tips &amp; &lt;Tricks&gt;</title>');
    expect(xml).toContain('He said &quot;hi&quot; &amp; left');
    expect(xml).not.toContain('<Tricks>');
  });

  test('emits RFC-822 pubDate, not ISO', () => {
    const xml = buildRssFeed([item()], NOW);

    expect(xml).toContain('<pubDate>Wed, 01 Jul 2026 12:00:00 GMT</pubDate>');
    expect(xml).not.toContain('2026-07-01T12:00:00.000Z');
  });

  test('lastBuildDate comes from nowMs', () => {
    expect(buildRssFeed([], NOW)).toContain(
      '<lastBuildDate>Fri, 10 Jul 2026 00:00:00 GMT</lastBuildDate>'
    );
  });

  test('falls back to _createdAt when publishedAt is null', () => {
    const xml = buildRssFeed([item({ publishedAt: null })], NOW);
    expect(xml).toContain('<pubDate>Mon, 01 Jun 2026 12:00:00 GMT</pubDate>');
  });

  test('link and guid are absolute and identical', () => {
    const xml = buildRssFeed([item({ slug: 'hello-world' })], NOW);

    expect(xml).toContain(
      '<link>https://preetamraj.dev/blog/hello-world</link>'
    );
    expect(xml).toContain(
      '<guid isPermaLink="true">https://preetamraj.dev/blog/hello-world</guid>'
    );
  });

  test('includes the category when present and omits it when null', () => {
    expect(buildRssFeed([item()], NOW)).toContain(
      '<category>Engineering</category>'
    );
    expect(buildRssFeed([item({ category: null })], NOW)).not.toContain(
      '<category>'
    );
  });

  test('declares a self-referencing atom:link', () => {
    expect(buildRssFeed([], NOW)).toContain(
      '<atom:link href="https://preetamraj.dev/feed.xml" rel="self" type="application/rss+xml" />'
    );
  });

  test('an empty post list still yields a valid channel', () => {
    const xml = buildRssFeed([], NOW);

    expect(xml).toStartWith('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<channel>');
    expect(xml).toContain('</channel>');
    expect(xml).toContain('</rss>');
    expect(xml).not.toContain('<item>');
  });

  test('renders every item', () => {
    const xml = buildRssFeed(
      [
        item({ slug: 'one', title: 'One' }),
        item({ slug: 'two', title: 'Two' }),
      ],
      NOW
    );
    expect(xml.match(/<item>/g)).toHaveLength(2);
  });

  test('a missing description does not emit undefined', () => {
    const xml = buildRssFeed(
      [item({ description: undefined as unknown as string })],
      NOW
    );
    expect(xml).toContain('<description></description>');
  });
});
