import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { calculateRelativeTimes } from '@/lib/utils';
import { fetchUser } from '@/lib/actions/user.actions';
import LikeButton from '../shared/LikeButton';
import { currentUser } from '@clerk/nextjs';

type Props = {
  threadId: string;
  currentUserId_clerk: string | null;
  // currentUserIdClerk: string | null;
  // parentThreadId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    _id: string;
    idUser_clerk: string;
  };
  createdAt: Date;
  comments: Array<{
    author: {
      image: string;
    };
  }>;
  isComment?: boolean;
  nth?: number;
  likes: Array<string>;
};

export default async function ThreadCard({
  threadId,
  currentUserId_clerk,
  // currentUserIdClerk,
  // parentThreadId,
  content,
  author,
  createdAt,
  comments,
  isComment,
  nth,
  likes,
}: Props) {
  // const currentUserClerk = await currentUser();

  const createdWhen = calculateRelativeTimes(createdAt);

  const currentUser_db = currentUserId_clerk
    ? await fetchUser(currentUserId_clerk)
    : null;

  let likedByCurrentUser: number = -1;
  if (currentUser_db) {
    likedByCurrentUser = likes.indexOf(currentUser_db._id) > -1 ? 1 : 0;
  }

  return (
    <article
      className={`flex w-full flex-col rounded-lg ${
        isComment ? 'px-0 xs:px-7' : 'bg-dark-2 p-7'
      }`}
    >
      <div
        className={`flex items-start justify-between ${
          isComment && nth !== 0 && 'mt-6'
        }`}
      >
        <div className='flex w-full flex-1 flex-row gap-4'>
          <div className='flex flex-col items-center'>
            <Link
              href={`/profile/${author.idUser_clerk}`}
              className='relative h-11 w-11'
            >
              <Image
                src={author.image}
                alt={`Profile image of ${author.name}`}
                fill
                sizes='normal'
                className='cursor-pointer rounded-full'
              />
            </Link>
            <div className='thread-card_bar' />
          </div>

          <div className='flex w-full flex-col'>
            <div className='flex flex-row gap-3 items-center'>
              <Link href={`/profile/${author.idUser_clerk}`} className='w-fit'>
                <h4 className='cursor-pointer text-base-semibold text-light-1'>
                  {author.name}
                </h4>
              </Link>
              <p className='text-gray-1 text-small-regular'>{createdWhen}</p>
            </div>
            <p className='text-light-2 mt-2 text-small-regular'>{content}</p>
            <div className='mt-3 flex flex-col gap-2'>
              <div className='flex gap-3.5'>
                <LikeButton
                  likedByCurrentUser={likedByCurrentUser}
                  currentUserId_db={
                    currentUser_db ? JSON.stringify(currentUser_db._id) : null
                  }
                  threadId={JSON.stringify(threadId)}
                />
                <Link href={`/thread/${threadId}`}>
                  <Image
                    src='/assets/reply.svg'
                    height={24}
                    width={24}
                    alt='icon-reply'
                    className='cursor-pointer object-contain'
                  />
                </Link>
                {/* <Image
                  src='/assets/repost.svg'
                  height={24}
                  width={24}
                  alt='icon-repost'
                  className='cursor-pointer object-contain'
                />
                <Image
                  src='/assets/share.svg'
                  height={24}
                  width={24}
                  alt='icon-share'
                  className='cursor-pointer object-contain'
                /> */}
              </div>

              {comments.length > 0 && (
                <Link href={`/thread/${threadId}`}>
                  <p className='mt-1 text-subtle-medium text-gray-1'>
                    {comments.length}{' '}
                    {comments.length > 1 ? 'replies' : 'reply'}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
