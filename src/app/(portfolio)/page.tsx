import BlogList from '@/components/blog/BlogList';
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

  return (
    <div className='space-y-2'>
      <BlogList blogs={blogs} />
    </div>
  );
};

export default HomePage;
