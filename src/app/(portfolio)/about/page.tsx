import { DownloadIcon } from '@radix-ui/react-icons';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About - Preetam Raj',
  description: 'A fullstack web developer',
};

const skills = [
  {
    id: 1,
    title: 'Languages',
    items: ['Python', 'C++', 'Typescript', 'Javascript', 'Java'],
  },
  {
    id: 2,
    title: 'Frameworks/Web/App Technologies',
    items: [
      'Django',
      'Django Rest Framework',
      'FastAPI',
      'ReactJS',
      'NextJS',
      'React Native (Expo/CLI)',
      'Redux Toolkit',
      'HTML5',
      'CSS3',
      'Tailwind CSS',
      'Shadcn',
      'Material UI',
      'Bootstrap',
    ],
  },
  {
    id: 3,
    title: 'Familiar Technologies',
    items: [
      'MySQL',
      'Postgresql',
      'SQLAlchemy',
      'AWS EC2',
      'AWS RDS',
      'AWS S3',
      'GIT',
      'Github',
      'Socket Programming',
      'Pandas',
      'Numpy',
      'Matplotlib',
    ],
  },
];

const AboutPage = () => {
  return (
    <div className='flex flex-col space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-foreground text-2xl'>Who am I?</h1>
        <Link
          href='#'
          className='text-primary text-xl flex items-center space-x-2'
        >
          <span>Resume</span>
          <DownloadIcon className='h-4 w-4 text-primary' />
        </Link>
      </div>

      <p className='text-justify font-light'>
        Hi, I am <span className='text-primary font-semibold'>Preetam Raj</span>
        , a passionate individual driven by the intersection of technology and
        creativity. With a background in Mechanical Engineering, and a minor in{' '}
        <span className='text-primary font-semibold'>
          Computer Science and Engineering
        </span>
        , from the prestigious{' '}
        <span className='text-primary font-semibold'>
          Indian Institute of Technology (IIT) Mandi
        </span>
        , I&apos;ve always been captivated by the dynamic world of web and app
        development. As a full-stack web developer, I thrive on transforming
        innovative ideas into functional digital solutions. Beyond the realm of
        coding, I find solace in the world of music. Whether it&apos;s through
        singing, strumming my guitar, or immersing myself in the magic of
        melodies, music is where I truly find my balance. Hailing from the
        vibrant city of Patna, Bihar, I&apos;m on a relentless quest to blend my
        technical expertise with my creative passions to craft digital
        experiences that resonate with people around the world.
      </p>

      <div className='flex flex-col space-y-2'>
        <h1 className='text-2xl text-foreground'>Skills</h1>
        {skills.map((item) => (
          <div className='flex flex-col space-y-4' key={item.id}>
            <h1 className='underline underline-offset-2'>{item.title}:</h1>
            <ul className='flex flex-wrap items-center gap-2 text-sm'>
              {item.items.map((skill) => (
                <li key={skill.replace(' ', '-')}>{skill}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;
