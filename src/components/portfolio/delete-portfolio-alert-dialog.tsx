'use client';
import { deletePortfolioById } from '@/actions/portfolio';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type Props = {
  portfolioId: string;
};

const DeletePortfolioAlertDialog = ({ portfolioId }: Props) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleDelete = async () => {
    setLoading(true);
    const res = await deletePortfolioById(portfolioId);

    if (res.success) {
      toast.success(res.message);
      setLoading(false);
      router.push('/portfolio');
    } else {
      setLoading(false);
      toast.error(res.message);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Trash className='h-4 w-4 cursor-pointer' />
      </AlertDialogTrigger>
      <AlertDialogContent className='border-border'>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            project from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className='bg-destructive hover:bg-destructive/90 text-foreground'
            onClick={handleDelete}
          >
            {loading ? 'Deleting...' : 'Continue'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePortfolioAlertDialog;
