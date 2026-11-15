'use client';

import '@/styles/dracula.css';
import { buildToc, tocIdsByKey } from '@/lib/toc';
import { LINK } from '../roles';
import type { SanityImage } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import hljs from 'highlight.js';
import Image from 'next/image';
import { ReactNode, useEffect, useMemo, useRef } from 'react';

type Props = {
  value: PortableTextBlock[];
};

const copySvg = `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;

const checkSvg = `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>`;

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
// so we auto-detect instead (mirrors the old markdown-it-highlightjs fallback).
const PLAIN_LANGUAGES = new Set(['text', 'plaintext', 'plain', 'none', 'txt']);

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
    <pre>
      {value?.filename && (
        <span className='block font-mono text-caption mb-2'>
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

const COPY_LABEL = 'Copy code to clipboard';

const Prose = ({ value }: Props) => {
  const proseComponents = useMemo(
    () => makeComponents(tocIdsByKey(buildToc(value))),
    [value]
  );
  // Polite live region that announces copy success/failure to screen readers.
  const statusRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const announce = (message: string) => {
      const status = statusRef.current;
      if (!status) return;
      // Clear first so repeating the same message is announced again.
      status.textContent = '';
      window.setTimeout(() => {
        status.textContent = message;
      }, 50);
    };

    // Add copy buttons to all code blocks (mirrors RenderMarkdown behaviour).
    document.querySelectorAll('pre code').forEach((block) => {
      const codeBlock = block as HTMLElement;
      const pre = codeBlock.parentElement;
      if (!pre) return;

      pre.style.position = 'relative';
      if (pre.querySelector('button.copy-button')) return;

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'copy-button';
      button.setAttribute('aria-label', COPY_LABEL);
      button.innerHTML = copySvg;
      pre.appendChild(button);

      const reset = () => {
        button.innerHTML = copySvg;
        button.setAttribute('aria-label', COPY_LABEL);
      };

      button.addEventListener('click', async () => {
        try {
          if (!navigator.clipboard) throw new Error('Clipboard unavailable');
          await navigator.clipboard.writeText(codeBlock.innerText);
          button.innerHTML = checkSvg;
          button.setAttribute('aria-label', 'Code copied');
          announce('Code copied to clipboard');
        } catch {
          button.setAttribute('aria-label', 'Copy failed');
          announce(
            'Could not copy code. Select the code and copy it manually.'
          );
        }
        setTimeout(reset, 2000);
      });
    });
  }, [value]);

  return (
    // Width comes from the article column (PageLayout) and the prose
    // plugin's maxWidth token; headings, lists, images and code blocks all
    // share it. Headings keep clear of the sticky navbar when jumped to.
    // Code blocks use w-0 + min-w-full so long lines scroll inside the block
    // instead of widening the page: the Radix ScrollArea wraps the layout in
    // display:table, which otherwise grows to fit the widest code line.
    <article
      className={`prose dark:prose-invert ${LINK.prose} prose-headings:scroll-mt-24 prose-headings:text-foreground prose-img:w-full prose-pre:w-0 prose-pre:min-w-full`}
    >
      <PortableText value={value} components={proseComponents} />
      <p ref={statusRef} role='status' aria-live='polite' className='sr-only' />
    </article>
  );
};

export default Prose;
