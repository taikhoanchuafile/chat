import jwt from "jsonwebtoken";
import { env } from "../config/env";
import crypto from "crypto";
import Token from "../models/tokenModel";
import { Types } from "mongoose";
import { AccessTokenPayload } from "../types/userType";

const { ACCESS_TOKEN_SECRET } = env;
const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000;

//tạo access token
export const signAccessToken = (userId: string) => {
  return jwt.sign({ userId }, ACCESS_TOKEN_SECRET!, {
    expiresIn: ACCESS_TOKEN_TTL,
  }); // string: header.payload.signature
};

//xác minh access token
export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET!) as AccessTokenPayload; //paload
};

// Tạo refresh token
export const createRefreshTokenString = () =>
  crypto.randomBytes(64).toString("hex");

// Mã hóa refresh token
export const hashedString = (str: string) => {
  if (!str || typeof str !== "string")
    throw new Error("Token không phải chuỗi");
  return crypto.createHash("sha256").update(str).digest("hex");
};

// Lưu refresh token trong db
export const saveRefreshToken = async (
  userId: Types.ObjectId,
  token: string
) => {
  return await Token.create({
    userId,
    token: hashedString(token),
    expiredAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });
};

// Xóa refresh token
export const deleteRefreshToken = async (token: string) => {
  return await Token.deleteOne({ token: hashedString(token) });
};

export const findRefreshTokenByToken = async (token: string) => {
  return await Token.findOne({ token: hashedString(token) });
};
