import CreateTagsDialog from '@/components/create-tags-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Page = () => {
  return (
    <div>
      <div className='h-16 px-12 bg-muted flex items-center justify-between'>
        <CreateTagsDialog />
        <div className='flex items-center space-x-4'>
          <Input
            className='bg-background border border-primary'
            placeholder='Search something...'
          />
          <Button className='w-56'>Search Tag</Button>
        </div>
      </div>

      <div className='flex space-x-4 px-12 py-4'></div>
    </div>
  );
};

export default Page;
