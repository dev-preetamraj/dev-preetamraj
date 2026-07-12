type Props = {
  index: string;
  title: string;
};

const SectionHeading = ({ index, title }: Props) => (
  <div className='flex items-center gap-4'>
    <h2 className='flex items-baseline gap-2 whitespace-nowrap text-xl font-bold text-foreground md:text-2xl'>
      <span className='font-mono text-sm text-primary'>{index}.</span>
      {title}
    </h2>
    <span className='h-px flex-1 bg-border' />
  </div>
);

export default SectionHeading;
