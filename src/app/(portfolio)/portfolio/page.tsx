import PortfolioCard from '@/components/PortfolioCard';
import { urlFor } from '@/sanity/lib/image';
import {
  PROJECTS_QUERY,
  ProjectListItem,
  sanityFetch,
} from '@/sanity/lib/queries';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio - Preetam Raj',
  description: 'A fullstack web developer',
};

const PortfolioPage = async () => {
  const projects = await sanityFetch<ProjectListItem[]>(PROJECTS_QUERY);
  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        {projects &&
          projects.map((project) => (
            <PortfolioCard
              key={project._id}
              title={project.title}
              imgUrl={urlFor(project.featuredImage).url()}
              slug={project.slug}
            />
          ))}
      </div>
    </div>
  );
};

export default PortfolioPage;
