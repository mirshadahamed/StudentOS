import mongoose from 'mongoose';

const collectionName = process.env.USER_COLLECTION_NAME || 'users';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    userId: { type: String, default: '' },
  },
  {
    strict: false,
    timestamps: true,
  }
);

export const User = mongoose.models.User || mongoose.model('User', UserSchema, collectionName);
