'use client';

import '@/styles/dracula.css';
import markdownit from 'markdown-it';
import highlightjs from 'markdown-it-highlightjs';
import { useEffect } from 'react';

type Props = {
  content: string;
};

const copySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;

const checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>`;

const RenderMarkdown = ({ content }: Props) => {
  const md = markdownit();
  md.use(highlightjs);

  useEffect(() => {
    // Add copy buttons to all code blocks
    document.querySelectorAll('pre code').forEach((block) => {
      const codeBlock = block as HTMLElement;

      // Create the copy button
      const button = document.createElement('button');
      button.className = 'copy-button';
      button.innerHTML = copySvg;

      // Check if the copy button already exists
      const pre = codeBlock.parentElement;
      if (pre) {
        pre.style.position = 'relative';
        const existingButton = pre.querySelector('button.copy-button');
        if (!existingButton) {
          pre.appendChild(button);
        }
      }

      // Add click event listener to the copy button
      button.addEventListener('click', () => {
        navigator.clipboard.writeText(codeBlock.innerText).then(() => {
          button.innerHTML = checkSvg;
          setTimeout(() => {
            button.innerHTML = copySvg;
          }, 2000);
        });
      });
    });
  }, [content]);

  return (
    <article
      className='prose !max-w-none dark:prose-invert prose-a:text-primary prose-headings:text-foreground prose-img:w-full prose-img:aspect-video prose-img:object-cover prose-img:object-left md:prose-pre:max-w-md lg:prose-pre:max-w-[630px] xl:prose-pre:max-w-xl 2xl:prose-pre:max-w-[880px]'
      dangerouslySetInnerHTML={{
        __html: md.render(content),
      }}
    />
  );
};

export default RenderMarkdown;
