'use client';

import { createTag } from '@/server-actions/tag';
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

const CreateTagsDialog = (props: Props) => {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);

  const { isPending, mutate } = useMutation({
    mutationFn: async (name: string) => {
      const res = await createTag(name);
      setOpen(false);
      return res;
    },
    onSuccess: ({ message, success }) => {
      if (success) toast.success(message);
      else toast.error(message);
    },
  });

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
            onClick={() => mutate(value)}
            disabled={value === ''}
          >
            {isPending ? 'Creating...' : 'Create Tag'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTagsDialog;
