'use client';
import { createBlog } from '@/actions/blog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Textarea } from '../ui/textarea';
const CreateBlogDialog = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [FeaturedImage, setFeaturedImage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    if (title === '') {
      setLoading(false);
      toast.error('Title cannot be empty');
      return;
    }

    if (description === '') {
      setLoading(false);
      toast.error('Description cannot be empty');
      return;
    }

    const response = await createBlog(title, description, FeaturedImage);
    setLoading(false);
    if (response.success) {
      toast.success(response.message);
      router.push(`/dashboard/blog?action=edit&_id=${response.data?._id}`);
    } else {
      toast.error(response.message);
      return;
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='link'>Add Blog</Button>
      </DialogTrigger>
      <DialogContent className='border-border rounded-md'>
        <DialogHeader>
          <DialogTitle>Add blog</DialogTitle>
          <DialogDescription>
            Fill up the below fields and click on create blog button
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col space-y-4'>
          <div className='flex flex-col space-y-2'>
            <Label htmlFor='title'>Title</Label>
            <Input
              name='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className='flex flex-col space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              name='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className='flex flex-col space-y-2'>
            <Label htmlFor='featuredImage'>Featured Image Url</Label>
            <Input
              name='featuredImage'
              value={FeaturedImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>
            {loading ? 'Creating...' : 'Create blog'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBlogDialog;
