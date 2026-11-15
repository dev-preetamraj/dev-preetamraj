import PageLayout from '@/components/layout/PageLayout';
import { Cluster } from '@/components/layout/Stack';
import { Button } from '@/components/ui/button';
import { BookOpen, Briefcase, Home } from 'lucide-react';
import Link from 'next/link';

/**
 * The one 404, shared by the root and blog not-found pages: the standard
 * page header on the `index` PageLayout, plus the three ways back.
 */
const NotFoundView = () => (
  <PageLayout
    variant='index'
    length='short'
    header={{
      eyebrow: '404 - Page not found',
      title: 'This page wandered off',
      lead: 'The link may be broken, or the page may have been moved or unpublished. Try one of these instead.',
      children: (
        <nav aria-label='Not found'>
          <Cluster>
            <Button asChild>
              <Link href='/'>
                <Home aria-hidden className='mr-2 h-4 w-4' />
                Home
              </Link>
            </Button>
            <Button asChild variant='outline'>
              <Link href='/blog'>
                <BookOpen aria-hidden className='mr-2 h-4 w-4' />
                Blog
              </Link>
            </Button>
            <Button asChild variant='outline'>
              <Link href='/portfolio'>
                <Briefcase aria-hidden className='mr-2 h-4 w-4' />
                Portfolio
              </Link>
            </Button>
          </Cluster>
        </nav>
      ),
    }}
  />
);

export default NotFoundView;
