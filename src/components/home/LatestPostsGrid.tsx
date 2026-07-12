import { PostListItem } from '@/sanity/lib/queries';
import { FC } from 'react';
import PostGridCard from './PostGridCard';

type Props = {
  blogs: PostListItem[];
};

const LatestPostsGrid: FC<Props> = ({ blogs }) => (
  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
    {blogs.map((blog) => (
      <PostGridCard key={blog._id} blog={blog} />
    ))}
  </div>
);

export default LatestPostsGrid;
