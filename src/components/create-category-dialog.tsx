import { createCategory } from '@/actions/categories';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

type Props = {};

const CreateCategoryDialog = (props: Props) => {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const res = await createCategory(value);
    setLoading(false);
    setOpen(false);
    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.message);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>Create a category</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] border-border'>
        <DialogHeader>
          <DialogTitle>Create category</DialogTitle>
          <DialogDescription>Create a category</DialogDescription>
        </DialogHeader>
        <div className='space-y-2'>
          <Label>Name</Label>
          <Input
            placeholder='Programming'
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button
            variant='outline'
            onClick={handleClick}
            disabled={value === ''}
          >
            {loading ? 'Creating...' : 'Create Category'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryDialog;
