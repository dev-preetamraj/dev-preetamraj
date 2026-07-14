'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Progress bar that fills as the reader scrolls through the article body,
 * reaching 100% at the end of `#article-body` (before the comments section).
 *
 * It's portalled onto the top edge of the sticky navbar, so it spans exactly
 * the navbar's width, sits above it, and moves with it. Scroll is measured
 * against the article's own scroll container — the blog layout scrolls inside a
 * Radix ScrollArea viewport, not the window — resolved via `.closest()` so we
 * never grab the wrong scroller.
 */
const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);
  const [navbar, setNavbar] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const article = document.getElementById('article-body');
    if (!article) return;

    setNavbar(document.getElementById('site-navbar'));

    const viewport = article.closest<HTMLElement>(
      '[data-radix-scroll-area-viewport]',
    );
    const scrollTarget: EventTarget = viewport ?? window;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const scrollTop = viewport ? viewport.scrollTop : window.scrollY;
      const viewHeight = viewport ? viewport.clientHeight : window.innerHeight;
      const originTop = viewport ? viewport.getBoundingClientRect().top : 0;
      const articleEnd =
        article.getBoundingClientRect().bottom - originTop + scrollTop;

      const distance = articleEnd - viewHeight;
      const ratio = distance > 0 ? scrollTop / distance : 0;
      setProgress(Math.min(1, Math.max(0, ratio)));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    scrollTarget.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(article);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      scrollTarget.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      observer.disconnect();
    };
  }, []);

  if (!navbar) return null;

  return createPortal(
    <div
      aria-hidden
      className='pointer-events-none absolute inset-x-0 top-0 z-[60] h-0.5'
    >
      <div
        className='h-full origin-left rounded-full bg-primary brightness-75'
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>,
    navbar,
  );
};

export default ReadingProgress;
