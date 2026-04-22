import { NextResponse } from 'next/server';

import { connectToDatabase } from '@/lib/server/db';
import { findUserById, resolveUserId } from '@/lib/server/request-user';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectToDatabase();

    const userId = resolveUserId(request);
    const user = await findUserById(userId);

    return NextResponse.json({
      userId,
      user: user || null,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
