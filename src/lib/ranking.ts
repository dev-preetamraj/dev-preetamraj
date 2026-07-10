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
