import mongoose from 'mongoose';
import { connectMongoose, isMongoConfigured } from '@/lib/server/mongoose';

const globalForDefaultUser = globalThis;

if (!globalForDefaultUser.__studentosDefaultUser) {
  globalForDefaultUser.__studentosDefaultUser = { userId: null };
}

function readEnvDefaultUserId() {
  const raw = process.env.STUDENTOS_DEFAULT_USER_ID || process.env.DEFAULT_USER_ID || process.env.STUDENTOS_USER_ID;
  const trimmed = String(raw ?? '').trim();
  return trimmed || null;
}

function pickUserIdFromDoc(doc) {
  if (!doc || typeof doc !== 'object') return null;
  const candidates = [doc.userId, doc.uid, doc._id].map((v) => String(v ?? '').trim()).filter(Boolean);
  return candidates[0] || null;
}

async function findUserById(users, id) {
  if (!id) return null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const asObj = await users.findOne({ _id: new mongoose.Types.ObjectId(id) });
    if (asObj) return asObj;
  }
  const direct = await users.findOne({ _id: id });
  if (direct) return direct;
  const byUserId = await users.findOne({ userId: id });
  if (byUserId) return byUserId;
  const byUid = await users.findOne({ uid: id });
  if (byUid) return byUid;
  return null;
}

export async function resolveDefaultUserId() {
  if (!isMongoConfigured()) return 'guest';

  const fromEnv = readEnvDefaultUserId();
  if (fromEnv) return fromEnv;

  const cached = globalForDefaultUser.__studentosDefaultUser?.userId;
  if (cached) return cached;

  await connectMongoose();
  const users = mongoose.connection.db.collection('users');
  const doc = await users.findOne({});
  const resolved = pickUserIdFromDoc(doc) || 'guest';

  globalForDefaultUser.__studentosDefaultUser.userId = resolved;
  return resolved;
}

export async function resolveUserId(explicitUserId) {
  const trimmed = String(explicitUserId ?? '').trim();
  if (trimmed) return trimmed;
  return await resolveDefaultUserId();
}

export async function getDefaultUserDoc() {
  if (!isMongoConfigured()) return null;
  await connectMongoose();
  const users = mongoose.connection.db.collection('users');

  const envId = readEnvDefaultUserId();
  if (envId) {
    const byEnv = await findUserById(users, envId);
    if (byEnv) return byEnv;
  }

  const cachedId = globalForDefaultUser.__studentosDefaultUser?.userId;
  if (cachedId) {
    const byCached = await findUserById(users, cachedId);
    if (byCached) return byCached;
  }

  const doc = await users.findOne({});
  const pickedId = pickUserIdFromDoc(doc);
  if (pickedId) globalForDefaultUser.__studentosDefaultUser.userId = pickedId;
  return doc;
}
