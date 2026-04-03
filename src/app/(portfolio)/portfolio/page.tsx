import { fetchProjects } from '@/actions/portfolio';
import PortfolioCard from '@/components/PortfolioCard';
import { urlFor } from '@/sanity/lib/image';
import { Metadata } from 'next';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1549558549-415fe4c37b60';

export const metadata: Metadata = {
  title: 'Portfolio - Preetam Raj',
  description: 'A fullstack web developer',
};

const PortfolioPage = async () => {
  const projects = await fetchProjects();
  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        {projects &&
          projects.map((project) => {
            const imageUrl = project.featuredImage?.asset
              ? urlFor(project.featuredImage).width(1080).height(1080).url()
              : FALLBACK_IMAGE;
            return (
              <PortfolioCard
                key={project._id}
                title={project.title || 'Untitled'}
                imgUrl={imageUrl}
                slug={project.slug?.current || ''}
              />
            );
          })}
      </div>
    </div>
  );
};

export default PortfolioPage;
