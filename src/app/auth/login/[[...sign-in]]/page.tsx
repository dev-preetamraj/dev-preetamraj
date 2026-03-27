import { SignIn } from '@clerk/nextjs';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  const redirectUrl = searchParams['redirect'];

  if (redirectUrl)
    return (
      <SignIn forceRedirectUrl={`/auth/callback?redirect=${redirectUrl}`} />
    );
  return <SignIn />;
}
