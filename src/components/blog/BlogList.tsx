import { FC } from 'react';
import type { BlogsQueryResult } from '../../../sanity.types';
import BlogCard from './BlogCard';

type Props = {
  blogs: BlogsQueryResult | null;
};

const BlogList: FC<Props> = ({ blogs }) => {
  return (
    <div className='space-y-4'>
      {blogs && blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
    </div>
  );
};

export default BlogList;
