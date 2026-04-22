import { NextResponse } from 'next/server';

import { connectToDatabase } from '@/lib/server/db';
import { FocusSession } from '@/lib/server/focus-session-model';
import { resolveUserId } from '@/lib/server/request-user';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectToDatabase();

    const sessions = await FocusSession.find({ userId: resolveUserId(request) })
      .sort({ completedAt: -1 })
      .limit(30)
      .lean();

    return NextResponse.json(sessions);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
