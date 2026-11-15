import BlogListInfinite from '@/components/blog/BlogListInfinite';
import SortToggle, { SortKey } from '@/components/blog/SortToggle';
import PageLayout from '@/components/layout/PageLayout';
import Text from '@/components/layout/Text';
import { rankPosts } from '@/lib/ranking';
import { currentTimeMs, plural } from '@/lib/utils';
import { POSTS_QUERY, PostListItem, sanityFetch } from '@/sanity/lib/queries';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'A fullstack web developer',
};

type Props = {
  searchParams: Promise<{ sort?: string }>;
};

const byLatest = (a: PostListItem, b: PostListItem) =>
  Date.parse(b.publishedAt ?? b._createdAt) -
  Date.parse(a.publishedAt ?? a._createdAt);

const BlogPage = async ({ searchParams }: Props) => {
  const { sort } = await searchParams;
  const active: SortKey = sort === 'top' ? 'top' : 'latest';

  const posts = await sanityFetch<PostListItem[]>(POSTS_QUERY);

  const blogs =
    active === 'top'
      ? rankPosts(posts, currentTimeMs())
      : [...posts].sort(byLatest);

  return (
    <PageLayout
      variant='index'
      header={{
        eyebrow: 'The Blog',
        title: 'Every post, in one place.',
        meta: plural(blogs.length, 'post'),
        lead: 'Notes on backend systems, APIs, and building things that hold up. Sort by the newest writing or by what is ranking highest right now.',
        children: <SortToggle active={active} />,
      }}
    >
      {blogs.length ? (
        <BlogListInfinite key={active} blogs={blogs} />
      ) : (
        <Text>No posts yet - check back soon.</Text>
      )}
    </PageLayout>
  );
};

export default BlogPage;
