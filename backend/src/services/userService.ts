import { Types } from "mongoose";
import User from "../models/userModel";

export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email }).select("+hashedPassword");
};

// Tạo user
export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
  const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    name
  )}`;
  return await User.create({ name, email, hashedPassword: password, avatar });
};

// tìm user theo userId
export const findUserByUserId = async (userId: string) => {
  return await User.findById(userId).select("name email avatar");
};

// tìm toán bộ user còn lại theo currentUserId
export const findUserByNotUserId = async (currentUserId: Types.ObjectId) => {
  return await User.find({
    _id: { $ne: currentUserId },
  })
    .sort({ isOnline: -1 })
    .select("name email avatar");
};
