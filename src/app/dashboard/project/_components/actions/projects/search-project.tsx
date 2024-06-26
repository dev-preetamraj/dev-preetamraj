'use client';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Props = {};

const SearchProject = (props: Props) => {
  const router = useRouter();
  const [value, setValue] = useState('');

  useEffect(() => {
    if (!value) router.replace('/dashboard/project');

    if (value) {
      setTimeout(() => {
        router.replace(`/dashboard/project?keyword=${value}`);
      }, 100);
    }
  }, [value, router]);

  return (
    <Input
      className='bg-background border-primary w-full max-w-md'
      placeholder='Search something...'
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default SearchProject;
