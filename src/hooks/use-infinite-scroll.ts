'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/** Fraction of the page height scrolled past which the next batch loads. */
const TRIGGER_RATIO = 0.9;

type Options<T> = {
  initialItems: T[];
  totalCount: number;
  batchSize: number;
  getKey: (item: T) => string;
  fetchPage: (start: number, end: number) => Promise<T[]>;
};

/**
 * Scroll-triggered batch loading shared by the comments list and the blog list.
 * `fetchPage(start, end)` is the only data-source difference between callers
 * (a Server Action for comments, an in-memory slice for the pre-sorted blog).
 */
export function useInfiniteScroll<T>({
  initialItems,
  totalCount,
  batchSize,
  getKey,
  fetchPage,
}: Options<T>) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  // Guards against firing multiple loads for the same scroll gesture.
  const loadingRef = useRef(false);

  // Refs so loadMore stays stable regardless of caller-provided closures.
  const itemsRef = useRef(items);
  const getKeyRef = useRef(getKey);
  const fetchPageRef = useRef(fetchPage);
  // Synced after each render (declared before the scroll effect so it runs first).
  useEffect(() => {
    itemsRef.current = items;
    getKeyRef.current = getKey;
    fetchPageRef.current = fetchPage;
  });

  const hasMore = items.length < totalCount;

  const loadMore = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setIsLoading(true);

    const start = itemsRef.current.length;
    try {
      const next = await fetchPageRef.current(start, start + batchSize);

      setItems((prev) => {
        const key = getKeyRef.current;
        const seen = new Set(prev.map(key));
        const fresh = next.filter((item) => !seen.has(key(item)));
        return fresh.length ? [...prev, ...fresh] : prev;
      });
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [batchSize]);

  const retry = useCallback(() => {
    setError(null);
    void loadMore();
  }, [loadMore]);

  useEffect(() => {
    if (!hasMore || error) return;

    const onScroll = () => {
      if (loadingRef.current) return;
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (scrolled >= total * TRIGGER_RATIO) loadMore();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // In case the list is already short enough to be past the threshold.
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [hasMore, error, loadMore]);

  const remaining = Math.max(0, totalCount - items.length);

  return { items, isLoading, hasMore, remaining, error, retry };
}
