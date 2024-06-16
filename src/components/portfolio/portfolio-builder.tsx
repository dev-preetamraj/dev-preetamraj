'use client';
import { updatePortfolioContent } from '@/actions/portfolio';
import { ICategory } from '@/models/category';
import { IPortfolio } from '@/models/portfolio';
import { Editor } from '@monaco-editor/react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import PortfolioMetadataSheet from './portfolio-metadata-sheet';

type Props = {
  portfolio: Partial<IPortfolio> | null;
  categories: Partial<ICategory>[] | null;
};

const PortfolioBuilder = ({ portfolio, categories }: Props) => {
  const [content, setContent] = useState(portfolio?.content);
  const [loading, setLoading] = useState(false);

  const handleUpdateContent = async () => {
    if (!content) {
      toast.error('Content cannot be empty');
      return;
    }
    setLoading(true);
    const res = await updatePortfolioContent(portfolio?._id!, content);
    if (!res.success) {
      toast.error(res.message);
      setLoading(false);
      return;
    }
    toast.success(res.message);
    setLoading(false);
    return;
  };

  return (
    <div className='w-full flex flex-col space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-semibold truncate'>
          {portfolio?.title ?? ''}
        </h1>
        <div className='flex items-center space-x-2'>
          <Link href={`/portfolio/preview/${portfolio?._id}`} target='_blank'>
            <Button variant='link'>Preview</Button>
          </Link>
          <Button
            variant='outline'
            onClick={handleUpdateContent}
            disabled={content === '' || loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
          <PortfolioMetadataSheet
            categories={categories}
            portfolio={portfolio}
          />
        </div>
      </div>
      <Editor
        height='80vh'
        defaultLanguage='mdx'
        defaultValue={content}
        theme='vs-dark'
        options={{
          padding: {
            top: 10,
          },
          wordWrap: 'on',
        }}
        onChange={(value) => setContent(value ?? '')}
      />
    </div>
  );
};

export default PortfolioBuilder;
