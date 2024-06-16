'use client';

import { createTag } from '@/actions/tags';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(1).max(20),
});

const CreateTag = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await createTag(values.name);
    toast.success(response.message);
    form.reset();
    router.refresh();
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='w-full flex flex-col space-y-8'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Programming' {...field} />
              </FormControl>
              <FormDescription>Write the title of the tag.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>
          {form.formState.isSubmitting ? 'Submiting...' : 'Submit'}
        </Button>
      </form>
    </Form>
  );
};

export default CreateTag;
