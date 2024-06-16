import { fetchProjects } from '@/actions/portfolio';
import PortfolioCard from '@/components/PortfolioCard';
import CreatePortfolioDialog from '@/components/portfolio/create-portfolio-dialog';
import { currentUser } from '@clerk/nextjs/server';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio - Preetam Raj',
  description: 'A fullstack web developer',
};

const PortfolioPage = async () => {
  const { data: projects } = await fetchProjects();
  const user = await currentUser();
  const role = user?.privateMetadata.role;
  return (
    <div className='space-y-4'>
      <div className='border-b border-border pb-2 my-4 flex items-center justify-between'>
        <h1 className='text-2xl'>Recent Projects</h1>
        {role === 'admin' && <CreatePortfolioDialog />}
      </div>
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
