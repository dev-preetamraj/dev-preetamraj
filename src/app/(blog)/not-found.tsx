import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Search } from 'lucide-react';
import Link from 'next/link';

const NotFound = () => (
  <div className='flex min-h-[70vh] flex-col items-center justify-center px-4 text-center'>
    <div className='relative flex items-center justify-center'>
      <span
        aria-hidden
        className='pointer-events-none select-none text-[8rem] font-black leading-none tracking-tighter text-primary/10 sm:text-[12rem]'
      >
        404
      </span>
      <span className='absolute font-mono text-sm text-primary'>
        page not found
      </span>
    </div>

    <div className='mt-6 max-w-md space-y-3'>
      <h1 className='text-2xl font-bold text-foreground sm:text-3xl'>
        This page wandered off
      </h1>
      <p className='text-muted-foreground'>
        The link may be broken, or the post may have been moved or unpublished.
        Let&apos;s get you back on track.
      </p>
    </div>

    <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
      <Button asChild>
        <Link href='/'>
          <Home className='mr-2 h-4 w-4' />
          Back home
        </Link>
      </Button>
      <Button asChild variant='outline'>
        <Link href='/blog'>
          <Search className='mr-2 h-4 w-4' />
          Browse the blog
        </Link>
      </Button>
    </div>

    <Link
      href='/'
      className='mt-8 inline-flex items-center gap-1 font-mono text-xs text-muted-foreground transition-colors hover:text-primary'
    >
      <ArrowLeft className='h-3 w-3' />
      cd ~
    </Link>
  </div>
);

export default NotFound;
