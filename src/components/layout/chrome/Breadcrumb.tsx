'use client';

import { capitalizeWord, createURL, slugToTitle } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LINK } from '../roles';
import type { PageTitle } from '../SiteShell';

const Breadcrumb = ({ pageTitle }: { pageTitle: PageTitle | null }) => {
  const pathname = usePathname();
  // Detail pages report their real title (BreadcrumbTitle); until then, or
  // on pages that don't, the last crumb is derived from the slug.
  const title = pageTitle?.path === pathname ? pageTitle.title : undefined;
  const items = pathname.split('/');
  items[0] = 'home';
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
                    detail pages (depth > 1) use the page title. */}
                {index > 1
                  ? title ?? slugToTitle(decodeURIComponent(item))
                  : slugToTitle(item)}
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
