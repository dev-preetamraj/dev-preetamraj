import { getTagBySlug } from '@/server-actions/tag';
import { Metadata, ResolvingMetadata } from 'next';

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
  const { data: tag } = await getTagBySlug(slug);

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${tag?.name} | Tag - Preetam Raj`,
    openGraph: {
      images: previousImages,
    },
  };
}

const TagBlogListPage = async ({ params: { slug } }: Props) => {
  const { data: tag } = await getTagBySlug(slug);
  return (
    <div>
      <p>{tag?.name}</p>
    </div>
  );
};

export default TagBlogListPage;
