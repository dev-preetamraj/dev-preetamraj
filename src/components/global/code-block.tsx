'use client';

import hljs from 'highlight.js';
import '@/styles/dracula.css';
import { useEffect, useRef } from 'react';

type Props = {
  code: string;
  language?: string;
  filename?: string;
};

const copySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;

const checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>`;

const CodeBlock = ({ code, language, filename }: Props) => {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    navigator.clipboard.writeText(code).then(() => {
      button.innerHTML = checkSvg;
      setTimeout(() => {
        button.innerHTML = copySvg;
      }, 2000);
    });
  };

  return (
    <div className='relative not-prose'>
      {filename && (
        <div className='bg-[#1e1e2e] text-gray-400 text-xs px-4 py-2 border-b border-gray-700 rounded-t-md font-mono'>
          {filename}
        </div>
      )}
      <pre className={`relative ${filename ? 'rounded-t-none' : ''}`}>
        <code
          ref={codeRef}
          className={language ? `language-${language}` : ''}
        >
          {code}
        </code>
        <button
          className='copy-button'
          onClick={handleCopy}
          dangerouslySetInnerHTML={{ __html: copySvg }}
          aria-label='Copy code'
        />
      </pre>
    </div>
  );
};

export default CodeBlock;
