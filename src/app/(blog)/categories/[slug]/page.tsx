import { fetchCategoryBySlug } from '@/actions/categories';
import { Metadata, ResolvingMetadata } from 'next';
import { FC } from 'react';

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const { data: category } = await fetchCategoryBySlug(slug);

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${category?.name} | Category - Preetam Raj`,
    openGraph: {
      images: previousImages,
    },
  };
}

const CategoryDetailPage: FC<Props> = async ({ params: { slug } }) => {
  const { data: category } = await fetchCategoryBySlug(slug);
  return <div>{category?.name}</div>;
};

export default CategoryDetailPage;
