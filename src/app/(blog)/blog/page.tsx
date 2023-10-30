import BlogList from '@/components/blog/BlogList';
import { groq } from 'next-sanity';
import { client } from '../../../../sanity/lib/client';

const query = groq`
  *[_type=='post'] {
    _id,
    slug,
    title,
    description,
    mainImage,
    _createdAt,
    author->,
    categories[]->
  } | order(_createdAt desc)
`;

const BlogPage = async () => {
  const posts = await client.fetch(query);

  return (
    <div>
      <BlogList posts={posts} />
    </div>
  );
};

export default BlogPage;
