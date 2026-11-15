import { buttonVariants } from '@/components/ui/button';
import {
  EnvelopeClosedIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
} from '@radix-ui/react-icons';
import Link from 'next/link';

const LINKS = [
  {
    key: 'github',
    href: 'https://github.com/dev-preetamraj',
    label: 'GitHub (opens in a new tab)',
    Icon: GitHubLogoIcon,
    external: true,
  },
  {
    key: 'linkedin',
    href: 'https://www.linkedin.com/in/raj-preetam/',
    label: 'LinkedIn (opens in a new tab)',
    Icon: LinkedInLogoIcon,
    external: true,
  },
  {
    key: 'email',
    href: 'mailto:dev.preetamraj@gmail.com',
    label: 'Email Preetam',
    Icon: EnvelopeClosedIcon,
    external: false,
  },
] as const;

type Props = {
  /** Which links to show (all by default). */
  only?: ReadonlyArray<(typeof LINKS)[number]['key']>;
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
          <Icon aria-hidden className='h-5 w-5' />
        </Link>
      )
    )}
  </>
);

export default SocialLinks;
