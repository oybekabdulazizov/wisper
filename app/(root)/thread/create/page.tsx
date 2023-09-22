import PostThread from '@/components/forms/PostThread';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function Page() {
  const currentUser_clerk = await currentUser();
  if (!currentUser_clerk) redirect('/auth/sign-in');

  const user_db = await fetchUser(currentUser_clerk.id);
  if (!user_db) {
    redirect('/auth/onboarding');
  }
  return (
    <div>
      <h1 className='head-text'>Create Thread</h1>
      <PostThread authorId={JSON.stringify(user_db._id)} />
    </div>
  );
}
