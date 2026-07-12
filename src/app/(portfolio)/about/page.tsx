import SectionHeading from '@/components/global/SectionHeading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DownloadIcon,
  EnvelopeClosedIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
} from '@radix-ui/react-icons';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bot,
  Boxes,
  Cloud,
  Code2,
  Database,
  FileText,
  LayoutDashboard,
  Package,
  Server,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Fullstack software engineer who builds and runs platforms end to end - backend, frontend, and cloud infrastructure.',
};

type Highlight = {
  id: number;
  icon: LucideIcon;
  title: string;
  featured?: boolean;
  badge?: string;
  href?: string;
  text: string;
  tags: string[];
};

const highlights: Highlight[] = [
  {
    id: 10,
    icon: Package,
    title: 'llm-kit (open source)',
    featured: true,
    badge: 'Open source',
    href: 'https://llm-kit.readthedocs.io/en/latest/index.html',
    text: 'An open-source Python toolkit I build and publish on PyPI - one typed, async interface across Anthropic, Gemini, OpenAI, and Bedrock, with Pydantic-structured outputs and multimodal file handling so you never rewrite code per provider. It grew out of my day-to-day LLM work and now stands on its own.',
    tags: ['Anthropic', 'Gemini', 'OpenAI', 'PyPI'],
  },
  {
    id: 1,
    icon: Cloud,
    title: 'AWS → GCP Migration',
    featured: true,
    badge: 'Highlight',
    text: 'Led the full move of our entire stack across clouds - working with a team GCP brought in, I drove the migration of databases, backend services, load balancers, the S3 data lake to Cloud Storage, and a WordPress site off Lightsail onto a Compute Engine VM, keeping the platform live throughout. Leading that effort taught me how every layer fits together, and how to steer a team toward a shared finish line.',
    tags: ['GCP', 'AWS', 'GKE', 'Migration'],
  },
  {
    id: 2,
    icon: Server,
    title: 'FastAPI Platform (~50K LOC)',
    text: 'A Python / FastAPI platform I architected from the ground up - decoupled domains, clean thin-controller → service → repository layering, and the discipline to keep 50K lines maintainable as a team of one. I care a lot about code that stays easy to change.',
    tags: ['Python', 'FastAPI', 'PostgreSQL', 'TimescaleDB'],
  },
  {
    id: 3,
    icon: Activity,
    title: 'Real-time Ingestion',
    text: 'A real-time pipeline on Kafka and TimescaleDB hypertables that chews through high-volume time-series data and feeds everything downstream - alerting, billing, dashboards. I love the puzzle of making data flow reliably at scale.',
    tags: ['Kafka', 'TimescaleDB'],
  },
  {
    id: 4,
    icon: Sparkles,
    title: 'LLM Document Extraction',
    text: 'A model-agnostic extraction system I designed around a Strategy pattern - pluggable schemas, prompts, and validate-with-retry per format - that turns messy unstructured documents into clean, audited data across dozens of formats. It runs on Anthropic Claude and Google Gemini interchangeably, so I can pick the best model per job. This is where I get to mix good engineering with AI.',
    tags: ['Anthropic', 'Gemini', 'Strategy pattern'],
  },
  {
    id: 5,
    icon: FileText,
    title: 'Automated Invoicing',
    text: 'An engine that generates monthly PDF invoices (including merged multi-facility ones), takes payments via Razorpay, and delivers over WhatsApp and email - collapsing a slow manual process from days to hours. I enjoy killing tedious work with software.',
    tags: ['Razorpay', 'PDF', 'WhatsApp/Email'],
  },
  {
    id: 6,
    icon: AlertTriangle,
    title: 'Fault Detection & Alerts',
    text: 'A service that spots anomalies in live sensor data (current imbalance, power-factor drift) and fires targeted WhatsApp/Slack alerts, so people can act on problems in near real time.',
    tags: ['Slack', 'WhatsApp'],
  },
  {
    id: 7,
    icon: Bot,
    title: 'Portal Automation',
    text: 'A Playwright automation agent that logs into regional utility portals and pulls documents on its own - because nobody should be doing that by hand.',
    tags: ['Playwright'],
  },
  {
    id: 8,
    icon: Boxes,
    title: 'Cloud Infrastructure',
    text: 'The infrastructure it all runs on today: GCP end to end - Cloud Run, GKE, Cloud SQL, WordPress on a VM, Cloud Storage, migrations, auth, and leader-elected cron - all operated by me.',
    tags: ['Cloud Run', 'GKE', 'Cloud SQL', 'GCS'],
  },
  {
    id: 9,
    icon: LayoutDashboard,
    title: 'Frontend Dashboards',
    text: 'The frontend too: Next.js 15 / React 19 dashboards (TanStack Query/Table, Redux Toolkit, Clerk) that make all of the above actually usable.',
    tags: ['Next.js 15', 'React 19', 'TanStack', 'Clerk'],
  },
];

