import { ProjectListItem } from '@/sanity/lib/queries';
import { FC } from 'react';
import ProjectCard from './ProjectCard';

type Props = {
  project: ProjectListItem;
};

/** Featured project: the shared ProjectCard in its `featured` size. */
const FeaturedProjectCard: FC<Props> = ({ project }) => (
  <ProjectCard project={project} featured />
);

export default FeaturedProjectCard;
