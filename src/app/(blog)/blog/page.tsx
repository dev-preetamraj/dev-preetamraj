import BlogListInfinite from '@/components/blog/BlogListInfinite';
import SortToggle, { SortKey } from '@/components/blog/SortToggle';
import { rankPosts } from '@/lib/ranking';
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

// Wall-clock read lives outside the component so render stays pure; ranking takes it as `nowMs`.
const currentTimeMs = () => Date.now();

const BlogPage = async ({ searchParams }: Props) => {
  const { sort } = await searchParams;
  const active: SortKey = sort === 'top' ? 'top' : 'latest';

  const posts = await sanityFetch<PostListItem[]>(POSTS_QUERY);

  const blogs =
    active === 'top'
      ? rankPosts(posts, currentTimeMs())
      : [...posts].sort(byLatest);

  return (
    <div className='flex w-full flex-col space-y-8'>
      <section className='flex flex-col space-y-5'>
        <p className='text-eyebrow text-muted-foreground'>The Blog</p>
        <h1 className='text-h1 text-foreground'>Every post, in one place.</h1>
        <p className='max-w-2xl text-lead text-muted-foreground'>
          Notes on backend systems, APIs, and building things that hold up. Sort
          by the newest writing or by what is ranking highest right now.
        </p>
      </section>

      <div className='flex flex-wrap items-center justify-between gap-3'>
        <SortToggle active={active} />
        <span className='text-small text-muted-foreground'>
          {blogs.length} {blogs.length === 1 ? 'post' : 'posts'}
        </span>
      </div>

      {blogs.length ? (
        <BlogListInfinite key={active} blogs={blogs} />
      ) : (
        <p className='text-body text-muted-foreground'>
          No posts yet - check back soon.
        </p>
      )}
    </div>
  );
};

export default BlogPage;
