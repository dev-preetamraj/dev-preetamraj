import { IBlog } from '@/models/blog';
import { FC } from 'react';
import BlogCard from './BlogCard';

type Props = {
  blogs: Partial<IBlog>[] | null;
};

const BlogList: FC<Props> = ({ blogs }) => {
  return (
    <div className='space-y-4'>
      {blogs && blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
    </div>
  );
};

export default BlogList;
