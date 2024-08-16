import { getBlogBySlug } from '@/actions/blog';
import RenderBlog from '@/components/blog/render-blog';
import RenderComments from '@/components/comments/render-comments';
import { currentUser } from '@clerk/nextjs/server';
import { Metadata, ResolvingMetadata } from 'next';
import { FC } from 'react';

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const { data: blog } = await getBlogBySlug(slug);

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${blog?.title} - Preetam Raj`,
    openGraph: {
      images: previousImages,
    },
  };
}

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
