import SocialLinks from '@/components/global/SocialLinks';
import Card from '@/components/layout/Card';
import Chip from '@/components/layout/Chip';
import PageLayout from '@/components/layout/PageLayout';
import Section from '@/components/layout/Section';
import { Cluster, Grid, Stack } from '@/components/layout/Stack';
import Text, { Strong } from '@/components/layout/Text';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DownloadIcon,
  EnvelopeClosedIcon,
  LinkedInLogoIcon,
} from '@radix-ui/react-icons';
import {
  Activity,
  AlertTriangle,
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
    <PageLayout
      variant='index'
      // The page ends with its own contact card, so the rail skips the CTA.
      rail={{ cta: false }}
      header={{
        eyebrow: 'Fullstack Software Engineer',
        title: 'I build and run platforms end to end.',
        lead: 'From databases and cloud infrastructure up to the interface people actually touch - I like turning messy real-world problems into systems that just work.',
        children: (
          <>
            <Cluster as='ul'>
              {identityChips.map((chip) => (
                <li key={chip}>
                  <Chip>{chip}</Chip>
                </li>
              ))}
            </Cluster>
            <Cluster>
              <Link
                href='/resume.pdf'
                download
                className={cn(buttonVariants(), 'gap-2')}
              >
                Resume
                <DownloadIcon aria-hidden className='h-4 w-4' />
              </Link>
              <SocialLinks />
            </Cluster>
          </>
        ),
      }}
    >
      <Section title='About'>
        <Stack>
          <Text>
            Hi, I&apos;m <Strong>Preetam Raj</Strong>, a fullstack software
            engineer who loves turning messy real-world problems into systems
            that just work. I studied Mechanical Engineering with a minor in{' '}
            <Strong>Computer Science and Engineering</Strong> at{' '}
            <Strong>IIT Mandi</Strong>, and somewhere along the way fell for the
            craft of building software end to end - from database and
            infrastructure up to the interface people actually touch.
          </Text>
          <Text>
            These days I&apos;m a Software Engineer II in{' '}
            <Strong>energy-tech / cleantech</Strong>, where I own a platform
            that powers smart metering, automated billing, and bill audit for
            commercial and industrial customers - designing the backend and data
            pipelines, shipping the frontend dashboards, and running the whole
            thing on GCP. I like being the person who takes an idea from
            architecture to production and keeps it alive.
          </Text>
          <Text>
            I work AI-native day to day - <Strong>Claude Code</Strong> and{' '}
            <Strong>Codex</Strong> are a regular part of how I ship - and on the
            side I build <Strong>llm-kit</Strong>, an open-source Python toolkit
            (on PyPI) that gives one typed interface across Anthropic, Gemini,
            and OpenAI.
          </Text>
          <Text>
            Outside of code, you&apos;ll usually find me singing or strumming a
            guitar - music is where I find my balance. Originally from Patna,
            now based in Bangalore, I&apos;m always chasing that mix of solid
            engineering and a little creative spark.
          </Text>
        </Stack>
      </Section>

      <Section title='What I’ve built'>
        <Grid cols='two'>
          {highlights.map((item) => (
            <Card
              key={item.id}
              icon={item.icon}
              title={item.title}
              href={item.href}
              external={Boolean(item.href)}
              span={item.featured ? 'full' : undefined}
              aside={item.badge && <Chip tone='strong'>{item.badge}</Chip>}
              description={item.text}
              lines='none'
            >
              <Cluster as='ul' gap='xs'>
                {item.tags.map((tag) => (
                  <li key={tag}>
                    <Chip>{tag}</Chip>
                  </li>
                ))}
              </Cluster>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section title='Skills'>
        <Grid cols='two'>
          {skills.map((group) => (
            <Card key={group.id} icon={group.icon} title={group.title}>
              <Cluster as='ul' gap='xs'>
                {group.items.map((skill) => (
                  <li key={skill}>
                    <Chip>{skill}</Chip>
                  </li>
                ))}
              </Cluster>
            </Card>
          ))}
        </Grid>
      </Section>

      <Card
        titleAs='h2'
        title='Let’s build something.'
        description='Have a role or a project in mind? I’m happy to talk.'
        lines='none'
        footer={
          <>
            <Link
              href='mailto:dev.preetamraj@gmail.com'
              className={cn(buttonVariants(), 'gap-2')}
            >
              <EnvelopeClosedIcon aria-hidden className='h-4 w-4' />
              Email me
            </Link>
            <Link
              href='https://www.linkedin.com/in/raj-preetam/'
              target='_blank'
              rel='noopener noreferrer'
              className={cn(buttonVariants({ variant: 'outline' }), 'gap-2')}
            >
              <LinkedInLogoIcon aria-hidden className='h-4 w-4' />
              LinkedIn
            </Link>
          </>
        }
      />
    </PageLayout>
  );
};

export default AboutPage;
