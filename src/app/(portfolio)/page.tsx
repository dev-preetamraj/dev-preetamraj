import BlogList from '@/components/blog/BlogList';
import { rankPosts } from '@/lib/ranking';
import { POSTS_QUERY, PostListItem, sanityFetch } from '@/sanity/lib/queries';

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
  const blogs = await sanityFetch<PostListItem[]>(POSTS_QUERY);
  const rankedBlogs = rankPosts(blogs, Date.now());

  return (
    <div className='space-y-2'>
      <BlogList blogs={rankedBlogs} />
    </div>
  );
};

export default HomePage;
