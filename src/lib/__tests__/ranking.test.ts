import { describe, expect, test } from 'bun:test';

import {
  RANKING,
  rankCategories,
  rankPosts,
  rankRelated,
  scoreCategory,
  scorePost,
  scoreRelated,
  trendingWindowSince,
  type CategoryStats,
  type RankablePost,
  type RelatablePost,
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

let relatableId = 0;
const relatable = (over: Partial<RelatablePost> = {}): RelatablePost => ({
  _id: `post-${(relatableId += 1)}`,
  views: 0,
  publishedAt: daysAgo(0),
  _createdAt: daysAgo(0),
  category: { slug: 'engineering' },
  tags: [],
  ...over,
});

const tags = (...slugs: string[]) => slugs.map((slug) => ({ slug }));

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

describe('scoreRelated', () => {
  const reference = relatable({
    _id: 'reference',
    category: { slug: 'engineering' },
    tags: tags('react', 'testing'),
  });

  // The tie-break must stay bounded below the lattice's minimum gap of 1.
  // An unsquashed `scorePost` term is unbounded (log10 of views) and lets a
  // popular post jump a whole relatedness band - the bug this guards against.
  test('a fresh, heavily-viewed same-category post loses to a dead shared-tag post', () => {
    const catViral = relatable({
      category: { slug: 'engineering' },
      tags: [],
      views: 10_000,
      publishedAt: daysAgo(0),
    });
    const tagDead = relatable({
      category: { slug: 'design' },
      tags: tags('react'),
      views: 0,
      publishedAt: daysAgo(730),
    });

    expect(scoreRelated(tagDead, reference, NOW)).toBeGreaterThan(
      scoreRelated(catViral, reference, NOW)
    );
  });

  test('an absurd view count still cannot cross a relatedness band', () => {
    const absurd = relatable({
      category: { slug: 'engineering' },
      tags: [],
      views: 1_000_000_000,
      publishedAt: daysAgo(0),
    });
    const barelyRelated = relatable({
      category: { slug: 'design' },
      tags: tags('react'),
      views: 0,
      publishedAt: daysAgo(3650),
    });

    expect(scoreRelated(barelyRelated, reference, NOW)).toBeGreaterThan(
      scoreRelated(absurd, reference, NOW)
    );
  });

  test('within a band, scorePost still breaks the tie (squash stays monotonic)', () => {
    const shared = { category: { slug: 'design' }, tags: tags('react') };
    const fresh = relatable({ ...shared, views: 50, publishedAt: daysAgo(0) });
    const stale = relatable({
      ...shared,
      views: 50,
      publishedAt: daysAgo(400),
    });

    expect(scoreRelated(fresh, reference, NOW)).toBeGreaterThan(
      scoreRelated(stale, reference, NOW)
    );
  });

  test('one shared tag outranks a bare category match', () => {
    const tagged = relatable({
      category: { slug: 'design' },
      tags: tags('react'),
    });
    const sameCategory = relatable({
      category: { slug: 'engineering' },
      tags: [],
    });

    expect(scoreRelated(tagged, reference, NOW)).toBeGreaterThan(
      scoreRelated(sameCategory, reference, NOW)
    );
  });

  test('more shared tags outrank fewer', () => {
    const two = relatable({ category: null, tags: tags('react', 'testing') });
    const one = relatable({ category: null, tags: tags('react') });

    expect(scoreRelated(two, reference, NOW)).toBeGreaterThan(
      scoreRelated(one, reference, NOW)
    );
  });

  test('shared tags stop counting past maxSharedTags', () => {
    const many = relatable({
      _id: 'many',
      category: null,
      tags: tags('a', 'b', 'c', 'd', 'e'),
    });
    const capped = relatable({
      _id: 'capped',
      category: null,
      tags: tags('a', 'b', 'c'),
    });
    const wide = relatable({
      category: null,
      tags: tags('a', 'b', 'c', 'd', 'e'),
    });

    // Both share more than the cap allows, so they land in the same band.
    expect(scoreRelated(many, wide, NOW)).toBeCloseTo(
      scoreRelated(capped, wide, NOW),
      5
    );
  });

  test('two uncategorised posts do not count as a category match', () => {
    const noCategory = relatable({ category: null, tags: [] });
    const referenceNoCategory = relatable({
      _id: 'ref2',
      category: null,
      tags: [],
    });

    // A bare `===` would make null === null true and award the category weight.
    expect(scoreRelated(noCategory, referenceNoCategory, NOW)).toBeLessThan(
      RANKING.related.categoryMatchWeight
    );
  });

  test('duplicate tag refs do not inflate the score', () => {
    const duped = relatable({
      category: null,
      tags: tags('react', 'react', 'react'),
    });
    const single = relatable({ category: null, tags: tags('react') });

    expect(scoreRelated(duped, reference, NOW)).toBeCloseTo(
      scoreRelated(single, reference, NOW),
      5
    );
  });

  test('a post with no tags falls back to the category band', () => {
    const untagged = relatable({
      category: { slug: 'engineering' },
      tags: null,
    });
    expect(scoreRelated(untagged, reference, NOW)).toBeGreaterThan(
      RANKING.related.categoryMatchWeight
    );
    expect(scoreRelated(untagged, reference, NOW)).toBeLessThan(
      RANKING.related.categoryMatchWeight + 1
    );
  });

  test('a reference with no tags still matches on category', () => {
    const referenceUntagged = relatable({
      _id: 'ref3',
      category: { slug: 'engineering' },
      tags: null,
    });
    const sameCategory = relatable({
      category: { slug: 'engineering' },
      tags: tags('react'),
    });
    const unrelated = relatable({
      category: { slug: 'design' },
      tags: tags('react'),
    });

    expect(scoreRelated(sameCategory, referenceUntagged, NOW)).toBeGreaterThan(
      scoreRelated(unrelated, referenceUntagged, NOW)
    );
  });
});

describe('rankRelated', () => {
  const reference = relatable({
    _id: 'reference',
    category: { slug: 'engineering' },
    tags: tags('react', 'testing'),
  });

  test('excludes the reference post from its own results', () => {
    const other = relatable({ _id: 'other' });
    expect(
      rankRelated([reference, other], reference, NOW).map((p) => p._id)
    ).toEqual(['other']);
  });

  test('orders by relatedness and does not mutate the input', () => {
    const unrelated = relatable({
      _id: 'unrelated',
      category: { slug: 'design' },
      tags: [],
    });
    const sameCategory = relatable({
      _id: 'category',
      category: { slug: 'engineering' },
      tags: [],
    });
    const twoTags = relatable({
      _id: 'two',
      category: { slug: 'design' },
      tags: tags('react', 'testing'),
    });
    const input = [unrelated, sameCategory, twoTags];

    const ranked = rankRelated(input, reference, NOW);

    expect(ranked.map((p) => p._id)).toEqual(['two', 'category', 'unrelated']);
    expect(input).toEqual([unrelated, sameCategory, twoTags]);
  });

  test('unrelated posts sort last but still backfill, ranked by scorePost', () => {
    const related = relatable({
      _id: 'related',
      category: { slug: 'design' },
      tags: tags('react'),
    });
    const popular = relatable({
      _id: 'popular',
      category: { slug: 'design' },
      tags: [],
      views: 900,
    });
    const quiet = relatable({
      _id: 'quiet',
      category: { slug: 'design' },
      tags: [],
      views: 0,
    });

    const ranked = rankRelated([quiet, popular, related], reference, NOW);

    expect(ranked.map((p) => p._id)).toEqual(['related', 'popular', 'quiet']);
  });

  test('respects the limit and preserves extra fields', () => {
    const posts = [
      { ...relatable({ _id: 'a', tags: tags('react') }), title: 'A' },
      {
        ...relatable({ _id: 'b', tags: tags('react', 'testing') }),
        title: 'B',
      },
      { ...relatable({ _id: 'c', category: null, tags: [] }), title: 'C' },
    ];
    const ranked = rankRelated(posts, reference, NOW, 2);

    expect(ranked).toHaveLength(2);
    expect(ranked.map((p) => p.title)).toEqual(['B', 'A']);
  });

  test('empty input yields empty output', () => {
    expect(rankRelated([], reference, NOW)).toEqual([]);
  });

  test('fewer candidates than the limit returns what exists', () => {
    const only = relatable({ _id: 'only' });
    expect(rankRelated([only], reference, NOW, 4)).toHaveLength(1);
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
