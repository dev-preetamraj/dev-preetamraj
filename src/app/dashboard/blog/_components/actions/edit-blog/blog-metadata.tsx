'use client';

import { publishBlog, updateMetadata } from '@/actions/blog';
import CreateCategoryDialog from '@/components/create-category-dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { IBlog } from '@/models/blog';
import { ICategory } from '@/models/category';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { CheckIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type Props = {
  blog: Partial<IBlog>;
  categories: Partial<ICategory>[] | null;
  content: string;
};

const BlogMetadata = ({ blog, categories, content }: Props) => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [metadata, setMetadata] = useState({
    title: blog?.title ?? '',
    description: blog?.description ?? '',
    featuredImage:
      blog?.featuredImage ??
      'https://images.unsplash.com/photo-1549558549-415fe4c37b60',
    category: blog?.category?.name ?? 'uncategorized',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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
    setSaveLoading(true);
    const res = await updateMetadata(blog?._id!, metadata);
    if (res.success) {
      toast.success(res.message);
      setSaveLoading(false);
      router.refresh();
    } else {
      toast.success(res.message);
      setSaveLoading(false);
    }
  };

  const handlePublish = async () => {
    if (blog.content !== content) {
      toast.error('Save the content first');
      return;
    }

    const res = await publishBlog(blog._id!, !blog.isPublished);
    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Sheet open modal={false}>
      <SheetContent className='w-[400px] p-0 border-border'>
        <div className='space-4-4'>
          <div className='h-14 lg:h-[60px] px-4 lg:px-6 bg-muted/40 border-b border-border flex items-center justify-between'>
            <Button
              variant='link'
              className='px-0'
              onClick={handleMetadataUpdate}
              disabled={saveLoading}
            >
              {saveLoading ? 'Saving...' : 'Save Metadata'}
            </Button>
            <Button onClick={handlePublish}>
              {blog.isPublished ? 'Unpublish' : 'Publish'}
            </Button>
          </div>
          <div className='w-full px-4 lg:px-6'>
            <Accordion type='single' collapsible>
              <AccordionItem value='metadata' className='border-border'>
                <AccordionTrigger className='text-lg'>
                  Metadata
                </AccordionTrigger>
                <AccordionContent className='space-y-2'>
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
                    <Input
                      type='text'
                      placeholder='Slug'
                      value={blog?.slug}
                      readOnly
                    />
                  </div>

                  <div className='w-full space-y-2'>
                    <Label htmlFor='description'>Description</Label>
                    <Textarea
                      placeholder='Title'
                      value={metadata.description}
                      onChange={(e) =>
                        setMetadata({
                          ...metadata,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='featuredImage' className='border-border'>
                <AccordionTrigger className='text-lg'>
                  Featured Image
                </AccordionTrigger>
                <AccordionContent className='space-y-2'>
                  <Input
                    type='text'
                    placeholder='Featured Image'
                    value={metadata.featuredImage}
                    onChange={(e) =>
                      setMetadata({
                        ...metadata,
                        featuredImage: e.target.value,
                      })
                    }
                  />
                  <Image
                    alt={blog?.title ?? 'featuredImage'}
                    src={metadata.featuredImage}
                    height={500}
                    width={500}
                    className='w-full aspect-video object-cover'
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='category' className='border-border'>
                <AccordionTrigger className='text-lg'>
                  Category
                </AccordionTrigger>
                <AccordionContent>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        role='combobox'
                        aria-expanded={open}
                        className='w-full justify-between'
                      >
                        {metadata.category
                          ? metadata.category
                          : 'Select category...'}
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
                            <span className='text-center'>
                              No category found.
                            </span>
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
                                      category:
                                        _category.name ?? 'uncategorized',
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
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='tags' className='border-border'>
                <AccordionTrigger className='text-lg'>Tags</AccordionTrigger>
                <AccordionContent>Coming soon...</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BlogMetadata;
