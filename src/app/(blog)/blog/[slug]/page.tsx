import RenderBlog from '@/components/blog/render-blog';
import ViewTracker from '@/components/blog/view-tracker';
import JsonLd from '@/components/global/json-ld';
import RenderComments from '@/components/comments/render-comments';
import {
  AUTHOR_NAME,
  canonical,
  ogImageUrl,
  SITE_NAME,
  SITE_URL,
  TWITTER_HANDLE,
} from '@/lib/seo';
import { Post, POST_BY_SLUG_QUERY, sanityFetch } from '@/sanity/lib/queries';
import { Metadata } from 'next';
import { FC } from 'react';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const blog = await sanityFetch<Post | null>(POST_BY_SLUG_QUERY, { slug });

  if (!blog) return { title: 'Post not found' };

  const url = canonical(`/blog/${slug}`);
  const published = blog.publishedAt ?? blog._createdAt;

  return {
    title: blog.title,
    description: blog.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      siteName: SITE_NAME,
      title: blog.title,
      description: blog.description,
      publishedTime: published ?? undefined,
      authors: [AUTHOR_NAME],
      section: blog.category?.name,
      tags: blog.tags?.map((t) => t.name),
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.description,
      creator: TWITTER_HANDLE,
    },
  };
}

const BlogPost: FC<Props> = async (props) => {
  const { slug } = await props.params;

  const blog = await sanityFetch<Post | null>(POST_BY_SLUG_QUERY, { slug });

  if (!blog) return;

  const url = canonical(`/blog/${slug}`);
  const published = blog.publishedAt ?? blog._createdAt;
  const image = ogImageUrl(blog.featuredImage);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: blog.title,
    description: blog.description,
    ...(image ? { image: [image] } : {}),
    datePublished: published,
    dateModified: published,
    author: { '@type': 'Person', name: AUTHOR_NAME, url: SITE_URL },
    publisher: { '@type': 'Person', name: AUTHOR_NAME, url: SITE_URL },
    ...(blog.category ? { articleSection: blog.category.name } : {}),
    ...(blog.tags?.length
      ? { keywords: blog.tags.map((t) => t.name).join(', ') }
      : {}),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: canonical('/blog'),
      },
      { '@type': 'ListItem', position: 3, name: blog.title, item: url },
    ],
  };

  return (
    <div className='space-y-12'>
      <JsonLd data={[articleLd, breadcrumbLd]} />
      <ViewTracker postId={blog._id} />
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
