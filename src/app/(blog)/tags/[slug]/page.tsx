import BlogList from '@/components/blog/BlogList';
import PageLayout from '@/components/layout/PageLayout';
import Text from '@/components/layout/Text';
import { topicLabel } from '@/lib/topics';
import {
  TagWithPosts,
  TAG_BY_SLUG_QUERY,
  sanityFetch,
} from '@/sanity/lib/queries';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

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

  if (!tag) return { title: 'Tag not found' };

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${tag.name} | Tag`,
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

  if (!tag) notFound();

  const count = tag.posts?.length ?? 0;

  return (
    <PageLayout
      variant='index'
      header={{
        eyebrow: 'Tag',
        title: topicLabel({ name: tag.name, kind: 'tag' }),
        meta: `${count} ${count === 1 ? 'post' : 'posts'}`,
        lead: `Every post that touches ${tag.name}, newest first.`,
      }}
    >
      {count ? (
        <BlogList blogs={tag.posts} />
      ) : (
        <Text>No posts with this tag yet.</Text>
      )}
    </PageLayout>
  );
};

export default TagBlogListPage;
