import BlogList from '@/components/blog/BlogList';
import {
  CategoryWithPosts,
  CATEGORY_BY_SLUG_QUERY,
  sanityFetch,
} from '@/sanity/lib/queries';
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
  const category = await sanityFetch<CategoryWithPosts | null>(
    CATEGORY_BY_SLUG_QUERY,
    { slug }
  );

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${category?.name} | Category`,
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

  if (!category) return;

  return (
    <div className='w-full flex flex-col space-y-6'>
      <h1 className='text-2xl md:text-3xl font-bold text-foreground leading-tight'>
        Posts in <span className='text-primary'>{category.name}</span>
      </h1>
      {category.posts.length ? (
        <BlogList blogs={category.posts} />
      ) : (
        <p className='text-foreground/75'>No posts in this category yet.</p>
      )}
    </div>
  );
};

export default CategoryDetailPage;
