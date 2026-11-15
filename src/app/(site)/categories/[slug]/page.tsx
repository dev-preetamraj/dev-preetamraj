import TopicPostsPage from '@/components/blog/TopicPostsPage';
import {
  CategoryWithPosts,
  CATEGORY_BY_SLUG_QUERY,
  sanityFetch,
} from '@/sanity/lib/queries';
import { canonical, SITE_NAME } from '@/lib/seo';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FC } from 'react';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const category = await sanityFetch<CategoryWithPosts | null>(
    CATEGORY_BY_SLUG_QUERY,
    { slug }
  );
  if (!category) return { title: 'Category not found' };
  const title = `${category.name} | Category`;
  const url = canonical(`/categories/${slug}`);
  return {
    title,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, siteName: SITE_NAME, title },
    twitter: { title },
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

  return (
    <TopicPostsPage
      eyebrow='Category'
      name={category.name}
      title={category.name}
      lead={
        category.description ||
        `Every post filed under ${category.name}, newest first.`
      }
      posts={category.posts}
      empty='No posts in this category yet.'
    />
  );
};

export default CategoryDetailPage;
