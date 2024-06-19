import { getPortfolioById } from '@/actions/portfolio';
import Rightbar from '@/components/Rightbar';
import RenderPortfolio from '@/components/portfolio/render-portfolio';
import ExitPreviewButton from './exit-preview-button';

type Props = {
  _id: string;
};

const PreviewProject = async ({ _id }: Props) => {
  const { data: project } = await getPortfolioById(_id);
  if (!project) return null;

  return (
    <div className=''>
      <div className='h-16 bg-muted flex items-center sticky top-0 z-50 px-12'>
        <ExitPreviewButton />
      </div>
      <div className='flex space-x-4'>
        <div className='flex-1 py-4 px-32'>
          <RenderPortfolio project={project} />
        </div>

        <div className='max-w-2xl pr-10 sticky top-40'>
          <div>
            <Rightbar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewProject;
