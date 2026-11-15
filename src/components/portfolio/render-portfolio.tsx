import Prose from '@/components/layout/article/Prose';
import { MetaLink, PublishedDate } from '@/components/layout/Meta';
import PageLayout from '@/components/layout/PageLayout';
import { BreadcrumbTitle } from '@/components/layout/SiteShell';
import { buildToc } from '@/lib/toc';
import { urlFor } from '@/sanity/lib/image';
import { Project } from '@/sanity/lib/queries';
import { GithubIcon, LinkIcon } from 'lucide-react';

type Props = {
  project: Project;
  /** Canonical URL (copy-link button). */
  url: string;
};

/** A project on the `article` PageLayout. */
const RenderPortfolio = ({ project, url }: Props) => {
  const cover = project.featuredImage?.asset
    ? urlFor(project.featuredImage).width(1280).url()
    : undefined;
  const content = project.content ?? [];

  const meta = (
    <>
      <PublishedDate item={project} />
      {project.githubUrl && (
        <MetaLink href={project.githubUrl} icon={GithubIcon}>
          GitHub
        </MetaLink>
      )}
      {project.frontendGithubUrl && (
        <MetaLink href={project.frontendGithubUrl} icon={GithubIcon}>
          Frontend
        </MetaLink>
      )}
      {project.liveUrl && (
        <MetaLink href={project.liveUrl} icon={LinkIcon}>
          Live
        </MetaLink>
      )}
    </>
  );

  // Project tags have no listing page, so topics stay passive labels.
  const topics = {
    category: project.category,
    tags: project.tags,
    linked: false,
  };

  return (
    <PageLayout
      variant='article'
      header={{
        eyebrow: project.category?.name ?? 'Portfolio',
        title: project.title,
        meta,
        lead: project.description,
      }}
      cover={cover}
      toc={buildToc(content)}
      aside={{ meta, topics, url }}
    >
      <BreadcrumbTitle title={project.title} />
      <Prose value={content} />
    </PageLayout>
  );
};

export default RenderPortfolio;
