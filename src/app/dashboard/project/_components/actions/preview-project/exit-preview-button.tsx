'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const ExitPreviewButton = () => {
  const router = useRouter();
  return (
    <Button variant='link' className='px-0' onClick={() => router.back()}>
      Exit Preview
    </Button>
  );
};

export default ExitPreviewButton;
