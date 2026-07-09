import BlogList from '@/components/blog/BlogList';
import { POSTS_QUERY, PostListItem, sanityFetch } from '@/sanity/lib/queries';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Preetam Raj',
  description: 'A fullstack web developer',
};

const BlogPage = async () => {
  const blogs = await sanityFetch<PostListItem[]>(POSTS_QUERY);

  return <BlogList blogs={blogs} />;
};

export default BlogPage;
