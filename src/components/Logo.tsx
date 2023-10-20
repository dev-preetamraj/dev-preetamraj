import Image from 'next/image';

const Logo = (props: any) => {
  const { renderDefault } = props;
  return (
    <div className='flex items-center space-x-2'>
      <Image
        alt='Preetam'
        height={50}
        width={50}
        src='https://res.cloudinary.com/dxgl4eyhq/image/upload/v1687987306/portfolio/me/preetam_ha8a2h.jpg'
        className='rounded-full object-cover'
      />
      <>{renderDefault && renderDefault(props)}</>
    </div>
  );
};

export default Logo;
