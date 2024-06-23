import { getBlogBySlug } from '@/actions/blog';
import RenderBlog from '@/components/blog/render-blog';
import RenderComments from '@/components/render-comments';
import { currentUser } from '@clerk/nextjs/server';
import { FC } from 'react';

type Props = {
  params: {
    slug: string;
  };
};

const BlogPost: FC<Props> = async ({ params: { slug } }) => {
  const user = await currentUser();
  const { data: blog } = await getBlogBySlug(slug);

  if (!blog) return;

  return (
    <div className='space-y-12'>
      <RenderBlog blog={blog} />
      <RenderComments userId={user?.id} blog={blog} />
    </div>
  );
};

export default BlogPost;
