'use client';

import { ThemeToggler } from '@/components/ThemeToggler';
import { cn } from '@/lib/utils';
import { UserButton, useUser } from '@clerk/nextjs';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { DashboardIcon } from '@radix-ui/react-icons';
import {
  BookIcon,
  BookTextIcon,
  Inbox,
  PinIcon,
  ShareIcon,
  TagsIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
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
    name: 'Tag',
    href: '/dashboard/tag',
    icon: <TagsIcon className='h-5 w-5 cursor-pointer' />,
  },
];

const Sidebar = () => {
  const { user } = useUser();
  const pathname = usePathname();
  return (
    <div className='w-52 h-screen flex flex-col bg-muted sticky top-0'>
      <div className='bg-black/75 border-r border-border text-white/75 p-4 flex items-center space-x-4 h-16'>
        <UserButton />
        <span>{user?.fullName}</span>
      </div>
      <div className='py-4 flex-1 pr-1 flex flex-col justify-between'>
        <div className='space-y-4'>
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'py-1 px-4 transition-all ease-in duration-150 hover:border-r hover:text-primary border-primary cursor-pointer flex items-center space-x-4',
                pathname === item.href && 'border-r text-primary'
              )}
            >
              {item.icon}
              <span className='text-lg'>{item.name}</span>
            </Link>
          ))}
        </div>
        <div className='px-4'>
          <ThemeToggler />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
