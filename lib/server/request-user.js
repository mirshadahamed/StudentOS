import mongoose from 'mongoose';

import { User } from '@/lib/server/user-model';

export function getDefaultUserId() {
  return (
    process.env.DEFAULT_USER_ID ||
    process.env.NEXT_PUBLIC_USER_ID ||
    'guest'
  ).trim();
}

export function resolveUserId(request, body = null) {
  const { searchParams } = new URL(request.url);

  return (
    request.headers.get('x-user-id') ||
    searchParams.get('userId') ||
    body?.userId ||
    getDefaultUserId()
  ).trim();
}

export async function findUserById(userId) {
  if (!userId || userId === 'guest') {
    return null;
  }

  const orConditions = [{ userId }];
  if (mongoose.Types.ObjectId.isValid(userId)) {
    orConditions.push({ _id: userId });
  }

  return User.findOne({ $or: orConditions }).lean();
}

export async function getUserContext(request, body = null) {
  const userId = resolveUserId(request, body);
  const user = await findUserById(userId);

  return {
    userId,
    user,
    userEmail: body?.userEmail?.trim() || user?.email || '',
  };
}
