import SocialLinks, { LINKS, LinkKey } from '@/components/global/SocialLinks';
import Card from '@/components/layout/Card';
import PageLayout from '@/components/layout/PageLayout';
import Section from '@/components/layout/Section';
import { Cluster, Grid } from '@/components/layout/Stack';
import Text from '@/components/layout/Text';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Clock,
  MailIcon,
  MapPin,
  MessageSquare,
  type LucideIcon,
} from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Preetam Raj - fullstack software engineer building and running platforms end to end.',
};

// Email first: it is the fastest channel and spans the full row.
const channels = (['email', 'linkedin', 'github'] as LinkKey[]).map(
  (key) => LINKS.find((link) => link.key === key)!
);

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
              <MailIcon aria-hidden className='h-4 w-4' />
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
              key={channel.key}
              icon={channel.Icon}
              title={channel.name}
              href={channel.href}
              external={channel.external}
              span={index === 0 ? 'full' : undefined}
            >
              <Text variant='code' breakAll>
                {channel.handle}
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
