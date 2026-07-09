import RenderBlog from '@/components/blog/render-blog';
import RenderComments from '@/components/comments/render-comments';
import { Post, POST_BY_SLUG_QUERY, sanityFetch } from '@/sanity/lib/queries';
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
  const blog = await sanityFetch<Post | null>(POST_BY_SLUG_QUERY, { slug });

  // optionally access and extend (rather than replace) parent metadata
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

  const blog = await sanityFetch<Post | null>(POST_BY_SLUG_QUERY, { slug });

  if (!blog) return;

  return (
    <div className='space-y-12'>
      <RenderBlog blog={blog} />
      <RenderComments
        postId={blog._id}
        comments={blog.comments ?? []}
        commentsCount={blog.commentsCount ?? 0}
      />
    </div>
  );
};

export default BlogPost;
