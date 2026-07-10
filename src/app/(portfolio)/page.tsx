import BlogList from '@/components/blog/BlogList';
import { rankPosts } from '@/lib/ranking';
import { POSTS_QUERY, PostListItem, sanityFetch } from '@/sanity/lib/queries';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Preetam Raj',
  description:
    'A fullstack web/app developer passionate about creating robust application that can handle every user.',
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
