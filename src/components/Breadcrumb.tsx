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
    <div className='hidden lg:flex'>
      <ul className='flex items-center space-x-2 w-full'>
        {items.map((item, index) => (
          <li key={index} className='flex items-center space-x-2'>
            {index != 0 && <span>/</span>}
            {pathname === '/' ? (
              <span>{capitalizeWord(item)}</span>
            ) : index === items.length - 1 ? (
              <span className='truncate block w-48 xl:w-96'>
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
