import { describe, expect, test } from 'bun:test';

import {
  RANKING,
  rankCategories,
  rankPosts,
  scoreCategory,
  scorePost,
  trendingWindowSince,
  type CategoryStats,
  type RankablePost,
} from '../ranking';

const DAY_MS = 86_400_000;
const NOW = Date.parse('2026-07-10T00:00:00.000Z');

const daysAgo = (n: number) => new Date(NOW - n * DAY_MS).toISOString();

const post = (over: Partial<RankablePost> = {}): RankablePost => ({
  views: 0,
  publishedAt: daysAgo(0),
  _createdAt: daysAgo(0),
  ...over,
});

const category = (over: Partial<CategoryStats> = {}): CategoryStats => ({
  recentViews: 0,
  allTimeViews: 0,
  postCount: 0,
  ...over,
});

describe('scorePost', () => {
  test('a brand-new post gets (near) full freshness weight', () => {
    expect(scorePost(post(), NOW)).toBeCloseTo(RANKING.posts.freshnessWeight, 5);
  });

  test('freshness halves after exactly one half-life', () => {
    const atHalfLife = post({ publishedAt: daysAgo(RANKING.posts.halfLifeDays) });
    expect(scorePost(atHalfLife, NOW)).toBeCloseTo(
      RANKING.posts.freshnessWeight * 0.5,
      5,
    );
  });

  test('popularity uses log10(views + 1)', () => {
    const ancient = post({ views: 999, publishedAt: daysAgo(3650) });
    expect(scorePost(ancient, NOW)).toBeCloseTo(
      RANKING.posts.popularityWeight * 3, // log10(1000) = 3
      3,
    );
  });

  test('falls back to _createdAt when publishedAt is null', () => {
    const noPublish = post({ publishedAt: null, _createdAt: daysAgo(RANKING.posts.halfLifeDays) });
    expect(scorePost(noPublish, NOW)).toBeCloseTo(
      RANKING.posts.freshnessWeight * 0.5,
      5,
    );
  });

  test('a future date is clamped to freshness 1 (no age boost)', () => {
    const future = post({ publishedAt: daysAgo(-30) });
    expect(scorePost(future, NOW)).toBeCloseTo(RANKING.posts.freshnessWeight, 5);
  });

  test('missing views is treated as 0', () => {
    const missing = post({ views: undefined as unknown as number });
    expect(scorePost(missing, NOW)).toBeCloseTo(RANKING.posts.freshnessWeight, 5);
  });
});

describe('rankPosts', () => {
  test('orders by score descending and does not mutate the input', () => {
    const fresh = post({ views: 5, publishedAt: daysAgo(1) });
    const oldHot = post({ views: 5000, publishedAt: daysAgo(190) });
    const input = [fresh, oldHot];

    const ranked = rankPosts(input, NOW);

    expect(ranked[0]).toBe(oldHot);
    expect(ranked[1]).toBe(fresh);
    expect(input).toEqual([fresh, oldHot]);
  });

  test('a fresh, decently-viewed post beats an ancient viral one', () => {
    const freshDecent = post({ views: 50, publishedAt: daysAgo(0) });
    const ancientViral = post({ views: 5000, publishedAt: daysAgo(400) });
    const ranked = rankPosts([ancientViral, freshDecent], NOW);
    expect(ranked[0]).toBe(freshDecent);
  });

  test('respects the limit', () => {
    const posts = [post({ views: 1 }), post({ views: 2 }), post({ views: 3 })];
    expect(rankPosts(posts, NOW, 2)).toHaveLength(2);
  });

  test('empty input yields empty output', () => {
    expect(rankPosts([], NOW)).toEqual([]);
  });
});

describe('scoreCategory', () => {
  test('applies the configured weights', () => {
    const s = scoreCategory(category({ recentViews: 3, allTimeViews: 7, postCount: 2 }));
    const { recentViewWeight, allTimeViewWeight, postCountWeight } = RANKING.categories;
    expect(s).toBe(3 * recentViewWeight + 7 * allTimeViewWeight + 2 * postCountWeight);
  });

  test('recent views dominate all-time views at equal magnitude', () => {
    const recent = scoreCategory(category({ recentViews: 5 }));
    const allTime = scoreCategory(category({ allTimeViews: 5 }));
    expect(recent).toBeGreaterThan(allTime);
  });

  test('post count keeps an idle category above zero (fallback)', () => {
    expect(scoreCategory(category({ postCount: 4 }))).toBeGreaterThan(0);
  });
});

describe('rankCategories', () => {
  test('a view-active category outranks an idle but post-heavy one', () => {
    const active = { _id: 'a', recentViews: 12, allTimeViews: 40, postCount: 2 };
    const idle = { _id: 'b', recentViews: 0, allTimeViews: 30, postCount: 9 };
    const ranked = rankCategories([idle, active]);
    expect(ranked.map((c) => c._id)).toEqual(['a', 'b']);
  });

  test('respects the limit and preserves extra fields', () => {
    const cats = [
      { _id: 'a', name: 'A', recentViews: 1, allTimeViews: 0, postCount: 0 },
      { _id: 'b', name: 'B', recentViews: 9, allTimeViews: 0, postCount: 0 },
      { _id: 'c', name: 'C', recentViews: 5, allTimeViews: 0, postCount: 0 },
    ];
    const ranked = rankCategories(cats, 2);
    expect(ranked).toHaveLength(2);
    expect(ranked.map((c) => c.name)).toEqual(['B', 'C']);
  });
});

describe('trendingWindowSince', () => {
  test('returns an ISO cutoff `windowDays` before the current UTC day start', () => {
    expect(trendingWindowSince(NOW)).toBe('2026-06-10T00:00:00.000Z');
  });

  test('is bucketed to the day: stable as the clock advances within a day', () => {
    const morning = trendingWindowSince(NOW + DAY_MS / 4);
    const evening = trendingWindowSince(NOW + (DAY_MS * 3) / 4);
    expect(morning).toBe(evening);
    expect(morning).toBe(trendingWindowSince(NOW));
  });

  test('advances by one day once the clock crosses midnight', () => {
    expect(trendingWindowSince(NOW + DAY_MS)).toBe('2026-06-11T00:00:00.000Z');
  });

  test('honors a custom window length', () => {
    expect(trendingWindowSince(NOW, 7)).toBe('2026-07-03T00:00:00.000Z');
  });
});
