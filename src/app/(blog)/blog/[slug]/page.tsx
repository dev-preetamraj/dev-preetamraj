import { getBlogBySlug } from '@/actions/blog';
import RenderBlog from '@/components/blog/render-blog';
import { FC } from 'react';

type Props = {
  params: {
    slug: string;
  };
};

const BlogPost: FC<Props> = async ({ params: { slug } }) => {
  const { data: blog } = await getBlogBySlug(slug);

  if (!blog) return;

  return <RenderBlog blog={blog} />;
};

export default BlogPost;
