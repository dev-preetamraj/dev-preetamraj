import JsonLd from '@/components/global/json-ld';
import SectionHeading from '@/components/global/SectionHeading';
import { personLd, websiteLd } from '@/lib/seo';
import CategoryCard from '@/components/home/CategoryCard';
import FeaturedPostCard from '@/components/home/FeaturedPostCard';
import LatestPostsGrid from '@/components/home/LatestPostsGrid';
import PopularPosts from '@/components/home/PopularPosts';
import { buttonVariants } from '@/components/ui/button';
import { rankCategories, rankPosts, trendingWindowSince } from '@/lib/ranking';
import { cn } from '@/lib/utils';
import {
  CategoryStat,
  POSTS_QUERY,
  PostListItem,
  sanityFetch,
  TRENDING_CATEGORY_STATS_QUERY,
} from '@/sanity/lib/queries';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Preetam Raj' },
  description:
    'Preetam Raj, a backend-focused fullstack developer - articles on backend systems, APIs, scalable architecture, and building applications that hold up in production.',
  openGraph: {
    images: ['https://preetamraj.dev/preview.png'],
  },
  alternates: {
    canonical: 'https://preetamraj.dev',
  },
};

const HomePage = async () => {
  const now = Date.now();
  const [posts, categoryStats] = await Promise.all([
    sanityFetch<PostListItem[]>(POSTS_QUERY),
    sanityFetch<CategoryStat[]>(TRENDING_CATEGORY_STATS_QUERY, {
      since: trendingWindowSince(now),
    }),
  ]);

  const ranked = rankPosts(posts, now);
  const featured = ranked[0];
  const latest = posts.filter((post) => post._id !== featured?._id).slice(0, 6);
  const categories = rankCategories(categoryStats, 6);
  const popular = [...posts]
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
    .filter((post) => post._id !== featured?._id)
    .slice(0, 5);

  return (
    <div className='flex flex-col space-y-12'>
      <JsonLd data={[personLd, websiteLd]} />
      <section className='flex flex-col space-y-5'>
        <p className='text-primary text-sm font-medium uppercase tracking-wide'>
          The Blog
        </p>
        <h1 className='text-2xl md:text-3xl font-bold text-foreground leading-tight'>
          Notes on backend systems, APIs, and building things that hold up.
        </h1>
        <p className='text-muted-foreground max-w-2xl'>
          I write about the stuff I run into building and running platforms end
          to end - backend architecture, data pipelines, cloud, and the odd bit
          of AI on top. No fluff, just what actually worked.
        </p>
      </section>

      {ranked.length === 0 ? (
        <p className='text-muted-foreground'>No posts yet - check back soon.</p>
      ) : (
        <>
          {featured && (
            <section className='flex flex-col space-y-5'>
              <SectionHeading index='01' title='Featured' />
              <FeaturedPostCard blog={featured} />
            </section>
          )}

          {latest.length > 0 && (
            <section className='flex flex-col space-y-5'>
              <SectionHeading index='02' title='Latest' />
              <LatestPostsGrid blogs={latest} />
              <div className='flex justify-start'>
                <Link
                  href='/blog'
                  className={cn(
                    buttonVariants({ variant: 'outline' }),
                    'space-x-2'
                  )}
                >
                  <span>Browse all posts</span>
                  <ArrowRight className='h-4 w-4' />
                </Link>
              </div>
            </section>
          )}

          {categories.length > 0 && (
            <section className='flex flex-col space-y-5'>
              <SectionHeading index='03' title='Browse by category' />
              <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
                {categories.map((category) => (
                  <CategoryCard key={category._id} category={category} />
                ))}
              </div>
            </section>
          )}

          {popular.length > 0 && (
            <section className='flex flex-col space-y-5'>
              <SectionHeading index='04' title='Popular' />
              <PopularPosts blogs={popular} />
            </section>
          )}

          <section className='flex flex-col items-start justify-between gap-5 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 sm:flex-row sm:items-center'>
            <div className='space-y-1.5'>
              <h2 className='text-xl font-bold text-foreground md:text-2xl'>
                Want the full archive?
              </h2>
              <p className='text-sm text-muted-foreground'>
                Every post, in one place.
              </p>
            </div>
            <Link href='/blog' className={cn(buttonVariants(), 'space-x-2')}>
              <span>Browse all posts</span>
              <ArrowRight className='h-4 w-4' />
            </Link>
          </section>
        </>
      )}
    </div>
  );
};

export default HomePage;
