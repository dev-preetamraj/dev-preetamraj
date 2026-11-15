'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

/**
 * Progress bar that fills as the reader scrolls through the article body,
 * reaching 100% at the end of `#article-body` (before the comments section).
 *
 * It's portalled onto the top edge of the sticky navbar, so it spans exactly
 * the navbar's width, sits above it, and moves with it. Scroll is measured
 * against the window (the page scroller).
 */
const noopSubscribe = () => () => {};
const getNavbar = () =>
  document.getElementById('article-body')
    ? document.getElementById('site-navbar')
    : null;
const getServerNavbar = () => null;

const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);
  // null on the server / first hydration pass, then the navbar element.
  const navbar = useSyncExternalStore(
    noopSubscribe,
    getNavbar,
    getServerNavbar
  );

  useEffect(() => {
    const article = document.getElementById('article-body');
    if (!article) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const scrollTop = window.scrollY;
      const articleEnd = article.getBoundingClientRect().bottom + scrollTop;

      const distance = articleEnd - window.innerHeight;
      const ratio = distance > 0 ? scrollTop / distance : 0;
      setProgress(Math.min(1, Math.max(0, ratio)));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(article);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
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
        className='reading-progress-bar'
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>,
    navbar
  );
};

export default ReadingProgress;
