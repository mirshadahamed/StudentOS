import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, default: "", trim: true },
    email: { type: String, default: "", trim: true, index: true },
    phone: { type: String, default: "", trim: true },
    password: { type: String, default: "" },
  },
  {
    timestamps: true,
    collection: "users",
  },
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
