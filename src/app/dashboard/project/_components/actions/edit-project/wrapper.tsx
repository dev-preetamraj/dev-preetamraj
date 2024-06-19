'use client';
import { ICategory } from '@/models/category';
import { IPortfolio } from '@/models/portfolio';
import { useState } from 'react';
import EditProjectNav from './edit-project-nav';
import BlogEditor from './project-editor';
import ProjectMetadata from './project-metadata';

type Props = {
  project: Partial<IPortfolio>;
  categories: Partial<ICategory>[] | null;
};

const Wrapper = ({ project, categories }: Props) => {
  const [content, setContent] = useState(project?.content ?? '');
  const [loading, setLoading] = useState(false);

  return (
    <div className='min-h-screen'>
      <div className='mr-[384px]'>
        <EditProjectNav project={project} content={content} />
        <BlogEditor content={content} setContent={setContent} />
      </div>
      <ProjectMetadata
        project={project}
        categories={categories}
        content={content}
      />
    </div>
  );
};

export default Wrapper;
