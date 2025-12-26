import { NextFunction, Request, Response } from "express";
import { findUserByNotUserId } from "../services/userService";

// load user khi vào trang chính
export const fetchMeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Lấy từ middleware
    const user = req.user;
    return res.status(200).json({ user });
  } catch (error) {
    console.log("Lỗi khi gọi fetchMeController", error);
    next(error);
  }
};

// load users khác
export const getOtherUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Lấy từ middleware
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Phiên đăng nhập hết hạn" });
    }
    const users = await findUserByNotUserId(userId!);

    return res.status(200).json({ users: users ?? [] });
  } catch (error) {
    console.log("Lỗi khi gọi getOtherUsersController", error);
    next(error);
  }
};