type SkillGroup = {
  id: number;
  title: string;
  icon: LucideIcon;
  items: string[];
};

const skills: SkillGroup[] = [
  {
    id: 1,
    title: 'Languages',
    icon: Code2,
    items: ['Python', 'TypeScript', 'JavaScript', 'C++', 'Java'],
  },
  {
    id: 2,
    title: 'Backend',
    icon: Server,
    items: [
      'FastAPI',
      'Django',
      'Django Rest Framework',
      'SQLAlchemy',
      'Alembic',
      'Kafka',
      'REST',
    ],
  },
  {
    id: 3,
    title: 'Frontend',
    icon: LayoutDashboard,
    items: [
      'Next.js',
      'React',
      'React Native (Expo/CLI)',
      'Redux Toolkit',
      'TanStack Query/Table',
      'Tailwind CSS',
      'Shadcn',
      'Material UI',
    ],
  },
  {
    id: 4,
    title: 'Data & Storage',
    icon: Database,
    items: ['PostgreSQL', 'TimescaleDB', 'MySQL', 'Pandas', 'NumPy'],
  },
  {
    id: 5,
    title: 'Cloud & DevOps',
    icon: Cloud,
    items: [
      'GCP',
      'Cloud Run',
      'GKE',
      'Compute Engine',
      'Cloud SQL',
      'GCS',
      'Docker',
      'AWS',
      'Lightsail',
      'WordPress',
      'Git/GitHub',
    ],
  },
  {
    id: 6,
    title: 'AI & Integrations',
    icon: Sparkles,
    items: [
      'Anthropic Claude',
      'Google Gemini',
      'OpenAI',
      'Claude Code',
      'Codex',
      'Playwright',
      'Razorpay',
      'Clerk',
    ],
  },
];

const identityChips = [
  'Software Engineer II',
  'Energy-tech / Cleantech',
  'Bangalore, India',
];

