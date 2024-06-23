import { ResetIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

const StudioNavbar = (props: any) => {
  return (
    <div>
      <div className='flex items-center justify-between p-5'>
        <Link href='/' className='flex items-center space-x-4 text-primary'>
          <ResetIcon className='h-6 w-6 text-primary' />
          <span>Go to website</span>
        </Link>
      </div>
      <>{props.renderDefault(props)}</>
    </div>
  );
};

export default StudioNavbar;
