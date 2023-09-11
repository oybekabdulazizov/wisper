'use server';

import { revalidatePath } from 'next/cache';
import User from '../models/user.model';
import { connectToDB } from '../mongoose';
import Thread from '../models/thread.model';

interface Props {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Props): Promise<void> {
  connectToDB();

  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === '/profile/edit') {
      revalidatePath(path);
    }
  } catch (err: any) {
    console.log('Failed to create/update user.');
    console.log(err);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();
    const user = await User.findOne({ id: userId });
    return user;
  } catch (error: any) {
    console.log('Failed to fetch user.');
    console.log(error);
  }
}

export async function fetchUserThreads(userId: string) {
  try {
    connectToDB();

    const threadsByUser = await User.findOne({ id: userId }).populate({
      path: 'threads',
      model: Thread,
      options: {
        sort: { createdAt: 'desc' },
      },
      populate: {
        path: 'author',
        model: User,
        select: 'name image id _id',
      },
    });

    return threadsByUser;
  } catch (error: any) {
    throw new Error(`(fetchUserPosts): ${error.message}`);
  }
}
