'use client';

import '@/styles/dracula.css';
import { buildToc, tocIdsByKey } from '@/lib/toc';
import { LINK } from '../roles';
import type { SanityImage } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import hljs from 'highlight.js';
import { Check, Copy } from 'lucide-react';
import Image from 'next/image';
import { ReactNode, useMemo, useState } from 'react';
import { toast } from 'sonner';

type Props = {
  value: PortableTextBlock[];
};

/** Pull the intrinsic dimensions out of a Sanity image asset ref. */
function imageDimensions(image: SanityImage): {
  width: number;
  height: number;
} {
  const ref = image.asset?._ref;
  const dims = ref?.split('-')[2];
  const [width, height] = dims?.split('x').map(Number) ?? [];
  return {
    width: Number.isFinite(width) ? width : 1200,
    height: Number.isFinite(height) ? height : 800,
  };
}

type CodeValue = {
  code?: string;
  language?: string;
  filename?: string;
};

// Languages that carry no grammar — highlighting them as-is yields plain text,
// so we auto-detect instead.
const PLAIN_LANGUAGES = new Set(['text', 'plaintext', 'plain', 'none', 'txt']);

/** Copies a code block's source; same feedback as CopyLinkButton. */
const CopyButton = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied');
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy the code. Select it and copy it manually.');
    }
  };

  const Icon = copied ? Check : Copy;
  return (
    <button
      type='button'
      onClick={copy}
      aria-label={copied ? 'Code copied' : 'Copy code to clipboard'}
      className='absolute right-1 top-2 rounded-sm p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
    >
      <Icon aria-hidden className='h-5 w-5' />
    </button>
  );
};

const CodeBlock = ({ value }: { value: CodeValue }) => {
  const code = value?.code ?? '';
  const language = value?.language?.toLowerCase();
  const useSpecificLanguage =
    !!language &&
    !PLAIN_LANGUAGES.has(language) &&
    !!hljs.getLanguage(language);
  const highlighted = useSpecificLanguage
    ? hljs.highlight(code, { language: language as string }).value
    : hljs.highlightAuto(code).value;

  return (
    <pre className='relative'>
      {value?.filename && (
        <span className='block font-mono text-caption mb-2'>
          {value.filename}
        </span>
      )}
      <code
        className={`hljs${useSpecificLanguage ? ` language-${language}` : ''}`}
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
      <CopyButton code={code} />
    </pre>
  );
};

type HeadingProps = {
  children?: ReactNode;
  value: { _key?: string };
};

/** Content components; headings get the TOC anchor ids by block key. */
const makeComponents = (ids: Map<string, string>): PortableTextComponents => {
  const id = (value: HeadingProps['value']) =>
    value?._key ? ids.get(value._key) : undefined;
  return {
    ...components,
    block: {
      // The page owns the only h1 (the post/project title), so CMS content
      // headings start at h2: an authored h1 is demoted to h2.
      h1: ({ children, value }: HeadingProps) => (
        <h2 id={id(value)}>{children}</h2>
      ),
      h2: ({ children, value }: HeadingProps) => (
        <h2 id={id(value)}>{children}</h2>
      ),
      h3: ({ children, value }: HeadingProps) => (
        <h3 id={id(value)}>{children}</h3>
      ),
    },
  };
};

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImage }) => {
      const { width, height } = imageDimensions(value);
      return (
        <Image
          src={urlFor(value).url()}
          alt={value?.alt ?? ''}
          width={width}
          height={height}
        />
      );
    },
    code: CodeBlock,
  },
  marks: {
    link: ({ children, value }) => (
      <a href={value?.href} target='_blank' rel='noreferrer'>
        {children}
      </a>
    ),
  },
};

const Prose = ({ value }: Props) => {
  const proseComponents = useMemo(
    () => makeComponents(tocIdsByKey(buildToc(value))),
    [value]
  );

  return (
    // Width comes from the article column (PageLayout) and the prose
    // plugin's maxWidth token; headings, lists, images and code blocks all
    // share it. Headings keep clear of the sticky navbar when jumped to.
    <article
      className={`prose ${LINK.prose} prose-headings:scroll-mt-24 prose-headings:text-foreground prose-img:w-full`}
    >
      <PortableText value={value} components={proseComponents} />
    </article>
  );
};

export default Prose;
