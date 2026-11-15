import SectionHeading from '@/components/global/SectionHeading';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  EnvelopeClosedIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
} from '@radix-ui/react-icons';
import {
  ArrowUpRight,
  Clock,
  MapPin,
  MessageSquare,
  type LucideIcon,
} from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import type { ComponentType } from 'react';

type IconComponent = ComponentType<{ className?: string }>;

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Preetam Raj - fullstack software engineer building and running platforms end to end.',
};

type Channel = {
  id: number;
  icon: IconComponent;
  title: string;
  value: string;
  href: string;
  external?: boolean;
};

const channels: Channel[] = [
  {
    id: 1,
    icon: EnvelopeClosedIcon,
    title: 'Email',
    value: 'dev.preetamraj@gmail.com',
    href: 'mailto:dev.preetamraj@gmail.com',
  },
  {
    id: 2,
    icon: LinkedInLogoIcon,
    title: 'LinkedIn',
    value: '/raj-preetam',
    href: 'https://www.linkedin.com/in/raj-preetam/',
    external: true,
  },
  {
    id: 3,
    icon: GitHubLogoIcon,
    title: 'GitHub',
    value: '/dev-preetamraj',
    href: 'https://github.com/dev-preetamraj',
    external: true,
  },
];

type Fact = {
  id: number;
  icon: LucideIcon;
  title: string;
  text: string;
};

const facts: Fact[] = [
  {
    id: 1,
    icon: MapPin,
    title: 'Based in',
    text: 'Bangalore, India (IST, UTC+5:30). Open to remote roles across time zones.',
  },
  {
    id: 2,
    icon: Clock,
    title: 'Response time',
    text: 'I usually reply within a day. Email is the fastest way to reach me.',
  },
  {
    id: 3,
    icon: MessageSquare,
    title: 'Best for',
    text: 'Roles, collaborations, open-source, or anything backend, frontend, or cloud.',
  },
];

const ContactPage = () => {
  return (
    <div className='flex flex-col space-y-section-sm'>
      <section className='flex flex-col space-y-5'>
        <p className='text-eyebrow text-muted-foreground'>Get in touch</p>
        <h1 className='text-h1 text-foreground'>
          Let&apos;s build something together.
        </h1>
        <p className='text-lead text-muted-foreground max-w-measure'>
          Have a role, a project, or an idea in mind? I&apos;m always happy to
          talk - whether it&apos;s backend, frontend, cloud, or a bit of AI on
          top. Pick whichever channel works best for you.
        </p>

        <div className='flex flex-wrap items-center gap-4 pt-1'>
          <Link
            href='mailto:dev.preetamraj@gmail.com'
            className={cn(buttonVariants(), 'space-x-2')}
          >
            <EnvelopeClosedIcon className='h-4 w-4' />
            <span>Email me</span>
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
          </div>
        </div>
      </section>

      <section className='flex flex-col space-y-5'>
        <SectionHeading index='01' title='Reach me' />
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {channels.map((channel) => {
            const Icon = channel.icon;
            return (
              <Card
                key={channel.id}
                className='group relative overflow-hidden rounded-xl transition-all duration-base hover:-translate-y-1 hover:border-input hover:shadow-md'
              >
                <CardHeader className='flex-row items-center gap-3 space-y-0'>
                  <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-foreground'>
                    <Icon className='h-5 w-5' />
                  </span>
                  <CardTitle className='text-h4 transition-colors group-hover:text-primary'>
                    <Link
                      href={channel.href}
                      target={channel.external ? '_blank' : undefined}
                      rel={
                        channel.external ? 'noopener noreferrer' : undefined
                      }
                      className='after:absolute after:inset-0'
                    >
                      {channel.title}
                    </Link>
                  </CardTitle>
                  <ArrowUpRight className='ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary' />
                </CardHeader>
                <CardContent>
                  <p className='truncate font-mono text-small text-muted-foreground'>
                    {channel.value}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className='flex flex-col space-y-5'>
        <SectionHeading index='02' title='Good to know' />
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {facts.map((fact) => {
            const Icon = fact.icon;
            return (
              <div
                key={fact.id}
                className='flex flex-col gap-3 rounded-xl border border-border bg-card p-5'
              >
                <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-foreground'>
                  <Icon className='h-[18px] w-[18px]' />
                </span>
                <h3 className='text-h4 text-foreground'>{fact.title}</h3>
                <p className='text-small text-muted-foreground'>{fact.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className='flex flex-col items-start justify-between gap-5 rounded-xl border border-border bg-card p-8 sm:flex-row sm:items-center'>
        <div className='space-y-1.5'>
          <h2 className='text-h3 text-foreground'>Prefer the short version?</h2>
          <p className='text-small text-muted-foreground'>
            Drop me a line and I&apos;ll get back to you.
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
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
