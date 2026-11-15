import JsonLd from '@/components/global/json-ld';
import SectionHeading from '@/components/global/SectionHeading';
import { FEED_ALTERNATES } from '@/lib/feed';
import { personLd, websiteLd } from '@/lib/seo';
import FeaturedPostCard from '@/components/home/FeaturedPostCard';
import LatestPostsList from '@/components/home/LatestPostsList';
import { rankCategories, rankPosts, trendingWindowSince } from '@/lib/ranking';
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
    ...FEED_ALTERNATES,
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

  const allPostsLink = (
    <Link
      href='/blog'
      className='group inline-flex shrink-0 items-center gap-1 text-small text-primary hover:underline underline-offset-4'
    >
      All posts
      <ArrowRight className='h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5' />
    </Link>
  );

  return (
    <>
      <JsonLd data={[personLd, websiteLd]} />
      {/* Hero is the single focal point; everything below is quieter and
          separated by whitespace rather than rules or boxes. */}
      <div className='flex flex-col space-y-section'>
        <section className='flex max-w-2xl flex-col space-y-4'>
          <h1 className='text-h1 text-foreground'>
            Notes on backend systems, APIs, and building things that hold up.
          </h1>
          <p className='text-lead text-muted-foreground'>
            Backend, data pipelines, cloud and a bit of AI - from real projects.
          </p>
        </section>

        {ranked.length === 0 ? (
          <p className='text-body text-muted-foreground'>
            No posts yet - check back soon.
          </p>
        ) : (
          <>
            {featured && <FeaturedPostCard blog={featured} />}

            {latest.length > 0 && (
              <section className='flex flex-col space-y-6'>
                <SectionHeading title='Latest' action={allPostsLink} />
                <LatestPostsList blogs={latest} />
              </section>
            )}

            {categories.length > 0 && (
              <section className='flex flex-col space-y-5'>
                <SectionHeading title='Topics' />
                <ul className='flex flex-wrap gap-2'>
                  {categories.map((category) => (
                    <li key={category._id}>
                      <Link
                        href={`/categories/${category.slug}`}
                        className='inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-small text-muted-foreground transition-colors hover:border-input hover:text-foreground'
                      >
                        {category.name}
                        <span className='font-mono text-micro'>
                          {category.postCount}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default HomePage;
