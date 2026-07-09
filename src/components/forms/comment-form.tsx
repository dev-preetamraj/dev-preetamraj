'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { createComment } from '@/actions/sanity-comment';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  authorName: z.string().trim().min(1, { message: 'Name is required' }).max(80),
  authorEmail: z
    .string()
    .trim()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Enter a valid email' }),
  content: z
    .string()
    .trim()
    .min(1, { message: 'Comment is required' })
    .max(500, { message: 'Maximum 500 characters are allowed' }),
  // Honeypot — hidden from real users.
  website: z.string().optional(),
});

type Props = {
  postId: string;
};

const CommentForm = ({ postId }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      authorName: '',
      authorEmail: '',
      content: '',
      website: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await createComment({ postId, ...values });
    if (res.success) {
      toast.success(res.message);
      form.reset();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid gap-6 sm:grid-cols-2'>
          <FormField
            control={form.control}
            name='authorName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Name <span className='text-destructive'>*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder='Your name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='authorEmail'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email <span className='text-destructive'>*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='you@example.com'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Comment <span className='text-destructive'>*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Write comment here...'
                  maxLength={500}
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Your comment will be visible once it&apos;s approved.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Honeypot: hidden from users, tempting to bots. */}
        <FormField
          control={form.control}
          name='website'
          render={({ field }) => (
            <div className='hidden' aria-hidden='true'>
              <Input
                {...field}
                tabIndex={-1}
                autoComplete='off'
                placeholder='Leave this field empty'
              />
            </div>
          )}
        />

        <Button type='submit' disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Posting...' : 'Post comment'}
        </Button>
      </form>
    </Form>
  );
};

export default CommentForm;
