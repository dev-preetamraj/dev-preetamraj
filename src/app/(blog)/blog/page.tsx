import { fetchBlogs } from '@/actions/blog';
import BlogList from '@/components/blog/BlogList';
import CreateBlogDialog from '@/components/blog/create-blog-dialog';
import { currentUser } from '@clerk/nextjs/server';

const BlogPage = async () => {
  const user = await currentUser();
  const role = user?.privateMetadata.role;
  const blogs = await fetchBlogs();

  return (
    <div className='w-full flex flex-col space-y-4'>
      <div className='border-b border-border pb-2 my-4 flex items-center justify-between'>
        <h1 className='text-2xl'>Recent Blogs</h1>
        {role === 'admin' && <CreateBlogDialog />}
      </div>
      <BlogList blogs={blogs.data} />
    </div>
  );
};

export default BlogPage;
