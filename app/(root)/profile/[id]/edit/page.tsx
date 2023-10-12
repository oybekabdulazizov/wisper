import AccountProfile from '@/components/forms/AccountProfile';
import { fetchUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import React from 'react';

interface Props {
  params: {
    id: string;
  };
}

export default async function Page({ params }: Props) {
  const currentUser_db = await fetchUser(params.id);
  if (!currentUser_db) {
    redirect('/auth/onboarding');
  }

  const userDetails = {
    idUser_clerk: currentUser_db.idUser_clerk,
    name: currentUser_db.name,
    username: currentUser_db.username,
    bio: currentUser_db.bio,
    image: currentUser_db.image,
  };

  return (
    <main className='mx-auto flex w-full max-w-3xl flex-col justify-start px-2 xs:px-0 py-0'>
      <h1 className='head-text'>Edit profile</h1>
      <p className='mt-1 md:mt-3 mb-3 xs:mb-6 text-base-regular text-light-2'>
        Anything you wanna update?
      </p>

      <section className='bg-dark-2 p-5 xs:p-8'>
        <AccountProfile userDetails={userDetails} action='edit' />
      </section>
    </main>
  );
}
