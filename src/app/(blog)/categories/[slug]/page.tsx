import BlogList from '@/components/blog/BlogList';
import PageLayout from '@/components/layout/PageLayout';
import Text from '@/components/layout/Text';
import {
  CategoryWithPosts,
  CATEGORY_BY_SLUG_QUERY,
  sanityFetch,
} from '@/sanity/lib/queries';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
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
  const category = await sanityFetch<CategoryWithPosts | null>(
    CATEGORY_BY_SLUG_QUERY,
    { slug }
  );

  if (!category) return { title: 'Category not found' };

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${category.name} | Category`,
    openGraph: {
      images: previousImages,
    },
  };
}

const CategoryDetailPage: FC<Props> = async (props) => {
  const params = await props.params;

  const { slug } = params;

  const category = await sanityFetch<CategoryWithPosts | null>(
    CATEGORY_BY_SLUG_QUERY,
    { slug }
  );

  if (!category) notFound();

  const count = category.posts?.length ?? 0;

  return (
    <PageLayout
      variant='index'
      header={{
        eyebrow: 'Category',
        title: category.name,
        meta: `${count} ${count === 1 ? 'post' : 'posts'}`,
        lead:
          category.description ||
          `Every post filed under ${category.name}, newest first.`,
      }}
    >
      {count ? (
        <BlogList blogs={category.posts} />
      ) : (
        <Text>No posts in this category yet.</Text>
      )}
    </PageLayout>
  );
};

export default CategoryDetailPage;
