import RenderPortfolio from '@/components/portfolio/render-portfolio';
import { canonical, SITE_NAME } from '@/lib/seo';
import {
  Project,
  PROJECT_BY_SLUG_QUERY,
  sanityFetch,
} from '@/sanity/lib/queries';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FC } from 'react';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const project = await sanityFetch<Project | null>(PROJECT_BY_SLUG_QUERY, {
    slug,
  });
  if (!project) return { title: 'Project not found' };
  const url = canonical(`/portfolio/${slug}`);
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      siteName: SITE_NAME,
      title: project.title,
      description: project.description,
    },
    twitter: { title: project.title, description: project.description },
  };
}

const ProjectDetailsPage: FC<Props> = async (props) => {
  const params = await props.params;

  const { slug } = params;

  const project = await sanityFetch<Project | null>(PROJECT_BY_SLUG_QUERY, {
    slug,
  });

  if (!project) notFound();

  return (
    <RenderPortfolio project={project} url={canonical(`/portfolio/${slug}`)} />
  );
};

export default ProjectDetailsPage;
