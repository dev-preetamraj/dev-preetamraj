import { buttonVariants } from '@/components/ui/button';
import { GithubIcon, LinkedinIcon, MailIcon } from 'lucide-react';
import Link from 'next/link';

/** The one list of profile links (sidebar, about, contact). */
export const LINKS = [
  {
    key: 'github',
    name: 'GitHub',
    handle: '/dev-preetamraj',
    href: 'https://github.com/dev-preetamraj',
    label: 'GitHub (opens in a new tab)',
    Icon: GithubIcon,
    external: true,
  },
  {
    key: 'linkedin',
    name: 'LinkedIn',
    handle: '/raj-preetam',
    href: 'https://www.linkedin.com/in/raj-preetam/',
    label: 'LinkedIn (opens in a new tab)',
    Icon: LinkedinIcon,
    external: true,
  },
  {
    key: 'email',
    name: 'Email',
    handle: 'hi@preetamraj.dev',
    href: 'mailto:hi@preetamraj.dev',
    label: 'Email Preetam',
    Icon: MailIcon,
    external: false,
  },
] as const;

export type LinkKey = (typeof LINKS)[number]['key'];

type Props = {
  /** Which links to show (all by default). */
  only?: ReadonlyArray<LinkKey>;
};

/** GitHub / LinkedIn / Email as ghost icon buttons. */
const SocialLinks = ({ only }: Props) => (
  <>
    {LINKS.filter((link) => !only || only.includes(link.key)).map(
      ({ key, href, label, Icon, external }) => (
        <Link
          key={key}
          href={href}
          aria-label={label}
          {...(external
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
          className={buttonVariants({ variant: 'ghost', size: 'icon' })}
        >
          <Icon aria-hidden strokeWidth={1.75} className='h-5 w-5' />
        </Link>
      )
    )}
  </>
);

export default SocialLinks;
