'use client';
import { RootState } from '@/features/store';
import { cn } from '@/lib/utils';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import {
  EnvelopeClosedIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
} from '@radix-ui/react-icons';
import { LogInIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import SidebarLink from './SidebarLink';
import { ThemeToggler } from './ThemeToggler';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

const Sidebar = () => {
  const clicked = useSelector((state: RootState) => state.navbar.clicked);
  return (
    <div
      className={cn(
        'hidden md:flex flex-col justify-between h-screen min-w-[300px] w-[300px] sm:min-w-[350px] sm:w-[350px] bg-muted p-10 sticky top-0',
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
              className='h-28 w-28 md:h-36 md:w-36 rounded-full border border-ring'
            />
          </Link>
          <h1 className='text-3xl md:text-4xl font-bold text-foreground'>
            Preetam Raj
          </h1>
          <p className='text-gray-800 dark:text-gray-400 text-sm font-thin text-justify'>
            B.Tech in{' '}
            <span className='text-primary font-light'>
              Mechanical Engineering
            </span>{' '}
            with minor in{' '}
            <span className='text-primary font-light'>
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
        <SignedOut>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href='/auth/login'>
                  <LogInIcon className='h-6 w-6' />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Login</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Sidebar;
