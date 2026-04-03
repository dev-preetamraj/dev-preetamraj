'use client';

const PortfolioError = ({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <div className='flex flex-col items-center justify-center min-h-[50vh] space-y-4'>
      <h2 className='text-2xl font-semibold'>Something went wrong</h2>
      <p className='text-muted-foreground'>
        We couldn&apos;t load this page. Please try again.
      </p>
      <button
        onClick={reset}
        className='px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90'
      >
        Try again
      </button>
    </div>
  );
};

export default PortfolioError;
