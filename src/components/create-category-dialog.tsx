'use client';

import { createCategory } from '@/server-actions/category';
import { useMutation } from '@tanstack/react-query';
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
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);

  const { isPending, mutate } = useMutation({
    mutationFn: async (name: string) => {
      const res = await createCategory(name);
      setOpen(false);
      return res;
    },
    onSuccess: (data) => {
      if (data.success) toast.success(data.message);
      else toast.error(data.message);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='link' className='px-0'>
          Create a category
        </Button>
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
            onClick={() => mutate(value)}
            disabled={value === ''}
          >
            {isPending ? 'Creating...' : 'Create Category'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryDialog;
