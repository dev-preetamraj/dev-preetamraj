'use client';

import { cn } from '@/lib/utils';
import {
  BookmarkIcon,
  HomeIcon,
  IdCardIcon,
  InfoCircledIcon,
  Share1Icon,
  TextAlignLeftIcon,
} from '@radix-ui/react-icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ISidebarLink {
  href: string;
}

const SidebarLink: React.FC<ISidebarLink> = ({ href }) => {
  const pathname = usePathname();

  const menuName = () => {
    if (href === '/') return 'Home';
    return href.replace('/', '').charAt(0).toUpperCase() + href.substring(2);
  };

  const activePath = (href: string) => {
    return href.replace('/', '') === pathname.split('/')[1];
  };

  const iconMapper = () => {
    switch (href) {
      case '/':
        return (
          <HomeIcon
            className={cn('h-5 w-5 group-hover:text-primary', {
              'text-primary': activePath(href),
            })}
          />
        );

      case '/about':
        return (
          <InfoCircledIcon
            className={cn('h-5 w-5 group-hover:text-primary', {
              'text-primary': activePath(href),
            })}
          />
        );

      case '/portfolio':
        return (
          <Share1Icon
            className={cn('h-5 w-5 group-hover:text-primary', {
              'text-primary': activePath(href),
            })}
          />
        );

      case '/contact':
        return (
          <IdCardIcon
            className={cn('h-5 w-5 group-hover:text-primary', {
              'text-primary': activePath(href),
            })}
          />
        );

      case '/categories':
        return (
          <TextAlignLeftIcon
            className={cn('h-5 w-5 group-hover:text-primary', {
              'text-primary': activePath(href),
            })}
          />
        );

      case '/tags':
        return (
          <BookmarkIcon
            className={cn('h-5 w-5 group-hover:text-primary', {
              'text-primary': activePath(href),
            })}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Link
      href={href}
      className={cn(
        'group flex items-center space-x-4 hover:border-r-2 hover:border-primary transition-all ease-linear duration-500',
        {
          'border-r-2 border-primary': activePath(href),
        }
      )}
    >
      {iconMapper()}
      <span
        className={cn(
          'text-lg group-hover:text-primary group-hover:font-semibold',
          {
            'text-primary font-semibold': activePath(href),
          }
        )}
      >
        {menuName()}
      </span>
    </Link>
  );
};

export default SidebarLink;
