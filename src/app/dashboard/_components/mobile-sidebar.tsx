'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { menuItems } from './sidebar';
const MobileSidebar = () => {
  const pathname = usePathname();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='outline' size='icon' className='shrink-0 md:hidden'>
          <Menu className='h-5 w-5' />
          <span className='sr-only'>Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='flex flex-col border-border'>
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
        <div className='mt-auto'></div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
