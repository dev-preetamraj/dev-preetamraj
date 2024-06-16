import { getBlogById } from '@/actions/blog';
import RenderMarkdown from '@/components/render-markdown';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { GithubIcon } from 'lucide-react';
import markdownit from 'markdown-it';
import Image from 'next/image';

type Props = {
  params: {
    blogId: string;
  };
};

const PreviewBlogPage = async ({ params: { blogId } }: Props) => {
  const { data: blog } = await getBlogById(blogId);
  const md = markdownit();
  return (
    <div className='space-y-10'>
      <div className='relative w-full h-60'>
        <Image
          alt={blog?.title ?? 'Featured'}
          src={blog?.featuredImage!}
          height={400}
          width={600}
          className='w-full h-full object-cover object-center absolute top-0 left-0 -z-50'
        />
        <div className='absolute -z-40 top-0 left-0 w-full h-full bg-muted/90' />
        <div className='p-4 w-full space-y-10'>
          <div>
            <h1 className='text-4xl font-bold'>{blog?.title}</h1>
            <span>{format(blog?.createdAt ?? '', 'PPP')}</span>
          </div>
          <div>
            <p>{blog?.description}</p>
            <Button className='float-right flex items-center space-x-2'>
              <GithubIcon className='h-6 w-6' />
              <span>Github</span>
            </Button>
          </div>
        </div>
      </div>
      <RenderMarkdown content={blog?.content ?? ''} />
    </div>
  );
};

export default PreviewBlogPage;
