import { getBlogById } from '@/actions/blog';
import Rightbar from '@/components/global/Rightbar';
import ExitPreviewButton from './exit-preview-button';
import RenderBlogPreview from './render-blog-preview';

type Props = {
  _id: string;
};

const PreviewBlog = async ({ _id }: Props) => {
  const { data: blog } = await getBlogById(_id);
  if (!blog) return null;

  return (
    <div className=''>
      <div className='h-14 lg:h-[60px] bg-muted/40 border-b border-border flex items-center sticky top-0 z-50 px-12 backdrop-blur-md'>
        <ExitPreviewButton />
      </div>
      <div className='flex space-x-4'>
        <div className='flex-1 py-4 px-32'>
          <RenderBlogPreview blog={blog} />
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
