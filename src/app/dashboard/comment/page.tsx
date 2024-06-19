import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const CommentPage = () => {
  return (
    <div>
      <div className='h-16 px-12 bg-muted flex items-center justify-between'>
        <h1 className='text-lg font-semibold'>Comment</h1>
        <div className='flex items-center space-x-4'>
          <Input
            className='bg-background border border-primary'
            placeholder='Search something...'
          />
          <Button className='w-56'>Search Comments</Button>
        </div>
      </div>
    </div>
  );
};

export default CommentPage;
