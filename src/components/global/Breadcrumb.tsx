'use client';

import { capitalizeWord, createURL, slugToTitle } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Breadcrumb = () => {
  const pathname = usePathname();
  const items = pathname.split('/');
  if (items) items[0] = 'home';
  if (items.length === 2 && items[1] === '') items.pop();

  return (
    // Visible from md up (the md-only "Home" link in Navbar is gone); the
    // trail shrinks and only the last crumb truncates.
    <div className='hidden min-w-0 flex-1 md:mr-4 md:flex'>
      <ul className='flex min-w-0 items-center space-x-2 w-full text-small text-muted-foreground'>
        {items.map((item, index) => (
          <li
            key={index}
            className={
              index === items.length - 1
                ? 'flex min-w-0 items-center space-x-2'
                : 'flex shrink-0 items-center space-x-2'
            }
          >
            {index != 0 && <span>/</span>}
            {pathname === '/' ? (
              <span>{capitalizeWord(item)}</span>
            ) : index === items.length - 1 ? (
              <span className='block min-w-0 max-w-[14rem] truncate text-foreground xl:max-w-sm'>
                {slugToTitle(item)}
              </span>
            ) : (
              <Link
                href={createURL(items, index)}
                className='text-primary underline underline-offset-2'
              >
                {capitalizeWord(item)}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Breadcrumb;
