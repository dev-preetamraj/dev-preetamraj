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
    <div className='w-full flex flex-col space-y-stack'>
      <h1 className='text-h1 text-foreground'>
        Posts in {category.name}
      </h1>
      {category.posts.length ? (
        <BlogList blogs={category.posts} />
      ) : (
        <p className='text-body text-muted-foreground'>No posts in this category yet.</p>
      )}
    </div>
  );
};

export default CategoryDetailPage;
