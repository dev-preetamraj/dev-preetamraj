import TopicPostsPage from '@/components/blog/TopicPostsPage';
import { canonical, SITE_NAME } from '@/lib/seo';
import { topicLabel } from '@/lib/topics';
import {
  TagWithPosts,
  TAG_BY_SLUG_QUERY,
  sanityFetch,
} from '@/sanity/lib/queries';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const tag = await sanityFetch<TagWithPosts | null>(TAG_BY_SLUG_QUERY, {
    slug,
  });
  if (!tag) return { title: 'Tag not found' };
  const title = `${tag.name} | Tag`;
  const url = canonical(`/tags/${slug}`);
  return {
    title,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, siteName: SITE_NAME, title },
    twitter: { title },
  };
}

const TagBlogListPage = async (props: Props) => {
  const params = await props.params;

  const { slug } = params;

  const tag = await sanityFetch<TagWithPosts | null>(TAG_BY_SLUG_QUERY, {
    slug,
  });

  if (!tag) notFound();

  return (
    <TopicPostsPage
      eyebrow='Tag'
      name={tag.name}
      title={topicLabel({ name: tag.name, kind: 'tag' })}
      lead={`Every post that touches ${tag.name}, newest first.`}
      posts={tag.posts}
      empty='No posts with this tag yet.'
    />
  );
};

export default TagBlogListPage;
