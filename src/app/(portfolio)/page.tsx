import { fetchBlogs } from '@/actions/blog';
import BlogList from '@/components/blog/BlogList';

const HomePage = async () => {
  const blogs = await fetchBlogs();

  return (
    <div className='space-y-2'>
      <BlogList blogs={blogs.data} />
    </div>
  );
};

export default HomePage;
