import BlogList from '@/components/blog/BlogList';
import { TagWithPosts, TAG_BY_SLUG_QUERY, sanityFetch } from '@/sanity/lib/queries';
import { Metadata, ResolvingMetadata } from 'next';

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
  const tag = await sanityFetch<TagWithPosts | null>(TAG_BY_SLUG_QUERY, {
    slug,
  });

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${tag?.name} | Tag`,
    openGraph: {
      images: previousImages,
    },
  };
}

const TagBlogListPage = async (props: Props) => {
  const params = await props.params;

  const { slug } = params;

  const tag = await sanityFetch<TagWithPosts | null>(TAG_BY_SLUG_QUERY, {
    slug,
  });

  if (!tag) return;

  return (
    <div className='w-full flex flex-col space-y-6'>
      <h1 className='text-2xl'>
        Posts tagged <span className='text-primary'>#{tag.name}</span>
      </h1>
      {tag.posts.length ? (
        <BlogList blogs={tag.posts} />
      ) : (
        <p className='text-foreground/75'>No posts with this tag yet.</p>
      )}
    </div>
  );
};

export default TagBlogListPage;
