'use client';

import { createTag } from '@/actions/tags';
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

const CreateTagsDialog = (props: Props) => {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const res = await createTag(value);
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
        <Button variant='link' className='px-0'>
          Create a Tag
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] border-border'>
        <DialogHeader>
          <DialogTitle>Create Tag</DialogTitle>
          <DialogDescription>Create a Tag</DialogDescription>
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
            {loading ? 'Creating...' : 'Create Tag'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTagsDialog;
