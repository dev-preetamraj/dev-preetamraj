'use client';
import { updateContent } from '@/actions/blog';
import { IBlog } from '@/models/blog';
import { ICategory } from '@/models/category';
import { Editor } from '@monaco-editor/react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import MetadataSheet from './metadata-sheet';

type Props = {
  blog: Partial<IBlog> | null;
  categories: Partial<ICategory>[] | null;
};

const BlogBuilder = ({ blog, categories }: Props) => {
  const [content, setContent] = useState(blog?.content ?? '');
  const [loading, setLoading] = useState(false);

  const handleUpdateContent = async () => {
    if (!content) {
      toast.error('Content cannot be empty');
      return;
    }
    setLoading(true);
    const res = await updateContent(blog?._id!, content);

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
        <h1 className='text-xl font-semibold truncate'>{blog?.title ?? ''}</h1>
        <div className='flex items-center space-x-2'>
          <Link href={`/blog/preview/${blog?._id}`} target='_blank'>
            <Button variant='link'>Preview</Button>
          </Link>
          <Button
            variant='outline'
            onClick={handleUpdateContent}
            disabled={content === '' || loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
          <MetadataSheet blog={blog} categories={categories} />
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

export default BlogBuilder;
