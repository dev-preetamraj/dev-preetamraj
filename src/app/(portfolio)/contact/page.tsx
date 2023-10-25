import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact - Preetam Raj',
  description: 'A fullstack web developer',
};

const ContactPage = () => {
  return (
    <div>
      <p className='text-xl'>
        Feel free to contact me at:{' '}
        <Link href='mailto:dev.preetamraj@gmail.com' className='text-primary'>
          dev.preetamraj@gmail.com
        </Link>
      </p>
    </div>
  );
};

export default ContactPage;
