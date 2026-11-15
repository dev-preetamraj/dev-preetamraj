'use client';
import { buttonVariants } from '@/components/ui/button';
import { clickMenuButton } from '@/features/slices/navbarSlice';
import { AppDispatch, RootState } from '@/features/store';
import { cn } from '@/lib/utils';
import { MenuIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import Breadcrumb from './Breadcrumb';
import NavbarSearch from './NavbarSearch';

const Navbar = () => {
  const clicked = useSelector((state: RootState) => state.navbar.clicked);
  const dispatch: AppDispatch = useDispatch();
  const MenuToggleIcon = clicked ? XIcon : MenuIcon;
  return (
    <header
      id='site-navbar'
      className='relative border-b border-border sticky z-50 top-0 backdrop-blur-md'
    >
      {/* Same centred cap + gutter as the layout content row, so the
          breadcrumb and search line up with the content and rail edges. */}
      <div className='mx-auto flex max-w-shell items-center justify-between gap-3 px-gutter py-2 md:py-4'>
        {/* Mobile only: menu toggle + wordmark (the sidebar carries both
            from md up). Same outline icon-button style as search. */}
        <div className='flex min-w-0 items-center gap-3 md:hidden'>
          <button
            type='button'
            aria-expanded={clicked}
            aria-controls='site-sidebar'
            aria-label={clicked ? 'Close menu' : 'Open menu'}
            onClick={() => dispatch(clickMenuButton(!clicked))}
            className={buttonVariants({ variant: 'outline', size: 'icon' })}
          >
            <MenuToggleIcon
              aria-hidden='true'
              strokeWidth={1.75}
              className='h-5 w-5'
            />
          </button>
          <Link
            href='/'
            className={cn(
              'truncate rounded-sm text-body font-semibold text-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
          >
            Preetam Raj
          </Link>
        </div>
        <Breadcrumb />
        <NavbarSearch />
      </div>
    </header>
  );
};

export default Navbar;
