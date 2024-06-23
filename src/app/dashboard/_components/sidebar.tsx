'use client';

import { ThemeToggler } from '@/components/ThemeToggler';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { DashboardIcon } from '@radix-ui/react-icons';
import {
  Bell,
  BookIcon,
  BookTextIcon,
  Home,
  Inbox,
  Package2,
  PinIcon,
  ShareIcon,
  TagsIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const menuItems = [
  {
    id: 1,
    name: 'Dashboard',
    href: '/dashboard',
    icon: <DashboardIcon className='h-5 w-5 cursor-pointer' />,
  },
  {
    id: 2,
    name: 'Blog',
    href: '/dashboard/blog',
    icon: <BookIcon className='h-5 w-5 cursor-pointer' />,
  },
  {
    id: 3,
    name: 'Comment',
    href: '/dashboard/comment',
    icon: <Inbox className='h-5 w-5 cursor-pointer' />,
  },
  {
    id: 4,
    name: 'Project',
    href: '/dashboard/project',
    icon: <ShareIcon className='h-5 w-5 cursor-pointer' />,
  },

  {
    id: 5,
    name: 'Course',
    href: '/dashboard/course',
    icon: <BookTextIcon className='h-5 w-5 cursor-pointer' />,
  },
  {
    id: 6,
    name: 'Media',
    href: '/dashboard/media',
    icon: <PhotoIcon className='h-5 w-5 cursor-pointer' />,
  },
  {
    id: 7,
    name: 'Category',
    href: '/dashboard/category',
    icon: <PinIcon className='h-5 w-5 cursor-pointer' />,
  },
  {
    id: 8,
    name: 'Tags',
    href: '/dashboard/tags',
    icon: <TagsIcon className='h-5 w-5 cursor-pointer' />,
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className='hidden border-r border-border bg-muted/40 md:block'>
      <div className='flex h-full max-h-screen flex-col gap-2'>
        <div className='flex h-14 items-center border-b border-border px-4 lg:h-[60px] lg:px-6'>
          <Link href='/' className='flex items-center gap-2 font-semibold'>
            <Package2 className='h-6 w-6' />
            <span className=''>Acme Inc</span>
          </Link>
          <Button variant='outline' size='icon' className='ml-auto h-8 w-8'>
            <Bell className='h-4 w-4' />
            <span className='sr-only'>Toggle notifications</span>
          </Button>
        </div>
        <div className='flex-1'>
          <nav className='grid items-start px-2 text-sm font-medium lg:px-4 gap-2'>
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted',
                  pathname === item.href && 'bg-muted text-primary'
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className='mt-auto p-4 lg:px-6 flex items-center gap-4'>
          <Link href='/'>
            <Home className='h-6 w-6 cursor-pointer' />
          </Link>
          <ThemeToggler />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
