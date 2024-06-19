import { getPortfolioBySlug } from '@/actions/portfolio';
import { FC } from 'react';

import RenderPortfolio from '@/components/portfolio/render-portfolio';

type Props = {
  params: {
    slug: string;
  };
};

const ProjectDetailsPage: FC<Props> = async ({ params: { slug } }) => {
  const { data: project } = await getPortfolioBySlug(slug);

  return <RenderPortfolio project={project} />;
};

export default ProjectDetailsPage;
