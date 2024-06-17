'use client';
import { updateMetadata } from '@/actions/blog';
import { cn } from '@/lib/utils';
import { IBlog } from '@/models/blog';
import { ICategory } from '@/models/category';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { CheckIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import CreateCategoryDialog from '../create-category-dialog';
import { Button } from '../ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { Textarea } from '../ui/textarea';

type Props = {
  blog: Partial<IBlog> | null;
  categories: Partial<ICategory>[] | null;
};

const MetadataSheet = ({ blog, categories }: Props) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState({
    title: blog?.title ?? '',
    description: blog?.description ?? '',
    featuredImage:
      blog?.featuredImage ??
      'https://images.unsplash.com/photo-1549558549-415fe4c37b60',
    category: blog?.category?.name ?? 'uncategorized',
  });

  const handleMetadataUpdate = async () => {
    if (metadata.title === '') {
      toast.error('Title cannot be empty');
      return;
    }

    if (metadata.description === '') {
      toast.error('Description cannot be empty');
      return;
    }

    if (metadata.featuredImage === '') {
      toast.error('Featured Image cannot be empty');
      return;
    }

    if (metadata.category === '') {
      toast.error('Category cannot be empty');
      return;
    }
    setLoading(true);
    const res = await updateMetadata(blog?._id!, metadata);
    if (res.success) {
      toast.success(res.message);
      setLoading(false);
      router.refresh();
    } else {
      toast.success(res.message);
      setLoading(false);
    }
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='outline'>Update Metadata</Button>
      </SheetTrigger>
      <SheetContent className='border-border pb-10 overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>Blog Metadata</SheetTitle>
          <SheetDescription>Update the metadata of your blog.</SheetDescription>
        </SheetHeader>
        <div className='w-full mt-10 space-y-4'>
          <div className='w-full space-y-2'>
            <Label htmlFor='title'>Title</Label>
            <Input
              type='text'
              placeholder='Title'
              value={metadata.title}
              onChange={(e) =>
                setMetadata({ ...metadata, title: e.target.value })
              }
            />
          </div>

          <div className='w-full space-y-2'>
            <Label htmlFor='title'>Slug</Label>
            <Input type='text' placeholder='Slug' value={blog?.slug} readOnly />
          </div>

          <div className='w-full space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              placeholder='Title'
              value={metadata.description}
              onChange={(e) =>
                setMetadata({ ...metadata, description: e.target.value })
              }
            />
          </div>

          <div className='w-full space-y-2'>
            <Label htmlFor='featuredImage'>Featured Image</Label>
            <Input
              type='text'
              placeholder='Featured Image'
              value={metadata.featuredImage}
              onChange={(e) =>
                setMetadata({ ...metadata, featuredImage: e.target.value })
              }
            />
            <Image
              alt={blog?.title ?? 'featuredImage'}
              src={metadata.featuredImage}
              height={500}
              width={500}
              className='w-full aspect-video object-cover'
            />
          </div>

          <div className='w-full space-y-2'>
            <Label htmlFor='description'>Category</Label>
            <br />
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={open}
                  className='w-full justify-between'
                >
                  {metadata.category ? metadata.category : 'Select category...'}
                  <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-full p-0 border-border'>
                <Command>
                  <CommandInput
                    placeholder='Search category...'
                    className='h-9'
                  />
                  <CommandList>
                    <CommandEmpty className='flex flex-col space-y-2 py-2'>
                      <span className='text-center'>No category found.</span>
                      <CreateCategoryDialog />
                    </CommandEmpty>
                    <CommandGroup>
                      {categories &&
                        categories.map((_category) => (
                          <CommandItem
                            key={_category._id}
                            value={_category.name}
                            onSelect={(currentValue) => {
                              setMetadata({
                                ...metadata,
                                category: _category.name ?? 'uncategorized',
                              });
                              setOpen(false);
                            }}
                          >
                            {_category.name}
                            <CheckIcon
                              className={cn(
                                'ml-auto h-4 w-4',
                                metadata.category === _category.name
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <Button
            variant='outline'
            className='w-full'
            onClick={handleMetadataUpdate}
          >
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MetadataSheet;
