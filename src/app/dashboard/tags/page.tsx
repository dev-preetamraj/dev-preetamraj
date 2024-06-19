import CreateTag from '@/components/forms/create-tag-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Page = () => {
  return (
    <div>
      <div className='h-16 px-12 bg-muted flex items-center justify-between'>
        {/* TODO: Create create-tag-dialog and remove h1 and CreateTag form */}
        <h1 className='text-lg font-semibold'>Tags</h1>
        <div className='flex items-center space-x-4'>
          <Input
            className='bg-background border border-primary'
            placeholder='Search something...'
          />
          <Button className='w-56'>Search Tag</Button>
        </div>
      </div>

      <div className='flex space-x-4 px-12 py-4'>
        <div className='w-full max-w-md'>
          <CreateTag />
        </div>
        <div className='flex-1'></div>
      </div>
    </div>
  );
};

export default Page;
