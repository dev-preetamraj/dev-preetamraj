import { slugToTitle } from '@/lib/utils';
import { FC } from 'react';

type Props = {
  params: {
    projectTitle: string;
  };
};

const ProjectDetailsPage: FC<Props> = ({ params }) => {
  return (
    <div>
      <h1 className='text-2xl text-foreground'>
        {slugToTitle(params.projectTitle)}
      </h1>
    </div>
  );
};

export default ProjectDetailsPage;
