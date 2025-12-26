import mongoose from "mongoose";
import { IUser } from "../types/userType";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    hashedPassword: { type: String, default: null, select: false },
    googleId: { type: String, sparse: true, default: null }, //sparse cho phép nhiều user
    isGoogleAccount: { type: Boolean, default: false },
    avatar: { type: String, default: "" },
    isOnline: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("hashedPassword")) {
    return;
  }
  this.hashedPassword = await bcrypt.hashSync(this.hashedPassword, 10);
});

userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.hashedPassword); // boolean
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;
