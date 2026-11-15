'use client';
import { LINKS } from '@/components/global/SocialLinks';
import { cn } from '@/lib/utils';
import {
  BookOpenIcon,
  BriefcaseIcon,
  FolderIcon,
  HashIcon,
  HomeIcon,
  InfoIcon,
  MailIcon,
  PenSquareIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggler } from './ThemeToggler';

/** One icon set (lucide) at one stroke weight for the whole sidebar. */
const ICON_STROKE = 1.75;

const NAV = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/about', label: 'About', icon: InfoIcon },
  { href: '/portfolio', label: 'Portfolio', icon: BriefcaseIcon },
  { href: '/blog', label: 'Blog', icon: BookOpenIcon },
  { href: '/contact', label: 'Contact', icon: MailIcon },
  { href: '/categories', label: 'Categories', icon: FolderIcon },
  { href: '/tags', label: 'Tags', icon: HashIcon },
];

const Sidebar = ({ open }: { open: boolean }) => {
  const pathname = usePathname();
  const section = pathname.split('/')[1];
  const iconProps = {
    'aria-hidden': true,
    strokeWidth: ICON_STROKE,
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
          flex: open,
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
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href.slice(1) === section;
            return (
              <Link
                key={href}
                href={href}
                // Exact match is the current page; a parent section (e.g.
                // /blog on a post) is still highlighted but announced as the
                // current location.
                aria-current={
                  active ? (pathname === href ? 'page' : 'location') : undefined
                }
                className={cn(
                  // Muted pill behind icon + label; no detached indicator bar.
                  '-mx-3 flex items-center gap-3 rounded-md px-3 py-2 text-body text-muted-foreground transition-colors duration-150 hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted motion-reduce:transition-none',
                  {
                    'bg-foreground/[0.07] font-medium text-foreground hover:bg-foreground/[0.07]':
                      active,
                  }
                )}
              >
                <Icon
                  aria-hidden='true'
                  strokeWidth={ICON_STROKE}
                  className={cn('h-5 w-5 shrink-0', {
                    'text-primary': active,
                  })}
                />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className='flex items-center justify-between'>
        <ThemeToggler />
        {LINKS.map(({ key, href, label, Icon, external }) => (
          <Link
            key={key}
            href={href}
            aria-label={label}
            {...(external
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
            className={iconLink}
          >
            <Icon {...iconProps} />
          </Link>
        ))}
        <Link
          href='/studio'
          target='_blank'
          rel='noopener noreferrer'
          aria-label='Sanity Studio (opens in a new tab)'
          title='Sanity Studio'
          className={iconLink}
        >
          <PenSquareIcon {...iconProps} />
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
