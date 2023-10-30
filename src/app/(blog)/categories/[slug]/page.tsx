import { groq } from 'next-sanity';
import { FC } from 'react';
import { client } from '../../../../../sanity/lib/client';

type Props = {
  params: {
    slug: string;
  };
};

const query = groq`
    *[_type=='category' && slug.current==$slug][0] {
      _id,
      title
    }
  `;

const CategoryDetailPage: FC<Props> = async ({ params: { slug } }) => {
  const category: Category = await client.fetch(query, { slug });
  return <div>{category.title}</div>;
};

export default CategoryDetailPage;
