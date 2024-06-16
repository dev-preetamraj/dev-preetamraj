import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  return (
    <div className='w-full h-full flex items-center justify-center'>
      {children}
    </div>
  );
};

export default AuthLayout;
