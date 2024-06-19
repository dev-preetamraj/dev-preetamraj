'use client';
import { IBlog } from '@/models/blog';
import { ICategory } from '@/models/category';
import { useState } from 'react';
import BlogEditor from './blog-editor';
import BlogMetadata from './blog-metadata';
import EditBlogNav from './edit-blog-nav';

type Props = {
  blog: Partial<IBlog>;
  categories: Partial<ICategory>[] | null;
};

const Wrapper = ({ blog, categories }: Props) => {
  const [content, setContent] = useState(blog?.content ?? '');
  const [loading, setLoading] = useState(false);

  return (
    <div className='min-h-screen'>
      <div className='mr-[384px]'>
        <EditBlogNav blog={blog} content={content} />
        <BlogEditor content={content} setContent={setContent} />
      </div>
      <BlogMetadata blog={blog} categories={categories} content={content} />
    </div>
  );
};

export default Wrapper;
