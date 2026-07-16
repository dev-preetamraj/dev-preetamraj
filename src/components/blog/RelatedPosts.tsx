import SectionHeading from '@/components/global/SectionHeading';
import PostGridCard from '@/components/home/PostGridCard';
import { PostListItem } from '@/sanity/lib/queries';
import { FC } from 'react';

type Props = {
  posts: PostListItem[];
};

const RelatedPosts: FC<Props> = ({ posts }) => {
  if (!posts.length) return null;

  return (
    <section className='space-y-6'>
      <SectionHeading index='01' title='Keep reading' />
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        {posts.map((post) => (
          <PostGridCard key={post._id} blog={post} />
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;
