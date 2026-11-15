'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { createComment } from '@/actions/sanity-comment';
import Text from '@/components/layout/Text';
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
import { cn } from '@/lib/utils';

const Required = () => (
  <Text as='span' tone='destructive' variant='small'>
    *
  </Text>
);

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
  /**
   * Set when this form posts a reply to an existing comment; replies use
   * the tighter inline-reply layout.
   */
  parentId?: string;
  /** Called after a successful submit (and on Cancel) — used to close inline reply forms. */
  onSuccess?: () => void;
};

const CommentForm = ({ postId, parentId, onSuccess }: Props) => {
  const compact = Boolean(parentId);
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
    try {
      const res = await createComment({ postId, parentId, ...values });
      if (res.success) {
        toast.success(res.message);
        form.reset();
        onSuccess?.();
      } else {
        toast.error(res.message);
      }
    } catch {
      // Preserve the draft so transient network failures are safe to retry.
      toast.error('Unable to submit your comment. Please try again.');
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('flex flex-col', compact ? 'gap-3' : 'gap-6')}
      >
        <div
          className={
            compact ? 'grid gap-3 sm:grid-cols-2' : 'grid gap-6 sm:grid-cols-2'
          }
        >
          <FormField
            control={form.control}
            name='authorName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Name <Required />
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
                  Email <Required />
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
                Comment <Required />
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={
                    parentId ? 'Write your reply...' : 'Write comment here...'
                  }
                  maxLength={500}
                  rows={compact ? 3 : 4}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {`Your ${
                  parentId ? 'reply' : 'comment'
                } will be visible once it’s approved.`}
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

        <div className='flex items-center gap-2'>
          <Button
            type='submit'
            size={compact ? 'sm' : 'default'}
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? 'Posting...'
              : parentId
              ? 'Post reply'
              : 'Post comment'}
          </Button>
          {onSuccess && (
            <Button
              type='button'
              variant='ghost'
              size={compact ? 'sm' : 'default'}
              onClick={onSuccess}
              disabled={form.formState.isSubmitting}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default CommentForm;
