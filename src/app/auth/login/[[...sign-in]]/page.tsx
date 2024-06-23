import { SignIn } from '@clerk/nextjs';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function Page({ searchParams }: Props) {
  const redirectUrl = searchParams['redirect'];

  if (redirectUrl)
    return (
      <SignIn forceRedirectUrl={`/auth/callback?redirect=${redirectUrl}`} />
    );
  return <SignIn />;
}
