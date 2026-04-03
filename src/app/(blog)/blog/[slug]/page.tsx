import { getBlogBySlug } from '@/actions/blog';
import { fetchCommentsByBlogSlug } from '@/actions/comment';
import RenderBlog from '@/components/blog/render-blog';
import RenderComments from '@/components/comments/render-comments';
import { currentUser } from '@clerk/nextjs/server';
import { Metadata, ResolvingMetadata } from 'next';
import { FC } from 'react';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug;
  const blog = await getBlogBySlug(slug);

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${blog?.title} - Preetam Raj`,
    openGraph: {
      images: previousImages,
    },
  };
}

const BlogPost: FC<Props> = async (props) => {
  const params = await props.params;
  const { slug } = params;

  const [user, blog, commentsResponse] = await Promise.all([
    currentUser(),
    getBlogBySlug(slug),
    fetchCommentsByBlogSlug(slug),
  ]);

  if (!blog) return null;

  return (
    <div className='space-y-12'>
      <RenderBlog blog={blog} />
      <RenderComments
        userId={user?.id}
        blogSlug={slug}
        comments={commentsResponse.data ?? []}
      />
    </div>
  );
};

export default BlogPost;
