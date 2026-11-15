import JsonLd from '@/components/global/json-ld';
import Chip from '@/components/layout/Chip';
import PageLayout from '@/components/layout/PageLayout';
import Section, { SectionLink } from '@/components/layout/Section';
import { Cluster } from '@/components/layout/Stack';
import Text from '@/components/layout/Text';
import { FEED_ALTERNATES } from '@/lib/feed';
import { canonical, personLd, SITE_URL, websiteLd } from '@/lib/seo';
import { currentTimeMs } from '@/lib/utils';
import BlogList from '@/components/blog/BlogList';
import FeaturedPostCard from '@/components/home/FeaturedPostCard';
import { rankCategories, rankPosts, trendingWindowSince } from '@/lib/ranking';
import {
  CategoryStat,
  POSTS_QUERY,
  PostListItem,
  sanityFetch,
  TRENDING_CATEGORY_STATS_QUERY,
} from '@/sanity/lib/queries';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Preetam Raj' },
  description:
    'Preetam Raj, a backend-focused fullstack developer - articles on backend systems, APIs, scalable architecture, and building applications that hold up in production.',
  openGraph: {
    images: [canonical('/preview.png')],
  },
  alternates: {
    canonical: SITE_URL,
    ...FEED_ALTERNATES,
  },
};

const HomePage = async () => {
  const now = currentTimeMs();
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

  return (
    <>
      <JsonLd data={[personLd, websiteLd]} />
      <PageLayout
        variant='index'
        header={{
          eyebrow: 'Preetam Raj - Fullstack engineer',
          title:
            'Notes on backend systems, APIs, and building things that hold up.',
          lead: 'Backend, data pipelines, cloud and a bit of AI - from real projects.',
        }}
      >
        {ranked.length === 0 ? (
          <Text>No posts yet - check back soon.</Text>
        ) : (
          <>
            <FeaturedPostCard blog={featured} />

            {latest.length > 0 && (
              <Section
                title='Latest'
                action={<SectionLink href='/blog'>All posts</SectionLink>}
              >
                <BlogList blogs={latest} titleAs='h3' />
              </Section>
            )}

            {categories.length > 0 && (
              <Section title='Topics'>
                <Cluster as='ul'>
                  {categories.map((category) => (
                    <li key={category._id}>
                      <Chip
                        variant='nav'
                        href={`/categories/${category.slug}`}
                        count={category.postCount}
                      >
                        {category.name}
                      </Chip>
                    </li>
                  ))}
                </Cluster>
              </Section>
            )}
          </>
        )}
      </PageLayout>
    </>
  );
};

export default HomePage;
