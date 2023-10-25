import PortfolioCard from '@/components/PortfolioCard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio - Preetam Raj',
  description: 'A fullstack web developer',
};

const projects = [
  {
    id: 1,
    title: 'Hulu Clone',
    imageUrl:
      'https://res.cloudinary.com/dxgl4eyhq/image/upload/v1689107780/portfolio/me/hulu_zlr1k7.png',
  },
  {
    id: 2,
    title: 'Tweetbook',
    imageUrl:
      'https://res.cloudinary.com/dxgl4eyhq/image/upload/v1689107885/portfolio/me/tweetbook_qfprxy.png',
  },
  {
    id: 3,
    title: 'Baazarnow',
    imageUrl:
      'https://res.cloudinary.com/dxgl4eyhq/image/upload/v1689108658/portfolio/me/baazarnow_nm8qyn.png',
  },
  {
    id: 4,
    title: 'Code Together',
    imageUrl:
      'https://res.cloudinary.com/dxgl4eyhq/image/upload/v1689104203/portfolio/me/vscode_roysxu.png',
  },
  {
    id: 5,
    title: 'SMS: School Management System',
    imageUrl:
      'https://res.cloudinary.com/dxgl4eyhq/image/upload/v1689104203/portfolio/me/school_te8msc.jpg',
  },
];

const PortfolioPage = () => {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
      {projects.map((project) => (
        <PortfolioCard
          key={project.id}
          title={project.title}
          imgUrl={project.imageUrl}
        />
      ))}
    </div>
  );
};

export default PortfolioPage;
