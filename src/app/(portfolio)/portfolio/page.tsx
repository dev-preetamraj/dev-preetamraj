import PortfolioCard from '@/components/PortfolioCard';
import { Metadata } from 'next';
import { groq } from 'next-sanity';
import { client } from '../../../../sanity/lib/client';
import { urlForImage } from '../../../../sanity/lib/image';

export const metadata: Metadata = {
  title: 'Portfolio - Preetam Raj',
  description: 'A fullstack web developer',
};

export const revalidate = 60; // revalidate this page every 60 seconds

const query = groq`
  *[_type=='project'] {
    _id,
    slug,
    title,
    mainImage,
    _createdAt
  } | order(_createdAt asc)
`;

const PortfolioPage = async () => {
  const projects: Project[] = await client.fetch(query);

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
      {projects.map((project) => (
        <PortfolioCard
          key={project._id}
          title={project.title}
          imgUrl={urlForImage(project.mainImage).url()}
          slug={project.slug.current}
        />
      ))}
    </div>
  );
};

export default PortfolioPage;