const AboutPage = () => {
  return (
    <div className='flex flex-col space-y-12'>
      <section className='flex flex-col space-y-5'>
        <p className='text-primary text-sm font-medium uppercase tracking-wide'>
          Fullstack Software Engineer
        </p>
        <h1 className='text-2xl md:text-3xl font-bold text-foreground leading-tight'>
          I build and run platforms end to end.
        </h1>
        <p className='text-muted-foreground max-w-2xl'>
          From databases and cloud infrastructure up to the interface people
          actually touch - I like turning messy real-world problems into systems
          that just work.
        </p>

        <ul className='flex flex-wrap gap-2'>
          {identityChips.map((chip) => (
            <li
              key={chip}
              className='rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground'
            >
              {chip}
            </li>
          ))}
        </ul>

        <div className='flex flex-wrap items-center gap-4 pt-1'>
          <Link
            href='/resume.pdf'
            download
            className={cn(buttonVariants(), 'space-x-2')}
          >
            <span>Resume</span>
            <DownloadIcon className='h-4 w-4' />
          </Link>
          <div className='flex items-center gap-4 text-foreground'>
            <Link
              href='https://github.com/dev-preetamraj'
              target='_blank'
              aria-label='GitHub'
              className='hover:text-primary transition-colors'
            >
              <GitHubLogoIcon className='h-6 w-6' />
            </Link>
            <Link
              href='https://www.linkedin.com/in/raj-preetam/'
              target='_blank'
              aria-label='LinkedIn'
              className='hover:text-primary transition-colors'
            >
              <LinkedInLogoIcon className='h-6 w-6' />
            </Link>
            <Link
              href='mailto:dev.preetamraj@gmail.com'
              aria-label='Email'
              className='hover:text-primary transition-colors'
            >
              <EnvelopeClosedIcon className='h-6 w-6' />
            </Link>
          </div>
        </div>
      </section>

      <section className='flex flex-col space-y-5'>
        <SectionHeading index='01' title='About' />
        <div className='max-w-3xl space-y-4 text-[15px] font-light leading-7 text-muted-foreground'>
          <p>
            Hi, I&apos;m{' '}
            <span className='text-primary font-semibold'>Preetam Raj</span>, a
            fullstack software engineer who loves turning messy real-world
            problems into systems that just work. I studied Mechanical
            Engineering with a minor in{' '}
            <span className='text-primary font-semibold'>
              Computer Science and Engineering
            </span>{' '}
            at <span className='text-primary font-semibold'>IIT Mandi</span>,
            and somewhere along the way fell for the craft of building software
            end to end - from database and infrastructure up to the interface
            people actually touch.
          </p>
          <p>
            These days I&apos;m a Software Engineer II in{' '}
            <span className='text-primary font-semibold'>
              energy-tech / cleantech
            </span>
            , where I own a platform that powers smart metering, automated
            billing, and bill audit for commercial and industrial customers -
            designing the backend and data pipelines, shipping the frontend
            dashboards, and running the whole thing on GCP. I like being the
            person who takes an idea from architecture to production and keeps
            it alive.
          </p>
          <p>
            I work AI-native day to day -{' '}
            <span className='text-primary font-semibold'>Claude Code</span> and{' '}
            <span className='text-primary font-semibold'>Codex</span> are a
            regular part of how I ship - and on the side I build{' '}
            <span className='text-primary font-semibold'>llm-kit</span>, an
            open-source Python toolkit (on PyPI) that gives one typed interface
            across Anthropic, Gemini, and OpenAI.
          </p>
          <p>
            Outside of code, you&apos;ll usually find me singing or strumming a
            guitar - music is where I find my balance. Originally from Patna,
            now based in Bangalore, I&apos;m always chasing that mix of solid
            engineering and a little creative spark.
          </p>
        </div>
      </section>

      <section className='flex flex-col space-y-5'>
        <SectionHeading index='02' title="What I've built" />
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.id}
                className={cn(
                  'group relative overflow-hidden rounded-2xl border-border/70 bg-gradient-to-b from-card to-muted/20 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/[0.06]',
                  item.featured &&
                    'border-primary/25 bg-gradient-to-br from-primary/[0.08] via-primary/[0.03] to-transparent hover:border-primary/50 md:col-span-2'
                )}
              >
                <CardHeader className='flex-row items-center gap-3 space-y-0'>
                  <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 transition-colors group-hover:bg-primary/15'>
                    <Icon className='h-5 w-5' />
                  </span>
                  <CardTitle className='text-base transition-colors group-hover:text-primary'>
                    {item.href ? (
                      <Link
                        href={item.href}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='after:absolute after:inset-0'
                      >
                        {item.title}
                      </Link>
                    ) : (
                      item.title
                    )}
                  </CardTitle>
                  {(item.badge || item.href) && (
                    <div className='ml-auto flex items-center gap-2'>
                      {item.badge && (
                        <span className='hidden rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary ring-1 ring-primary/20 sm:inline'>
                          {item.badge}
                        </span>
                      )}
                      {item.href && (
                        <ArrowUpRight className='h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary' />
                      )}
                    </div>
                  )}
                </CardHeader>
                <CardContent className='space-y-4'>
                  <p className='text-sm leading-6 text-muted-foreground'>
                    {item.text}
                  </p>
                  <ul className='flex flex-wrap gap-1.5'>
                    {item.tags.map((tag) => (
                      <li
                        key={tag}
                        className='rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 font-mono text-[11px] text-muted-foreground'
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className='flex flex-col space-y-5'>
        <SectionHeading index='03' title='Skills' />
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          {skills.map((group) => {
            const Icon = group.icon;
            return (
              <div
                key={group.id}
                className='flex flex-col gap-4 rounded-2xl border border-border/70 bg-gradient-to-b from-card to-muted/20 p-5 shadow-sm'
              >
                <h3 className='flex items-center gap-3'>
                  <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20'>
                    <Icon className='h-[18px] w-[18px]' />
                  </span>
                  <span className='text-sm font-semibold text-foreground'>
                    {group.title}
                  </span>
                </h3>
                <ul className='flex flex-wrap gap-1.5'>
                  {group.items.map((skill) => (
                    <li
                      key={skill}
                      className='rounded-md border border-border/60 bg-muted/60 px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary'
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className='flex flex-col items-start justify-between gap-5 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 sm:flex-row sm:items-center'>
        <div className='space-y-1.5'>
          <h2 className='text-xl font-bold text-foreground md:text-2xl'>
            Let&apos;s build something.
          </h2>
          <p className='text-sm text-muted-foreground'>
            Have a role or a project in mind? I&apos;m happy to talk.
          </p>
        </div>
        <div className='flex flex-wrap items-center gap-3'>
          <Link
            href='mailto:dev.preetamraj@gmail.com'
            className={cn(buttonVariants(), 'space-x-2')}
          >
            <EnvelopeClosedIcon className='h-4 w-4' />
            <span>Email me</span>
          </Link>
          <Link
            href='https://www.linkedin.com/in/raj-preetam/'
            target='_blank'
            className={cn(buttonVariants({ variant: 'outline' }), 'space-x-2')}
          >
            <LinkedInLogoIcon className='h-4 w-4' />
            <span>LinkedIn</span>
          </Link>
          <Link
            href='https://github.com/dev-preetamraj'
            target='_blank'
            className={cn(buttonVariants({ variant: 'outline' }), 'space-x-2')}
          >
            <GitHubLogoIcon className='h-4 w-4' />
            <span>GitHub</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
