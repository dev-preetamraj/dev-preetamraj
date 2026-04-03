import { fetchTagBySlug } from '@/actions/tags';
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
  const tag = await fetchTagBySlug(slug);

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${tag?.name} | Tag - Preetam Raj`,
    openGraph: {
      images: previousImages,
    },
  };
}

const TagBlogListPage = async (props: Props) => {
  const params = await props.params;
  const { slug } = params;

  const tag = await fetchTagBySlug(slug);
  return (
    <div>
      <p>{tag?.name}</p>
    </div>
  );
};

export default TagBlogListPage;
