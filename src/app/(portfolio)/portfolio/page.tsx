import PageLayout from '@/components/layout/PageLayout';
import { Grid } from '@/components/layout/Stack';
import Text from '@/components/layout/Text';
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
  const projects = (await sanityFetch<ProjectListItem[]>(PROJECTS_QUERY)) ?? [];
  // Featured projects first, each spanning the full grid row.
  const ordered = [
    ...projects.filter((p) => p.featured),
    ...projects.filter((p) => !p.featured),
  ];

  return (
    <PageLayout
      variant='index'
      rail={{ projects: false }}
      header={{
        eyebrow: 'Portfolio',
        title: 'Things I’ve designed, built, and shipped.',
        lead: 'A selection of work - from backend systems and APIs to full-stack apps I took from first commit to production.',
      }}
    >
      {ordered.length > 0 ? (
        <Grid cols='two'>
          {ordered.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              featured={project.featured}
            />
          ))}
        </Grid>
      ) : (
        <Text>No projects here yet - check back soon.</Text>
      )}
    </PageLayout>
  );
};

export default PortfolioPage;
