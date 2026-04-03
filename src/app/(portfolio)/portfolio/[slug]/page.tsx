import { getPortfolioBySlug } from '@/actions/portfolio';
import { FC } from 'react';

import RenderPortfolio from '@/components/portfolio/render-portfolio';
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
  const project = await getPortfolioBySlug(slug);

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${project?.title} - Preetam Raj`,
    openGraph: {
      images: previousImages,
    },
  };
}

const ProjectDetailsPage: FC<Props> = async (props) => {
  const params = await props.params;
  const { slug } = params;

  const project = await getPortfolioBySlug(slug);

  if (!project) return null;

  return <RenderPortfolio project={project} />;
};

export default ProjectDetailsPage;
