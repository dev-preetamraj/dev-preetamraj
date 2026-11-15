'use client';

import { cn } from '@/lib/utils';
import {
  BookOpenIcon,
  BriefcaseIcon,
  FolderIcon,
  HashIcon,
  HomeIcon,
  InfoIcon,
  MailIcon,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ISidebarLink {
  href: string;
}

/** One icon set (lucide) at one stroke weight for the whole sidebar. */
export const SIDEBAR_ICON_STROKE = 1.75;

const ICONS: Record<string, LucideIcon> = {
  '/': HomeIcon,
  '/about': InfoIcon,
  '/portfolio': BriefcaseIcon,
  '/blog': BookOpenIcon,
  '/contact': MailIcon,
  '/categories': FolderIcon,
  '/tags': HashIcon,
};

const SidebarLink: React.FC<ISidebarLink> = ({ href }) => {
  const pathname = usePathname();

  const menuName =
    href === '/'
      ? 'Home'
      : href.replace('/', '').charAt(0).toUpperCase() + href.substring(2);

  const active = href.replace('/', '') === pathname.split('/')[1];
  // Exact match is the current page; a parent section (e.g. /blog on a
  // post) is still highlighted but announced as the current location.
  const ariaCurrent = active
    ? pathname === href
      ? ('page' as const)
      : ('location' as const)
    : undefined;

  const Icon = ICONS[href];

  return (
    <Link
      href={href}
      aria-current={ariaCurrent}
      className={cn(
        // Muted pill behind icon + label; no detached indicator bar.
        '-mx-3 flex items-center gap-3 rounded-md px-3 py-2 text-body text-muted-foreground transition-colors duration-150 hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted motion-reduce:transition-none',
        {
          'bg-foreground/[0.07] font-medium text-foreground hover:bg-foreground/[0.07]':
            active,
        }
      )}
    >
      {Icon && (
        <Icon
          aria-hidden='true'
          strokeWidth={SIDEBAR_ICON_STROKE}
          className={cn('h-5 w-5 shrink-0', { 'text-primary': active })}
        />
      )}
      <span>{menuName}</span>
    </Link>
  );
};

export default SidebarLink;
