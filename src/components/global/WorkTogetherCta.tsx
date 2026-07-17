'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const WorkTogetherCta = () => {
  const pathname = usePathname();
  if (pathname === '/about') return null;

  return (
    <div className='rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5'>
      <h3 className='font-semibold text-foreground'>Let&apos;s work together</h3>
      <p className='mt-1 text-sm text-muted-foreground'>
        Got something in mind? I&apos;m always up for a good problem.
      </p>
      <Link
        href='/contact'
        className={cn(buttonVariants({ size: 'sm' }), 'mt-4 w-full gap-1.5')}
      >
        Get in touch
        <ArrowRight className='h-4 w-4' />
      </Link>
    </div>
  );
};

export default WorkTogetherCta;
