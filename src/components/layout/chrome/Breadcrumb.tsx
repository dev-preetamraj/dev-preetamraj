'use client';

import { SITE_NAME } from '@/lib/seo';
import { capitalizeWord, createURL, slugToTitle } from '@/lib/utils';
import Link from 'next/link';
import { LINK } from '../roles';
import { usePathname } from 'next/navigation';
import { useSyncExternalStore } from 'react';

// Live document.title: Next updates <title> after client navigation, so the
// last crumb re-renders when the new page's metadata lands.
const subscribeTitle = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.head, {
    subtree: true,
    childList: true,
    characterData: true,
  });
  return () => observer.disconnect();
};
const getTitle = () => document.title;
const getServerTitle = () => '';

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ');

/**
 * Label for the last crumb: the page title (e.g. "LLM Kit Pro"), not the
 * slug ("Llm Kit Pro"). Strips the "%s - Preetam Raj" template and any
 * " | Tag"-style suffix. Falls back to the slug when the title is not yet
 * the current page's (shares no word with the slug) or is unavailable.
 */
const titleForSlug = (docTitle: string, slug: string) => {
  const fallback = slugToTitle(decodeURIComponent(slug));
  const suffix = ` - ${SITE_NAME}`;
  let title = docTitle.endsWith(suffix)
    ? docTitle.slice(0, -suffix.length)
    : docTitle;
  title = title.split(' | ')[0].trim();
  if (!title || title === SITE_NAME) return fallback;

  const titleWords = new Set(normalize(title).split(' '));
  const slugWords = normalize(slug)
    .split(' ')
    .filter((w) => w.length > 2);
  const belongsToPage =
    slugWords.length === 0 || slugWords.some((w) => titleWords.has(w));
  return belongsToPage ? title : fallback;
};

const Breadcrumb = () => {
  const pathname = usePathname();
  const docTitle = useSyncExternalStore(
    subscribeTitle,
    getTitle,
    getServerTitle
  );
  const items = pathname.split('/');
  if (items) items[0] = 'home';
  if (items.length === 2 && items[1] === '') items.pop();

  return (
    // Visible from md up (the md-only "Home" link in Navbar is gone); the
    // trail shrinks and only the last crumb truncates.
    <nav
      aria-label='Breadcrumb'
      className='hidden min-w-0 flex-1 md:mr-4 md:flex'
    >
      <ol className='flex min-w-0 items-center space-x-2 w-full text-small text-muted-foreground'>
        {items.map((item, index) => (
          <li
            key={index}
            className={
              index === items.length - 1
                ? 'flex min-w-0 items-center space-x-2'
                : 'flex shrink-0 items-center space-x-2'
            }
          >
            {index != 0 && <span aria-hidden='true'>/</span>}
            {pathname === '/' ? (
              <span aria-current='page'>{capitalizeWord(item)}</span>
            ) : index === items.length - 1 ? (
              <span
                aria-current='page'
                className='block min-w-0 max-w-[14rem] truncate text-foreground xl:max-w-sm'
              >
                {/* Top-level sections keep their short name ("Blog"); only
                    detail pages (depth > 1) use the document title. */}
                {index > 1 ? titleForSlug(docTitle, item) : slugToTitle(item)}
              </span>
            ) : (
              <Link href={createURL(items, index)} className={LINK.action}>
                {capitalizeWord(item)}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
