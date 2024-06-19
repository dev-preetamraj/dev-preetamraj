import { getBlogById } from '@/actions/blog';
import Rightbar from '@/components/Rightbar';
import RenderBlog from '@/components/blog/render-blog';
import ExitPreviewButton from './exit-preview-button';

type Props = {
  _id: string;
};

const PreviewBlog = async ({ _id }: Props) => {
  const { data: blog } = await getBlogById(_id);
  if (!blog) return null;

  return (
    <div className=''>
      <div className='h-16 bg-muted flex items-center sticky top-0 z-50 px-12'>
        <ExitPreviewButton />
      </div>
      <div className='flex space-x-4'>
        <div className='flex-1 py-4 px-32'>
          <RenderBlog blog={blog} />
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

export default PreviewBlog;
