import { RichTextComponent } from '@/components/blog/RichTextComponent';
import { buttonVariants } from '@/components/ui/button';
import { PortableText } from '@portabletext/react';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { groq } from 'next-sanity';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import { client } from '../../../../../sanity/lib/client';
import { urlForImage } from '../../../../../sanity/lib/image';

type Props = {
  params: {
    slug: string;
  };
};

// export const revalidate = 60; // revalidate this page every 60 seconds

export async function generateStaticParams() {
  const query = groq`
    *[_type=='project'] {
      slug
    }
  `;
  const slugs: Category[] = await client.fetch(query);
  const slugRoutes = slugs.map((slug) => slug.slug.current);

  return slugRoutes.map((slug) => ({
    slug,
  }));
}

const ProjectDetailsPage: FC<Props> = async ({ params: { slug } }) => {
  const query = groq`
    *[_type=='project' && slug.current==$slug][0] {
      _id,
      title,
      slug,
      githubLink,
      mainImage,
      body,
      description,
      _createdAt
    }
  `;

  const project: Project = await client.fetch(query, { slug });

  return (
    <article>
      <section className='space-y-2 border border-primary/10 mb-10'>
        <div className='relative flex flex-col xl:flex-row justify-between'>
          <div className='absolute top-0 w-full h-full opacity-10 blur-sm'>
            <Image
              className='object-cover object-center mx-auto'
              src={urlForImage(project.mainImage).url()}
              alt={project.title}
              fill
            />
          </div>

          <section className='p-5 bg-primary/10 w-full z-10'>
            <div className='flex flex-col 2xl:flex-row justify-between gap-y-5'>
              <div className='space-y-2'>
                <h1 className='text-2xl md:text-3xl xl:text-4xl font-extrabold'>
                  {project.title}
                </h1>
                <p>
                  {new Date(project._createdAt).toLocaleDateString('en-US', {
                    timeZone: 'Asia/Kolkata',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div>
              <h2 className='italic line-clamp-2 pt-10'>
                {project.description}
              </h2>
              <div className='flex items-center justify-end mt-auto space-x-2'>
                <Link
                  href={project.githubLink}
                  target='_blank'
                  className={buttonVariants({
                    variant: 'default',
                    className: 'flex items-center space-x-2',
                  })}
                >
                  <GitHubLogoIcon className='h-4 w-4' />
                  <span>Github</span>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </section>

      <PortableText value={project.body} components={RichTextComponent} />
    </article>
  );
};

export default ProjectDetailsPage;
