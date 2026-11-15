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
  EnvelopeClosedIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
} from '@radix-ui/react-icons';
import { PenSquareIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import SidebarLink from './SidebarLink';
import { ThemeToggler } from './ThemeToggler';

const Sidebar = () => {
  const clicked = useSelector((state: RootState) => state.navbar.clicked);
  return (
    <div
      className={cn(
        'hidden md:flex flex-col justify-between h-screen min-w-[260px] w-[260px] sm:min-w-[300px] sm:w-[300px] bg-muted p-10 sticky top-0',
        {
          flex: clicked,
        }
      )}
    >
      <div className='flex flex-col space-y-10'>
        <div className='flex flex-col space-y-4'>
          <Link href='/'>
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
        <div className='flex flex-col space-y-5'>
          <SidebarLink href='/' />
          <SidebarLink href='/about' />
          <SidebarLink href='/portfolio' />
          <SidebarLink href='/blog' />
          <SidebarLink href='/contact' />
          <SidebarLink href='/categories' />
          <SidebarLink href='/tags' />
        </div>
      </div>

      <div className='flex items-center justify-between'>
        <ThemeToggler />
        <Link href='https://github.com/dev-preetamraj' target='_blank'>
          <GitHubLogoIcon className='h-6 w-6' />
        </Link>
        <Link href='https://www.linkedin.com/in/raj-preetam/' target='_blank'>
          <LinkedInLogoIcon className='h-6 w-6' />
        </Link>
        <Link href='mailto:dev.preetamraj@gmail.com'>
          <EnvelopeClosedIcon className='h-6 w-6' />
        </Link>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href='/studio' target='_blank' rel='noopener noreferrer'>
                <PenSquareIcon className='h-6 w-6' />
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
