import BlogList from '@/components/blog/BlogList';
import { groq } from 'next-sanity';
import { client } from '../../../sanity/lib/client';

const query = groq`
  *[_type=='post'] {
    ...,
    author->,
    categories[]->
  } | order(_createdAt desc)
`;

const HomePage = async () => {
  const posts = await client.fetch(query);

  return (
    <div className='space-y-2'>
      <BlogList posts={posts} />
    </div>
  );
};

export default HomePage;
