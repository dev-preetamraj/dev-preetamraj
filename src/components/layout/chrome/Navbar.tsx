'use client';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import type { PageTitle } from '../SiteShell';
import Breadcrumb from './Breadcrumb';
import NavbarSearch from './NavbarSearch';

type Props = {
  menuOpen: boolean;
  onMenuToggle: () => void;
  pageTitle: PageTitle | null;
};

const Navbar = ({ menuOpen, onMenuToggle, pageTitle }: Props) => {
  const MenuToggleIcon = menuOpen ? XIcon : MenuIcon;
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
            aria-expanded={menuOpen}
            aria-controls='site-sidebar'
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={onMenuToggle}
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
        <Breadcrumb pageTitle={pageTitle} />
        <NavbarSearch />
      </div>
    </header>
  );
};

export default Navbar;
