'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Options<T> = {
  initialItems: T[];
  totalCount: number;
  batchSize: number;
  getKey: (item: T) => string;
  fetchPage: (start: number, end: number) => Promise<T[]>;
  /** Fraction of the scroller height past which the next batch loads. */
  triggerRatio?: number;
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
  triggerRatio = 0.9,
}: Options<T>) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  // Guards against firing multiple loads for the same scroll gesture.
  const loadingRef = useRef(false);

  // Refs so loadMore stays stable regardless of caller-provided closures.
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const getKeyRef = useRef(getKey);
  getKeyRef.current = getKey;
  const fetchPageRef = useRef(fetchPage);
  fetchPageRef.current = fetchPage;

  const hasMore = items.length < totalCount;

  const loadMore = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setIsLoading(true);

    const start = itemsRef.current.length;
    const next = await fetchPageRef.current(start, start + batchSize);

    setItems((prev) => {
      const key = getKeyRef.current;
      const seen = new Set(prev.map(key));
      const fresh = next.filter((item) => !seen.has(key(item)));
      return fresh.length ? [...prev, ...fresh] : prev;
    });

    setIsLoading(false);
    loadingRef.current = false;
  }, [batchSize]);

  useEffect(() => {
    if (!hasMore) return;

    // The page may scroll inside a Radix ScrollArea viewport rather than the
    // window - find it, falling back to the window if the layout changes.
    const scroller: HTMLElement | Window =
      containerRef.current?.closest<HTMLElement>(
        '[data-radix-scroll-area-viewport]',
      ) ?? window;

    const isReached = () => {
      if (scroller instanceof Window) {
        const scrolled = window.scrollY + window.innerHeight;
        const total = document.documentElement.scrollHeight;
        return scrolled >= total * triggerRatio;
      }
      const scrolled = scroller.scrollTop + scroller.clientHeight;
      return scrolled >= scroller.scrollHeight * triggerRatio;
    };

    const onScroll = () => {
      if (loadingRef.current) return;
      if (isReached()) loadMore();
    };

    scroller.addEventListener('scroll', onScroll, { passive: true });
    // In case the list is already short enough to be past the threshold.
    onScroll();
    return () => scroller.removeEventListener('scroll', onScroll);
  }, [hasMore, loadMore, triggerRatio]);

  const remaining = Math.max(0, totalCount - items.length);

  return { items, isLoading, hasMore, remaining, containerRef };
}
