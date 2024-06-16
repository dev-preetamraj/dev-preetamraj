import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const CallbackPage = async () => {
  const user = await currentUser();
  if (!user) return redirect('/auth/login');

  await clerkClient.users.updateUserMetadata(user.id, {
    privateMetadata: {
      role:
        user.emailAddresses[0].emailAddress === process.env.ADMIN_EMAIL
          ? 'admin'
          : 'subscriber',
    },
  });
  return redirect('/');
};

export default CallbackPage;
