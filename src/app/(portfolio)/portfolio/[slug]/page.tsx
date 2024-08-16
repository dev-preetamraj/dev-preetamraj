import { getPortfolioBySlug } from '@/actions/portfolio';
import { FC } from 'react';

import RenderPortfolio from '@/components/portfolio/render-portfolio';
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
  const { data: project } = await getPortfolioBySlug(slug);

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${project?.title} - Preetam Raj`,
    openGraph: {
      images: previousImages,
    },
  };
}

const ProjectDetailsPage: FC<Props> = async ({ params: { slug } }) => {
  const { data: project } = await getPortfolioBySlug(slug);

  return <RenderPortfolio project={project} />;
};

export default ProjectDetailsPage;
