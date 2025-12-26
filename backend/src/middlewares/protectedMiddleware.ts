import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../services/authService";
import { findUserByUserId } from "../services/userService";

export const protectedMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Lấy và kiểm tra access token từ headers
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ message: "Không tìm thấy token" });
    }

    // Kiểm tra authorization
    const [key, value] = header.split(" ");
    if (key !== "Bearer") {
      return res.status(403).json({ message: "Authorization không hợp lệ" });
    }
    if (!value) {
      return res.status(403).json({ message: "Token không tồn tại" });
    }

    // xác minh token
    let decoded;
    try {
      decoded = verifyAccessToken(value);
    } catch (error) {
      return res.status(403).json({ message: "Token không hợp lệ" });
    }

    const user = await findUserByUserId(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Lỗi khi gọi protectedMiddleware", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
