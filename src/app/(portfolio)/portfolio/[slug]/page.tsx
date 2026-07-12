import RenderPortfolio from '@/components/portfolio/render-portfolio';
import {
  Project,
  PROJECT_BY_SLUG_QUERY,
  sanityFetch,
} from '@/sanity/lib/queries';
import { Metadata, ResolvingMetadata } from 'next';
import { FC } from 'react';

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
  const project = await sanityFetch<Project | null>(PROJECT_BY_SLUG_QUERY, {
    slug,
  });

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: project?.title,
    openGraph: {
      images: previousImages,
    },
  };
}

const ProjectDetailsPage: FC<Props> = async (props) => {
  const params = await props.params;

  const { slug } = params;

  const project = await sanityFetch<Project | null>(PROJECT_BY_SLUG_QUERY, {
    slug,
  });

  return <RenderPortfolio project={project} />;
};

export default ProjectDetailsPage;
