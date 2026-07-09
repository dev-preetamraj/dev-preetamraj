import { getBlogBySlug } from '@/actions/blog';
import RenderBlog from '@/components/blog/render-blog';
import RenderComments from '@/components/comments/render-comments';
import { Post, POST_BY_SLUG_QUERY, sanityFetch } from '@/sanity/lib/queries';
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

  const user = await currentUser();
  const blog = await sanityFetch<Post | null>(POST_BY_SLUG_QUERY, { slug });

  if (!blog) return;

  // Content + metadata come from Sanity; comments still live on MongoDB
  // (the comment write path + Clerk auth are unchanged this phase). Both
  // stores are keyed by the same slug, so this is an isolated bridge.
  const { data: mongoBlog } = await getBlogBySlug(slug);

  return (
    <div className='space-y-12'>
      <RenderBlog blog={blog} />
      <RenderComments userId={user?.id} blog={mongoBlog ?? {}} />
    </div>
  );
};

export default BlogPost;
