import { fetchCategoryBySlug } from '@/actions/categories';
import { Metadata, ResolvingMetadata } from 'next';
import { FC } from 'react';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug;
  const category = await fetchCategoryBySlug(slug);

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${category?.name} | Category - Preetam Raj`,
    openGraph: {
      images: previousImages,
    },
  };
}

const CategoryDetailPage: FC<Props> = async (props) => {
  const params = await props.params;
  const { slug } = params;

  const category = await fetchCategoryBySlug(slug);
  return <div>{category?.name}</div>;
};

export default CategoryDetailPage;
