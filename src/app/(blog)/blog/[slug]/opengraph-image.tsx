import { OG_SIZE, ogImageUrl, SITE_URL } from '@/lib/seo';
import { POST_OG_QUERY, sanityFetch } from '@/sanity/lib/queries';
import type { SanityImage } from '@/sanity/lib/queries';
import { ImageResponse } from 'next/og';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Preetam Raj - blog post';

type OgPost = {
  title: string;
  description?: string;
  featuredImage?: SanityImage;
  category?: { name: string } | null;
};

export default async function Image({
  params,
}: {
  params: { slug: string };
}) {
  const post = await sanityFetch<OgPost | null>(POST_OG_QUERY, {
    slug: params.slug,
  });

  const featured = ogImageUrl(post?.featuredImage);

  // Preferred: the post's own featured image, full-bleed.
  if (featured) {
    return new ImageResponse(
      (
        <div style={{ display: 'flex', height: '100%', width: '100%' }}>
          <img
            src={featured}
            alt={post?.title ?? alt}
            width={size.width}
            height={size.height}
            style={{ objectFit: 'cover' }}
          />
        </div>
      ),
      { ...size },
    );
  }

  // Fallback when a post has no featured image: a branded title card.
  const title = post?.title ?? 'Preetam Raj';
  const category = post?.category?.name;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background:
            'linear-gradient(135deg, #0a0a0a 0%, #171717 60%, #262626 100%)',
          color: '#fafafa',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 30, color: '#a1a1aa' }}>
          {SITE_URL.replace('https://', '')}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {category ? (
            <div
              style={{
                display: 'flex',
                alignSelf: 'flex-start',
                padding: '8px 20px',
                borderRadius: '9999px',
                background: '#fafafa',
                color: '#0a0a0a',
                fontSize: 26,
                fontWeight: 600,
              }}
            >
              {category}
            </div>
          ) : null}
          <div
            style={{
              display: 'flex',
              fontSize: title.length > 60 ? 60 : 76,
              fontWeight: 800,
              lineHeight: 1.1,
              maxWidth: '1000px',
            }}
          >
            {title}
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 32, fontWeight: 700 }}>
          Preetam Raj
        </div>
      </div>
    ),
    { ...size },
  );
}
