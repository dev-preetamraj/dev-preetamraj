'use client';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { RootState } from '@/features/store';
import { cn } from '@/lib/utils';
import {
  GithubIcon,
  LinkedinIcon,
  MailIcon,
  PenSquareIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import SidebarLink, { SIDEBAR_ICON_STROKE } from './SidebarLink';
import { ThemeToggler } from './ThemeToggler';

const Sidebar = () => {
  const clicked = useSelector((state: RootState) => state.navbar.clicked);
  const iconProps = {
    'aria-hidden': true,
    strokeWidth: SIDEBAR_ICON_STROKE,
    className: 'h-5 w-5',
  } as const;
  const iconLink =
    'rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none';
  return (
    <div
      id='site-sidebar'
      className={cn(
        'hidden md:flex flex-col justify-between h-screen min-w-[260px] w-[260px] sm:min-w-[300px] sm:w-[300px] bg-muted p-10 sticky top-0',
        {
          flex: clicked,
        }
      )}
    >
      <div className='flex flex-col space-y-10'>
        <div className='flex flex-col space-y-4'>
          <Link href='/' aria-label='Preetam Raj, home' className='w-fit'>
            <Image
              height={150}
              width={150}
              alt='Preetam'
              src='https://res.cloudinary.com/dxgl4eyhq/image/upload/v1687987306/portfolio/me/preetam_ha8a2h.jpg'
              className='h-24 w-24 rounded-full border border-border object-cover'
              priority
            />
          </Link>
          {/* Site identity, not a page heading: each page owns its h1. */}
          <p className='text-h3 text-foreground'>Preetam Raj</p>
          <p className='text-small text-muted-foreground'>
            B.Tech in{' '}
            <span className='font-medium text-foreground'>
              Mechanical Engineering
            </span>{' '}
            with minor in{' '}
            <span className='font-medium text-foreground'>
              Computer Science and Engineering
            </span>
          </p>
        </div>
        <nav aria-label='Primary' className='flex flex-col space-y-1'>
          <SidebarLink href='/' />
          <SidebarLink href='/about' />
          <SidebarLink href='/portfolio' />
          <SidebarLink href='/blog' />
          <SidebarLink href='/contact' />
          <SidebarLink href='/categories' />
          <SidebarLink href='/tags' />
        </nav>
      </div>

      <div className='flex items-center justify-between'>
        <ThemeToggler />
        <Link
          href='https://github.com/dev-preetamraj'
          target='_blank'
          rel='noopener noreferrer'
          aria-label='GitHub (opens in a new tab)'
          className={iconLink}
        >
          <GithubIcon {...iconProps} />
        </Link>
        <Link
          href='https://www.linkedin.com/in/raj-preetam/'
          target='_blank'
          rel='noopener noreferrer'
          aria-label='LinkedIn (opens in a new tab)'
          className={iconLink}
        >
          <LinkedinIcon {...iconProps} />
        </Link>
        <Link
          href='mailto:dev.preetamraj@gmail.com'
          aria-label='Email Preetam'
          className={iconLink}
        >
          <MailIcon {...iconProps} />
        </Link>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href='/studio'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Sanity Studio (opens in a new tab)'
                className={iconLink}
              >
                <PenSquareIcon {...iconProps} />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sanity Studio</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Sidebar;
