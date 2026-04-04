import { connectToDatabase } from "@/lib/mongoose";
import { resolveUserId } from "@/lib/auth.server";
import FocusSession from "@/models/FocusSession";

export async function GET(request) {
  await connectToDatabase();
  const userId = await resolveUserId(request);
  const sessions = await FocusSession.find({ userId }).sort({ completedAt: -1 });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaySessions = sessions.filter((session) => new Date(session.completedAt) >= today);
  const focusSessions = todaySessions.filter((session) => session.type === "focus");
  const minutes = focusSessions.reduce((sum, session) => sum + session.durationMins, 0);
  const allDays = [
    ...new Set(
      sessions
        .filter((session) => session.type === "focus")
        .map((session) => new Date(session.completedAt).toDateString()),
    ),
  ].sort((a, b) => new Date(b) - new Date(a));

  let streak = 0;
  for (let index = 0; index < allDays.length; index += 1) {
    if (allDays[index] === new Date(Date.now() - index * 86400000).toDateString()) {
      streak += 1;
    } else {
      break;
    }
  }

  return Response.json({
    focusMinToday: minutes,
    focusHoursToday: `${Math.floor(minutes / 60)}h ${minutes % 60}m`,
    completedPomodoros: focusSessions.length,
    streak,
    totalSessionsToday: todaySessions.length,
  });
}
