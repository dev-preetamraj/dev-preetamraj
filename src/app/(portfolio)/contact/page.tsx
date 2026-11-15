import SocialLinks from '@/components/global/SocialLinks';
import Card from '@/components/layout/Card';
import PageLayout from '@/components/layout/PageLayout';
import Section from '@/components/layout/Section';
import { Cluster, Grid } from '@/components/layout/Stack';
import Text from '@/components/layout/Text';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  EnvelopeClosedIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
} from '@radix-ui/react-icons';
import { Clock, MapPin, MessageSquare, type LucideIcon } from 'lucide-react';
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
    <PageLayout
      variant='index'
      // This page is the pitch itself, so the rail skips the CTA.
      rail={{ cta: false }}
      header={{
        eyebrow: 'Get in touch',
        title: 'Let’s build something together.',
        lead: 'Have a role, a project, or an idea in mind? I’m always happy to talk - whether it’s backend, frontend, cloud, or a bit of AI on top. Pick whichever channel works best for you.',
        children: (
          <Cluster>
            <Link
              href='mailto:dev.preetamraj@gmail.com'
              className={cn(buttonVariants(), 'gap-2')}
            >
              <EnvelopeClosedIcon aria-hidden className='h-4 w-4' />
              Email me
            </Link>
            <SocialLinks only={['github', 'linkedin']} />
          </Cluster>
        ),
      }}
    >
      <Section title='Reach me'>
        {/* Two columns with the first (email) card spanning both, so the
            full address always fits on one line. */}
        <Grid cols='two'>
          {channels.map((channel, index) => (
            <Card
              key={channel.id}
              icon={channel.icon}
              title={channel.title}
              href={channel.href}
              external={channel.external}
              span={index === 0 ? 'full' : undefined}
            >
              <Text variant='code' breakAll>
                {channel.value}
              </Text>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section title='Good to know'>
        <Grid cols='three'>
          {facts.map((fact) => (
            <Card
              key={fact.id}
              icon={fact.icon}
              title={fact.title}
              description={fact.text}
              lines='none'
            />
          ))}
        </Grid>
      </Section>
    </PageLayout>
  );
};

export default ContactPage;
