import { FC } from 'react';
import BlogCard from './BlogCard';

type Props = {
  posts: Post[];
};

const BlogList: FC<Props> = ({ posts }) => {
  return (
    <div className=''>
      {posts.map((post) => (
        <BlogCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default BlogList;
