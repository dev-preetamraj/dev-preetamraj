'use client';

import '@/styles/dracula.css';
import type { SanityImage } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import {
  PortableText,
  type PortableTextComponents,
} from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import hljs from 'highlight.js';
import Image from 'next/image';
import { useEffect } from 'react';

type Props = {
  value: PortableTextBlock[];
};

const copySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;

const checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>`;

/** Pull the intrinsic dimensions out of a Sanity image asset ref. */
function imageDimensions(image: SanityImage): { width: number; height: number } {
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
// so we auto-detect instead (mirrors the old markdown-it-highlightjs fallback).
const PLAIN_LANGUAGES = new Set(['text', 'plaintext', 'plain', 'none', 'txt']);

const CodeBlock = ({ value }: { value: CodeValue }) => {
  const code = value?.code ?? '';
  const language = value?.language?.toLowerCase();
  const useSpecificLanguage =
    !!language && !PLAIN_LANGUAGES.has(language) && !!hljs.getLanguage(language);
  const highlighted = useSpecificLanguage
    ? hljs.highlight(code, { language: language as string }).value
    : hljs.highlightAuto(code).value;

  return (
    <pre>
      {value?.filename && (
        <span className='block text-xs font-mono opacity-70 mb-2'>
          {value.filename}
        </span>
      )}
      <code
        className={`hljs${useSpecificLanguage ? ` language-${language}` : ''}`}
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </pre>
  );
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

const RenderPortableText = ({ value }: Props) => {
  useEffect(() => {
    // Add copy buttons to all code blocks (mirrors RenderMarkdown behaviour).
    document.querySelectorAll('pre code').forEach((block) => {
      const codeBlock = block as HTMLElement;
      const pre = codeBlock.parentElement;
      if (!pre) return;

      pre.style.position = 'relative';
      if (pre.querySelector('button.copy-button')) return;

      const button = document.createElement('button');
      button.className = 'copy-button';
      button.innerHTML = copySvg;
      pre.appendChild(button);

      button.addEventListener('click', () => {
        navigator.clipboard.writeText(codeBlock.innerText).then(() => {
          button.innerHTML = checkSvg;
          setTimeout(() => {
            button.innerHTML = copySvg;
          }, 2000);
        });
      });
    });
  }, [value]);

  return (
    <article className='prose !max-w-none dark:prose-invert prose-a:text-primary prose-headings:text-foreground prose-img:w-full md:prose-pre:max-w-md lg:prose-pre:max-w-[630px] xl:prose-pre:max-w-xl 2xl:prose-pre:max-w-[880px]'>
      <PortableText value={value} components={components} />
    </article>
  );
};

export default RenderPortableText;
