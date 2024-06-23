'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { createCommentForBlog } from '@/actions/comment';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
  content: z
    .string()
    .min(1, {
      message: 'Required field',
    })
    .max(500, { message: 'Maximum 500 characters are allowed' }),
});

type Props = {
  userId?: string;
  blogId?: string;
  portfolioId?: string;
};

const CommentForm = ({ userId, blogId, portfolioId }: Props) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!userId) {
      toast.error('Unauthorized');
      return;
    }

    if (blogId) {
      const res = await createCommentForBlog(userId, values.content, blogId);
      if (res.success) {
        toast.success(res.message);
        form.reset();
        router.refresh();
      }
    }
  };

  if (!userId) return null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder='Write comment here...'
                  {...field}
                  maxLength={500}
                  cols={4}
                />
              </FormControl>
              <FormDescription>
                This is a required field to post your comment.
              </FormDescription>
              <FormMessage />
            </FormItem>
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
