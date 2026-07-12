import FeaturedProjectCard from '@/components/portfolio/FeaturedProjectCard';
import ProjectCard from '@/components/portfolio/ProjectCard';
import {
  PROJECTS_QUERY,
  ProjectListItem,
  sanityFetch,
} from '@/sanity/lib/queries';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    'Selected projects by Preetam Raj - backend systems, full-stack apps, and the things I have shipped end to end.',
};

const PortfolioPage = async () => {
  const projects = await sanityFetch<ProjectListItem[]>(PROJECTS_QUERY);
  const featured = projects?.filter((p) => p.featured) ?? [];
  const rest = projects?.filter((p) => !p.featured) ?? [];

  return (
    <div className='flex flex-col space-y-12'>
      <section className='flex flex-col space-y-5'>
        <p className='text-primary text-sm font-medium uppercase tracking-wide'>
          Portfolio
        </p>
        <h1 className='text-2xl md:text-3xl font-bold text-foreground leading-tight'>
          Things I&apos;ve designed, built, and shipped.
        </h1>
        <p className='text-muted-foreground max-w-2xl'>
          A selection of work - from backend systems and APIs to full-stack apps
          I took from first commit to production.
        </p>
      </section>

      {featured.length > 0 && (
        <section className='flex flex-col gap-5'>
          {featured.map((project) => (
            <FeaturedProjectCard key={project._id} project={project} />
          ))}
        </section>
      )}

      {rest.length > 0 && (
        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
          {rest.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}

      {projects && projects.length === 0 && (
        <p className='text-muted-foreground'>
          No projects here yet - check back soon.
        </p>
      )}
    </div>
  );
};

export default PortfolioPage;
