import { Button } from '@/components/ui/button';
import { SITE_NAME } from '@/lib/seo';
import { Home } from 'lucide-react';
import Link from 'next/link';

const NotFound = () => (
  <div className='flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center'>
    <Link
      href='/'
      className='mb-12 font-mono text-small text-muted-foreground transition-colors hover:text-primary'
    >
      {SITE_NAME.toLowerCase().replace(' ', '')}.dev
    </Link>

    <div className='flex flex-col items-center gap-4 sm:flex-row sm:gap-6'>
      <span className='text-display text-foreground'>404</span>
      <span className='h-px w-16 bg-border sm:h-16 sm:w-px' />
      <div className='max-w-xs space-y-1 text-center sm:text-left'>
        <h1 className='text-h4 text-foreground'>Lost in space</h1>
        <p className='text-small text-muted-foreground'>
          This route doesn&apos;t exist. Check the URL or head back home.
        </p>
      </div>
    </div>

    <Button asChild className='mt-12'>
      <Link href='/'>
        <Home className='mr-2 h-4 w-4' />
        Take me home
      </Link>
    </Button>

    <span
      aria-hidden
      className='pointer-events-none mt-16 select-none font-mono text-caption text-muted-foreground'
    >
      HTTP 404 - not found
    </span>
  </div>
);

export default NotFound;
