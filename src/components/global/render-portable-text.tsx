'use client';

import { PortableText, PortableTextComponents } from '@portabletext/react';
import Image from 'next/image';

import { urlFor } from '@/sanity/lib/image';
import CodeBlock from './code-block';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1549558549-415fe4c37b60';

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const src = value?.asset ? urlFor(value).width(1200).url() : FALLBACK_IMAGE;
      return (
        <figure className='my-8'>
          <Image
            src={src}
            alt={value?.alt || 'Blog image'}
            width={1200}
            height={675}
            className='rounded-md w-full'
          />
          {value?.alt && (
            <figcaption className='text-center text-sm text-muted-foreground mt-2'>
              {value.alt}
            </figcaption>
          )}
        </figure>
      );
    },
    code: ({ value }) => (
      <CodeBlock
        code={value?.code || ''}
        language={value?.language}
        filename={value?.filename}
      />
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith('http') ? '_blank' : undefined}
        rel={value?.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
  },
};

type Props = {
  value: any[];
};

const RenderPortableText = ({ value }: Props) => {
  return (
    <article className='prose !max-w-none dark:prose-invert prose-a:text-primary prose-headings:text-foreground prose-img:w-full md:prose-pre:max-w-md lg:prose-pre:max-w-[630px] xl:prose-pre:max-w-xl 2xl:prose-pre:max-w-[880px]'>
      <PortableText value={value} components={components} />
    </article>
  );
};

export default RenderPortableText;
