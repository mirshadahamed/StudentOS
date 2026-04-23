import { readJson, writeJson } from '@/lib/server/storage';

const FOCUS_FILE = 'focus-sessions.json';

async function readSessions() {
  const sessions = await readJson(FOCUS_FILE, []);
  return Array.isArray(sessions) ? sessions : [];
}

export async function getSessions() {
  return readSessions();
}

export async function addSession(record) {
  const sessions = await readSessions();
  const stored = {
    ...record,
    id: sessions.length + 1,
    completedAt: new Date(),
  };
  sessions.push(stored);
  await writeJson(FOCUS_FILE, sessions);
  return stored;
}

