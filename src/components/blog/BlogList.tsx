import { FC } from 'react';
import BlogCard from './BlogCard';

type Props = {
  posts: Post[];
};

const BlogList: FC<Props> = ({ posts }) => {
  return (
    <div className='space-y-4'>
      {posts.map((post) => (
        <BlogCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default BlogList;
