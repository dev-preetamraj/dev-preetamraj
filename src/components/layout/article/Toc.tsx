'use client';

import type { TocItem } from '@/lib/toc';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  items: TocItem[];
  /**
   * `aside` = always-open list in the sticky article aside (lg and up).
   * `disclosure` = collapsible block above the article (below lg).
   */
  variant: 'aside' | 'disclosure';
};

/** Headings above this line (px from the viewport top) count as read. */
const READ_LINE = 140;

/**
 * Tracks which section is being read: the last heading whose top has
 * scrolled above READ_LINE (the first heading until then). Listens to the
 * Radix ScrollArea viewport the layout scrolls in, falling back to window.
 */
const useActiveHeading = (ids: string[]) => {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!elements.length) return;

    const scroller: HTMLElement | Window =
      elements[0].closest<HTMLElement>('[data-radix-scroll-area-viewport]') ??
      window;

    let frame = 0;
    const measure = () => {
      frame = 0;
      let current = elements[0].id;
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= READ_LINE) current = el.id;
        else break;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    schedule();
    scroller.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      scroller.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [ids]);

  return active;
};

const TocList = ({
  items,
  active,
}: {
  items: TocItem[];
  active: string | null;
}) => (
  <ol className='flex flex-col border-l border-border'>
    {items.map((item) => {
      const isActive = item.id === active;
      return (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            aria-current={isActive ? 'location' : undefined}
            className={cn(
              '-ml-px block border-l py-1.5 text-small transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              item.level === 3 ? 'pl-7' : 'pl-4',
              isActive
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-primary'
            )}
          >
            {item.text}
          </a>
        </li>
      );
    })}
  </ol>
);

const Toc = ({ items, variant }: Props) => {
  const ids = useMemo(() => items.map((item) => item.id), [items]);
  const active = useActiveHeading(ids);
  if (!items.length) return null;

  if (variant === 'disclosure') {
    return (
      <details className='group rounded-xl border border-border bg-card'>
        <summary className='flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-5 py-3 text-eyebrow text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden'>
          On this page
          <ChevronDown
            aria-hidden
            className='h-4 w-4 transition-transform group-open:rotate-180'
          />
        </summary>
        <nav aria-label='On this page' className='px-5 pb-4'>
          <TocList items={items} active={active} />
        </nav>
      </details>
    );
  }

  return (
    <nav aria-label='On this page' className='flex flex-col gap-3'>
      <h2 className='text-eyebrow text-muted-foreground'>On this page</h2>
      <TocList items={items} active={active} />
    </nav>
  );
};

export default Toc;
