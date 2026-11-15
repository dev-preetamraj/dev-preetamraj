'use client';

import { Button } from '@/components/ui/button';
import { Check, Link2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

/** Copies the canonical URL of the current article. */
const CopyLinkButton = ({ url }: { url: string }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied');
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy the link. Copy it from the address bar.');
    }
  };

  const Icon = copied ? Check : Link2;
  return (
    <Button
      type='button'
      variant='outline'
      size='sm'
      onClick={copy}
      className='w-fit gap-1.5'
    >
      <Icon aria-hidden className='h-4 w-4' />
      {copied ? 'Copied' : 'Copy link'}
    </Button>
  );
};

export default CopyLinkButton;
