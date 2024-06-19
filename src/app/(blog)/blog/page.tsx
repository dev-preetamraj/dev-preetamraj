import { fetchBlogs } from '@/actions/blog';
import BlogList from '@/components/blog/BlogList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Preetam Raj',
  description: 'A fullstack web developer',
};

const BlogPage = async () => {
  const blogs = await fetchBlogs();

  return <BlogList blogs={blogs.data} />;
};

export default BlogPage;
