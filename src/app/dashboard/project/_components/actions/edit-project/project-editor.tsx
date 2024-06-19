'use client';
import { Editor } from '@monaco-editor/react';

type Props = {
  content: string;
  setContent: (value: string) => void;
};

const ProjectEditor = ({ content, setContent }: Props) => {
  return (
    <Editor
      height='93vh'
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
  );
};

export default ProjectEditor;
