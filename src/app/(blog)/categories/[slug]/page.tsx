import { FC } from 'react';

type Props = {
  params: {
    slug: string;
  };
};

const CategoryDetailPage: FC<Props> = async ({ params: { slug } }) => {
  return <div>{slug}</div>;
};

export default CategoryDetailPage;
