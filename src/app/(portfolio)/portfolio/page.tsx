import { fetchProjects } from '@/actions/portfolio';
import PortfolioCard from '@/components/PortfolioCard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio - Preetam Raj',
  description: 'A fullstack web developer',
};

const PortfolioPage = async () => {
  const { data: projects } = await fetchProjects();
  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        {projects &&
          projects.map((project) => (
            <PortfolioCard
              key={project._id}
              title={project.title!}
              imgUrl={project.featuredImage!}
              slug={project.slug!}
            />
          ))}
      </div>
    </div>
  );
};

export default PortfolioPage;
