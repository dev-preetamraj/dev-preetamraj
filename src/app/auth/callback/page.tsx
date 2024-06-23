import { createUser, getUserByUserId } from '@/actions/user';
import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const CallbackPage = async ({ searchParams }: Props) => {
  const user = await currentUser();
  if (!user) return redirect('/auth/login');

  const redirectUrl = searchParams['redirect'] as string;

  await clerkClient.users.updateUserMetadata(user.id, {
    privateMetadata: {
      role:
        user.emailAddresses[0].emailAddress === process.env.ADMIN_EMAIL
          ? 'admin'
          : 'subscriber',
    },
    publicMetadata: {
      role:
        user.emailAddresses[0].emailAddress === process.env.ADMIN_EMAIL
          ? 'admin'
          : 'subscriber',
    },
  });

  const { data: dbUser } = await getUserByUserId(user.id);

  if (!dbUser) {
    await createUser(
      user.id,
      user.emailAddresses[0].emailAddress,
      user.fullName,
      user.imageUrl
    );
  }

  if (redirectUrl) return redirect(redirectUrl);
  return redirect('/');
};

export default CallbackPage;
