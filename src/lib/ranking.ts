// Scoring lives here; GROQ only gathers raw signals. Pure: time is passed in as `nowMs`.

// Tunable weights - the algorithm's single source of truth.
export const RANKING = {
  posts: {
    popularityWeight: 1,
    freshnessWeight: 2,
    halfLifeDays: 14,
  },
  categories: {
    recentViewWeight: 10,
    allTimeViewWeight: 1,
    postCountWeight: 1,
    windowDays: 30,
  },
  related: {
    sharedTagWeight: 3,
    categoryMatchWeight: 2,
    // Caps the relatedness lattice at 0,2,3,5,6,8,9,11 - min gap 1, so a
    // tie-break bounded below 1 can never move a post out of its band.
    maxSharedTags: 3,
    tieBreakWeight: 0.5,
  },
};

const DAY_MS = 86_400_000;

// Decay in (0, 1], halving every `halfLifeDays`; future dates clamp to 1.
function freshness(dateMs: number, nowMs: number, halfLifeDays: number): number {
  const ageDays = Math.max(0, (nowMs - dateMs) / DAY_MS);
  return Math.pow(0.5, ageDays / halfLifeDays);
}

export type RankablePost = {
  views: number;
  publishedAt: string | null;
  _createdAt: string;
};

export function scorePost(post: RankablePost, nowMs: number): number {
  const { popularityWeight, freshnessWeight, halfLifeDays } = RANKING.posts;
  const dateMs = Date.parse(post.publishedAt ?? post._createdAt);
  const popularity = Math.log10((post.views ?? 0) + 1);
  return (
    popularityWeight * popularity +
    freshnessWeight * freshness(dateMs, nowMs, halfLifeDays)
  );
}

export function rankPosts<T extends RankablePost>(
  posts: T[],
  nowMs: number,
  limit?: number,
): T[] {
  const ranked = [...posts].sort((a, b) => scorePost(b, nowMs) - scorePost(a, nowMs));
  return typeof limit === 'number' ? ranked.slice(0, limit) : ranked;
}

export type RelatablePost = RankablePost & {
  _id: string;
  category: { slug: string } | null;
  tags: { slug: string }[] | null;
};

/** Distinct tag slugs; `tags` has no uniqueness constraint in the schema. */
function tagSlugs(post: RelatablePost): Set<string> {
  const slugs = new Set<string>();
  for (const tag of post.tags ?? []) {
    if (tag?.slug) slugs.add(tag.slug);
  }
  return slugs;
}

/**
 * Relatedness to `reference`: a discrete band from shared tags and category,
 * with `scorePost` squashed into [0, 1) as a tie-break *within* the band.
 * Squashing matters - `scorePost` grows with log10(views) and is unbounded, so
 * an unsquashed tie-break would let a popular post outrank a more related one.
 */
export function scoreRelated(
  post: RelatablePost,
  reference: RelatablePost,
  nowMs: number,
): number {
  const { sharedTagWeight, categoryMatchWeight, maxSharedTags, tieBreakWeight } = RANKING.related;

  const referenceTags = tagSlugs(reference);
  let sharedTags = 0;
  for (const slug of tagSlugs(post)) {
    if (referenceTags.has(slug)) sharedTags += 1;
  }

  // Guarded: without the Boolean(), two uncategorised posts would match on null.
  const categorySlug = post.category?.slug;
  const categoryMatches = Boolean(categorySlug) && categorySlug === reference.category?.slug;

  const base = scorePost(post, nowMs);

  return (
    sharedTagWeight * Math.min(sharedTags, maxSharedTags) +
    categoryMatchWeight * (categoryMatches ? 1 : 0) +
    tieBreakWeight * (base / (base + 1))
  );
}

/**
 * Posts most related to `reference`, best first, excluding `reference` itself.
 * Unrelated posts score on the tie-break alone, so they sort below every real
 * match and backfill the remaining slots by popularity/freshness.
 */
export function rankRelated<T extends RelatablePost>(
  posts: T[],
  reference: RelatablePost,
  nowMs: number,
  limit?: number,
): T[] {
  const ranked = posts
    .filter((post) => post._id !== reference._id)
    .sort((a, b) => scoreRelated(b, reference, nowMs) - scoreRelated(a, reference, nowMs));
  return typeof limit === 'number' ? ranked.slice(0, limit) : ranked;
}

export type CategoryStats = {
  recentViews: number;
  allTimeViews: number;
  postCount: number;
};

export function scoreCategory(stats: CategoryStats): number {
  const { recentViewWeight, allTimeViewWeight, postCountWeight } = RANKING.categories;
  return (
    stats.recentViews * recentViewWeight +
    stats.allTimeViews * allTimeViewWeight +
    stats.postCount * postCountWeight
  );
}

export function rankCategories<T extends CategoryStats>(
  categories: T[],
  limit?: number,
): T[] {
  const ranked = [...categories].sort((a, b) => scoreCategory(b) - scoreCategory(a));
  return typeof limit === 'number' ? ranked.slice(0, limit) : ranked;
}

// Day-bucketed so the value is stable within a UTC day, keeping the ISR
// fetch-cache key stable while still revalidating every 60s.
export function trendingWindowSince(
  nowMs: number,
  windowDays = RANKING.categories.windowDays,
): string {
  const dayStart = Math.floor(nowMs / DAY_MS) * DAY_MS;
  return new Date(dayStart - windowDays * DAY_MS).toISOString();
}
