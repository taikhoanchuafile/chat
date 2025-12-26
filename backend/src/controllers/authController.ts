import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import { createUser, findUserByEmail } from "../services/userService";
import {
  createRefreshTokenString,
  deleteRefreshToken,
  findRefreshTokenByToken,
  saveRefreshToken,
  signAccessToken,
} from "../services/authService";
import Token from "../models/tokenModel";
import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env";

export const signUpController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    // Kiểm tra dữ liệu
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Thiếu dữ liệu" });
    }

    // Kiểm tra email
    const user = await findUserByEmail(email);
    if (user) {
      return res
        .status(409)
        .json({ message: "Email đã tồn tại, hãy nhập email khác" });
    }

    // ghi vào db
    await createUser(name, email, password);
    return res.status(201).json({ message: "Đăng ký thành công" });
  } catch (error) {
    console.log("Lỗi khi gọi signUpController", error);
    next(error);
  }
};

export const signInController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra dữ liệu
    if (!email || !password) {
      return res.status(400).json({ message: "Thiếu dữ liệu" });
    }

    // Kiểm tra email
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // so sánh password với password trên db
    const match = await user.comparePassword(password);
    if (!match) {
      return res
        .status(403)
        .json({ message: "Tài khoản hoặc mật khẩu không chính xác" });
    }

    // Taọ token
    const accessToken = signAccessToken(user._id.toString());
    const refreshToken = createRefreshTokenString();

    // Trước khi lưu token thì xóa token trùng
    await Token.deleteMany({ userId: user._id });
    // Lưu refreshToken
    await saveRefreshToken(user._id, refreshToken);

    // Gửi refreshToken qua cookie và chỉ cho cookie đến /
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.log("Lỗi khi gọi signInController", error);
    next(error);
  }
};

export const signOutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Kiểm tra token
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.sendStatus(204);
    }

    // Xóa token trên db
    await deleteRefreshToken(refreshToken);

    // xóa cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (error) {
    console.log("Lỗi khi gọi signOutController", error);
    next(error);
  }
};

export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Kiểm tra token
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Thiếu token" });
    }

    // Kiểm tra token so với token trên db
    const token = await findRefreshTokenByToken(refreshToken);
    if (!token) {
      return res
        .status(403)
        .json({ message: "Token hết hạn hoặc không hợp lệ" });
    }

    // Kiểm tra hết hạn
    if (token.expiredAt < new Date()) {
      await deleteRefreshToken(refreshToken);
      return res.status(403).json({ message: "Token hết hạn" });
    }

    // Tạo access token mới
    const newAccessToken = signAccessToken(token.userId.toString());

    // rotation refresh token
    await deleteRefreshToken(refreshToken);
    const newRefreshToken = createRefreshTokenString();
    await saveRefreshToken(token.userId, newRefreshToken);

    // Gửi refreshToken qua cookie và chỉ cho cookie đến /
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.log("Lỗi khi gọi refreshTokenController", error);
    next(error);
  }
};

// login gg
const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
export const signInGGController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { credential } = req.body;

    // Xác minh idToken của gg
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: env.GOOGLE_CLIENT_ID,
    });

    // Kiểm tra dữ liệu
    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(403).json({ message: "IdToken google không hợp lệ" });
    }

    const { email, name, picture, sub } = payload;

    // Kiểm tra email
    let user = await findUserByEmail(email!);
    if (!user) {
      // tạo mới
      user = await User.create({
        name,
        email,
        googleId: sub,
        isGoogleAccount: true,
        avatar: picture,
      });
      // return res.status(404).json({ message: "Người dùng không tồn tại" });
    } else {
      // Nếu là tk gg thì kiểm tra googleId
      if (user.googleId && user.googleId !== sub) {
        return res
          .status(403)
          .json({ message: "Tài khoản google không hợp lệ" });
      } else if (!user.googleId) {
        // nếu không có googId thì nâng cấp lên tk gg
        user.googleId = sub;
        user.isGoogleAccount = true;
        await user.save();
      }
    }

    // Taọ token
    const accessToken = signAccessToken(user._id.toString());
    const refreshToken = createRefreshTokenString();

    // Trước khi lưu token thì xóa token trùng
    await Token.deleteMany({ userId: user._id });
    // Lưu refreshToken
    await saveRefreshToken(user._id, refreshToken);

    // Gửi refreshToken qua cookie và chỉ cho cookie đến /
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.log("Lỗi khi gọi signInController", error);
    next(error);
  }
};
